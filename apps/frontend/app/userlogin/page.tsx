'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import Link from 'next/link';

interface FormErrors {
  [key: string]: string;
}

// Simple CAPTCHA component
function SimpleCaptcha({ onVerify }: { onVerify: (valid: boolean) => void }) {
  const [captchaCode] = useState<string>(() => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  });
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaError, setCaptchaError] = useState('');

  const handleCaptchaChange = (value: string) => {
    setCaptchaInput(value.toUpperCase());
    if (captchaError) setCaptchaError('');
  };

  const verifyCaptcha = () => {
    if (captchaInput === captchaCode) {
      onVerify(true);
      return true;
    } else {
      setCaptchaError('Incorrect CAPTCHA. Please try again.');
      onVerify(false);
      return false;
    }
  };

  return (
    <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
      <div className="flex gap-4 items-center">
        <div className="flex-1">
          <div className="bg-white border-2 border-gray-300 px-4 py-3 rounded font-mono text-lg tracking-widest font-bold text-blue-600 mb-2">
            {captchaCode}
          </div>
          <input
            type="text"
            value={captchaInput}
            onChange={(e) => handleCaptchaChange(e.target.value)}
            placeholder="Enter the code above"
            maxLength={6}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          {captchaError && <p className="text-red-500 text-sm mt-1">{captchaError}</p>}
        </div>
        <button
          type="button"
          onClick={verifyCaptcha}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded"
        >
          Verify
        </button>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [generalError, setGeneralError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setGeneralError('');

    if (!captchaVerified) {
      setGeneralError('Please verify the CAPTCHA first');
      return;
    }

    setLoading(true);

    try {
      await login(username, password);
      router.push('/dashboard');
    } catch (error: any) {
      setGeneralError(error.message || 'Login failed');
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
              <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold">GG</span>
              </div>
              <span className="font-bold text-lg">Gyan Ganga</span>
            </div>
          </div>

          <h1 className="text-2xl font-bold mb-6">User Login</h1>

          {generalError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
              {generalError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <div className="relative">
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
                  placeholder="Enter username"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.username ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                <svg
                  className="absolute right-3 top-2.5 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  />
                </svg>
              </div>
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
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
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                <svg
                  className="absolute right-3 top-2.5 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <SimpleCaptcha onVerify={setCaptchaVerified} />

            <button
              type="submit"
              disabled={loading || !captchaVerified}
              className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-4">
            <Link href="#" className="text-green-500 text-sm font-bold hover:underline">
              Forgot Password?
            </Link>
          </div>

          <p className="mt-4 text-center text-gray-600 text-sm">
            Don't have an account?{' '}
            <Link href="/usersignup" className="text-green-500 font-bold hover:underline">
              Sign Up
            </Link>
          </p>
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
