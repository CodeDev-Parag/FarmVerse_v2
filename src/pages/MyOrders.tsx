import { useStore } from '../store/useStore';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { ShoppingBag, Package, Truck, CheckCircle2, Clock } from 'lucide-react';

const STATUS_CONFIG = {
    confirmed: { label: 'Confirmed', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', dot: 'bg-green-500' },
    processing: { label: 'Processing', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', dot: 'bg-amber-500' },
    shipped: { label: 'Shipped', icon: Truck, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', dot: 'bg-blue-500' },
    delivered: { label: 'Delivered', icon: Package, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', dot: 'bg-emerald-500' },
};

export const MyOrders = () => {
    const { orders, isAuthenticated } = useStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/consumer/login', { state: { from: { pathname: '/my-orders' } } });
        }
    }, [isAuthenticated, navigate]);

    if (orders.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-6 min-h-[60vh]"
                style={{ background: 'linear-gradient(135deg, #ECFDF5 0%, #F0FDF4 50%, #FEF3C7 100%)' }}
            >
                <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-100 to-amber-100 flex items-center justify-center">
                        <ShoppingBag size={40} className="text-green-500" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-3">No Orders Yet</h1>
                    <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                        Your order history will appear here once you place your first order. Start shopping for fresh produce!
                    </p>
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold px-8 py-3 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300"
                    >
                        🛒 Start Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 py-8 px-4 sm:px-6 lg:px-8"
            style={{ background: 'linear-gradient(135deg, #F9FAFB 0%, #ECFDF5 50%, #FFFBEB 100%)' }}
        >
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                            <Package size={22} className="text-white" />
                        </div>
                        My Orders
                    </h1>
                    <p className="text-gray-500 mt-2 ml-[52px]">{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
                </div>

                {/* Orders List */}
                <div className="space-y-4">
                    {orders.map((order) => {
                        const statusConfig = STATUS_CONFIG[order.status];
                        const StatusIcon = statusConfig.icon;
                        const orderDate = new Date(order.date);
                        const formattedDate = orderDate.toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'short', year: 'numeric'
                        });
                        const formattedTime = orderDate.toLocaleTimeString('en-IN', {
                            hour: '2-digit', minute: '2-digit'
                        });

                        return (
                            <div
                                key={order.id}
                                className="bg-white rounded-xl border border-gray-150 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group"
                            >
                                {/* Order Header */}
                                <div className="px-6 py-4 flex flex-wrap items-center justify-between gap-3 border-b border-gray-100">
                                    <div className="flex items-center gap-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-gray-800">{order.id}</span>
                                            <span className="text-xs text-gray-400">{formattedDate} at {formattedTime}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${statusConfig.bg} ${statusConfig.color} ${statusConfig.border} border`}>
                                            <span className={`w-2 h-2 rounded-full ${statusConfig.dot} animate-pulse`} />
                                            <StatusIcon size={13} />
                                            {statusConfig.label}
                                        </span>
                                        <span className="text-lg font-bold text-gray-800">₹{order.total}</span>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="px-6 py-4">
                                    <div className="flex flex-wrap gap-3">
                                        {order.items.map((item, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 text-sm border border-gray-100"
                                            >
                                                {item.image ? (
                                                    <img src={item.image} alt={item.name} className="w-8 h-8 rounded-md object-cover" />
                                                ) : (
                                                    <div className="w-8 h-8 rounded-md bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center text-xs">
                                                        🥬
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-medium text-gray-700">{item.name}</p>
                                                    <p className="text-xs text-gray-400">₹{item.price}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Order Footer */}
                                <div className="px-6 py-3 bg-gray-50/50 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-400">
                                    <div className="flex items-center gap-4">
                                        <span>📍 {order.city}</span>
                                        <span>💳 {order.paymentMethod}</span>
                                    </div>
                                    <span className="font-medium">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Continue Shopping */}
                <div className="mt-8 text-center">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold transition-colors duration-200"
                    >
                        <span>←</span> Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
};
