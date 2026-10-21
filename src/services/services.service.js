
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
                    service.category?.toLowerCase() === category.toLowerCase()
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

        return await this.repository.create(serviceData);
    }

    async updateService(id, updatedData) {
        const service = await this.repository.getById(id);

        if (!service) {
            return null;
        }

        return await this.repository.update(id, updatedData);
    }

    async deleteService(id) {
        return await this.repository.delete(id);
    }
}

export default ServicesService;
