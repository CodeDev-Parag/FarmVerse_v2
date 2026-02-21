import { useStore } from '../store/useStore';
import { X, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Cart = () => {
    const { cart, isCartOpen, toggleCart, removeFromCart, isAuthenticated } = useStore();
    const navigate = useNavigate();

    if (!isCartOpen) return null;

    const total = cart.reduce((sum, item) => sum + item.price, 0);

    const handleCheckout = () => {
        toggleCart();
        if (isAuthenticated) {
            navigate('/checkout');
        } else {
            navigate('/consumer/login', { state: { from: { pathname: '/checkout' } } });
        }
    };

    return (
        <>
            <div
                className="fixed inset-0 bg-black/50 z-50 transition-opacity"
                onClick={toggleCart}
            />

            <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col transform transition-transform duration-300">
                <div className="flex justify-between items-center p-6 border-b border-green-100">
                    <h2 className="text-2xl font-heading font-bold text-primary">Your Cart</h2>
                    <button onClick={toggleCart} className="text-gray-500 hover:text-red-500 transition">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    {cart.length === 0 ? (
                        <div className="text-center text-gray-500 mt-10">
                            <span className="text-4xl block mb-2">🛒</span>
                            Your cart is empty. Let's add some fresh produce!
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {cart.map((item, index) => (
                                <div key={`${item.id}-${index}`} className="flex justify-between items-center bg-green-50/50 p-4 border border-green-100 rounded-lg">
                                    <div>
                                        <h3 className="font-bold text-gray-800">{item.name}</h3>
                                        <p className="text-sm text-gray-500">₹{item.price}/kg</p>
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item._id || item.id || '')}
                                        className="text-gray-400 hover:text-red-500 transition p-2"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {cart.length > 0 && (
                    <div className="p-6 border-t border-green-100 bg-gray-50">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-lg font-medium text-gray-600">Total Estimate</span>
                            <span className="text-2xl font-bold font-heading text-secondary">₹{total}</span>
                        </div>
                        <button
                            onClick={handleCheckout}
                            className="w-full bg-primary hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg transition text-lg"
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};
