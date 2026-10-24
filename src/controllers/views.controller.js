import ServicesService from '../services/services.service.js';

const servicesService = new ServicesService();

export const getServicesView = async (req, res) => {
    try {
        const services = await servicesService.getServices();

        res.render('services', {
            title: 'Servicios disponibles',
            services
        });
    } catch (error) {
        console.error('Error al cargar la vista de servicios:', error.message);
        res.status(500).send('Error al cargar los servicios');
    }
};

export const getAvailabilityView = async (req, res) => {
    try {
        const services = await servicesService.getServices({
            available: 'true'
        });

        res.render('availability', {
            title: 'Disponibilidad',
            services
        });
    } catch (error) {
        console.error('Error al cargar la disponibilidad:', error.message);
        res.status(500).send('Error al cargar la disponibilidad');
    }
};
