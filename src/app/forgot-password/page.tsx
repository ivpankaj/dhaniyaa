'use client';

import { useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import DhaniyaaLogo from '@/components/DhaniyaaLogo';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMessage('');

        try {
            await api.post('/api/auth/forgot-password', { email });
            setStatus('success');
        } catch (err: any) {
            setStatus('error');
            setErrorMessage(err.response?.data?.message || 'Failed to send reset email');
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-50 items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                <div className="p-8 sm:p-10">
                    <div className="flex justify-center mb-8">
                        <div className="w-16 h-16 bg-[#0d1117] rounded-2xl flex items-center justify-center p-3 shadow-lg">
                            <DhaniyaaLogo className="w-full h-full text-white" />
                        </div>
                    </div>

                    <h1 className="text-3xl font-black text-center text-slate-800 mb-2 tracking-tight">Forgot Password?</h1>
                    <p className="text-center text-slate-500 font-medium mb-8">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>

                    {status === 'success' ? (
                        <div className="bg-violet-50 border-2 border-violet-100 rounded-2xl p-6 text-center animate-in zoom-in duration-300">
                            <div className="w-12 h-12 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle2 className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-violet-800 mb-2">Check your email</h3>
                            <p className="text-violet-700 font-medium text-sm">
                                We sent a password reset link to <span className="font-bold">{email}</span>
                            </p>
                            <div className="mt-6">
                                <Link
                                    href="/login"
                                    className="inline-flex items-center justify-center gap-2 text-violet-700 font-bold hover:text-violet-800 transition-colors"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Back to login
                                </Link>
                            </div>
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
                                <label className="block text-sm font-bold text-slate-700 mb-2">Email address</label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-slate-50 border-2 border-slate-200 px-4 py-3.5 pl-11 rounded-xl focus:outline-none focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100 transition-all font-medium text-slate-800"
                                        placeholder="you@company.com"
                                        required
                                    />
                                    <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
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
                                        Sending Link...
                                    </span>
                                ) : (
                                    'Send Reset Link'
                                )}
                            </button>

                            <div className="text-center">
                                <Link href="/login" className="inline-flex items-center gap-2 text-slate-500 font-bold hover:text-slate-800 transition-colors text-sm">
                                    <ArrowLeft className="w-4 h-4" />
                                    Back to login
                                </Link>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
