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

    const handleGoogleSignIn = async () => {
        setError('');
        try {
            const { error: googleError } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin + '/farmer/dashboard',
                }
            });
            if (googleError) throw googleError;
        } catch (err: any) {
            setError(err.message || 'Failed to sign in with Google.');
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

                    {/* Divider */}
                    <div className="relative my-6" style={{ animation: 'farmerFieldSlide 0.5s ease-out forwards', animationDelay: '0.5s', opacity: 0 }}>
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-green-200" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-3 bg-white/90 text-gray-400 font-medium">or continue with</span>
                        </div>
                    </div>

                    {/* Google Sign In Button */}
                    <button
                        onClick={handleGoogleSignIn}
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 hover:border-green-300 hover:shadow-md text-gray-700 font-semibold py-3 rounded-xl transition-all duration-300 group disabled:opacity-50"
                        style={{ animation: 'farmerFieldSlide 0.5s ease-out forwards', animationDelay: '0.55s', opacity: 0 }}
                    >
                        <svg className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Sign in with Google
                    </button>

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
