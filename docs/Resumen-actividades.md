# Resumen de Actividades

En primera instancia pense la estructura la de aplicacion, mas que nada como iba a modelar la base de datos. En un principio (y se puede ver en el historial del repositorio) pense en usar dos tablas las cuales
serian users (por defecto en laravel) y mensajes. Todo iba bien hasta que era un lio el tema de los chat y conversaciones y el objeto mensajes tenia demasiados atributos, por lo que decidi hacer una tabla intermedia llamada conversaciones (ya en mitad del desarrollo) y entonces lo que pense es que un usuario
tiene muchas conversaciones, una conversacion tiene muchos mensajes y un usuario participa en un mensaje (el emisor).

Ejemplo del modelo `Conversacion` que muestra las relaciones entre las tablas:

```php
// app/Models/Conversacion.php
class Conversacion extends Model
{
    // Relaciones
    public function emisor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_emisor');
    }

    public function receptor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_receptor');
    }

    public function mensajes(): HasMany
    {
        return $this->hasMany(Mensaje::class, 'conversacion_id');
    }
}
```

Como ya habia establecido la estructura usuario -> mensajes lo que hice fue conocer mas el framework. Opte por laravel porque tenia ganas de probar el starter kit que tiene con react, ya que use un poco de react en un trabajo grupal en 2025. 

Al empezar a hacer la aplicacion lo primero que me di cuenta es que como es un 'starter kit' ya viene con muchas cosas hechas de mano, como la autenticacion (login, registro, olvide la contraseña, etc), inertia.js que seria lo que conecta el back con el front, y los componentes de shadcn/ui hechos con react.

Luego de hacer empece a modificar la tabla usuarios y eso me llevo a modificar los formularios de registro, login y aprender que laravel usa fortify para su autentificacion, tuve que cambiar un parametro en config/fortify.php para que me tome el nombre de usuario como identificador principal del usuario en el login (por defecto es el email). Y bueno modifique los formularios para crear la cuenta y loguearse.

Este es el cambio clave en `config/fortify.php` para usar `nombre_usuario` en lugar de `email`:

```php
// config/fortify.php
'username' => 'nombre_usuario', // Cambié de 'email' a 'nombre_usuario'
'email' => 'email',
```

Despues de eso empece a crear los recursos de los modelos de laravel, si haces el comando php artisan make:model Mensajes --all, te crea todos los recursos para trabajar con ese modelo en php, te hace el controllador con metodos basicos como index, store, create, update, destroy, como para un crud y en el enrutador de laravel que es el web.php podes acceder a esas rutas atraves de un Route::resource('nombre_plural_controller', NombreController::class).

Ejemplo de cómo se ven las rutas en `routes/web.php`:

```php
// routes/web.php
Route::middleware('auth')->group(function () {
    
    // Ruta personalizada para conversaciones enviadas
    Route::get('conversaciones/enviados', [ConversacionController::class, 'enviados'])
        ->name('conversaciones.enviados');

    // Ruta para obtener detalle de conversación (AJAX)
    Route::get('conversaciones/componentes/detalle-conversacion/{conversacion}', 
        [ConversacionController::class, 'detalleConversacion'])
        ->name('conversaciones.componentes.detalle-conversacion');

    // Resource route (index, create, store)
    Route::resource('conversaciones', ConversacionController::class)
        ->only(['index', 'create', 'store'])
        ->parameters(['conversaciones' => 'conversacion']);

    // Nested resource para mensajes
    Route::resource('conversaciones.mensajes', MensajeController::class)
        ->only(['store'])
        ->shallow()
        ->parameters(['conversaciones' => 'conversacion']);
});
```

El archivo web.php como mencione es el que maneja las rutas, si hiciste una pagina y no esta definida ahi te va a tirar un error. Entonces el flujo que segui fue: crear modelo y recursos, crear las rutas en web.php y de ahi empieza el front con inertia.js y react.

Algo muy util que tiene inertia.js son los valores compartidos, hay un archivo que se llama HandleInertiaRequests que devuelve ciertos parametros que nosotros querramos definir, a mi me sirvio para le tema del dialog de bienvenida (hablamos luego de eso). Por defecto este archivo nos da el modelo del usuario autenticado y el nombre de la aplicacion. 

Así se ve el middleware `HandleInertiaRequests` con el flash data para el dialog:

