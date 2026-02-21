import { useEffect } from 'react';
import { useStore } from '../store/useStore';

export const Marketplace = () => {
    const { addToCart, products, fetchProducts } = useStore();

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return (
        <section className="p-12 max-w-6xl mx-auto">
            <h2 className="text-3xl font-heading font-bold mb-8 text-primary">FarmVerse Marketplace (Fresh Produce)</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {products.filter(p => p.category !== 'supply').length === 0 ? (
                    <p className="text-gray-500 font-medium col-span-3 text-center py-10">No fresh produce available. Please check server connection.</p>
                ) : products.filter(p => p.category !== 'supply').map(product => (
                    <div key={product._id || product.id} className="border border-green-200 rounded-xl p-4 shadow-sm hover:shadow-md transition bg-white relative overflow-hidden group">
                        <div className="w-full h-48 bg-gray-100 rounded-lg flex flex-col items-center justify-center text-gray-500 mb-4 text-center relative overflow-hidden">
                            <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        </div>
                        <h3 className="font-bold text-lg">{product.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">Farmer: {product.farmer}</p>
                        <div className="flex justify-between items-center mt-4">
                            <span className="font-bold text-secondary text-xl">₹{product.price}/kg</span>
                            <button onClick={() => addToCart({ ...product, id: product._id || product.id })} className="bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700">
                                Add to Cart
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};
