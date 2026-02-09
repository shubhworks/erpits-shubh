'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';

interface FormErrors {
    [key: string]: string;
}

export default function SignupPage() {
    const router = useRouter();
    const { signup, verifyOtp } = useAuth();

    const [step, setStep] = useState<'signup' | 'otp'>('signup');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [errors, setErrors] = useState<FormErrors>({});
    const [generalError, setGeneralError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setGeneralError('');
        setLoading(true);

        try {
            await signup(email, username, password);
            setStep('otp');
        } catch (error: any) {
            const errorMessage = error.message || 'Signup failed';

            // Parse validation errors if they come from the API
            if (errorMessage.includes('Validation failed')) {
                setGeneralError(errorMessage);
            } else if (errorMessage.includes('already')) {
                if (errorMessage.includes('email')) {
                    setErrors({ email: errorMessage });
                } else if (errorMessage.includes('username')) {
                    setErrors({ username: errorMessage });
                }
            } else {
                setGeneralError(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleOtpVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setGeneralError('');
        setLoading(true);

        try {
            await verifyOtp(email, otp);
            // Redirect to login page
            router.push('/userlogin');
        } catch (error: any) {
            setGeneralError(error.message || 'OTP verification failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* Left side - Form */}
            <div className="w-2/5 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-8">
                            <Image
                                src="/ggitsLogo.png"
                                alt="Gyan Ganga Logo"
                                width={200}
                                height={200}
                            />
                        </div>
                    </div>

                    {step === 'signup' ? (
                        <>
                            <h1 className="text-2xl font-bold mb-6">Create Account</h1>

                            {generalError && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
                                    {generalError}
                                </div>
                            )}

                            <form onSubmit={handleSignup} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            if (errors.email) {
                                                const newErrors = { ...errors };
                                                delete newErrors.email;
                                                setErrors(newErrors);
                                            }
                                        }}
                                        placeholder="your@email.com"
                                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.email ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        required
                                    />
                                    {errors.email && (
                                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Username
                                    </label>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => {
                                            setUsername(e.target.value);
                                            if (errors.username) {
                                                const newErrors = { ...errors };
                                                delete newErrors.username;
                                                setErrors(newErrors);
                                            }
                                        }}
                                        placeholder="your_username"
                                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.username ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        required
                                    />
                                    {errors.username && (
                                        <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            if (errors.password) {
                                                const newErrors = { ...errors };
                                                delete newErrors.password;
                                                setErrors(newErrors);
                                            }
                                        }}
                                        placeholder="••••••••"
                                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.password ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        required
                                    />
                                    {errors.password && (
                                        <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                                    )}
                                    <p className="text-xs text-gray-500 mt-1">
                                        At least 6 characters (1 uppercase, 1 lowercase, 1 number)
                                    </p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition"
                                >
                                    {loading ? 'Creating Account...' : 'Sign Up'}
                                </button>
                            </form>

                            <p className="mt-4 text-center text-gray-600">
                                Already have an account?{' '}
                                <Link href="/userlogin" className="text-green-500 font-bold hover:underline">
                                    Sign In
                                </Link>
                            </p>
                        </>
                    ) : (
                        <>
                            <h1 className="text-2xl font-bold mb-6">Verify Email</h1>

                            {generalError && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
                                    {generalError}
                                </div>
                            )}

                            <p className="text-gray-600 mb-6">
                                We've sent a verification code to <strong>{email}</strong>
                            </p>

                            <form onSubmit={handleOtpVerify} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        OTP Code
                                    </label>
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        placeholder="000000"
                                        maxLength={6}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-center text-2xl tracking-widest"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || otp.length !== 6}
                                    className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition"
                                >
                                    {loading ? 'Verifying...' : 'Verify & Continue'}
                                </button>
                            </form>

                            <button
                                onClick={() => setStep('signup')}
                                className="mt-4 w-full text-green-500 font-bold hover:underline"
                            >
                                Back to Sign Up
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Right side - Full Background Image */}
            <div 
                className="w-3/5 h-screen bg-cover bg-center"
                style={{
                    backgroundImage: "url('/authBgCollege.png')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed'
                }}
            >
            </div>
        </div>
    );
}