```php
// app/Http/Middleware/HandleInertiaRequests.php
public function share(Request $request): array
{
    return [
        ...parent::share($request),
        'name' => config('app.name'),
        'auth' => [
            'user' => $request->user(), // Usuario autenticado
        ],
        'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        'flash' => [
            'mostrar_dialog_bienvenida' => fn() => $request->session()->get('mostrar_dialog_bienvenida'), 
        ],    
    ];
}
```

El tema de transformar los modelos en el front lo hice haciendo una interfaz del modelo, por ejemplo el framework ya proporciona una de usuario en resources/js/types/auth.ts, entonces hice eso con el mensaje y la conversacion mas adelante. Es como definir un objeto con sus atributos pero mas sencillo.

Interfaz TypeScript de `ConversacionModelo`:

```typescript
// resources/js/types/conversacion-modelo.ts
export interface ConversacionModelo {
    id: number;
    asunto: string;
    desplazamiento_asunto: number;
    excepciones_asunto: Record<number, string> | null;
    id_emisor: number;
    id_receptor: number;
    fecha_ultimo_mensaje: string | null;
    created_at: string;
    updated_at: string;
    // Relaciones cargadas (opcional, depende del eager loading)
    emisor?: User;
    receptor?: User;
    mensajes?: MensajeModelo[];
    ultimo_mensaje?: MensajeModelo;
}
```

Luego de experimentar que se podia y que no con laravel + inertia.js + react, comence a enfocarme en lo que tenia que hacer la aplicacion web, voy por pasos pero no del todo cronologicamente correcto.

Primero el dialog de bienvenida yo sabia que tenia que aparecer cuando se inicie sesion o que cuando un
usuario se registre de la bienvenida, entonces lei en la documentacion de laravel que hay eventos y listeners a esos eventos, y para mi suerte los eventos de login, logout, register y demas estan por defecto definidos, entonces hice dos listeners. El primero para saber si el usuario se habia logueado (asi solo se mostraba el dialog una vez), y pasaba a la session el valor 'mostrar_dialog_bienvenida', segun inertia esto se denomina 'flash data', luego iba al controlador y al componente asociado le pasaba por parametro la variable 'mostrar_dialog_bienvenida', si era verdadero se mostraba. Quizas era mas sencillo usar un session_storage y hacerlo con javascript pero me parecio interesante hacerlo asi.

Listener que maneja el evento de Login:

```php
// app/Listeners/MostrarDialogBienvenida.php
class MostrarDialogBienvenida
{
    public function handle(Login $event): void
    {
        // Guardo en la sesión que se debe mostrar el dialog
        session()->flash('mostrar_dialog_bienvenida', true);
    }
}
```

Luego cuando el usuario cierra sesion, tengo otro listener que actualiza la fecha de la ultima conexion, para que compare en el dialog de bienvenida cuantos mensajes nuevos tiene desde la ultima conexion.

Despues adentrandonos a los mensajes y demas es siempre el mismo flujo, el usuario hace una peticion a una ruta, el controlador recibe la peticion, hace lo que tiene que hacer con la base de datos y devuelve una vista con los datos correspondientes, y asi sucesivamente. Por ejemplo, para crear un mensaje, el usuario hace una peticion a la ruta /conversaciones/{conversacion}/mensajes, el controlador recibe la peticion, crea el mensaje en la base de datos y devuelve una vista con los datos correspondientes.

El controlador devuelve los datos usando inertia.js, que es lo que conecta el back con el front, y este a su vez usa react para renderizar la vista. Por ejemplo, en el controlador de mensajes, tenemos un metodo store que recibe la peticion, crea el mensaje en la base de datos y devuelve una vista con los datos correspondientes. la vista es el nombre del componente de react o la pagina de react, las que estan en resources/js/pages y terminan y .tsx.

Ejemplo de query con Eloquent en el controlador:

