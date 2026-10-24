import { createServer } from 'node:http';
import { Server } from 'socket.io';
import app from './app.js';
import { config } from './config/env.config.js';
import { connectDB } from './config/database.js';
import { setSocketIO } from './config/socket.js';

const httpServer = createServer(app);

export const io = new Server(httpServer);

setSocketIO(io);

const startServer = async () => {
    await connectDB();

    httpServer.listen(config.port, () => {
        console.log(
            `Servidor ejecutándose en http://localhost:${config.port}`
        );
    });
};

startServer();
