import { z } from 'zod';

const objectIdSchema = z.string().regex(
    /^[a-fA-F0-9]{24}$/,
    'El identificador debe ser un ObjectId válido'
);

export const createBookingSchema = z.object({
    clientName: z.string()
        .trim()
        .min(1, 'El nombre del cliente es obligatorio'),

    clientEmail: z.string()
        .trim()
        .email('El correo electrónico no es válido'),

    date: z.string()
        .trim()
        .min(1, 'La fecha es obligatoria'),

    time: z.string()
        .trim()
        .regex(
            /^([01]\d|2[0-3]):[0-5]\d$/,
            'La hora debe tener el formato HH:mm'
        ),

    status: z.string()
        .trim()
        .min(1, 'El estado es obligatorio')
}).strict();

export const addServiceToBookingSchema = z.object({}).strict();

export const bookingIdParamsSchema = z.object({
    bid: objectIdSchema
});

export const addServiceToBookingParamsSchema = z.object({
    bid: objectIdSchema,
    sid: objectIdSchema
});
