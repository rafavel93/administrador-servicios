import mongoose from 'mongoose';
import MessagesDAO from '../dao/messages.dao.js';

class MessagesRepository {
    constructor() {
        this.dao = new MessagesDAO();
    }

    async getAll() {
        return await this.dao.getAll();
    }

    async getById(id) {
        if (!mongoose.isValidObjectId(id)) {
            return null;
        }

        return await this.dao.getById(id);
    }

    async create(messageData) {
        return await this.dao.create(messageData);
    }

    async delete(id) {
        if (!mongoose.isValidObjectId(id)) {
            return null;
        }

        return await this.dao.delete(id);
    }
}

export default MessagesRepository;
