# API REST de Servicios y Reservas

API REST desarrollada con Node.js, Express y MongoDB Atlas para gestionar servicios, reservas y mensajes. Utiliza Mongoose como ODM y una arquitectura en capas. Incorpora vistas renderizadas con Express Handlebars y actualizaciones en tiempo real mediante Socket.io.

## Tecnologías

- Node.js
- Express
- MongoDB Atlas
- Mongoose
- dotenv
- JavaScript (ES Modules)
- Express Handlebars
- Socket.io
- HTML y CSS

## Instalación

Clonar el repositorio e instalar las dependencias:

```bash
git clone https://github.com/rafavel93/administrador-servicios.git
cd administrador-servicios
npm install
```

Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
PORT=8080
NODE_ENV=development
MONGO_URI=mongodb+srv://<db_username>:<db_password>@<cluster-url>/administrador-servicios
```

Reemplazar los valores de ejemplo de `MONGO_URI` por la URI de conexión real de MongoDB Atlas. No compartir ni subir el archivo `.env` al repositorio.

El archivo `.env.example` contiene una plantilla de configuración para otros desarrolladores.

## Ejecución

Iniciar el servidor:

```bash
npm start
```

Ejecutar en modo desarrollo:

```bash
npm run dev
```

La API estará disponible en:

`http://localhost:8080`

El servidor establece la conexión con MongoDB Atlas antes de comenzar a escuchar solicitudes.

## Arquitectura

El proyecto utiliza una arquitectura en capas:

```text
Router
  ↓
Controller
  ↓
Service
  ↓
Repository
  ↓
DAO
  ↓
MongoDB Atlas
```

### Router

Define los endpoints y deriva las solicitudes a los controladores correspondientes.

### Controller

Recibe las solicitudes HTTP, obtiene parámetros, query strings y datos del body, invoca los servicios y devuelve las respuestas HTTP adecuadas.

### Service

Contiene la lógica de negocio, incluyendo validaciones, filtros y operaciones relacionadas con servicios, reservas y mensajes.

### Repository

Actúa como intermediario entre los servicios y los DAO. Centraliza el acceso a las operaciones de persistencia y la validación de los identificadores de MongoDB.

### DAO

Es la capa encargada de interactuar con MongoDB mediante modelos de Mongoose. Implementa las operaciones de acceso a datos.

## Modelos

Los modelos se encuentran en `src/models/`:

- `service.model.js`: define la estructura de los servicios.
- `booking.model.js`: define la estructura de las reservas y sus servicios asociados.
- `message.model.js`: define la estructura de los mensajes.

Los documentos utilizan identificadores `_id` generados por MongoDB.

Las reservas almacenan referencias a los servicios mediante `ObjectId` y mantienen la cantidad de cada servicio agregado mediante el campo `quantity`.

## Endpoints de servicios

### Obtener todos los servicios

```http
GET /api/services
```

Permite filtrar por categoría:

```http
GET /api/services?category=Salud
```

También permite filtrar por disponibilidad:

```http
GET /api/services?available=true
```

### Obtener un servicio por ID

```http
GET /api/services/:sid
```

### Crear un servicio

```http
POST /api/services
```

Ejemplo de body JSON:

```json
{
  "name": "Clase de natación",
  "description": "Clase individual de natación",
  "duration": 60,
  "price": 100,
  "category": "Deportes",
  "available": true
}
```

El identificador `_id` se genera automáticamente.

### Actualizar un servicio

```http
PUT /api/services/:sid
```

Permite actualizar los datos del servicio identificado por `sid`.

### Eliminar un servicio

```http
DELETE /api/services/:sid
```

## Endpoints de reservas

### Crear una reserva

```http
POST /api/bookings
```

Ejemplo de body JSON:

```json
{
  "clientName": "Rafael",
  "clientEmail": "rafa@example.com",
  "date": "2026-10-10",
  "time": "10:00",
  "status": "pending"
}
```

Las reservas se crean inicialmente con un array `services` vacío.

