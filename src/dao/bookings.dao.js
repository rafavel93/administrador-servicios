
import Booking from '../models/booking.model.js';

class BookingsDAO {
    async getAll() {
        return await Booking.find()
            .populate('services.service')
            .lean();
    }

    async getById(id) {
        return await Booking.findById(id)
            .populate('services.service')
            .lean();
    }

    async create(booking) {
        const newBooking = await Booking.create(booking);

        return await Booking.findById(newBooking._id)
            .populate('services.service')
            .lean();
    }

    async update(id, updatedBooking) {
        return await Booking.findByIdAndUpdate(
            id,
            updatedBooking,
            {
                new: true,
                runValidators: true
            }
        )
            .populate('services.service')
            .lean();
    }

    async delete(id) {
        return await Booking.findByIdAndDelete(id).lean();
    }
}

export default BookingsDAO;