```php
// app/Http/Controllers/ConversacionController.php - método index()
public function index()
{
    $usuarioAutenticado = auth()->id();

    $conversaciones = Conversacion::query()
        ->where(function ($query) use ($usuarioAutenticado) {
            // Conversaciones donde el usuario es participante
            $query->where('id_emisor', $usuarioAutenticado)
                ->orWhere('id_receptor', $usuarioAutenticado);
        })
        ->whereHas('mensajes', function ($query) use ($usuarioAutenticado) {
            // Y tiene mensajes recibidos (no enviados por el usuario)
            $query->where('emisor_id', '!=', $usuarioAutenticado);
        })
        ->with(['emisor', 'receptor', 'ultimoMensaje', 'mensajes.emisor'])
        ->orderByDesc('fecha_ultimo_mensaje')
        ->get();

    return Inertia::render('conversaciones/index', [
        'conversaciones' => $conversaciones,
        'mostrar_dialog_bienvenida' => session('mostrar_dialog_bienvenida', false),
        'cantidad_mensajes_no_leidos' => $cantidadMensajesNoLeidos,
        'usuarios_emisores' => $usuariosEmisores,
    ]);
}
```

La logica del cifrado fue desafiante al principio porque lo primero que pense fue hacer los calculos con ASCII y era asunto sencillo, lo hice en el back cifraba y descifraba los mensajes, pero me di cuenta que no era lo mejor del mundo porque como aprendimos en clase, si alguien intercepta el mensaje desencriptado estamos al horno. Habia usado la funcion de php ord() para obtener los valores de los caracteres en ACII.

Luego hice lo mismo pero en el front con typescript, aca esta el tema, lo hice tal cual, y cuando me percate la ñ y las letras con acento no se cifraban, porque no estan en el rango contemplado de las mayusculas y minusculas, entonces investigando encontre la funcion normalize() con el parametro 'NFD', y ahi le metes un replace() con los parametros < /[\u0300-\u036f]/g, '' > ¿para que? para separar los caracteres especiales sean ñ en n + ~, y las vocales con acento en a + ´, y luego reemplazar ese segundo caracter por uno vacio entonces la ñ se vuelve una n y las vocales con acento sin acento. Se normaliza el texto y de ahi se cifra pero ahi surge otro problema.

Muy bien ahora se ve que con un desplazamiento de 3 se cambia la ñ por q, pero cuando se descifra vuelve a n, no vuelve a ñ, aca tenemos el segundo problema, y la solucion que implemente es guardar la posicion y el caracter especial en un registro de clave valor, algo asi como un diccionario de python, entonces si tengo la palabra 'sueño' el cifrar recorre la palabra letra por letra haciendo match con áéíóúÁÉÍÓÚñÑ, cuando encuentra la coincidencia guarda en el registro la posicion y el caracter quedando: Registro { 3: 'ñ' }, y sigue con el cifrado comparando con los valores ascii y sumandole el desplazamiento. Este metodo devuelve el texto cifrado y las excepciones que se encontraron en ese mismo texto (los caracteres especiales)

Implementación de la función `cifrar()`:

```typescript
// resources/js/lib/cifrar.ts
export default function cifrar(texto: string, desplazamiento: number): TextoCifrado {
    const excepciones: Record<number, string> = {};
    
    // Detecta los caracteres especiales ANTES de normalizar
    for (let i = 0; i < texto.length; i++) {
        if (texto[i].match(/[áéíóúÁÉÍÓÚñÑ]/)) {
            excepciones[i] = texto[i]; // Guardo posición y carácter original
        }
    }

    // Normalizo: "sueño" -> "sueno" (ñ -> n)
    const normalizado = texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    let cifrado = '';

    for (let i = 0; i < normalizado.length; i++) {
        const codigo = normalizado.charCodeAt(i);

        // Mayúsculas (A-Z)
        if (codigo >= 65 && codigo <= 90) {
            cifrado += String.fromCharCode(((codigo - 65 + desplazamiento) % 26 + 26) % 26 + 65);
        }
        // Minúsculas (a-z)
        else if (codigo >= 97 && codigo <= 122) {
            cifrado += String.fromCharCode(((codigo - 97 + desplazamiento) % 26 + 26) % 26 + 97);
        }
        // Números (0-9)
        else if (codigo >= 48 && codigo <= 57) {
            cifrado += String.fromCharCode(((codigo - 48 + desplazamiento) % 10 + 10) % 10 + 48);
        } else {
            cifrado += normalizado[i];
        }
    }

    return { texto: cifrado, excepciones }; // Devuelvo texto cifrado + excepciones
}
```

