import BookingsDAO from '../dao/bookings.dao.js';

class BookingsRepository {
    constructor() {
        this.dao = new BookingsDAO();
    }

    async create(booking) {
        return await this.dao.create(booking);
    }

    async getById(id) {
        return await this.dao.getById(id);
    }

    async update(id, booking) {
        return await this.dao.update(id, booking);
    }
}

export default BookingsRepository;
