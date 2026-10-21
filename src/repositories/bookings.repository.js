
import mongoose from 'mongoose';
import BookingsDAO from '../dao/bookings.dao.js';

class BookingsRepository {
    constructor() {
        this.dao = new BookingsDAO();
    }

    isValidId(id) {
        return mongoose.isValidObjectId(id);
    }

    async create(booking) {
        return await this.dao.create(booking);
    }

    async getById(id) {
        if (!this.isValidId(id)) {
            return null;
        }

        return await this.dao.getById(id);
    }

    async update(id, booking) {
        if (!this.isValidId(id)) {
            return null;
        }

        return await this.dao.update(id, booking);
    }
}

export default BookingsRepository;