Luego al descifrar se pide el texto, el desplazamiento y las excepciones, y ahora al inverso. Se hacen los calculos con los valores ASCII, se recorre la cadena (haciendo un split('') para separar los caracteres) comparando con las excepciones, si hay una coincidencia en la posicion, se reemplaza el caracter por el valor que tiene en el registro de excepciones. Por ejemplo, si tengo la palabra ['s', 'u', 'e', 'n', 'o'] y las excepciones { 3: 'ñ'}, se recorre la cadena, cuando llega a la posicion 3, ve que hay una excepcion, entonces reemplaza la n por ñ, y asi sucesivamente. Devolviendo ['s', 'u', 'e', 'ñ', 'o'] y luego un join('') para unir los caracteres.

Luego adentrandonos a los controladores que es por donde pasa la mayoria de la magia son basicamente querys de sql, para obtener, insertar, actualizar, etc. Pero con metodos estaticos del modelo como ::where y con metodos de php como ->get(). Tambien esta el objeto DB que con ese hice una transaccion, que de la conversacion se cree el primer mensaje y asi. Usaba mucho el dd($request) para ver si mandaba bien los datos al back o si siquiera se mandaban, con el tema del enrutado muchas veces me confundia y no mandaba nada.

El reto mas grande creo que fue la asincronia, yo estaba usando polling de inertia.js pero al probar la aplicacion en otros dispositivos tuve que hacaer una llamada asincrona a la ruta del controlador que me da los datos de las conversaciones. Asi que para el listado de conversaciones uso polling (usePoll) y para el detalle de la conversacion uso ajax.

Ejemplo de polling con `usePoll` de Inertia.js:

```typescript
// resources/js/pages/conversaciones/index.tsx
export default function Index({ conversaciones, cantidad_mensajes_no_leidos, usuarios_emisores }: Props) {
    const [conversacionSeleccionada, setConversacionSeleccionada] = useState<ConversacionModelo | null>(null);

    // Polling cada 5 segundos para actualizar el listado
    usePoll(5000, {
        only: ["conversaciones"] // Solo recarga esta prop
    },
    {
        keepAlive: true
    });
    
    // ... resto del componente
}
```

Ejemplo de fetch asíncrono (AJAX) para el detalle:

```typescript
// resources/js/pages/conversaciones/componentes/detalle-conversacion.tsx
useEffect(() => {
    if (!conversacionActualizada?.id) return;

    const fetchUpdatedConversation = async () => {
        try {
            const response = await fetch(`/conversaciones/componentes/detalle-conversacion/${conversacionActualizada.id}`);
            if (response.ok) {
                const data = await response.json();
                setConversacionActualizada(data.conversacion); // Actualizo el estado local
            }
        } catch (error) {
            console.error('Error fetching updated conversation:', error);
        }
    };

    const intervaloId = setInterval(fetchUpdatedConversation, 5000); // Cada 5 segundos

    return () => clearInterval(intervaloId); // Limpio al desmontar
}, [conversacionActualizada?.id]);
```

Y bueno eso es un resumen por mi jornada de laravel + inertia + react. 

Cosas a destacar de laravel, su sencillez y lo bien documentada que esta, las querys se hacen todas por metodos (Modelo::where->('atributo', 'operador', 'valor')->get()) y no insertando el string como hacia antes con php puro y el objeto mysqli, ademas usa sqlite que no tenes que instalar ningun motor de base de datos y anda muy bien. Ademas el inertia es buenisimo como conceta el back con el front, los componentes de Form, y usePage los use mucho, facilitan el desarrollo de la app. El usePage es para los valores del HandleInertiaRequest. y el Form es un componente de inertia + react que facilita el envio de datos al back, o por lo menos a mi me parecio mas sencillo que el useForm de react.

En react no tengo mucho para decir ya que mas que nada use el useState y useEffect porque tampoco tengo mucha idea, es mi primera vez juntando y aprendiendo estas tecnologias, ademas que el proyecto de el año pasado tenia solo useState entonces no quise ir mas alla de eso.

El typescript si fue un dolor de cabeza ya que al mal acostumbrarme al tipado dinamico siempre me olvidaba de declarar los tipos, que es muy importante para el cifrado y descifrado.

Decisiones importantes fueron:
- Hacer la estructura Usuarios -> Conversaciones -> Mensajes <-> Usuarios
- Usar los componentes de inertia.js como usePage, usePoll, Form
- Usar los componentes de sahdcn para la ui, asi no pienso tanto en como decorar la pagina
- Utilizar AJAX para la vista detallada de los mensajes.
- Configurar y adaptar bien el framework segun la aplicación.