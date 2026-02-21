import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import cuid from 'cuid';

export const FarmerDashboard = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Feature tracking state
    const [newCropName, setNewCropName] = useState('');
    const [newCropPrice, setNewCropPrice] = useState('');
    const [newCropStock, setNewCropStock] = useState('');

    const { products, user, addProductLocally } = useStore((state) => ({
        products: state.products,
        user: state.user,
        // local hook into zustand to push items locally since we are maintaining feature tracking offline
        addProductLocally: (product: any) => useStore.setState(s => ({ products: [product, ...s.products] }))
    }));

    const farmerInventory = useMemo(() => {
        // Find products owned by this specific farmer (or fallback to showing all products conceptually if no strict bindings exist yet)
        if (!user || user.role !== 'farmer') return [];
        return products.filter(p => p.farmer === user.phone || p.farmer === user.name);
    }, [products, user]);

    // Derived statistics
    const totalSales = farmerInventory.reduce((acc, current) => acc + (current.price * 5), 0); // Simulated sales tracking logic
    const activeListings = farmerInventory.length;

    return (
        <div className="flex-1 bg-green-50 p-8 relative min-h-screen">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-heading font-bold text-primary">Farmer Dashboard</h1>
                    <Link to="/" className="text-secondary font-medium hover:underline">Log Out</Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-green-200">
                        <h3 className="text-gray-500 font-medium mb-2">Total Estimated Sales</h3>
                        <p className="text-3xl font-bold text-green-700">₹{totalSales}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-green-200">
                        <h3 className="text-gray-500 font-medium mb-2">Active Listings</h3>
                        <p className="text-3xl font-bold text-green-700">{activeListings}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-green-200">
                        <h3 className="text-gray-500 font-medium mb-2">Pending Orders</h3>
                        <p className="text-3xl font-bold text-amber-500">4</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-green-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-green-100 flex justify-between items-center bg-green-50/50">
                        <h2 className="text-xl font-bold text-gray-800">Your Inventory</h2>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition"
                        >
                            + Add New Crop
                        </button>
                    </div>

                    <div className="p-0 border-t border-green-100">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-green-50 text-gray-600 text-sm border-b border-green-100">
                                    <th className="p-4 font-medium">Crop Name</th>
                                    <th className="p-4 font-medium">Stock Available</th>
                                    <th className="p-4 font-medium">Price per kg</th>
                                    <th className="p-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {farmerInventory.length > 0 ? farmerInventory.map((item) => (
                                    <tr key={item._id || item.id} className="border-b border-green-50 hover:bg-green-50/50 transition">
                                        <td className="p-4 font-medium text-gray-800 flex items-center gap-3">
                                            {item.image && <img src={item.image} className="w-10 h-10 rounded object-cover" alt="crop" />}
                                            {item.name}
                                        </td>
                                        <td className="p-4 text-gray-600">Stock available</td>
                                        <td className="p-4 text-gray-600">₹{item.price}</td>
                                        <td className="p-4 text-right">
                                            <button className="text-secondary hover:text-amber-700 font-medium text-sm mr-4">Edit</button>
                                            <button className="text-red-500 hover:text-red-700 font-medium text-sm">Delete</button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={4} className="p-8 text-center text-gray-400">
                                            No crops actively assigned to your inventory right now.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* AI Crop Generation Modal Mockup */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl">
                        <h2 className="text-2xl font-bold font-heading text-primary mb-4">List New Crop</h2>
                        <span className="text-sm bg-blue-50 text-blue-700 font-medium px-2 py-1 rounded inline-block mb-4">
                            ✨ AI Auto-fill available
                        </span>

                        <form className="space-y-4" onSubmit={(e) => {
                            e.preventDefault();
                            if (!newCropName || !newCropPrice) return;

                            const listing = {
                                _id: cuid(),
                                id: cuid(),
                                name: newCropName,
                                price: parseFloat(newCropPrice),
                                farmer: user?.phone || 'Unknown Farmer',
                                category: 'vegetable', // defaults
                                stock: newCropStock,
                            };

                            addProductLocally(listing);
                            setIsModalOpen(false);
                            setNewCropName('');
                            setNewCropPrice('');
                            setNewCropStock('');
                        }}>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Crop Name</label>
                                <input required type="text" value={newCropName} onChange={e => setNewCropName(e.target.value)} placeholder="e.g. Premium Basmati Rice" className="w-full px-4 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Price per kg (₹)</label>
                                    <input required type="number" min="1" value={newCropPrice} onChange={e => setNewCropPrice(e.target.value)} placeholder="40" className="w-full px-4 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock (kg)</label>
                                    <input required type="number" min="1" value={newCropStock} onChange={e => setNewCropStock(e.target.value)} placeholder="100" className="w-full px-4 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                                </div>
                            </div>

                            <div className="border-2 border-dashed border-green-300 rounded-lg p-6 text-center text-gray-500 hover:bg-green-50 transition cursor-pointer">
                                <span>📸 Click to upload crop photo</span>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition">
                                    Cancel
                                </button>
                                <button type="submit" className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-bold hover:bg-green-700 transition">
                                    Publish Listing
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
