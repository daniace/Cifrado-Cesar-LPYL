# Detalle de Paginas Web

## 1. Bienvenida (Landing Page)
- **Ruta:** `/`
- **Archivo:** `resources/js/pages/welcome.tsx`
- **Ruta directa:** `routes/web.php`.
- **Funcionalidad:**
  - Es la puerta de entrada a la aplicación.
  - Muestra una animación de texto cifrado ("Cifrado César").
  - Si el usuario está autenticado, muestra un botón "Ir a la Aplicación" que redirige a `/conversaciones`.
  - Si no está autenticado, muestra botones para "Iniciar Sesión" y "Registrarse".

## 2. Autenticación

### Login
- **Ruta:** `/login`
- **Archivo:** `resources/js/pages/auth/login.tsx`
- **Funcionalidad:**
  - Formulario para ingresar credenciales (nombre de usuario y contraseña).
  - Checkbox "Recordarme" para persistencia de sesión.
  - Enlace de recuperación de contraseña si se olvida.

### Registro
- **Ruta:** `/register`
- **Archivo:** `resources/js/pages/auth/register.tsx`
- **Funcionalidad:**
  - Formulario de creación de cuenta.
  - Campos: Nombre, Apellido, Nombre de Usuario (único), Email, Contraseña y Confirmación.
  - Validación de campos obligatorios y formato de email.
  - Al completar exitosamente, inicia sesión automáticamente y redirige a `/conversaciones`.

## 3. Mensajería

### Bandeja de Entrada (Recibidos) - **HOME**
- **Ruta:** `/conversaciones`
- **Archivo Principal:** `resources/js/pages/conversaciones/index.tsx`
- **Componentes Clave:**
  - `ListaConversaciones` (`resources/js/pages/conversaciones/componentes/lista-conversaciones.tsx`): Panel izquierdo con el listado de las conversaciones.
  - `DetalleConversacion` (`resources/js/pages/conversaciones/componentes/detalle-conversacion.tsx`): Panel derecho con la conversacion seleccionada.
  - `DialogBienvenida` (`resources/js/pages/conversaciones/componentes/dialog-bienvenida.tsx`): Modal informativo al inicio.
- **Funcionalidad:**
  - **Bienvenida:** Muestra un modal con la cantidad de mensajes no leídos desde el último login.
  - **Listado:** Muestra todas las conversaciones donde el usuario ha recibido mensajes.
  - **Visualización:** Al hacer clic en una conversación, carga dinámicamente el historial de mensajes en el panel derecho sin recargar la página completa.
  - **Respuesta:** Incluye un formulario al final del chat para responder rápidamente al remitente.

### Bandeja de Salida (Enviados)
- **Ruta:** `/conversaciones/enviados`
- **Archivo:** `resources/js/pages/conversaciones/enviados.tsx`
- **Componentes Clave:** Reutiliza `ListaConversaciones` y `DetalleConversacion`.
- **Funcionalidad:**
  - Similar a la bandeja de entrada, pero filtrando las conversaciones donde el usuario autenticado es el remitente inicial.
  - Permite revisar qué se ha enviado y continuar esas conversaciones.

### Crear Nuevo Mensaje (Redactar)
- **Ruta:** `/conversaciones/create`
- **Archivo:** `resources/js/pages/conversaciones/create.tsx`
- **Funcionalidad:**
  - Formulario para iniciar un nuevo hilo de conversación.
  - **Selector de Destinatario:** Lista desplegable con todos los usuarios del sistema.
  - **Configuración de Cifrado:** Campo numérico para el "Desplazamiento" (Clave César).
  - **Campos de Texto:** Asunto y Contenido del mensaje.
  - **Vista Previa en Tiempo Real:** Muestra cómo se verá el mensaje cifrado (texto ininteligible) antes de enviarlo, basándose en el desplazamiento elegido.

## 4. Configuración (Settings)

### Perfil
- **Ruta:** `/settings/profile`
- **Archivo:** `resources/js/pages/settings/profile.tsx`
- **Funcionalidad:** Edición de datos personales (Nombre de usuario, Email) y eliminación de cuenta.

### Contraseña
- **Ruta:** `/settings/password`
- **Archivo:** `resources/js/pages/settings/password.tsx`
- **Funcionalidad:** Cambio de contraseña solicitando la actual y la nueva.

### Apariencia
- **Ruta:** `/settings/appearance`
- **Archivo:** `resources/js/pages/settings/appearance.tsx`
- **Funcionalidad:** Selección de tema (Claro/Oscuro/Sistema).