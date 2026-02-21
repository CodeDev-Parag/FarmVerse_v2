import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { auth } from '../lib/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, type ConfirmationResult } from 'firebase/auth';

export const FarmerLogin = () => {
    const [phone, setPhone] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
    const [error, setError] = useState('');

    const { login } = useStore();
    const navigate = useNavigate();

    useEffect(() => {
        // Initialize reCAPTCHA
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, 'farmer-recaptcha-container', {
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
                    login(phone, 'farmer');
                    navigate('/farmer/dashboard');
                }
            }
        } catch (err: any) {
            console.error('Error verifying OTP:', err);
            setError('Invalid OTP code. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex-1 bg-green-50 flex items-center justify-center p-6">
            <div className="bg-white rounded-xl shadow-xl border border-green-200 p-8 max-w-md w-full relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-secondary to-primary"></div>

                <div className="text-center mb-8">
                    <span className="text-4xl mb-2 inline-block">🚜</span>
                    <h1 className="text-3xl font-heading font-bold text-primary mb-2">Farmer Portal</h1>
                    <p className="text-gray-600">Access your farm stall, view orders, and manage inventory.</p>
                </div>

                {error && <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">{error}</div>}

                <form className="space-y-6" onSubmit={otpSent ? verifyOTP : requestOTP}>
                    <div id="farmer-recaptcha-container"></div>

                    {!otpSent ? (
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Registered Mobile Number</label>
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
                                    className="w-full pl-12 pr-4 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
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
                                className="w-full px-4 py-2 text-center tracking-[1em] font-heading font-bold text-lg border border-green-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                            />
                            <p className="text-sm text-center mt-3 text-secondary">OTP sent securely to +91 {phone}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting || (!otpSent && phone.length < 10) || (otpSent && otp.length < 6)}
                        className={`w-full text-white font-bold py-3 rounded-lg transition shadow-md ${isSubmitting || (!otpSent && phone.length < 10) || (otpSent && otp.length < 6) ? 'bg-green-400 cursor-not-allowed' : 'bg-primary hover:bg-green-700 hover:shadow-lg'}`}
                    >
                        {isSubmitting ? 'Processing...' : otpSent ? 'Verify Login' : 'Send OTP securely'}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-gray-500 pb-2 border-b border-gray-100">
                    Not registered yet? <span className="text-secondary font-bold cursor-pointer hover:underline">Apply to Sell</span>
                </div>

                <div className="mt-4 text-center">
                    <Link to="/" className="text-primary hover:text-green-800 font-medium text-sm flex items-center justify-center gap-1 transition">
                        <span>←</span> Return to Marketplace
                    </Link>
                </div>
            </div>
        </div>
    );
};
