import express from 'express';
import { Product } from '../models/Product';

const router = express.Router();

// GET all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// POST load initial mock products (for initial setup)
router.post('/seed', async (req, res) => {
    try {
        await Product.deleteMany(); // clear existing
        const MOCK_PRODUCTS = [
            // Produce
            { name: 'Organic Tomatoes', price: 40, farmer: 'Ramesh Singh', image: '/images/organic_tomatoes.png', category: 'produce' },
            { name: 'Fresh Apples', price: 120, farmer: 'Priya Patel', image: '/images/fresh_apples.png', category: 'produce' },
            { name: 'Premium Wheat', price: 30, farmer: 'Amit Kumar', image: '/images/premium_wheat.png', category: 'produce' },

            // Agricultural Supplies
            { name: 'Premium Urea Fertilizer', price: 1200, farmer: 'AgriCorp Supplies', image: '/images/urea_fertilizer.png', category: 'supply' },
            { name: 'High-Yield Wheat Seeds', price: 850, farmer: 'FarmPro Genetics', image: '/images/high_yield_seeds.png', category: 'supply' },
            { name: 'Organic Bio-Pesticide', price: 450, farmer: 'EcoFarm Solutions', image: '/images/organic_pesticide.png', category: 'supply' }
        ];
        const createdProducts = await Product.insertMany(MOCK_PRODUCTS);
        res.status(201).json(createdProducts);
    } catch (error) {
        console.error("Seed error:", error);
        res.status(500).json({ message: 'Server Error' });
    }
});

export default router;
