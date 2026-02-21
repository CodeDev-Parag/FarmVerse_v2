import express from 'express';
import { Order } from '../models/Order';

const router = express.Router();

// POST create new order
router.post('/', async (req, res) => {
    try {
        const { orderItems, customerInfo, paymentMethod, totalPrice } = req.body;

        if (orderItems && orderItems.length === 0) {
            res.status(400).json({ message: 'No order items' });
            return;
        } else {
            const order = new Order({
                orderItems,
                customerInfo,
                paymentMethod,
                totalPrice
            });

            const createdOrder = await order.save();
            res.status(201).json(createdOrder);
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error during order creation' });
    }
});

export default router;
