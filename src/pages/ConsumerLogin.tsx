import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { supabase } from '../lib/supabase';

export const ConsumerLogin = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useStore();
    const from = location.state?.from?.pathname || '/';

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
                    options: { data: { display_name: name, role: 'consumer' } }
                });
                if (signUpError) throw signUpError;
                if (data.user) {
                    setSuccess('Account created! Please check your email to confirm, then sign in.');
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
                    login(data.user.email || email, 'consumer');
                    navigate(from, { replace: true });
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
            style={{ background: 'linear-gradient(135deg, #FFF8E1 0%, #FFECB3 30%, #FFE0B2 60%, #FFF3E0 100%)' }}>

            {/* Animated floating elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full opacity-20"
                        style={{
                            width: `${60 + i * 30}px`,
                            height: `${60 + i * 30}px`,
                            background: `radial-gradient(circle, ${i % 2 === 0 ? '#F59E0B' : '#D97706'}, transparent)`,
                            left: `${10 + i * 15}%`,
                            top: `${15 + (i % 3) * 25}%`,
                            animation: `float3d ${4 + i * 1.5}s ease-in-out infinite alternate`,
                            animationDelay: `${i * 0.5}s`,
                        }}
                    />
                ))}
            </div>

            {/* 3D Card */}
            <div
                className="relative w-full max-w-md"
                style={{ perspective: '1200px' }}
            >
                <div
                    className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-amber-200/50 p-8 relative overflow-hidden transition-all duration-700 ease-out"
                    style={{
                        transformStyle: 'preserve-3d',
                        animation: 'cardEntrance 0.8s ease-out forwards',
                        boxShadow: '0 25px 60px -10px rgba(217, 119, 6, 0.25), 0 10px 30px -15px rgba(245, 158, 11, 0.2), inset 0 1px 0 rgba(255,255,255,0.6)',
                    }}
                >
                    {/* Animated gradient border */}
                    <div className="absolute top-0 left-0 w-full h-1.5 overflow-hidden rounded-t-2xl">
                        <div
                            className="w-[200%] h-full"
                            style={{
                                background: 'linear-gradient(90deg, #F59E0B, #D97706, #B45309, #D97706, #F59E0B)',
                                animation: 'shimmer 3s linear infinite',
                            }}
                        />
                    </div>

                    {/* Floating icon */}
                    <div className="text-center mb-6">
                        <div
                            className="inline-block text-6xl"
                            style={{ animation: 'iconFloat 3s ease-in-out infinite' }}
                        >
                            🥬
                        </div>
                        <h1
                            className="text-3xl font-bold mt-3 mb-2"
                            style={{
                                background: 'linear-gradient(135deg, #92400E, #D97706)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                animation: 'titleSlide 0.6s ease-out forwards',
                                animationDelay: '0.2s',
                                opacity: 0,
                            }}
                        >
                            {isSignUp ? 'Create Account' : 'Welcome Back'}
                        </h1>
                        <p
                            className="text-gray-500 text-sm"
                            style={{ animation: 'titleSlide 0.6s ease-out forwards', animationDelay: '0.3s', opacity: 0 }}
                        >
                            {isSignUp ? 'Join FarmVerse — fresh produce, direct from farms.' : 'Sign in to order fresh produce directly from farmers.'}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-100"
                            style={{ animation: 'shake 0.4s ease-out' }}>
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-4 bg-green-50 text-green-700 p-3 rounded-xl text-sm border border-green-100"
                            style={{ animation: 'titleSlide 0.4s ease-out' }}>
                            ✅ {success}
                        </div>
                    )}

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        {isSignUp && (
                            <div style={{ animation: 'fieldSlide 0.5s ease-out forwards', animationDelay: '0.1s', opacity: 0 }}>
                                <label htmlFor="name" className="block text-sm font-semibold text-gray-600 mb-1.5">Full Name</label>
                                <input
                                    id="name"
                                    required
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Ramesh Kumar"
                                    className="w-full px-4 py-3 bg-amber-50/50 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition-all duration-300 hover:border-amber-300"
                                />
                            </div>
                        )}

                        <div style={{ animation: 'fieldSlide 0.5s ease-out forwards', animationDelay: isSignUp ? '0.2s' : '0.1s', opacity: 0 }}>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-600 mb-1.5">Email Address</label>
                            <input
                                id="email"
                                required
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full px-4 py-3 bg-amber-50/50 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition-all duration-300 hover:border-amber-300"
                            />
                        </div>

                        <div style={{ animation: 'fieldSlide 0.5s ease-out forwards', animationDelay: isSignUp ? '0.3s' : '0.2s', opacity: 0 }}>
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-600 mb-1.5">Password</label>
                            <input
                                id="password"
                                required
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                minLength={6}
                                className="w-full px-4 py-3 bg-amber-50/50 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition-all duration-300 hover:border-amber-300"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full text-white font-bold py-3.5 rounded-xl transition-all duration-300 shadow-lg relative overflow-hidden group"
                            style={{
                                background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                                animation: 'fieldSlide 0.5s ease-out forwards',
                                animationDelay: isSignUp ? '0.4s' : '0.3s',
                                opacity: 0,
                            }}
                        >
                            <span className="relative z-10">
                                {isSubmitting ? '⏳ Processing...' : isSignUp ? '🚀 Create Account' : '🌾 Sign In'}
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-amber-700 to-amber-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </button>
                    </form>

                    {/* Toggle Sign In / Sign Up */}
                    <div className="mt-6 text-center">
                        <button
                            onClick={() => { setIsSignUp(!isSignUp); setError(''); setSuccess(''); }}
                            className="text-amber-700 hover:text-amber-900 font-semibold text-sm transition-colors duration-200 underline-offset-4 hover:underline"
                        >
                            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                        </button>
                    </div>

                    <div className="mt-4 pt-4 border-t border-amber-100 text-center text-sm text-gray-500">
                        Are you a farmer? <Link to="/farmer/login" className="text-green-700 font-bold hover:underline">Seller Login</Link>
                    </div>

                    <div className="mt-3 text-center">
                        <Link to="/" className="text-amber-600 hover:text-amber-800 font-medium text-sm inline-flex items-center gap-1 transition-colors duration-200">
                            <span>←</span> Return to Marketplace
                        </Link>
                    </div>
                </div>
            </div>

            {/* CSS Animations */}
            <style>{`
                @keyframes float3d {
                    0% { transform: translateY(0px) translateX(0px) scale(1); }
                    100% { transform: translateY(-30px) translateX(15px) scale(1.1); }
                }
                @keyframes cardEntrance {
                    0% { opacity: 0; transform: rotateX(15deg) rotateY(-5deg) translateY(40px) scale(0.95); }
                    60% { transform: rotateX(-3deg) rotateY(2deg) translateY(-5px) scale(1.01); }
                    100% { opacity: 1; transform: rotateX(0) rotateY(0) translateY(0) scale(1); }
                }
                @keyframes iconFloat {
                    0%, 100% { transform: translateY(0px) rotateY(0deg); }
                    25% { transform: translateY(-8px) rotateY(15deg); }
                    50% { transform: translateY(-3px) rotateY(0deg); }
                    75% { transform: translateY(-10px) rotateY(-15deg); }
                }
                @keyframes titleSlide {
                    0% { opacity: 0; transform: translateY(15px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                @keyframes fieldSlide {
                    0% { opacity: 0; transform: translateX(-20px); }
                    100% { opacity: 1; transform: translateX(0); }
                }
                @keyframes shimmer {
                    0% { transform: translateX(-50%); }
                    100% { transform: translateX(0%); }
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    20% { transform: translateX(-8px); }
                    40% { transform: translateX(8px); }
                    60% { transform: translateX(-4px); }
                    80% { transform: translateX(4px); }
                }
            `}</style>
        </div>
    );
};
