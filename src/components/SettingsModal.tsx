'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { toast } from 'sonner';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
    const [loading, setLoading] = useState(false);

    // Security tab state
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    if (!isOpen) return null;

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            return toast.error('New passwords do not match');
        }

        setLoading(true);
        try {
            await api.put('/api/auth/update-password', {
                currentPassword,
                newPassword
            });
            toast.success('Password updated successfully');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[250] p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
                <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div>
                        <h2 className="text-xl font-black text-slate-800 tracking-tight">Account Settings</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Manage your profile and security</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                        <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex flex-1 min-h-0">
                    {/* Sidebar Nav */}
                    <aside className="w-48 border-r border-slate-100 bg-slate-50/30 p-4 space-y-2">
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'profile' ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-slate-500 hover:bg-slate-100'}`}
                        >
                            Profile
                        </button>
                        <button
                            onClick={() => setActiveTab('security')}
                            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'security' ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-slate-500 hover:bg-slate-100'}`}
                        >
                            Security
                        </button>
                    </aside>

                    {/* Content area */}
                    <main className="flex-1 p-8 overflow-y-auto custom-scrollbar">
                        {activeTab === 'profile' ? (
                            <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                                <div className="flex items-center gap-6 mb-10">
                                    <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center shadow-inner overflow-hidden">
                                        {user?.avatar ? (
                                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-primary font-black text-3xl">{user?.name?.charAt(0).toUpperCase()}</span>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-slate-800 tracking-tight">{user?.name}</h3>
                                        <p className="text-slate-500 font-bold text-sm mt-1">{user?.email}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">Display Name</label>
                                        <div className="px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-800">
                                            {user?.name}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">Email Address</label>
                                        <div className="px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-800">
                                            {user?.email}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">Organization Role</label>
                                        <div className="inline-block px-4 py-1.5 bg-green-50 text-green-600 rounded-full font-bold text-[10px] uppercase border border-green-100">
                                            Administrator
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="animate-in slide-in-from-right-4 duration-300">
                                <form onSubmit={handleUpdatePassword} className="space-y-6">
                                    <div>
                                        <label className="block text-[11px] font-black uppercase tracking-widest text-slate-500 mb-2">Current Password</label>
                                        <input
                                            type="password"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            className="w-full px-5 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-primary focus:bg-white outline-none transition-all font-bold"
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>
                                    <div className="h-px bg-slate-100 my-2"></div>
                                    <div>
                                        <label className="block text-[11px] font-black uppercase tracking-widest text-slate-500 mb-2">New Password</label>
                                        <input
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="w-full px-5 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-primary focus:bg-white outline-none transition-all font-bold"
                                            placeholder="Min 6 characters"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-black uppercase tracking-widest text-slate-500 mb-2">Confirm New Password</label>
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full px-5 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-primary focus:bg-white outline-none transition-all font-bold"
                                            placeholder="Match new password"
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-slate-900 text-white w-full py-4 rounded-2xl font-black shadow-xl hover:shadow-slate-300 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 mt-4"
                                    >
                                        {loading ? 'Updating...' : 'Update Password'}
                                    </button>
                                </form>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};
