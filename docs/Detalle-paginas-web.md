# Detalle de Paginas Web

## Bienvenida
### Ruta: /
### Archivo: welcome.tsx
#### Funcionalidad

Una vista de bienvenida a la aplicacion la cual te permite
acceder al login o registro de la misma. y si estas iniciado sesion
proporciona un boton para dirigirse al home: /conversaciones.

## Login
### Ruta: /login
### Archivo: login.tsx
#### Funcionalidad

Permite al usuario ingresar sus credenciales para ingresar
a la pagina y ver los mensajes recibidos.

## Registro
### Ruta: /register
### Archivo: register.tsx
#### Funcionalidad

Permite al usuario poder crear una cuenta en el sistema, el mismo
tiene que proporcionar: nombre, apellido, nombre de usuario, email y contraseña (necesita confirmarse). Una vez registrado se lo dirige a
la pagina recibidos.

## Redactar
### Ruta: /conversaciones/create
### Archivo: create.tsx
#### Funcionalidad

Permite al usuario autenticado seleccionar otro usuario registrado en el sistema para poder iniciar una conversacion con el, detallando un asunto para la conversacion, un mensaje, y un desplazamiento que se utilizara para cifrarlo con el cifrado cesar. Una vez enviado se lo dirige a la pagina recibidos.

## Recibidos
### Ruta: /conversaciones
### Archivo: index.tsx
#### Funcionalidad

Permite al usuario autenticado poder visualizar los mensajes entrantes o que han sido dirigidos hacia a el, en esta misma pantalla se puede seleccionar un mensaje recibido y ver mas detalladamente su contenido. Tambien permite responder el mensaje.

## Enviados
### Ruta: /conversaciones/enviados
### Archivo: enviados.tsx
#### Funcionalidad

Permite al usuario autenticado poder visualizar los mensajes que ha enviado a otros usuarios, en esta misma pantalla se puede seleccionar un mensaje enviado y ver mas detalladamente su contenido. Tambien permite seguir enviando mensajes a la conversacion.