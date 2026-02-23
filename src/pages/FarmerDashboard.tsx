import { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { AgriSupplies } from '../components/AgriSupplies';
import cuid from 'cuid';

export const FarmerDashboard = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Feature tracking state
    const [newCropName, setNewCropName] = useState('');
    const [newCropPrice, setNewCropPrice] = useState('');
    const [newCropStock, setNewCropStock] = useState('');
    const [newCropCategory, setNewCropCategory] = useState('vegetable');
    const [newCropImage, setNewCropImage] = useState<string | null>(null);

    const products = useStore((state) => state.products);
    const user = useStore((state) => state.user);
    const addProductLocally = (product: any) => useStore.setState(s => ({ products: [product, ...s.products] }));

    const farmerInventory = useMemo(() => {
        // Find products owned by this specific farmer (or fallback to showing all products conceptually if no strict bindings exist yet)
        if (!user || user.role !== 'farmer') return [];
        return products.filter(p => p.farmer === user.email || p.farmer === user.name);
    }, [products, user]);

    const groupedInventory = useMemo(() => {
        return farmerInventory.reduce((acc, item) => {
            const cat = item.category || 'uncategorized';
            if (!acc[cat]) acc[cat] = [];
            acc[cat].push(item);
            return acc;
        }, {} as Record<string, typeof farmerInventory>);
    }, [farmerInventory]);

    // Derived statistics
    const totalSales = farmerInventory.reduce((acc, current) => acc + (current.price * 5), 0); // Simulated sales tracking logic
    const activeListings = farmerInventory.length;

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewCropImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="flex-1 bg-green-50 p-8 relative min-h-screen">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-heading font-bold text-primary">Farmer Dashboard</h1>
                    <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-sm border border-green-100">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold shadow-md">
                            {(user?.email?.[0] || 'F').toUpperCase()}
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-800">{user?.email || 'Farmer'}</p>
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">🌾 Verified Seller</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-green-200 hover:shadow-md transition">
                        <h3 className="text-gray-500 font-medium mb-2">Total Estimated Sales</h3>
                        <p className="text-3xl font-bold text-green-700">₹{totalSales}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-green-200 hover:shadow-md transition">
                        <h3 className="text-gray-500 font-medium mb-2">Active Listings</h3>
                        <p className="text-3xl font-bold text-green-700">{activeListings}</p>
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
                        {Object.keys(groupedInventory).length > 0 ? (
                            <div className="space-y-6 p-4">
                                {Object.entries(groupedInventory).map(([category, items]) => (
                                    <div key={category} className="border border-green-100 rounded-lg overflow-hidden shadow-sm">
                                        <div className="bg-green-100/50 px-4 py-3 border-b border-green-100 flex items-center gap-2">
                                            <span className="font-bold text-green-800 capitalize">{category}s</span>
                                            <span className="bg-white text-green-700 text-xs font-bold px-2 py-0.5 rounded-full border border-green-200">{items.length}</span>
                                        </div>
                                        <table className="w-full text-left border-collapse bg-white">
                                            <thead>
                                                <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider border-b border-green-50">
                                                    <th className="px-4 py-3 font-medium">Crop Name</th>
                                                    <th className="px-4 py-3 font-medium">Stock</th>
                                                    <th className="px-4 py-3 font-medium">Price/kg</th>
                                                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {items.map((item) => (
                                                    <tr key={item._id || item.id} className="border-b border-green-50 hover:bg-green-50/30 transition last:border-0">
                                                        <td className="px-4 py-3 font-medium text-gray-800 flex items-center gap-3">
                                                            {item.image ? (
                                                                <img src={item.image} loading="lazy" className="w-8 h-8 rounded object-cover" alt={item.name} />
                                                            ) : (
                                                                <div className="w-8 h-8 rounded bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center text-xs">🥬</div>
                                                            )}
                                                            {item.name}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-gray-600">Available</td>
                                                        <td className="px-4 py-3 text-sm font-semibold text-gray-800">₹{item.price}</td>
                                                        <td className="px-4 py-3 text-right">
                                                            <button className="text-secondary hover:text-amber-700 font-medium text-sm mr-4 transition-colors">Edit</button>
                                                            <button className="text-red-500 hover:text-red-700 font-medium text-sm transition-colors">Delete</button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-12 text-center">
                                <span className="text-4xl block mb-3 opacity-50">🌾</span>
                                <h3 className="text-lg font-bold text-gray-700 mb-1">Your inventory is empty</h3>
                                <p className="text-gray-500 mb-4">You haven't added any crops yet. Click the button above to start selling.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sell products block finished, now let them buy farming products */}
                <div className="mt-12">
                    <AgriSupplies />
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
                                farmer: user?.email || 'Unknown Farmer',
                                category: newCropCategory,
                                stock: newCropStock,
                                image: newCropImage,
                            };

                            addProductLocally(listing);
                            setIsModalOpen(false);
                            setNewCropName('');
                            setNewCropPrice('');
                            setNewCropStock('');
                            setNewCropCategory('vegetable');
                            setNewCropImage(null);
                        }}>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Crop Name</label>
                                <input required type="text" value={newCropName} onChange={e => setNewCropName(e.target.value)} placeholder="e.g. Premium Basmati Rice" className="w-full px-4 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <select value={newCropCategory} onChange={e => setNewCropCategory(e.target.value)} className="w-full px-4 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-primary outline-none bg-white">
                                        <option value="vegetable">Vegetables</option>
                                        <option value="fruit">Fruits</option>
                                        <option value="grain">Grains</option>
                                        <option value="dairy">Dairy</option>
                                        <option value="spice">Spices</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Price per kg (₹)</label>
                                    <input required type="number" min="1" value={newCropPrice} onChange={e => setNewCropPrice(e.target.value)} placeholder="40" className="w-full px-4 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Stock (kg)</label>
                                <input required type="number" min="1" value={newCropStock} onChange={e => setNewCropStock(e.target.value)} placeholder="100" className="w-full px-4 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Crop Photo</label>
                                <label className="border-2 border-dashed border-green-300 rounded-lg p-6 text-center text-gray-500 hover:bg-green-50 transition cursor-pointer flex flex-col items-center justify-center min-h-[120px] overflow-hidden relative">
                                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                    {newCropImage ? (
                                        <div className="absolute inset-0 w-full h-full">
                                            <img src={newCropImage} alt="Preview" loading="lazy" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                                <span className="text-white font-medium text-sm">Click to change photo</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <span className="text-2xl mb-2">📸</span>
                                            <span className="text-sm font-medium">Click to upload crop photo</span>
                                        </>
                                    )}
                                </label>
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
