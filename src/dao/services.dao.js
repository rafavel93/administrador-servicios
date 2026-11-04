import Service from '../models/service.model.js';

class ServicesDAO {
    async getAll(filters = {}, options = {}) {
        const {
            page = 1,
            limit = 10,
            sortBy = 'name',
            order = 'asc'
        } = options;

        const skip = (page - 1) * limit;
        const sortOrder = order === 'desc' ? -1 : 1;

        const [services, totalResults] = await Promise.all([
            Service.find(filters)
                .sort({ [sortBy]: sortOrder })
                .skip(skip)
                .limit(limit)
                .lean(),

            Service.countDocuments(filters)
        ]);

        const totalPages = Math.ceil(totalResults / limit);

        return {
            payload: services,
            totalResults,
            page,
            limit,
            totalPages,
            hasPrevPage: page > 1,
            hasNextPage: page < totalPages
        };
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
