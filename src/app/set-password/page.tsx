'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import DhaniyaaLogo from '@/components/DhaniyaaLogo';
import { Eye, EyeOff } from 'lucide-react';



export default function SetPasswordPage() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            await api.put('/api/auth/set-password', { password });
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to set password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
            </div>

            <div className="w-full max-w-[480px] bg-white p-10 md:p-12 rounded-[32px] shadow-2xl border border-slate-100 relative z-10 animate-in zoom-in-95 duration-500">
                <div className="flex flex-col items-center mb-10 text-center">
                    <div className="w-20 h-20  rounded-[24px] flex items-center justify-center mb-8 shadow-xl shadow-violet-500/20 p-4 transform rotate-3 hover:rotate-0 transition-all duration-500">
                        <DhaniyaaLogo className="w-full h-full text-white" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-3">Welcome to Dhaniyaa!</h2>
                    <p className="text-slate-500 font-medium text-base leading-relaxed max-w-xs mx-auto">
                        Since this is your first time logging in, please set a secure password to protect your account.
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl text-sm font-bold mb-8 text-center animate-in shake-in flex items-center gap-2 justify-center">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-[11px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">New Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 px-5 py-4 rounded-2xl focus:outline-none focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100 transition-all font-bold text-slate-800 shadow-inner pr-12"
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-[11px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">Confirm Password</label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 px-5 py-4 rounded-2xl focus:outline-none focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100 transition-all font-bold text-slate-800 shadow-inner pr-12"
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-violet-600 to-emerald-500 text-white py-5 rounded-2xl font-black text-lg hover:shadow-2xl hover:shadow-emerald-500/30 active:scale-95 transition-all shadow-xl shadow-violet-500/10 disabled:opacity-50 mt-4"
                    >
                        {loading ? 'Setting Password...' : 'Set Password & Continue'}
                    </button>
                </form>
            </div>
        </div>
    );
}
