import ServicesService from '../services/services.service.js';
import { getSocketIO } from '../config/socket.js';

const servicesService = new ServicesService();

export const getServices = async (req, res) => {
    try {
        const { category, available } = req.query;

        const services = await servicesService.getServices({
            category,
            available
        });

        return res.status(200).json(services);
    } catch (error) {
        return res.status(500).json({
            error: 'Error al obtener los servicios'
        });
    }
};

export const getServiceById = async (req, res) => {
    try {
        const { sid } = req.params;
        const service = await servicesService.getServiceById(sid);

        if (!service) {
            return res.status(404).json({
                error: 'Servicio no encontrado'
            });
        }

        return res.status(200).json(service);
    } catch (error) {
        return res.status(500).json({
            error: 'Error al obtener el servicio'
        });
    }
};

export const createService = async (req, res) => {
    try {
        const newService = await servicesService.createService(req.body);

        getSocketIO().emit('service:created', newService);

        return res.status(201).json(newService);
    } catch (error) {
        return res.status(400).json({
            error: error.message
        });
    }
};

export const updateService = async (req, res) => {
    try {
        const { sid } = req.params;
        const { _id, id, ...updatedData } = req.body;

        const updatedService = await servicesService.updateService(
            sid,
            updatedData
        );

        if (!updatedService) {
            return res.status(404).json({
                error: 'Servicio no encontrado'
            });
        }

        return res.status(200).json(updatedService);
    } catch (error) {
        return res.status(400).json({
            error: error.message
        });
    }
};

export const deleteService = async (req, res) => {
    try {
        const { sid } = req.params;
        const deletedService = await servicesService.deleteService(sid);

        if (!deletedService) {
            return res.status(404).json({
                error: 'Servicio no encontrado'
            });
        }

        return res.status(200).json(deletedService);
    } catch (error) {
        return res.status(500).json({
            error: 'Error al eliminar el servicio'
        });
    }
};
