import { useEffect, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Store, Sprout, ShieldPlus, Tractor } from 'lucide-react';

// Maps a subcategory name to an icon and a color theme
const getCategoryMetadata = (name: string) => {
    const raw = name.toLowerCase();
    if (raw.includes('seed')) return { icon: Sprout, color: 'text-green-600', bg: 'bg-green-100', border: 'border-green-200' };
    if (raw.includes('fertilizer')) return { icon: Store, color: 'text-emerald-600', bg: 'bg-emerald-100', border: 'border-emerald-200' };
    if (raw.includes('protection') || raw.includes('herbicide') || raw.includes('pesticide')) return { icon: ShieldPlus, color: 'text-rose-600', bg: 'bg-rose-100', border: 'border-rose-200' };
    if (raw.includes('implement') || raw.includes('tool')) return { icon: Tractor, color: 'text-amber-600', bg: 'bg-amber-100', border: 'border-amber-200' };
    return { icon: Store, color: 'text-blue-600', bg: 'bg-blue-100', border: 'border-blue-200' };
};

export const AgriSupplies = () => {
    const { products, fetchProducts } = useStore();

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const categories = useMemo(() => {
        const supplies = products.filter(p => p.category === 'supply');

        // Group by subCategory and get counts + sample image
        const map = supplies.reduce((acc, p) => {
            const sub = p.subCategory || 'General Supplies';
            if (!acc[sub]) acc[sub] = { name: sub, count: 0, image: null as string | null };
            acc[sub].count++;
            // Try to find a valid image to represent the category
            if (!acc[sub].image && p.image && p.image.includes('http')) {
                acc[sub].image = p.image;
            }
            return acc;
        }, {} as Record<string, { name: string, count: number, image: string | null }>);

        return Object.values(map);
    }, [products]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.9, y: 30 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { type: 'spring' as const, stiffness: 300, damping: 20 }
        }
    };

    return (
        <section className="p-12 max-w-7xl mx-auto bg-amber-50 mt-8 rounded-3xl relative overflow-hidden">
            <h2 className="text-3xl font-heading font-bold mb-3 text-amber-800">Browse by Department</h2>
            <p className="text-amber-900/60 mb-10 max-w-2xl text-lg">
                Explore dedicated catalogs for every aspect of modern agriculture. Top brands with zero middlemen.
            </p>

            {categories.length === 0 ? (
                <p className="text-gray-500 font-medium text-center py-10">No agricultural supplies available right now.</p>
            ) : (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {categories.map((cat) => {
                        const { icon: Icon, color, bg, border } = getCategoryMetadata(cat.name);
                        return (
                            <Link to={`/supplies/${encodeURIComponent(cat.name)}`} key={cat.name}>
                                <motion.div
                                    variants={itemVariants}
                                    whileHover={{ y: -8, transition: { duration: 0.2 } }}
                                    className={`relative flex flex-col h-full bg-white border ${border} rounded-[1.5rem] p-6 shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden cursor-pointer`}
                                >
                                    {/* Background Accent Glow */}
                                    <div className={`absolute top-0 right-0 w-32 h-32 rounded-bl-full opacity-10 ${bg} blur-2xl group-hover:opacity-30 transition-opacity`} />

                                    <div className={`w-14 h-14 rounded-2xl ${bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                        <Icon className={`${color}`} size={28} />
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="text-2xl font-bold text-gray-800 mb-2 capitalize group-hover:text-amber-700 transition-colors">
                                            {cat.name}
                                        </h3>
                                        <p className="text-gray-500 font-medium tracking-wide">
                                            {cat.count} {cat.count === 1 ? 'Product' : 'Products'} available
                                        </p>
                                    </div>

                                    <div className="mt-8 flex items-center text-amber-600 font-bold group-hover:translate-x-2 transition-transform duration-300">
                                        View Catalog
                                        <span className="ml-2">→</span>
                                    </div>
                                </motion.div>
                            </Link>
                        );
                    })}
                </motion.div>
            )}
        </section>
    );
};
