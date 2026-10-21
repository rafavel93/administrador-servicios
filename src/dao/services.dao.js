
import Service from '../models/service.model.js';

class ServicesDAO {
    async getAll() {
        return await Service.find().lean();
    }

    async getById(id) {
        return await Service.findById(id).lean();
    }

    async create(service) {
        const newService = await Service.create(service);
        return newService.toObject();
    }

    async update(id, updatedService) {
        return await Service.findByIdAndUpdate(
            id,
            updatedService,
            {
                new: true,
                runValidators: true
            }
        ).lean();
    }

    async delete(id) {
        return await Service.findByIdAndDelete(id).lean();
    }
}

export default ServicesDAO;
