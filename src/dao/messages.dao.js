import Message from '../models/message.model.js';

class MessagesDAO {
    async getAll() {
        return await Message.find().lean();
    }

    async getById(id) {
        return await Message.findById(id).lean();
    }

    async create(messageData) {
        const message = await Message.create(messageData);
        return message.toObject();
    }

    async delete(id) {
        return await Message.findByIdAndDelete(id).lean();
    }
}

export default MessagesDAO;
