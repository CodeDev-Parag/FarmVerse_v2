import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';

import axios from 'axios';

export const Checkout = () => {
    const { cart, clearCart, isAuthenticated } = useStore();
    const navigate = useNavigate();
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/consumer/login', { state: { from: { pathname: '/checkout' } } });
        }
    }, [isAuthenticated, navigate]);

    const total = cart.reduce((sum, item) => sum + item.price, 0);

    const handlePlaceOrder = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        const form = e.currentTarget;
        const formData = new FormData(form);

        const customerInfo = {
            name: formData.get('name'),
            phone: formData.get('phone'),
            address: formData.get('address'),
            city: formData.get('city'),
            pinCode: formData.get('pinCode'),
        };

        const orderData = {
            customerInfo,
            orderItems: cart.map(item => ({
                name: item.name,
                price: item.price,
                product: item._id || item.id
            })),
            totalPrice: total,
            paymentMethod: 'Cash on Delivery' // Assuming COD for now based on UI
        };

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            await axios.post(`${apiUrl}/api/orders`, orderData);
            setOrderPlaced(true);
            clearCart();
        } catch (error) {
            console.error('Failed to place order:', error);
            alert('Oh no! Something went wrong with your order. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (orderPlaced) {
        return (
            <div className="flex-1 bg-green-50 flex items-center justify-center p-6">
                <div className="bg-white rounded-xl shadow-xl border border-green-200 p-12 max-w-md w-full text-center">
                    <CheckCircle2 size={64} className="text-primary mx-auto mb-6" />
                    <h1 className="text-3xl font-heading font-bold text-gray-800 mb-4">Order Placed Successfully!</h1>
                    <p className="text-gray-600 mb-8">
                        Thank you for supporting our farmers. Your fresh produce will be delivered soon.
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-secondary text-white px-6 py-3 rounded-lg font-bold hover:bg-amber-600 transition"
                    >
                        Return to Shop
                    </button>
                </div>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="flex-1 bg-gray-50 flex flex-col items-center justify-center p-6">
                <h1 className="text-3xl font-heading font-bold text-gray-800 mb-4">Your Cart is Empty</h1>
                <p className="text-gray-600 mb-8">Looks like you haven't added any fresh produce yet!</p>
                <Link to="/" className="bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition">
                    Browse Marketplace
                </Link>
            </div>
        );
    }

    return (
        <div className="flex-1 bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8">
                {/* Checkout Form */}
                <div className="md:w-2/3 bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                    <h2 className="text-2xl font-bold font-heading mb-6 text-gray-800 border-b pb-4">Delivery Details</h2>
                    <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input required name="name" type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                                <input required name="phone" type="tel" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
                            <textarea required name="address" rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"></textarea>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                <input required name="city" type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">PIN Code</label>
                                <input required name="pinCode" type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                            </div>
                        </div>

                        <h3 className="font-bold text-lg text-gray-800 mt-8 mb-4 border-b pb-2">Payment Method</h3>
                        <div className="space-y-3">
                            <label className="flex items-center p-4 border border-green-200 rounded-lg cursor-pointer hover:bg-green-50 transition bg-green-50/30">
                                <input type="radio" name="payment" defaultChecked className="w-4 h-4 text-primary focus:ring-primary" />
                                <span className="ml-3 font-medium text-gray-800">Cash on Delivery (COD)</span>
                            </label>
                            <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                                <input type="radio" name="payment" className="w-4 h-4 text-primary focus:ring-primary" />
                                <span className="ml-3 font-medium text-gray-600">UPI / Net Banking (Coming Soon)</span>
                            </label>
                        </div>
                    </form>
                </div>

                {/* Order Summary */}
                <div className="md:w-1/3">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
                        <h2 className="text-xl font-bold font-heading mb-4 text-gray-800">Order Summary</h2>
                        <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
                            {cart.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600 font-medium">{item.name}</span>
                                    <span className="text-gray-800">₹{item.price}</span>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-gray-200 pt-4 mb-6 space-y-2">
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>Subtotal</span>
                                <span>₹{total}</span>
                            </div>
                            <div className="flex justify-between text-sm text-primary">
                                <span>Delivery Fee</span>
                                <span>Free</span>
                            </div>
                            <div className="flex justify-between text-xl font-bold text-secondary mt-4">
                                <span>Total</span>
                                <span>₹{total}</span>
                            </div>
                        </div>
                        <button
                            form="checkout-form"
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full text-white font-bold py-4 rounded-xl transition shadow-md ${isSubmitting ? 'bg-primary/70 cursor-not-allowed' : 'bg-primary hover:bg-green-700'
                                }`}
                        >
                            {isSubmitting ? 'Processing...' : 'Place Order'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
