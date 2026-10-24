# API REST de Servicios y Reservas

API REST desarrollada con Node.js, Express y MongoDB Atlas para gestionar servicios y reservas, utilizando Mongoose como ODM y una arquitectura en capas.

## Tecnologías

- Node.js
- Express
- MongoDB Atlas
- Mongoose
- dotenv
- JavaScript (ES Modules)

## Instalación

Clonar el repositorio e instalar las dependencias:

```bash
npm install
```

Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

```dotenv
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

Recibe las solicitudes HTTP, obtiene los parámetros, query strings y datos del body, invoca los servicios y devuelve las respuestas HTTP.

### Service

Contiene la lógica de negocio, incluyendo:

- Validación de campos obligatorios.
- Aplicación de filtros por categoría y disponibilidad.
- Validación de la existencia de servicios al agregarlos a una reserva.
- Incremento de `quantity` cuando se agrega nuevamente un servicio a una reserva.

### Repository

Actúa como intermediario entre los servicios y los DAO. Centraliza el acceso a las operaciones de persistencia y la validación de los identificadores de MongoDB.

### DAO

Es la capa encargada de interactuar con MongoDB mediante modelos de Mongoose. Implementa las operaciones de consulta, creación, actualización y eliminación de datos.

## Modelos

Los modelos se encuentran en `src/models/`:

- `service.model.js`: define la estructura de los servicios.
- `booking.model.js`: define la estructura de las reservas y sus servicios asociados.
- `message.model.js`: define la estructura de los mensajes.

Los documentos utilizan identificadores `_id` generados por MongoDB.

Las reservas almacenan referencias a los servicios mediante `ObjectId` y mantienen la cantidad de cada servicio agregado.

## Endpoints de servicios

### Obtener todos los servicios

`GET /api/services`

Permite filtrar por categoría:

`GET /api/services?category=Salud`

También permite filtrar por disponibilidad:

`GET /api/services?available=true`

### Obtener un servicio por ID

`GET /api/services/:sid`

### Crear un servicio

`POST /api/services`

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

`PUT /api/services/:sid`

Permite actualizar los datos del servicio identificado por `sid`. El identificador no se modifica.

### Eliminar un servicio

`DELETE /api/services/:sid`

## Endpoints de reservas

### Crear una reserva

`POST /api/bookings`

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

`GET /api/bookings/:bid`

### Agregar un servicio a una reserva

`POST /api/bookings/:bid/services/:sid`

Los servicios asociados a una reserva se almacenan con una estructura similar a la siguiente:

```json
{
  "service": "671a12345678901234567890",
  "quantity": 1
}
```

El campo `service` contiene una referencia al identificador del servicio en MongoDB.

Si se agrega nuevamente el mismo servicio a una reserva, se incrementa el valor de `quantity`.

## Persistencia

La persistencia se realiza mediante MongoDB Atlas y Mongoose.

La URI de conexión se configura mediante la variable de entorno `MONGO_URI`. Las operaciones de acceso a datos se implementan en la capa DAO.

## Estructura del proyecto

```text
src/
├── app.js
├── server.js
├── config/
│   ├── database.js
│   └── env.config.js
├── models/
│   ├── service.model.js
│   ├── booking.model.js
│   └── message.model.js
├── controllers/
│   ├── services.controller.js
│   └── bookings.controller.js
├── services/
│   ├── services.service.js
│   └── bookings.service.js
├── repositories/
│   ├── services.repository.js
│   └── bookings.repository.js
├── dao/
│   ├── services.dao.js
│   └── bookings.dao.js
└── routes/
    ├── services.router.js
    └── bookings.router.js
```

## Autor

Rafael Velázquez


## Vistas con Handlebars

El proyecto incorpora vistas renderizadas desde el servidor mediante Express Handlebars.

### Servicios

`GET /views/services`

Muestra los servicios registrados en MongoDB con nombre, descripción, duración, precio, categoría y disponibilidad.

### Disponibilidad

`GET /views/availability`

Muestra los servicios que tienen el campo `available` en `true`.

Las vistas utilizan el controller de vistas y la arquitectura existente para obtener los datos desde MongoDB. No se utilizan datos de ejemplo hardcodeados en las plantillas.

## Comunicación en tiempo real con Socket.io

El servidor HTTP comparte la instancia de Express con Socket.io.

Cuando se crea un servicio correctamente mediante:

`POST /api/services`

el servidor emite el evento `service:created` con los datos del nuevo servicio.

El cliente ubicado en `src/public/js/socket.js` escucha ese evento y actualiza las tarjetas de las vistas sin recargar la página.

## Tecnologías adicionales

- Express Handlebars: renderizado de vistas del lado del servidor.
- Socket.io: comunicación en tiempo real entre el servidor y los navegadores.
- CSS: estilos adaptables para las vistas.
- JavaScript del lado del cliente: actualización dinámica de los listados.

## Estructura adicional de la Entrega 7

```text
src/
├── config/
│   └── socket.js
├── controllers/
│   └── views.controller.js
├── routes/
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

La API REST existente se mantiene disponible junto con las nuevas vistas.
