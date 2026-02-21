import { useTranslation } from 'react-i18next';
import { useStore } from '../store/useStore';
import { ShoppingCart, User, Search, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';

const AuthSplitButton = () => {
    const [hovered, setHovered] = useState<'consumer' | 'farmer' | null>(null);

    return (
        <div
            className="flex relative h-9 md:h-10 w-36 md:w-48 rounded-lg overflow-hidden bg-white border border-gray-200 shadow-sm cursor-pointer"
            onMouseLeave={() => setHovered(null)}
        >
            {/* Consumer Section (CL) */}
            <motion.div
                className="absolute inset-0 bg-blue-50 text-blue-600 hover:text-white z-10"
                initial={false}
                animate={{
                    clipPath: hovered === 'consumer'
                        ? 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'
                        : hovered === 'farmer'
                            ? 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)'
                            : 'polygon(0% 0%, 55% 0%, 45% 100%, 0% 100%)',
                    backgroundColor: hovered === 'consumer' ? '#3b82f6' : '#eff6ff',
                }}
                transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
            >
                <Link
                    to="/consumer/login"
                    className="absolute inset-0 flex items-center justify-center whitespace-nowrap"
                    onMouseEnter={() => setHovered('consumer')}
                >
                    <span
                        className={`absolute transition-opacity duration-300 font-medium text-xs md:text-sm ${hovered === 'consumer' ? 'opacity-100' : 'opacity-0'}`}
                    >
                        Customer Login
                    </span>
                    <span
                        className={`absolute right-1/2 mr-2 md:mr-3 transition-opacity duration-300 text-sm md:text-base font-bold ${hovered === null ? 'opacity-100' : 'opacity-0'}`}
                    >
                        CL
                    </span>
                </Link>
            </motion.div>

            {/* Farmer Section (FL) */}
            <motion.div
                className="absolute inset-0 bg-emerald-50 text-emerald-700 hover:text-white z-0"
                initial={false}
                animate={{
                    clipPath: hovered === 'farmer'
                        ? 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'
                        : hovered === 'consumer'
                            ? 'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)'
                            : 'polygon(55% 0%, 100% 0%, 100% 100%, 45% 100%)',
                    backgroundColor: hovered === 'farmer' ? '#10b981' : '#ecfdf5',
                }}
                transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
            >
                <Link
                    to="/farmer/login"
                    className="absolute inset-0 flex items-center justify-center whitespace-nowrap"
                    onMouseEnter={() => setHovered('farmer')}
                >
                    <span
                        className={`absolute transition-opacity duration-300 font-medium text-xs md:text-sm ${hovered === 'farmer' ? 'opacity-100' : 'opacity-0'}`}
                    >
                        Farmer Login
                    </span>
                    <span
                        className={`absolute left-1/2 ml-2 md:ml-3 transition-opacity duration-300 text-sm md:text-base font-bold ${hovered === null ? 'opacity-100' : 'opacity-0'}`}
                    >
                        FL
                    </span>
                </Link>
            </motion.div>

            {/* Divider Line */}
            <div className={`absolute inset-0 pointer-events-none transition-opacity duration-300 z-20 ${hovered ? 'opacity-0' : 'opacity-100'}`}>
                <svg className="w-full h-full" preserveAspectRatio="none">
                    <line x1="55%" y1="0" x2="45%" y2="100%" stroke="#d1d5db" strokeWidth="1.5" />
                </svg>
            </div>
        </div>
    );
};

export const Header = () => {
    const { i18n } = useTranslation();
    const { cart, toggleCart, user, isAuthenticated, logout } = useStore();

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'hi' : 'en';
        i18n.changeLanguage(newLang);
    };

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <Link to="/" className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                        <span className="text-3xl">🌾</span>
                        <span className="font-heading font-bold text-2xl text-primary">FarmVerse</span>
                    </Link>

                    <div className="hidden md:flex flex-1 max-w-lg mx-8">
                        <div className="relative w-full">
                            <input
                                type="text"
                                placeholder={i18n.language === 'en' ? "Search for fresh produce..." : "ताज़ा उत्पाद खोजें..."}
                                className="w-full bg-green-50 text-gray-800 rounded-full py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-primary border border-green-200"
                            />
                            <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-6">
                        <button
                            onClick={toggleLanguage}
                            className="flex items-center gap-1 sm:gap-2 text-gray-600 hover:text-primary transition font-medium text-sm sm:text-base"
                        >
                            <Globe size={20} className="w-5 h-5 sm:w-auto sm:h-auto" />
                            <span className="hidden sm:inline">{i18n.language === 'en' ? 'EN / HI' : 'HI / EN'}</span>
                        </button>

                        <div className="relative text-gray-600 hover:text-primary cursor-pointer" onClick={toggleCart}>
                            <ShoppingCart size={24} />
                            {cart.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center pointer-events-none">
                                    {cart.length}
                                </span>
                            )}
                        </div>

                        {isAuthenticated && user ? (
                            <div className="flex items-center gap-2 sm:gap-4">
                                <Link to={user.role === 'farmer' ? '/farmer/dashboard' : '/'} className="flex items-center gap-2 text-gray-700 hover:text-primary transition font-medium">
                                    <User size={18} />
                                    <span className="hidden sm:inline">{user.role === 'farmer' ? 'Dashboard' : 'Profile'}</span>
                                </Link>
                                <button onClick={logout} className="text-gray-500 hover:text-red-500 font-medium transition text-xs sm:text-sm">
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="block">
                                <AuthSplitButton />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};