### Obtener una reserva por ID

```http
GET /api/bookings/:bid
```

### Agregar un servicio a una reserva

```http
POST /api/bookings/:bid/services/:sid
```

Los servicios asociados a una reserva se almacenan mediante una referencia al servicio y una cantidad:

```json
{
  "service": "671a12345678901234567890",
  "quantity": 1
}
```

El campo `service` contiene el identificador del servicio en MongoDB. Si se agrega nuevamente el mismo servicio a una reserva, se incrementa el valor de `quantity`.

## Endpoints de mensajes

Los mensajes se almacenan en MongoDB Atlas mediante el modelo `Message` de Mongoose.

### Obtener todos los mensajes

```http
GET /api/messages
```

### Obtener un mensaje por ID

```http
GET /api/messages/:mid
```

### Crear un mensaje

```http
POST /api/messages
```

Ejemplo de body JSON:

```json
{
  "user": "Usuario de prueba",
  "message": "Contenido del mensaje"
}
```

Los campos `user` y `message` son obligatorios. Si faltan o están vacíos, la API responde con un error HTTP `400 Bad Request`.

### Eliminar un mensaje

```http
DELETE /api/messages/:mid
```

La API valida los identificadores y devuelve una respuesta HTTP `404 Not Found` cuando el mensaje no existe.

## Vistas con Handlebars

El proyecto incorpora vistas renderizadas desde el servidor mediante Express Handlebars.

### Servicios

```http
GET /views/services
```

Muestra los servicios registrados en MongoDB con su nombre, descripción, duración, precio, categoría y disponibilidad.

### Disponibilidad

```http
GET /views/availability
```

Muestra los servicios que tienen el campo `available` en `true`.

Las vistas obtienen los datos desde MongoDB a través de la arquitectura del proyecto y no dependen de datos de ejemplo escritos directamente en las plantillas.

## Comunicación en tiempo real con Socket.io

El servidor HTTP comparte la instancia de Express con Socket.io.

Cuando se crea un servicio correctamente mediante:

```http
POST /api/services
```

el servidor emite el evento `service:created` con los datos del nuevo servicio.

El cliente ubicado en `src/public/js/socket.js` escucha ese evento y actualiza las tarjetas de servicios en las vistas sin necesidad de recargar la página.

## Variables de entorno y seguridad

- `PORT`: puerto en el que escucha el servidor.
- `NODE_ENV`: entorno de ejecución.
- `MONGO_URI`: URI de conexión a MongoDB Atlas.

Las credenciales se mantienen en el archivo `.env`, que no debe publicarse en el repositorio. El archivo `.env.example` sirve como plantilla para configurar el entorno local.

## Estructura del proyecto

```text
src/
├── app.js
├── server.js
├── config/
│   ├── database.js
│   ├── env.config.js
│   └── socket.js
├── models/
│   ├── service.model.js
│   ├── booking.model.js
│   └── message.model.js
├── controllers/
│   ├── services.controller.js
│   ├── bookings.controller.js
│   ├── messages.controller.js
│   └── views.controller.js
├── services/
│   ├── services.service.js
│   ├── bookings.service.js
│   └── messages.service.js
├── repositories/
│   ├── services.repository.js
│   ├── bookings.repository.js
│   └── messages.repository.js
├── dao/
│   ├── services.dao.js
│   ├── bookings.dao.js
│   └── messages.dao.js
├── routes/
│   ├── services.router.js
│   ├── bookings.router.js
│   ├── messages.router.js
│   └── views.router.js
├── views/
│   ├── layouts/
│   │   └── main.handlebars
│   ├── services.handlebars
│   └── availability.handlebars
└── public/
    ├── css/
    │   └── styles.css
    └── js/
        └── socket.js
```

## Persistencia

La persistencia se realiza mediante MongoDB Atlas y Mongoose. La URI de conexión se configura mediante `MONGO_URI`, y las operaciones de acceso a datos se implementan en los DAO correspondientes.

## Autor

Rafael Velázquez
