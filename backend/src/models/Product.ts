import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    farmer: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    category: {
        type: String,
        enum: ['produce', 'supply'],
        default: 'produce'
    },
    stock: {
        type: String,
        default: 'In Stock'
    }
}, {
    timestamps: true,
});

export const Product = mongoose.model('Product', productSchema);
