'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import Link from 'next/link';
import { auth, googleProvider } from '@/lib/firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { Eye, EyeOff, Sparkles, CheckCircle2, Users, Zap } from 'lucide-react';
import DhaniyaaLogo from '@/components/DhaniyaaLogo';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await api.post('/api/auth/login', { email, password });
            login(res.data.data.token, res.data.data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError('');
        setLoading(true);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential?.idToken;
            const user = result.user;

            if (!token) {
                throw new Error('Could not retrieve Google ID Token');
            }

            const res = await api.post('/api/auth/google-login', {
                token,
                avatar: user.photoURL
            });
            login(res.data.data.token, res.data.data);
        } catch (err: any) {
            console.error(err);
            if (err.code) {
                setError(`Firebase Error: ${err.message}`);
            } else if (err.response?.data?.message) {
                setError(`Server Error: ${err.response.data.message}`);
            } else {
                setError(`Error: ${err.message || 'Google Sign In Failed'}`);
            }
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen">
            {/* Left Side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-violet-600 via-violet-500 to-emerald-500 relative overflow-hidden">
                {/* Animated background shapes */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-blob"></div>
                    <div className="absolute top-40 right-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-2000"></div>
                    <div className="absolute bottom-20 left-40 w-72 h-72 bg-emerald-300 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-4000"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-center px-16 text-white">
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-30 h-30 rounded-2xl flex items-center justify-center p-2">
                                <DhaniyaaLogo className="w-full h-full" />
                            </div>
                            <h1 className="text-4xl font-black tracking-tight -ml-9">Dhaniyaa</h1>
                        </div>
                        <h2 className="text-5xl font-black leading-tight mb-6">
                            Manage projects<br />with confidence
                        </h2>
                        <p className="text-xl text-violet-100 font-medium leading-relaxed">
                            Streamline your workflow, collaborate seamlessly, and deliver projects on time with Dhaniyaa.
                        </p>
                    </div>

                    {/* Features */}
                    <div className="space-y-4 mt-12">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                <CheckCircle2 className="w-5 h-5" />
                            </div>
                            <span className="text-lg font-semibold">Real-time collaboration</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                <Zap className="w-5 h-5" />
                            </div>
                            <span className="text-lg font-semibold">Lightning-fast performance</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                <Users className="w-5 h-5" />
                            </div>
                            <span className="text-lg font-semibold">Team-first approach</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-emerald-500 rounded-2xl flex items-center justify-center p-2">
                            <DhaniyaaLogo className="w-full h-full" />
                        </div>
                        <h1 className="text-2xl font-black text-slate-800">Dhaniyaa</h1>
                    </div>

                    <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-slate-100">
                        <div className="mb-8">
                            <h2 className="text-3xl font-black text-slate-800 tracking-tight mb-2">Welcome back</h2>
                            <p className="text-slate-500 font-medium">Sign in to your Dhaniyaa workspace</p>
                        </div>

                        {error && (
                            <div className="bg-red-50 border-2 border-red-200 text-red-700 p-4 rounded-2xl text-sm font-semibold mb-6 animate-in slide-in-from-top-2 duration-300">
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    <span>{error}</span>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Email address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-slate-50 border-2 border-slate-200 px-4 py-3.5 rounded-xl focus:outline-none focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100 transition-all font-medium text-slate-800"
                                    placeholder="you@company.com"
                                    required
                                />
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-bold text-slate-700">Password</label>
                                    <Link href="/forgot-password" className="text-sm font-semibold text-violet-600 hover:text-violet-700 hover:underline">
                                        Forgot password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-slate-50 border-2 border-slate-200 px-4 py-3.5 rounded-xl focus:outline-none focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100 transition-all font-medium text-slate-800 pr-12"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-violet-600 to-emerald-500 text-white py-4 rounded-xl font-bold text-base hover:shadow-2xl hover:shadow-emerald-500/30 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Signing in...
                                    </span>
                                ) : (
                                    'Sign in'
                                )}
                            </button>
                        </form>

                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-slate-200" />
                            </div>
                            <div className="relative flex justify-center text-xs">
                                <span className="bg-white px-4 text-slate-500 font-semibold uppercase tracking-wider">Or continue with</span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            disabled={loading}
                            className="flex w-full items-center justify-center gap-3 rounded-xl bg-white border-2 border-slate-200 px-4 py-3.5 text-slate-700 font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <svg className="h-5 w-5" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            <span>Sign in with Google</span>
                        </button>

                        <div className="mt-8 text-center">
                            <p className="text-slate-600 font-medium text-sm">
                                New to Dhaniyaa?{' '}
                                <Link href="/register" className="text-violet-600 hover:text-violet-700 font-bold hover:underline decoration-2 underline-offset-4">
                                    Create workspace
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes blob {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </div>
    );
}
