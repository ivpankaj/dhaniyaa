import React, { useState } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';

interface InviteMemberModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'organization' | 'project';
    id: string;
    onSuccess?: () => void;
}

export const InviteMemberModal: React.FC<InviteMemberModalProps> = ({ isOpen, onClose, type, id, onSuccess }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const endpoint = type === 'organization'
                ? `/api/organizations/${id}/invite`
                : `/api/projects/${id}/invite`;

            await api.post(endpoint, { email });
            toast.success(`User invited to ${type} successfully`);
            setEmail('');
            onSuccess?.();
            onClose();
        } catch (error: any) {
            toast.error(error.response?.data?.message || `Failed to invite user to ${type}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[150] p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="px-8 py-8 text-center bg-slate-50/50">
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">Invite People</h2>
                    <p className="text-sm font-medium text-slate-500 mt-2">Add a teammate to this {type}.</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-[11px] font-black uppercase tracking-widest text-slate-500 mb-2">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-primary focus:bg-white outline-none transition-all font-bold text-slate-800"
                                placeholder="teammate@example.com"
                                autoFocus
                                required
                            />
                        </div>
                    </div>

                    <div className="mt-8 flex flex-col gap-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-primary text-white w-full py-4 rounded-2xl font-black shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                        >
                            {loading ? 'Sending Invitation...' : 'Send Invitation'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full py-3 rounded-2xl font-bold text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all text-sm"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
