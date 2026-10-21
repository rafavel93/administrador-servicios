
import BookingsService from '../services/bookings.service.js';

const bookingsService = new BookingsService();

export const createBooking = async (req, res) => {
    try {
        const newBooking = await bookingsService.createBooking(req.body);

        return res.status(201).json(newBooking);
    } catch (error) {
        return res.status(400).json({
            error: error.message
        });
    }
};

export const getBookingById = async (req, res) => {
    try {
        const { bid } = req.params;
        const booking = await bookingsService.getBookingById(bid);

        if (!booking) {
            return res.status(404).json({
                error: 'Reserva no encontrada'
            });
        }

        return res.status(200).json(booking);
    } catch (error) {
        return res.status(500).json({
            error: 'Error al obtener la reserva'
        });
    }
};

export const addServiceToBooking = async (req, res) => {
    try {
        const { bid, sid } = req.params;

        const updatedBooking = await bookingsService.addServiceToBooking(
            bid,
            sid
        );

        if (!updatedBooking) {
            return res.status(404).json({
                error: 'Reserva o servicio no encontrado'
            });
        }

        return res.status(200).json(updatedBooking);
    } catch (error) {
        if (error.message === 'Servicio no encontrado') {
            return res.status(404).json({
                error: error.message
            });
        }

        return res.status(400).json({
            error: error.message
        });
    }
};
