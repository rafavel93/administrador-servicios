import fs from 'fs/promises';
import path from 'path';
import ServiceManager from './ServiceManager.js';

class BookingManager {
    constructor() {
        this.filePath = path.join(
            process.cwd(),
            'src',
            'data',
            'bookings.json'
        );

        this.serviceManager = new ServiceManager();
    }

    async getBookings() {
        const data = await fs.readFile(this.filePath, 'utf-8');
        return JSON.parse(data);
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

        const bookings = await this.getBookings();

        const newId = bookings.length > 0
            ? Math.max(...bookings.map(booking => booking.id)) + 1
            : 1;

        const newBooking = {
            id: newId,
            clientName: bookingData.clientName,
            clientEmail: bookingData.clientEmail,
            date: bookingData.date,
            time: bookingData.time,
            status: bookingData.status,
            services: []
        };

        bookings.push(newBooking);

        await fs.writeFile(
            this.filePath,
            JSON.stringify(bookings, null, 2)
        );

        return newBooking;
    }

    async getBookingById(id) {
        const bookings = await this.getBookings();

        return bookings.find(
            booking => booking.id === Number(id)
        ) || null;
    }

    async addServiceToBooking(bookingId, serviceId) {
        const bookings = await this.getBookings();

        const booking = bookings.find(
            item => item.id === Number(bookingId)
        );

        if (!booking) {
            return null;
        }

        const service = await this.serviceManager.getServiceById(serviceId);

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

        await fs.writeFile(
            this.filePath,
            JSON.stringify(bookings, null, 2)
        );

        return booking;
    }
}

export default BookingManager;
