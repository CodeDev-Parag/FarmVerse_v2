import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { auth } from '../lib/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, GoogleAuthProvider, signInWithPopup, type ConfirmationResult } from 'firebase/auth';

declare global {
    interface Window {
        recaptchaVerifier: any;
    }
}

export const ConsumerLogin = () => {
    const [phone, setPhone] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useStore();

    // The route we came from, or home by default
    const from = location.state?.from?.pathname || '/';

    useEffect(() => {
        // Initialize reCAPTCHA
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                size: 'invisible',
            });
        }
    }, []);

    const requestOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            const phoneNumber = `+91${phone}`;
            const appVerifier = window.recaptchaVerifier;

            const confirmation = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
            setConfirmationResult(confirmation);
            setOtpSent(true);
        } catch (err: any) {
            console.error('Error sending OTP:', err);
            setError(err.message || 'Failed to send OTP. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const verifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            if (confirmationResult) {
                const result = await confirmationResult.confirm(otp);
                // User signed in successfully
                if (result.user) {
                    login(phone, 'consumer');
                    navigate(from, { replace: true });
                }
            }
        } catch (err: any) {
            console.error('Error verifying OTP:', err);
            setError('Invalid OTP code. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        setError('');
        setIsSubmitting(true);
        try {
            const result = await signInWithPopup(auth, provider);
            if (result.user) {
                // We use their email or phone if available, otherwise just signal auth
                login(result.user.phoneNumber || result.user.email || 'Google User', 'consumer');
                navigate(from, { replace: true });
            }
        } catch (err: any) {
            console.error('Error signing in with Google:', err);
            setError(err.message || 'Failed to sign in with Google. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex-1 bg-amber-50 flex items-center justify-center p-6 min-h-[80vh]">
            <div className="bg-white rounded-xl shadow-xl border border-amber-200 p-8 max-w-md w-full relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400"></div>

                <div className="text-center mb-8">
                    <span className="text-5xl mb-4 inline-block">🥬</span>
                    <h1 className="text-3xl font-heading font-bold text-amber-900 mb-2">Consumer Login</h1>
                    <p className="text-gray-600">Secure access to order fresh produce directly from farmers.</p>
                </div>

                {error && <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">{error}</div>}

                <form className="space-y-6" onSubmit={otpSent ? verifyOTP : requestOTP}>
                    <div id="recaptcha-container"></div>

                    {!otpSent ? (
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-gray-500 font-medium">+91</span>
                                <input
                                    id="phone"
                                    required
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                                    placeholder="98765 43210"
                                    maxLength={10}
                                    className="w-full pl-12 pr-4 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                                />
                            </div>
                        </div>
                    ) : (
                        <div>
                            <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">Enter 6-Digit OTP</label>
                            <input
                                id="otp"
                                required
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                placeholder="• • • • • •"
                                maxLength={6}
                                className="w-full px-4 py-2 text-center tracking-[1em] font-heading font-bold text-lg border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                            />
                            <p className="text-sm text-center mt-3 text-amber-700">Test OTP sent securely to +91 {phone}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting || (!otpSent && phone.length < 10) || (otpSent && otp.length < 6)}
                        className={`w-full text-white font-bold py-3 rounded-lg transition shadow-md ${isSubmitting || (!otpSent && phone.length < 10) || (otpSent && otp.length < 6) ? 'bg-amber-400 cursor-not-allowed' : 'bg-amber-600 hover:bg-amber-700 hover:shadow-lg'}`}
                    >
                        {isSubmitting ? 'Processing...' : otpSent ? 'Verify & Login' : 'Send Secure OTP'}
                    </button>

                    <div className="relative mt-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-lg transition shadow-sm mt-4 disabled:opacity-50"
                    >
                        <svg className="h-5 w-5" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                            <path d="M1 1h22v22H1z" fill="none" />
                        </svg>
                        Sign in with Google
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-gray-500 pb-2 border-b border-gray-100">
                    Are you a farmer? <Link to="/farmer/login" className="text-secondary font-bold hover:underline">Seller Login</Link>
                </div>

                <div className="mt-4 text-center">
                    <Link to="/" className="text-amber-700 hover:text-amber-900 font-medium text-sm flex items-center justify-center gap-1 transition">
                        <span>←</span> Return to Marketplace
                    </Link>
                </div>
            </div>
        </div>
    );
};
