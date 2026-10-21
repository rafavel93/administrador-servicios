
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

        const existingService = booking.services.find(item => {
            const currentServiceId =
                item.service?._id?.toString() ??
                item.service?.toString();

            return currentServiceId === service._id.toString();
        });

        const updatedServices = existingService
            ? booking.services.map(item => {
                const currentServiceId =
                    item.service?._id?.toString() ??
                    item.service?.toString();

                if (currentServiceId === service._id.toString()) {
                    return {
                        service: service._id,
                        quantity: item.quantity + 1
                    };
                }

                return {
                    service: currentServiceId,
                    quantity: item.quantity
                };
            })
            : [
                ...booking.services.map(item => ({
                    service: item.service?._id ?? item.service,
                    quantity: item.quantity
                })),
                {
                    service: service._id,
                    quantity: 1
                }
            ];

        return await this.repository.update(bookingId, {
            services: updatedServices
        });
    }
}

export default BookingsService;
