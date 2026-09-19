import fs from 'fs/promises';
import path from 'path';

class ServiceManager {
    constructor() {
        this.filePath = path.join(
            process.cwd(),
            'src',
            'data',
            'services.json'
        );
    }

    async getServices() {
        const data = await fs.readFile(this.filePath, 'utf-8');
        return JSON.parse(data);
    }

    async getServiceById(id) {
        const services = await this.getServices();

        return services.find(service => service.id === Number(id)) || null;
    }

    async addService(serviceData) {
        const requiredFields = [
            'name',
            'description',
            'duration',
            'price',
            'category',
            'available'
        ];

        const hasMissingField = requiredFields.some(
            field => serviceData[field] === undefined
        );

        if (hasMissingField) {
            throw new Error('Faltan campos obligatorios');
        }

        const services = await this.getServices();

        const newId = services.length > 0
            ? Math.max(...services.map(service => service.id)) + 1
            : 1;

        const newService = {
            ...serviceData,
            id: newId
        };

        services.push(newService);

        await fs.writeFile(
            this.filePath,
            JSON.stringify(services, null, 2)
        );

        return newService;
    }

    async updateService(id, updatedData) {
        const services = await this.getServices();

        const index = services.findIndex(
            service => service.id === Number(id)
        );

        if (index === -1) {
            return null;
        }

        const updatedService = {
            ...services[index],
            ...updatedData,
            id: services[index].id
        };

        services[index] = updatedService;

        await fs.writeFile(
            this.filePath,
            JSON.stringify(services, null, 2)
        );

        return updatedService;
    }

    async deleteService(id) {
        const services = await this.getServices();

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

export default ServiceManager;