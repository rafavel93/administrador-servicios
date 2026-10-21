
import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
    {
        clientName: {
            type: String,
            required: true,
            trim: true
        },
        clientEmail: {
            type: String,
            required: true,
            trim: true
        },
        date: {
            type: String,
            required: true
        },
        time: {
            type: String,
            required: true
        },
        status: {
            type: String,
            required: true,
            trim: true
        },
        services: [
            {
                service: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Service',
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                    default: 1
                }
            }
        ]
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
