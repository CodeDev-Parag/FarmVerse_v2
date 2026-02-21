import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { supabase } from '../lib/supabase';

export const FarmerLogin = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [farmName, setFarmName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const { login } = useStore();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsSubmitting(true);

        try {
            if (isSignUp) {
                const { data, error: signUpError } = await supabase.auth.signUp({
                    email,
                    password,
                    options: { data: { display_name: farmName, role: 'farmer' } }
                });
                if (signUpError) throw signUpError;
                if (data.user) {
                    setSuccess('Farmer account created! Check your email to confirm, then sign in.');
                    setIsSignUp(false);
                    setPassword('');
                }
            } else {
                const { data, error: signInError } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (signInError) throw signInError;
                if (data.user) {
                    login(data.user.email || email, 'farmer');
                    navigate('/farmer/dashboard');
                }
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex-1 flex items-center justify-center p-6 min-h-[80vh] relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 30%, #A7F3D0 60%, #ECFDF5 100%)' }}>

            {/* Animated floating elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(8)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full"
                        style={{
                            width: `${40 + i * 25}px`,
                            height: `${40 + i * 25}px`,
                            background: `radial-gradient(circle, ${i % 3 === 0 ? '#10B981' : i % 3 === 1 ? '#059669' : '#047857'}, transparent)`,
                            opacity: 0.15,
                            left: `${5 + i * 12}%`,
                            top: `${10 + (i % 4) * 22}%`,
                            animation: `farmerFloat ${3.5 + i * 1.2}s ease-in-out infinite alternate`,
                            animationDelay: `${i * 0.4}s`,
                        }}
                    />
                ))}
            </div>

            {/* Decorative leaves */}
            <div className="absolute top-10 left-10 text-6xl opacity-10 pointer-events-none"
                style={{ animation: 'leafDrift 6s ease-in-out infinite alternate' }}>🌿</div>
            <div className="absolute bottom-20 right-16 text-5xl opacity-10 pointer-events-none"
                style={{ animation: 'leafDrift 7s ease-in-out infinite alternate', animationDelay: '2s' }}>🌾</div>
            <div className="absolute top-1/3 right-10 text-4xl opacity-10 pointer-events-none"
                style={{ animation: 'leafDrift 5s ease-in-out infinite alternate', animationDelay: '1s' }}>🍃</div>

            {/* 3D Card */}
            <div
                className="relative w-full max-w-md"
                style={{ perspective: '1200px' }}
            >
                <div
                    className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-green-200/50 p-8 relative overflow-hidden"
                    style={{
                        transformStyle: 'preserve-3d',
                        animation: 'farmerCardEntrance 0.9s ease-out forwards',
                        boxShadow: '0 25px 60px -10px rgba(5, 150, 105, 0.2), 0 10px 30px -15px rgba(16, 185, 129, 0.15), inset 0 1px 0 rgba(255,255,255,0.6)',
                    }}
                >
                    {/* Animated gradient border */}
                    <div className="absolute top-0 left-0 w-full h-1.5 overflow-hidden rounded-t-2xl">
                        <div
                            className="w-[200%] h-full"
                            style={{
                                background: 'linear-gradient(90deg, #10B981, #059669, #047857, #059669, #10B981)',
                                animation: 'farmerShimmer 3s linear infinite',
                            }}
                        />
                    </div>

                    {/* Floating icon */}
                    <div className="text-center mb-6">
                        <div
                            className="inline-block text-6xl"
                            style={{ animation: 'tractorBounce 3s ease-in-out infinite' }}
                        >
                            🚜
                        </div>
                        <h1
                            className="text-3xl font-bold mt-3 mb-2"
                            style={{
                                background: 'linear-gradient(135deg, #064E3B, #059669)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                animation: 'farmerTitleSlide 0.6s ease-out forwards',
                                animationDelay: '0.2s',
                                opacity: 0,
                            }}
                        >
                            {isSignUp ? 'Register as Farmer' : 'Farmer Portal'}
                        </h1>
                        <p
                            className="text-gray-500 text-sm"
                            style={{ animation: 'farmerTitleSlide 0.6s ease-out forwards', animationDelay: '0.3s', opacity: 0 }}
                        >
                            {isSignUp ? 'Start selling your produce directly to consumers.' : 'Access your farm stall, view orders, and manage inventory.'}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-100"
                            style={{ animation: 'farmerShake 0.4s ease-out' }}>
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-4 bg-emerald-50 text-emerald-700 p-3 rounded-xl text-sm border border-emerald-100"
                            style={{ animation: 'farmerTitleSlide 0.4s ease-out' }}>
                            ✅ {success}
                        </div>
                    )}

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        {isSignUp && (
                            <div style={{ animation: 'farmerFieldSlide 0.5s ease-out forwards', animationDelay: '0.1s', opacity: 0 }}>
                                <label htmlFor="farmName" className="block text-sm font-semibold text-gray-600 mb-1.5">Farm / Seller Name</label>
                                <input
                                    id="farmName"
                                    required
                                    type="text"
                                    value={farmName}
                                    onChange={(e) => setFarmName(e.target.value)}
                                    placeholder="Green Valley Farms"
                                    className="w-full px-4 py-3 bg-green-50/50 border border-green-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition-all duration-300 hover:border-green-300"
                                />
                            </div>
                        )}

                        <div style={{ animation: 'farmerFieldSlide 0.5s ease-out forwards', animationDelay: isSignUp ? '0.2s' : '0.1s', opacity: 0 }}>
                            <label htmlFor="farmerEmail" className="block text-sm font-semibold text-gray-600 mb-1.5">Email Address</label>
                            <input
                                id="farmerEmail"
                                required
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="farmer@example.com"
                                className="w-full px-4 py-3 bg-green-50/50 border border-green-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition-all duration-300 hover:border-green-300"
                            />
                        </div>

                        <div style={{ animation: 'farmerFieldSlide 0.5s ease-out forwards', animationDelay: isSignUp ? '0.3s' : '0.2s', opacity: 0 }}>
                            <label htmlFor="farmerPassword" className="block text-sm font-semibold text-gray-600 mb-1.5">Password</label>
                            <input
                                id="farmerPassword"
                                required
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                minLength={6}
                                className="w-full px-4 py-3 bg-green-50/50 border border-green-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition-all duration-300 hover:border-green-300"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full text-white font-bold py-3.5 rounded-xl transition-all duration-300 shadow-lg relative overflow-hidden group"
                            style={{
                                background: 'linear-gradient(135deg, #10B981, #059669)',
                                animation: 'farmerFieldSlide 0.5s ease-out forwards',
                                animationDelay: isSignUp ? '0.4s' : '0.3s',
                                opacity: 0,
                            }}
                        >
                            <span className="relative z-10">
                                {isSubmitting ? '⏳ Processing...' : isSignUp ? '🌱 Create Farmer Account' : '🚜 Sign In to Farm'}
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-700 to-green-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </button>
                    </form>

                    {/* Toggle Sign In / Sign Up */}
                    <div className="mt-6 text-center">
                        <button
                            onClick={() => { setIsSignUp(!isSignUp); setError(''); setSuccess(''); }}
                            className="text-green-700 hover:text-green-900 font-semibold text-sm transition-colors duration-200 underline-offset-4 hover:underline"
                        >
                            {isSignUp ? 'Already registered? Sign In' : 'New farmer? Register Now'}
                        </button>
                    </div>

                    <div className="mt-4 pt-4 border-t border-green-100 text-center text-sm text-gray-500">
                        Looking to buy? <Link to="/consumer/login" className="text-amber-700 font-bold hover:underline">Consumer Login</Link>
                    </div>

                    <div className="mt-3 text-center">
                        <Link to="/" className="text-green-600 hover:text-green-800 font-medium text-sm inline-flex items-center gap-1 transition-colors duration-200">
                            <span>←</span> Return to Marketplace
                        </Link>
                    </div>
                </div>
            </div>

            {/* CSS Animations */}
            <style>{`
                @keyframes farmerFloat {
                    0% { transform: translateY(0px) translateX(0px) rotate(0deg); }
                    100% { transform: translateY(-25px) translateX(10px) rotate(5deg); }
                }
                @keyframes farmerCardEntrance {
                    0% { opacity: 0; transform: rotateX(12deg) rotateY(5deg) translateY(50px) scale(0.93); }
                    50% { transform: rotateX(-4deg) rotateY(-2deg) translateY(-8px) scale(1.02); }
                    100% { opacity: 1; transform: rotateX(0) rotateY(0) translateY(0) scale(1); }
                }
                @keyframes tractorBounce {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    20% { transform: translateY(-10px) rotate(-5deg); }
                    40% { transform: translateY(-4px) rotate(3deg); }
                    60% { transform: translateY(-12px) rotate(-3deg); }
                    80% { transform: translateY(-2px) rotate(2deg); }
                }
                @keyframes farmerTitleSlide {
                    0% { opacity: 0; transform: translateY(15px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                @keyframes farmerFieldSlide {
                    0% { opacity: 0; transform: translateX(-20px); }
                    100% { opacity: 1; transform: translateX(0); }
                }
                @keyframes farmerShimmer {
                    0% { transform: translateX(-50%); }
                    100% { transform: translateX(0%); }
                }
                @keyframes farmerShake {
                    0%, 100% { transform: translateX(0); }
                    20% { transform: translateX(-8px); }
                    40% { transform: translateX(8px); }
                    60% { transform: translateX(-4px); }
                    80% { transform: translateX(4px); }
                }
                @keyframes leafDrift {
                    0% { transform: translateY(0) rotate(0deg); }
                    100% { transform: translateY(-15px) rotate(10deg); }
                }
            `}</style>
        </div>
    );
};
