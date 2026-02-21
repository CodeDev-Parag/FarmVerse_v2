import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    customerInfo: {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        pinCode: { type: String, required: true },
    },
    orderItems: [
        {
            name: { type: String, required: true },
            price: { type: Number, required: true },
            product: {
                type: mongoose.Schema.Types.ObjectId,
                required: false,
                ref: 'Product',
            },
        }
    ],
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0,
    },
    paymentMethod: {
        type: String,
        required: true,
    },
    isDelivered: {
        type: Boolean,
        required: true,
        default: false,
    },
}, {
    timestamps: true,
});

export const Order = mongoose.model('Order', orderSchema);
