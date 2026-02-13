'use client';

import { useState } from 'react';

interface CreateOrganizationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (data: any) => Promise<void>;
}

export default function CreateOrganizationModal({ isOpen, onClose, onCreate }: CreateOrganizationModalProps) {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setLoading(true);
        try {
            await onCreate({ name });
            onClose();
            setName('');
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[120] p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
                <div className="px-8 py-8 text-center bg-slate-50/50 shrink-0">
                    <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-3">
                        <svg className="w-10 h-10 text-primary -rotate-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-7h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">New Organization</h2>
                    <p className="text-sm font-medium text-slate-500 mt-2">Bring your team together in one space.</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-y-auto custom-scrollbar">
                    <div className="p-8 space-y-6">
                        <div>
                            <label className="block text-[11px] font-black uppercase tracking-widest text-slate-500 mb-2">Organization Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-primary focus:bg-white outline-none transition-all font-bold text-slate-800 text-lg text-center"
                                placeholder="e.g. Acme Corp"
                                autoFocus
                                required
                            />
                        </div>
                    </div>

                    <div className="p-8 pt-0 flex flex-col gap-3 shrink-0">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-primary text-white w-full py-4 rounded-2xl font-black shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                        >
                            {loading ? 'Starting...' : 'Create Organization'}
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
}
