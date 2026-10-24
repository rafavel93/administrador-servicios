import mongoose from 'mongoose';
import MessagesService from '../services/messages.service.js';

const messagesService = new MessagesService();

export const getMessages = async (req, res) => {
    try {
        const messages = await messagesService.getMessages();
        return res.status(200).json(messages);
    } catch (error) {
        console.error('Error al obtener los mensajes:', error.message);
        return res.status(500).json({
            error: 'Error al obtener los mensajes'
        });
    }
};

export const getMessageById = async (req, res) => {
    try {
        const { mid } = req.params;

        if (!mongoose.isValidObjectId(mid)) {
            return res.status(400).json({
                error: 'ID de mensaje inválido'
            });
        }

        const message = await messagesService.getMessageById(mid);

        if (!message) {
            return res.status(404).json({
                error: 'Mensaje no encontrado'
            });
        }

        return res.status(200).json(message);
    } catch (error) {
        console.error('Error al obtener el mensaje:', error.message);
        return res.status(500).json({
            error: 'Error al obtener el mensaje'
        });
    }
};

export const createMessage = async (req, res) => {
    try {
        const message = await messagesService.createMessage(req.body);
        return res.status(201).json(message);
    } catch (error) {
        if (error.message === 'El usuario y el mensaje son obligatorios') {
            return res.status(400).json({ error: error.message });
        }

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                error: 'Los datos del mensaje no son válidos'
            });
        }

        console.error('Error al crear el mensaje:', error.message);
        return res.status(500).json({
            error: 'Error al crear el mensaje'
        });
    }
};

export const deleteMessage = async (req, res) => {
    try {
        const { mid } = req.params;

        if (!mongoose.isValidObjectId(mid)) {
            return res.status(400).json({
                error: 'ID de mensaje inválido'
            });
        }

        const message = await messagesService.deleteMessage(mid);

        if (!message) {
            return res.status(404).json({
                error: 'Mensaje no encontrado'
            });
        }

        return res.status(200).json({
            message: 'Mensaje eliminado correctamente',
            deletedMessage: message
        });
    } catch (error) {
        console.error('Error al eliminar el mensaje:', error.message);
        return res.status(500).json({
            error: 'Error al eliminar el mensaje'
        });
    }
};
