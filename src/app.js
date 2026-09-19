import http from 'http';
import { config } from './config/env.config.js';
import ServiceManager from './managers/ServiceManager.js';

const serviceManager = new ServiceManager();

const server = http.createServer(async (req, res) => {

    if (req.method === 'GET' && req.url === '/services') {
        const services = await serviceManager.getServices();

        res.writeHead(200, {
            'Content-Type': 'application/json'
        });

        res.end(JSON.stringify(services));
        return;
    }

    if (req.method === 'GET' && req.url.startsWith('/services/')) {
        const id = req.url.split('/')[2];

        const service = await serviceManager.getServiceById(id);

        if (!service) {
            res.writeHead(404, {
                'Content-Type': 'application/json'
            });

            res.end(JSON.stringify({
                error: 'Servicio no encontrado'
            }));

            return;
        }

        res.writeHead(200, {
            'Content-Type': 'application/json'
        });

        res.end(JSON.stringify(service));
        return;
    }

    res.writeHead(404, {
        'Content-Type': 'application/json'
    });

    res.end(JSON.stringify({
        error: 'Ruta no encontrada'
    }));
});

server.listen(config.port, () => {
    console.log(`Servidor ejecutándose en http://localhost:${config.port}`);
});