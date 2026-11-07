import { z } from 'zod';

const serviceFields = {
    name: z.string().trim().min(1, 'El nombre es obligatorio'),

    description: z.string().trim(),

    duration: z.number().min(0, 'La duración no puede ser negativa'),

    price: z.number().min(0, 'El precio no puede ser negativo'),

    category: z.string().trim().min(1, 'La categoría es obligatoria'),

    available: z.boolean()
};

export const createServiceSchema = z.object({
    ...serviceFields
}).strict();

export const updateServiceSchema = z.object({
    name: serviceFields.name.optional(),
    description: serviceFields.description.optional(),
    duration: serviceFields.duration.optional(),
    price: serviceFields.price.optional(),
    category: serviceFields.category.optional(),
    available: serviceFields.available.optional()
}).strict().refine(
    data => Object.keys(data).length > 0,
    {
        message: 'Debe enviar al menos un campo para actualizar'
    }
);

export const serviceQuerySchema = z.object({
    category: z.string().trim().min(1).optional(),

    available: z.enum(['true', 'false']).optional(),

    page: z.coerce.number().int().positive().default(1),

    limit: z.coerce.number().int().positive().max(100).default(10),

    sortBy: z.enum([
        'name',
        'price',
        'duration',
        'category',
        'createdAt'
    ]).default('name'),

    order: z.enum(['asc', 'desc']).default('asc')
}).strict();

const serviceObjectIdSchema = z.string().regex(
    /^[a-fA-F0-9]{24}$/,
    'El identificador debe ser un ObjectId válido'
);

export const serviceIdParamsSchema = z.object({
    sid: serviceObjectIdSchema
});
