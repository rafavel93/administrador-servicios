
import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            trim: true,
            default: ''
        },
        duration: {
            type: Number,
            required: true,
            min: 0
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        category: {
            type: String,
            required: true,
            trim: true
        },
        available: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const Service = mongoose.model('Service', serviceSchema);

export default Service;
