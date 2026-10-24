import MessagesRepository from '../repositories/messages.repository.js';

class MessagesService {
    constructor() {
        this.repository = new MessagesRepository();
    }

    async getMessages() {
        return await this.repository.getAll();
    }

    async getMessageById(id) {
        return await this.repository.getById(id);
    }

    async createMessage(messageData) {
        if (
            !messageData ||
            typeof messageData.user !== 'string' ||
            typeof messageData.message !== 'string' ||
            !messageData.user.trim() ||
            !messageData.message.trim()
        ) {
            throw new Error('El usuario y el mensaje son obligatorios');
        }

        return await this.repository.create({
            user: messageData.user.trim(),
            message: messageData.message.trim()
        });
    }

    async deleteMessage(id) {
        return await this.repository.delete(id);
    }
}

export default MessagesService;
