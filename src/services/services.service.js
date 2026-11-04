import ServicesRepository from '../repositories/services.repository.js';


class ServicesService {
    constructor() {
        this.repository = new ServicesRepository();
    }

    async getServices(query = {}) {
        const {
            category,
            available,
            page = 1,
            limit = 10,
            sortBy = 'name',
            order = 'asc'
        } = query;

        const filters = {};

        if (category) {
            const escapedCategory = category.replace(
                /[.*+?^${}()|[\]\\]/g,
                '\\$&'
            );

            filters.category = {
                $regex: `^${escapedCategory}$`,
                $options: 'i'
            };
        }

        if (available !== undefined) {
            filters.available = available === 'true';
        }

        const options = {
            page,
            limit,
            sortBy,
            order
        };

        return await this.repository.getAll(filters, options);
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
