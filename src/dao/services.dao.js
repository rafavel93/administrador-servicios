import fs from 'fs/promises';
import path from 'path';

class ServicesDAO {
    constructor() {
        this.filePath = path.join(
            process.cwd(),
            'src',
            'data',
            'services.json'
        );
    }

    async getAll() {
        try {
            const data = await fs.readFile(this.filePath, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            throw new Error('No se pudo leer el archivo de servicios');
        }
    }

    async getById(id) {
        const services = await this.getAll();

        return services.find(
            service => service.id === Number(id)
        ) || null;
    }

    async create(service) {
        try {
            const services = await this.getAll();

            services.push(service);

            await fs.writeFile(
                this.filePath,
                JSON.stringify(services, null, 2)
            );

            return service;
        } catch (error) {
            throw new Error('No se pudo guardar el servicio');
        }
    }

    async update(id, updatedService) {
        try {
            const services = await this.getAll();

            const index = services.findIndex(
                service => service.id === Number(id)
            );

            if (index === -1) {
                return null;
            }

            services[index] = updatedService;

            await fs.writeFile(
                this.filePath,
                JSON.stringify(services, null, 2)
            );

            return updatedService;
        } catch (error) {
            throw new Error('No se pudo actualizar el servicio');
        }
    }

    async delete(id) {
        try {
            const services = await this.getAll();

            const index = services.findIndex(
                service => service.id === Number(id)
            );

            if (index === -1) {
                return null;
            }

            const deletedService = services[index];

            services.splice(index, 1);

            await fs.writeFile(
                this.filePath,
                JSON.stringify(services, null, 2)
            );

            return deletedService;
        } catch (error) {
            throw new Error('No se pudo eliminar el servicio');
        }
    }
}

export default ServicesDAO;
