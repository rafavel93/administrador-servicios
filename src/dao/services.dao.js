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
        const data = await fs.readFile(this.filePath, 'utf-8');
        return JSON.parse(data);
    }

    async getById(id) {
        const services = await this.getAll();

        return services.find(
            service => service.id === Number(id)
        ) || null;
    }

    async create(service) {
        const services = await this.getAll();

        services.push(service);

        await fs.writeFile(
            this.filePath,
            JSON.stringify(services, null, 2)
        );

        return service;
    }

    async update(id, updatedService) {
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
    }

    async delete(id) {
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
    }
}

export default ServicesDAO;
