import ServicesRepository from '../repositories/services.repository.js';

class ServicesService {
    constructor() {
        this.repository = new ServicesRepository();
    }

    async getServices(filters = {}) {
        const { category, available } = filters;

        let services = await this.repository.getAll();

        if (category) {
            services = services.filter(
                service =>
                    service.category.toLowerCase() === category.toLowerCase()
            );
        }

        if (available !== undefined) {
            services = services.filter(
                service => service.available === (available === 'true')
            );
        }

        return services;
    }

    async getServiceById(id) {
        return await this.repository.getById(id);
    }

    async createService(serviceData) {
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

        const services = await this.repository.getAll();

        const newId = services.length > 0
            ? Math.max(...services.map(service => service.id)) + 1
            : 1;

        const newService = {
            ...serviceData,
            id: newId
        };

        return await this.repository.create(newService);
    }

    async updateService(id, updatedData) {
        const service = await this.repository.getById(id);

        if (!service) {
            return null;
        }

        const updatedService = {
            ...service,
            ...updatedData,
            id: service.id
        };

        return await this.repository.update(
            id,
            updatedService
        );
    }

    async deleteService(id) {
        return await this.repository.delete(id);
    }
}

export default ServicesService;
