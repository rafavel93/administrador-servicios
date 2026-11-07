# Administrador de Servicios y Reservas

API REST desarrollada con Node.js, Express y MongoDB Atlas para gestionar servicios, reservas y mensajes. Utiliza Mongoose como ODM, Zod para la validación de datos y una arquitectura en capas. Incorpora vistas renderizadas con Express Handlebars y actualizaciones en tiempo real mediante Socket.io.

## Tecnologías utilizadas

- Node.js
- Express
- MongoDB Atlas
- Mongoose
- Zod
- Express Handlebars
- Socket.io
- dotenv

## Instalación

Clonar el repositorio:

```bash
git clone https://github.com/rafavel93/administrador-servicios.git
```

Ingresar al directorio:

```bash
cd administrador-servicios
```

Instalar las dependencias:

```bash
npm install
```

## Variables de entorno

Crear un archivo `.env` en la raíz del proyecto, tomando como referencia `.env.example`.

```env
PORT=8080
NODE_ENV=development
MONGO_URI=mongodb+srv://<db_username>:<db_password>@<cluster-url>/administrador-servicios
```

Reemplazar los valores de conexión por las credenciales correspondientes de MongoDB Atlas.

**Importante:** el archivo `.env` contiene información sensible y no debe subirse al repositorio. Está incluido en `.gitignore`.

## Ejecución

Iniciar el servidor:

```bash
npm start
```

Iniciar el servidor en modo desarrollo:

```bash
npm run dev
```

Por defecto, la aplicación utiliza el puerto `8080`.

La conexión con MongoDB Atlas se realiza antes de iniciar el servidor HTTP.

## Arquitectura del proyecto

El proyecto utiliza una arquitectura en capas para separar responsabilidades y facilitar el mantenimiento del código.

```text
src/
├── config/
│   ├── database.js
│   ├── env.config.js
│   └── socket.js
├── controllers/
│   ├── bookings.controller.js
│   ├── messages.controller.js
│   ├── services.controller.js
│   └── views.controller.js
├── dao/
│   ├── bookings.dao.js
│   ├── messages.dao.js
│   └── services.dao.js
├── middlewares/
│   └── validate.middleware.js
├── models/
│   ├── booking.model.js
│   ├── message.model.js
│   └── service.model.js
├── public/
│   ├── css/
│   │   └── styles.css
│   └── js/
│       └── socket.js
├── repositories/
│   ├── bookings.repository.js
│   ├── messages.repository.js
│   └── services.repository.js
├── routes/
│   ├── bookings.router.js
│   ├── messages.router.js
│   ├── services.router.js
│   └── views.router.js
├── services/
│   ├── bookings.service.js
│   ├── messages.service.js
│   └── services.service.js
├── validators/
│   ├── booking.validator.js
│   └── service.validator.js
├── views/
│   ├── layouts/
│   │   └── main.handlebars
│   ├── availability.handlebars
│   └── services.handlebars
├── app.js
└── server.js
```

### Responsabilidades de las capas

- **Routes:** definen los endpoints y conectan las rutas con los controladores.
- **Controllers:** reciben las solicitudes HTTP y gestionan las respuestas.
- **Services:** contienen la lógica de negocio.
- **Repositories:** centralizan el acceso a los datos y delegan las operaciones en los DAO.
- **DAO:** ejecutan las operaciones de persistencia mediante Mongoose.
- **Models:** definen los esquemas y modelos de MongoDB.
- **Validators:** contienen los esquemas de validación con Zod.
- **Middlewares:** ejecutan validaciones antes de llegar a los controladores.
- **Config:** contiene la configuración de la base de datos, variables de entorno y Socket.io.

## Modelos de datos

### Service

Representa los servicios disponibles en el sistema.

Campos principales:

- `name`: nombre del servicio.
- `description`: descripción.
- `duration`: duración en minutos.
- `price`: precio.
- `category`: categoría.
- `available`: disponibilidad.

### Booking

Representa una reserva realizada por un cliente.

Campos principales:

- `clientName`: nombre del cliente.
- `clientEmail`: correo electrónico.
- `date`: fecha de la reserva.
- `time`: horario.
- `status`: estado de la reserva.
- `services`: servicios asociados a la reserva.

Las reservas almacenan referencias a los servicios mediante `ObjectId` y mantienen la cantidad de cada servicio agregado mediante el campo `quantity`.

Los servicios asociados se almacenan como referencias, no como objetos completos.

Las consultas de reservas utilizan `populate()` para recuperar los datos de los servicios asociados.

### Message

Representa los mensajes almacenados en el sistema.

## Validaciones con Zod

El proyecto utiliza Zod para validar los datos recibidos antes de ejecutar operaciones sobre la base de datos.

Los esquemas se encuentran en `src/validators/` y el middleware de validación en `src/middlewares/validate.middleware.js`.

Se validan las siguientes operaciones:

- Creación y actualización de servicios.
- Parámetros de consulta de servicios.
- Identificadores de servicios (`sid`) en las rutas GET, PUT y DELETE.
- Creación de reservas.
- Identificadores de reservas (`bid`) y servicios (`sid`) utilizados en las rutas de reservas.
- Asociación de servicios a reservas.

