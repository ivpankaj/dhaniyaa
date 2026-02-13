'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

export default function SetPasswordPage() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
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
            // Check if we are logged in (meaning we have the token from Google Login)
            // If the user came here from Login page redirect, they should be "logged in" in context?
            // Wait, the Google Login flow returns a token. We should have called login() with it.
            // So api.put should work with the token in headers.

            await api.put('/api/auth/set-password', { password });
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to set password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#F4F5F7] p-4">
            <div className="w-full max-w-[440px] bg-white p-12 rounded-[24px] shadow-[0_20px_60px_rgba(0,0,0,0.05)] animate-in zoom-in-95 duration-500">
                <div className="flex flex-col items-center mb-10">
                    <div className="w-16 h-16 bg-primary rounded-[20px] flex items-center justify-center mb-6 shadow-xl shadow-primary/20 scale-110">
                        <span className="text-white font-black text-3xl">T</span>
                    </div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">Set Password</h2>
                    <p className="text-slate-400 font-bold text-sm mt-2 uppercase tracking-widest">Secure your account</p>
                </div>

                {error && (
                    <div className="bg-red-50 border-2 border-red-100 text-red-600 p-4 rounded-xl text-sm font-bold mb-6 text-center animate-in shake-in">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-[11px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">New Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-50 border-2 border-slate-100 px-5 py-4 rounded-2xl focus:outline-none focus:border-primary focus:bg-white transition-all font-bold text-slate-800 shadow-inner"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-[11px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full bg-slate-50 border-2 border-slate-100 px-5 py-4 rounded-2xl focus:outline-none focus:border-primary focus:bg-white transition-all font-bold text-slate-800 shadow-inner"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-white py-5 rounded-2xl font-black text-lg hover:shadow-2xl hover:shadow-primary/30 active:scale-95 transition-all shadow-xl shadow-primary/10 disabled:opacity-50"
                    >
                        {loading ? 'Setting Password...' : 'Set Password & Continue'}
                    </button>
                </form>
            </div>
        </div>
    );
}
