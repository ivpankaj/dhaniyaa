'use client';

import { useState, Suspense } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import DhaniyaaLogo from '@/components/DhaniyaaLogo';
import { Eye, EyeOff, CheckCircle2, ArrowRight } from 'lucide-react';

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setStatus('error');
            setErrorMessage('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setStatus('error');
            setErrorMessage('Password must be at least 6 characters');
            return;
        }

        setStatus('loading');
        setErrorMessage('');

        try {
            await api.put(`/api/auth/reset-password/${token}`, { password });
            setStatus('success');
            setTimeout(() => {
                router.push('/login');
            }, 3000);
        } catch (err: any) {
            setStatus('error');
            setErrorMessage(err.response?.data?.message || 'Failed to reset password');
        }
    };

    if (!token) {
        return (
            <div className="text-center p-8">
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Invalid Link</h3>
                <p className="text-slate-500 mb-6">The password reset link is invalid or missing.</p>
                <Link href="/login" className="text-violet-600 font-bold hover:underline">
                    Back to Login
                </Link>
            </div>
        );
    }

    return (
        <div className="p-8 sm:p-10 w-full">
            <div className="flex justify-center mb-8">
                <div className="w-16 h-16 bg-[#0d1117] rounded-2xl flex items-center justify-center p-3 shadow-lg">
                    <DhaniyaaLogo className="w-full h-full text-white" />
                </div>
            </div>

            <h1 className="text-3xl font-black text-center text-slate-800 mb-2 tracking-tight">Reset Password</h1>
            <p className="text-center text-slate-500 font-medium mb-8">
                Enter your new password below.
            </p>

            {status === 'success' ? (
                <div className="bg-violet-50 border-2 border-violet-100 rounded-2xl p-8 text-center animate-in zoom-in duration-300">
                    <div className="w-16 h-16 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                        <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-violet-800 mb-2">Password Reset Successful!</h3>
                    <p className="text-violet-700 font-medium mb-6">
                        Your password has been securely updated. Redirecting you to login...
                    </p>
                    <Link
                        href="/login"
                        className="inline-flex items-center justify-center gap-2 bg-violet-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-violet-700 transition-all shadow-lg shadow-violet-600/20"
                    >
                        Login Now
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    {status === 'error' && (
                        <div className="bg-red-50 border-2 border-red-100 text-red-700 p-4 rounded-xl text-sm font-semibold flex items-center gap-2 animate-in slide-in-from-top-2">
                            <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            {errorMessage}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">New Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-50 border-2 border-slate-200 px-4 py-3.5 rounded-xl focus:outline-none focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100 transition-all font-medium text-slate-800 pr-12"
                                placeholder="••••••••"
                                required
                                minLength={6}
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

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Confirm New Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full bg-slate-50 border-2 border-slate-200 px-4 py-3.5 rounded-xl focus:outline-none focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100 transition-all font-medium text-slate-800 pr-12"
                                placeholder="••••••••"
                                required
                                minLength={6}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="w-full bg-violet-600 text-white py-4 rounded-xl font-bold text-base hover:bg-violet-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-violet-600/20"
                    >
                        {status === 'loading' ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Resetting Password...
                            </span>
                        ) : (
                            'Reset Password'
                        )}
                    </button>
                </form>
            )}
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="flex min-h-screen bg-slate-50 items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                <Suspense fallback={<div className="p-10 text-center text-slate-500">Loading...</div>}>
                    <ResetPasswordForm />
                </Suspense>
            </div>
        </div>
    );
}
