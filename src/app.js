import { config } from './config/env.config.js';
import ServiceManager from './managers/ServiceManager.js';

const serviceManager = new ServiceManager();

console.log(`Servidor configurado en el puerto ${config.port}`);
console.log(`Entorno: ${config.nodeEnv}`);
console.log('ServiceManager listo');
