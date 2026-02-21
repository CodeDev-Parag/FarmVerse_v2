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
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'hi' : 'en';
        i18n.changeLanguage(newLang);
    };

    const handleLogout = async () => {
        try {
            const { supabase } = await import('../lib/supabase');
            await supabase.auth.signOut();
        } catch (e) {
            // ignore supabase errors
        }
        logout();
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
                            <div className="relative">
                                <button
                                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 hover:border-green-400 hover:shadow-md transition-all duration-300 group"
                                >
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-sm font-bold shadow-sm group-hover:scale-110 transition-transform duration-300">
                                        {(user.email?.[0] || 'U').toUpperCase()}
                                    </div>
                                    <span className="hidden sm:inline text-sm font-semibold text-gray-700 group-hover:text-green-700 transition-colors duration-200 max-w-[100px] truncate">
                                        {user.email?.split('@')[0] || 'User'}
                                    </span>
                                    <svg className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${showProfileMenu ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {showProfileMenu && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)} />
                                        <div
                                            className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50"
                                            style={{ animation: 'dropdownSlide 0.2s ease-out' }}
                                        >
                                            <div className="px-4 py-4 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold shadow-md">
                                                        {(user.email?.[0] || 'U').toUpperCase()}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-bold text-gray-800 truncate">{user.email}</p>
                                                        <span className={`inline-block mt-0.5 text-xs font-semibold px-2 py-0.5 rounded-full ${user.role === 'farmer' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                                            {user.role === 'farmer' ? '🌾 Farmer' : '🛒 Consumer'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="py-2">
                                                <Link
                                                    to={user.role === 'farmer' ? '/farmer/dashboard' : '/'}
                                                    onClick={() => setShowProfileMenu(false)}
                                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-all duration-200 group"
                                                >
                                                    <User size={16} className="text-gray-400 group-hover:text-green-600 transition-colors" />
                                                    <span className="font-medium">{user.role === 'farmer' ? 'Dashboard' : 'My Orders'}</span>
                                                </Link>
                                                <Link
                                                    to="/checkout"
                                                    onClick={() => setShowProfileMenu(false)}
                                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-all duration-200 group"
                                                >
                                                    <ShoppingCart size={16} className="text-gray-400 group-hover:text-green-600 transition-colors" />
                                                    <span className="font-medium">Cart & Checkout</span>
                                                </Link>
                                            </div>

                                            <div className="border-t border-gray-100 p-2">
                                                <button
                                                    onClick={() => { handleLogout(); setShowProfileMenu(false); }}
                                                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 group"
                                                >
                                                    <svg className="w-4 h-4 group-hover:translate-x-[-2px] transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                    </svg>
                                                    Sign Out
                                                </button>
                                            </div>
                                        </div>

                                        <style>{`
                                            @keyframes dropdownSlide {
                                                0% { opacity: 0; transform: translateY(-8px) scale(0.95); }
                                                100% { opacity: 1; transform: translateY(0) scale(1); }
                                            }
                                        `}</style>
                                    </>
                                )}
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
