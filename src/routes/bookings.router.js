import { Router } from 'express';

import {
    createBooking,
    getBookingById,
    addServiceToBooking
} from '../controllers/bookings.controller.js';

import { validate } from '../middlewares/validate.middleware.js';

import {
    createBookingSchema,
    addServiceToBookingSchema,
    bookingIdParamsSchema,
    addServiceToBookingParamsSchema
} from '../validators/booking.validator.js';

const router = Router();

router.post(
    '/',
    validate(createBookingSchema),
    createBooking
);

router.get(
    '/:bid',
    validate(bookingIdParamsSchema, 'params'),
    getBookingById
);

router.post(
    '/:bid/services/:sid',
    validate(addServiceToBookingParamsSchema, 'params'),
    validate(addServiceToBookingSchema),
    addServiceToBooking
);

export default router;
