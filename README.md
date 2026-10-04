
API REST desarrollada con Node.js, Express y FileSystem para gestionar servicios y reservas, utilizando archivos JSON como sistema de persistencia.

## Tecnologías

* Node.js
* Express
* FileSystem
* dotenv
* JavaScript (ES Modules)

## Instalación

Clonar el repositorio e instalar las dependencias:

    npm install

Crear un archivo `.env` en la raíz del proyecto:

    PORT=8080
    NODE_ENV=development

## Ejecución

Para iniciar el servidor:

    npm start

Para ejecutar el servidor en modo desarrollo:

    npm run dev

La API estará disponible en:

    http://localhost:8080

## Arquitectura

El proyecto utiliza una arquitectura en capas:

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
    JSON

### Router

Define los endpoints de la API y deriva las solicitudes hacia los controllers correspondientes.

### Controller

Se encarga de recibir la información de req, obtener parámetros, querys y body, llamar al service correspondiente y devolver la respuesta mediante res.

### Service

Contiene la lógica de negocio de la aplicación.

Por ejemplo:

* Validación de campos obligatorios.
* Generación de datos necesarios para crear entidades.
* Aplicación de filtros.
* Validación de existencia de servicios al agregarlos a una reserva.
* Incremento de quantity cuando se agrega nuevamente el mismo servicio a una reserva.

### Repository

Actúa como intermediario entre los services y los DAO.

Se encarga de exponer las operaciones de acceso a datos sin contener lógica de negocio.

### DAO

Es la capa encargada de interactuar directamente con los archivos JSON mediante FileSystem.

Los DAO realizan operaciones de lectura y escritura sobre:

* services.json
* bookings.json

## Servicios

### Obtener todos los servicios

    GET /api/services

También permite filtrar por categoría:

    GET /api/services?category=Salud

Y por disponibilidad:

    GET /api/services?available=true

### Obtener un servicio por ID

    GET /api/services/:sid

### Crear un servicio

    POST /api/services

Ejemplo:

    {
      "name": "Clase de natación",
      "description": "Clase individual de natación",
      "duration": 60,
      "price": 100,
      "category": "Deportes",
      "available": true
    }

El id se genera automáticamente.

### Actualizar un servicio

    PUT /api/services/:sid

El id no puede modificarse.

### Eliminar un servicio

    DELETE /api/services/:sid

## Reservas

### Crear una reserva

    POST /api/bookings

Ejemplo:

    {
      "clientName": "Rafael",
      "clientEmail": "rafa@example.com",
      "date": "2026-10-10",
      "time": "10:00",
      "status": "pending"
    }

Las reservas se crean inicialmente con un array services vacío.

### Obtener una reserva por ID

    GET /api/bookings/:bid

### Agregar un servicio a una reserva

    POST /api/bookings/:bid/services/:sid

Los servicios dentro de una reserva se almacenan con la siguiente estructura:

    {
      "service": 1,
      "quantity": 1
    }

Si el mismo servicio se agrega nuevamente, se incrementa quantity.

## Persistencia

Los datos se almacenan en archivos JSON:

* src/data/services.json
* src/data/bookings.json

Los datos permanecen guardados aunque se reinicie el servidor.

## Estructura del proyecto

    src/
    ├── app.js
    ├── server.js
    ├── config/
    │   └── env.config.js
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
    ├── routes/
    │   ├── services.router.js
    │   └── bookings.router.js
    └── data/
        ├── services.json
        └── bookings.json

## Autor

Rafael Velázquez
