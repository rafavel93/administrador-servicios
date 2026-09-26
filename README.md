# API de Servicios y Reservas

API REST desarrollada con Node.js, Express y FileSystem para gestionar servicios y reservas, utilizando archivos JSON como sistema de persistencia.

## Tecnologías

* Node.js
* Express
* FileSystem
* dotenv
* JavaScript (ES Modules)

## Instalación

Clonar el repositorio e instalar las dependencias:

```bash
npm install
```

Crear un archivo `.env` en la raíz del proyecto:

```env
PORT=8080
NODE_ENV=development
```

## Ejecución

Para iniciar el servidor:

```bash
npm start
```

Para ejecutar el servidor en modo desarrollo:

```bash
npm run dev
```

La API estará disponible en:

```text
http://localhost:8080
```

## Servicios

### Obtener todos los servicios

```http
GET /api/services
```

### Obtener un servicio por ID

```http
GET /api/services/:sid
```

### Crear un servicio

```http
POST /api/services
```

Ejemplo:

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

El `id` se genera automáticamente.

### Actualizar un servicio

```http
PUT /api/services/:sid
```

El `id` no puede modificarse.

### Eliminar un servicio

```http
DELETE /api/services/:sid
```

## Reservas

### Crear una reserva

```http
POST /api/bookings
```

Ejemplo:

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

Los servicios dentro de una reserva se almacenan con la siguiente estructura:

```json
{
  "service": 1,
  "quantity": 1
}
```

Si el mismo servicio se agrega nuevamente, se incrementa `quantity`.

## Persistencia

Los datos se almacenan en archivos JSON:

* `src/data/services.json`
* `src/data/bookings.json`

Los datos permanecen guardados aunque se reinicie el servidor.

## Estructura del proyecto

```text
src/
├── app.js
├── server.js
├── config/
│   └── env.config.js
├── managers/
│   ├── ServiceManager.js
│   └── BookingManager.js
├── routes/
│   ├── services.router.js
│   └── bookings.router.js
└── data/
    ├── services.json
    └── bookings.json
```

## Autor

Rafael Velázquez
