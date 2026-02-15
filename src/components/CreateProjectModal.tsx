'use client';

import { useState } from 'react';

interface CreateProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (data: any) => Promise<void>;
    orgId: string;
}

export default function CreateProjectModal({ isOpen, onClose, onCreate, orgId }: CreateProjectModalProps) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('Software Project');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setLoading(true);
        try {
            await onCreate({ name, description, type, organizationId: orgId });
            onClose();
            setName('');
            setDescription('');
            setType('Software Project');
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[110] p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
                    <div>
                        <h2 className="text-xl font-black text-slate-800 tracking-tight">Create Project</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Start a new workflow</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                        <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
                    <div className="p-8 space-y-6 overflow-y-auto custom-scrollbar flex-1">
                        <div>
                            <label className="block text-[11px] font-black uppercase tracking-widest text-slate-500 mb-2">Project Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-primary focus:bg-white outline-none transition-all font-bold text-slate-800"
                                placeholder="e.g. Apollo Mission"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-[11px] font-black uppercase tracking-widest text-slate-500 mb-2">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-primary focus:bg-white outline-none transition-all text-slate-700 font-medium"
                                placeholder="What is this project about?"
                            />
                        </div>

                        <div>
                            <label className="block text-[11px] font-black uppercase tracking-widest text-slate-500 mb-2">Project Type</label>
                            <div className="relative">
                                <select
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-primary focus:bg-white outline-none transition-all font-bold text-slate-800 appearance-none cursor-pointer"
                                >
                                    <option value="Software Project">Software Project</option>
                                    <option value="Marketing Campaign">Marketing Campaign</option>
                                    <option value="Business Project">Business Project</option>
                                    <option value="Content Calendar">Content Calendar</option>
                                    <option value="Personal Board">Personal Board</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 border-t border-slate-100 flex justify-end gap-3 shrink-0 bg-slate-50/30">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-primary text-white px-10 py-3 rounded-xl font-black shadow-lg hover:shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                        >
                            {loading ? 'Creating...' : 'Create Project'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
