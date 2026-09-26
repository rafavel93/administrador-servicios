import { Router } from 'express';
import BookingManager from '../managers/BookingManager.js';

const router = Router();
const bookingManager = new BookingManager();

// Crear una reserva
router.post('/', async (req, res) => {
    try {
        const newBooking = await bookingManager.createBooking(req.body);

        res.status(201).json(newBooking);
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
});

// Obtener una reserva por ID
router.get('/:bid', async (req, res) => {
    const { bid } = req.params;

    const booking = await bookingManager.getBookingById(bid);

    if (!booking) {
        return res.status(404).json({
            error: 'Reserva no encontrada'
        });
    }

    res.status(200).json(booking);
});

// Agregar un servicio a una reserva
router.post('/:bid/services/:sid', async (req, res) => {
    const { bid, sid } = req.params;

    try {
        const updatedBooking = await bookingManager.addServiceToBooking(
            bid,
            sid
        );

        if (!updatedBooking) {
            return res.status(404).json({
                error: 'Reserva no encontrada'
            });
        }

        res.status(200).json(updatedBooking);
    } catch (error) {
        res.status(404).json({
            error: error.message
        });
    }
});

export default router;