Las validaciones comprueban tipos de datos, campos obligatorios, valores permitidos y formatos de identificadores ObjectId de MongoDB.

Cuando los datos no cumplen las reglas establecidas, la API responde con HTTP `400 Bad Request` e informa los campos que presentan errores.

## Endpoints de servicios

### Obtener todos los servicios

```http
GET /api/services
```

Permite realizar consultas avanzadas mediante parámetros opcionales.

| Parámetro | Descripción | Valores |
|---|---|---|
| category | Filtrar por categoría | Texto |
| available | Filtrar por disponibilidad | true / false |
| page | Número de página | Entero positivo |
| limit | Resultados por página | Entre 1 y 100 |
| sortBy | Campo de ordenamiento | name, price, duration, category, createdAt |
| order | Orden de los resultados | asc / desc |

Ejemplos:

Filtrar por categoría:

```http
GET /api/services?category=Salud
```

Filtrar por disponibilidad:

```http
GET /api/services?available=true
```

Combinar filtros:

```http
GET /api/services?category=Salud&available=true
```

Consultar una página específica:

```http
GET /api/services?page=1&limit=5
```

Ordenar por precio de mayor a menor:

```http
GET /api/services?sortBy=price&order=desc
```

Combinar filtros, paginación y ordenamiento:

```http
GET /api/services?category=Salud&available=true&page=1&limit=5&sortBy=price&order=desc
```

La respuesta incluye:

- `payload`: servicios obtenidos.
- `totalResults`: cantidad total de resultados.
- `page`: página actual.
- `limit`: cantidad máxima de resultados por página.
- `totalPages`: cantidad total de páginas.
- `hasPrevPage`: indica si existe una página anterior.
- `hasNextPage`: indica si existe una página siguiente.

### Obtener un servicio por ID

```http
GET /api/services/:sid
```

Valida el identificador `sid` mediante Zod antes de consultar la base de datos.

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

Permite actualizar uno o varios campos del servicio identificado por `sid`.

Valida el identificador y los datos recibidos antes de ejecutar la actualización.

### Eliminar un servicio

```http
DELETE /api/services/:sid
```

Valida el identificador `sid` mediante Zod antes de ejecutar la eliminación.

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
  "date": "2026-11-10",
  "time": "10:00",
  "status": "pendiente"
}
```

Las reservas se crean inicialmente con un array `services` vacío.

Los datos recibidos se validan mediante Zod, incluyendo el formato del correo electrónico y la hora.

### Obtener una reserva por ID

```http
GET /api/bookings/:bid
```

Permite consultar una reserva utilizando su identificador.

La respuesta utiliza `populate()` para incluir los datos de los servicios asociados a la reserva.

### Agregar un servicio a una reserva

```http
POST /api/bookings/:bid/services/:sid
```

Los identificadores de la reserva y del servicio se reciben mediante los parámetros de la URL.

Ambos identificadores se validan mediante Zod.

La asociación no requiere datos en el body. Se puede enviar un objeto vacío (`{}`).

La cantidad inicial del servicio se establece automáticamente en `1`. Si se agrega nuevamente el mismo servicio a una reserva, se incrementa el valor de `quantity`.

Las consultas posteriores utilizan `populate()` para recuperar la información completa de los servicios relacionados.

## Endpoints de mensajes

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
  "user": "Rafael",
  "message": "Consulta sobre un servicio"
}
```

Los campos `user` y `message` son obligatorios y deben contener texto no vacío. Ambos valores se limpian con `trim()` antes de almacenarse.

La API responde con HTTP `201 Created` cuando el mensaje se crea correctamente. Los identificadores `mid` se validan como ObjectId en las consultas y eliminaciones. Si el mensaje no existe, responde con HTTP `404 Not Found`.

### Eliminar un mensaje

```http
DELETE /api/messages/:mid
```

## Vistas con Handlebars

El proyecto incorpora vistas renderizadas mediante Express Handlebars.

Las vistas disponibles son:

### Servicios

```http
GET /views/services
```

Muestra los servicios registrados en el sistema.

### Disponibilidad

```http
GET /views/availability
```

Muestra los servicios que se encuentran disponibles.

Las vistas utilizan un layout principal y estilos CSS propios.

## Actualizaciones en tiempo real con Socket.io

El proyecto utiliza Socket.io para comunicar los cambios realizados sobre los servicios a los clientes conectados.

Se implementan los siguientes eventos:

- `service:created`: informa la creación de un servicio.
- `service:updated`: informa la actualización de un servicio.
- `service:deleted`: informa la eliminación de un servicio.

Las vistas reciben estos eventos y actualizan dinámicamente las listas de servicios y disponibilidad sin necesidad de recargar la página.

La implementación del cliente se encuentra en `src/public/js/socket.js`.

## Seguridad y configuración

- Las variables de entorno se gestionan mediante dotenv.
- La configuración verifica la existencia de las variables requeridas.
- Las credenciales de MongoDB Atlas se mantienen fuera del repositorio.
- `.env` y `node_modules/` están excluidos mediante `.gitignore`.
- Se incluye `.env.example` como referencia para configurar el entorno local.

## Autor

Proyecto desarrollado como entrega final de **Programación Backend I: Desarrollo Avanzado de Backend**.
