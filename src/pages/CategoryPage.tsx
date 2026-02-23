import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { ArrowLeft } from 'lucide-react';

export const CategoryPage = () => {
    const { categoryName } = useParams<{ categoryName: string }>();
    const { addToCart, products, fetchProducts } = useStore();

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const decodedCategory = decodeURIComponent(categoryName || '');

    // Filter products based on subCategory matching the route param
    const categoryProducts = products.filter(
        p => p.category === 'supply' && (p.subCategory === decodedCategory || (!p.subCategory && decodedCategory === 'General Supplies'))
    );

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: 'spring' as const, stiffness: 300, damping: 24 }
        }
    };

    return (
        <div className="min-h-screen bg-amber-50/30 pt-8 pb-20 px-4">
            <div className="max-w-7xl mx-auto">
                <Link to="/" className="inline-flex items-center gap-2 text-amber-700 hover:text-amber-900 font-medium mb-8 bg-amber-100 hover:bg-amber-200 px-4 py-2 rounded-full transition-colors">
                    <ArrowLeft size={18} /> Back to Home
                </Link>

                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-10"
                >
                    <h1 className="text-4xl md:text-5xl font-heading font-bold text-amber-800 capitalize mb-4">
                        {decodedCategory}
                    </h1>
                    <p className="text-lg text-amber-900/70 max-w-2xl">
                        Browse our selection of top-quality {decodedCategory.toLowerCase()} directly sourced for farmers.
                    </p>
                </motion.div>

                {categoryProducts.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-amber-100 shadow-sm">
                        <p className="text-xl text-gray-500 font-medium">No products found in this category.</p>
                        <button onClick={() => window.history.back()} className="mt-4 text-amber-600 font-medium hover:underline">Go back</button>
                    </div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                    >
                        {categoryProducts.map(product => (
                            <motion.div
                                variants={itemVariants}
                                key={product._id || product.id}
                                className="flex flex-col bg-white border border-amber-100 rounded-2xl p-4 shadow-sm hover:shadow-xl hover:border-amber-300 transition-all duration-300 group"
                            >
                                <div className="w-full aspect-square bg-white rounded-xl flex items-center justify-center mb-4 relative overflow-hidden">
                                    {product.image ? (
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            loading="lazy"
                                            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="text-6xl opacity-20">📦</div>
                                    )}
                                    {/* Removed the overlapping text as requested */}
                                </div>

                                <div className="flex-1 flex flex-col">
                                    <h3 className="font-bold text-gray-800 text-lg line-clamp-2 mb-1 group-hover:text-amber-700 transition-colors" title={product.name}>
                                        {product.name}
                                    </h3>
                                    <p className="text-xs text-amber-600/80 mb-4 font-medium uppercase tracking-wider">
                                        {product.farmer}
                                    </p>

                                    <div className="mt-auto flex justify-between items-end">
                                        <div>
                                            <span className="text-xs text-gray-500 block mb-0.5">Price</span>
                                            <span className="font-bold text-primary text-xl">₹{product.price}</span>
                                        </div>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => addToCart({ ...product, id: product._id || product.id })}
                                            className="bg-amber-100 text-amber-800 px-4 py-2 rounded-xl text-sm font-bold hover:bg-amber-500 hover:text-white transition-colors"
                                        >
                                            Add
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
};
