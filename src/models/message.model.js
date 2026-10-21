
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
    {
        user: {
            type: String,
            required: true,
            trim: true
        },
        message: {
            type: String,
            required: true,
            trim: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const Message = mongoose.model('Message', messageSchema);

export default Message;
