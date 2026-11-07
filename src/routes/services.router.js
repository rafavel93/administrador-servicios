import { Router } from 'express';

import {
    getServices,
    getServiceById,
    createService,
    updateService,
    deleteService
} from '../controllers/services.controller.js';

import { validate } from '../middlewares/validate.middleware.js';

import {
    createServiceSchema,
    updateServiceSchema,
    serviceQuerySchema,
    serviceIdParamsSchema
} from '../validators/service.validator.js';

const router = Router();

router.get('/', validate(serviceQuerySchema, 'query'), getServices);

router.get('/:sid', validate(serviceIdParamsSchema, 'params'), getServiceById);

router.post('/', validate(createServiceSchema), createService);

router.put(
    '/:sid',
    validate(serviceIdParamsSchema, 'params'),
    validate(updateServiceSchema),
    updateService
);

router.delete('/:sid', validate(serviceIdParamsSchema, 'params'), deleteService);

export default router;
