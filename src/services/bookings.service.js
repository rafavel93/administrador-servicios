import BookingsRepository from '../repositories/bookings.repository.js';
import ServicesRepository from '../repositories/services.repository.js';

class BookingsService {
    constructor() {
        this.repository = new BookingsRepository();
        this.servicesRepository = new ServicesRepository();
    }

    async createBooking(bookingData) {
        const requiredFields = [
            'clientName',
            'clientEmail',
            'date',
            'time',
            'status'
        ];

        const hasMissingField = requiredFields.some(
            field => !bookingData[field]
        );

        if (hasMissingField) {
            throw new Error('Faltan campos obligatorios');
        }

        const newBooking = {
            clientName: bookingData.clientName,
            clientEmail: bookingData.clientEmail,
            date: bookingData.date,
            time: bookingData.time,
            status: bookingData.status,
            services: []
        };

        return await this.repository.create(newBooking);
    }

    async getBookingById(id) {
        return await this.repository.getById(id);
    }

    async addServiceToBooking(bookingId, serviceId) {
        const booking = await this.repository.getById(bookingId);

        if (!booking) {
            return null;
        }

        const service = await this.servicesRepository.getById(serviceId);

        if (!service) {
            throw new Error('Servicio no encontrado');
        }

        const existingService = booking.services.find(
            item => item.service === Number(serviceId)
        );

        if (existingService) {
            existingService.quantity += 1;
        } else {
            booking.services.push({
                service: Number(serviceId),
                quantity: 1
            });
        }

        return await this.repository.update(
            bookingId,
            booking
        );
    }
}

export default BookingsService;
