'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface CreateSprintModalProps {
    isOpen: boolean;
    onClose: () => void;
    projectId: string;
    onSprintCreated?: (sprint: any) => void;
}

export default function CreateSprintModal({ isOpen, onClose, projectId, onSprintCreated }: CreateSprintModalProps) {
    const [name, setName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [goal, setGoal] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/api/sprints', {
                name,
                startDate,
                endDate,
                goal,
                projectId
            });
            toast.success('Sprint created successfully');
            if (onSprintCreated) onSprintCreated(res.data.data);
            onClose();
        } catch (err) {
            toast.error('Failed to create sprint');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[250] p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[32px] w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50 shrink-0">
                    <div>
                        <h2 className="text-xl font-black text-slate-800 tracking-tight leading-none mb-1">Create New Sprint</h2>
                        <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest italic">Plan your next cycle</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                        <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
                    {/* Scrollable Content Area */}
                    <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                        <div className="animate-in slide-in-from-bottom-2 duration-300">
                            <label className="block text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 mb-2 ml-1">Sprint Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-slate-50 border-2 border-slate-100 px-5 py-4 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:border-primary/40 focus:bg-white transition-all placeholder:text-slate-300"
                                placeholder="e.g., Sprint 1: Foundation"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="animate-in slide-in-from-bottom-2 duration-300 delay-75">
                                <label className="block text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 mb-2 ml-1">Start Date</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full bg-slate-50 border-2 border-slate-100 px-5 py-4 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:border-primary/40 focus:bg-white transition-all"
                                    required
                                />
                            </div>
                            <div className="animate-in slide-in-from-bottom-2 duration-300 delay-100">
                                <label className="block text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 mb-2 ml-1">End Date</label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full bg-slate-50 border-2 border-slate-100 px-5 py-4 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:border-primary/40 focus:bg-white transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div className="animate-in slide-in-from-bottom-2 duration-300 delay-150">
                            <label className="block text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 mb-2 ml-1">Sprint Goal</label>
                            <textarea
                                value={goal}
                                onChange={(e) => setGoal(e.target.value)}
                                className="w-full bg-slate-50 border-2 border-slate-100 px-5 py-4 rounded-2xl text-sm font-medium text-slate-600 outline-none focus:border-primary/40 focus:bg-white transition-all min-h-[100px] placeholder:text-slate-300"
                                placeholder="What do we want to achieve in this sprint?"
                            />
                        </div>
                    </div>

                    {/* Fixed Footer Actions */}
                    <div className="p-6 px-8 border-t border-slate-50 bg-slate-50/30 flex justify-end gap-3 shrink-0">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onClose}
                            className="rounded-2xl px-6 h-12 font-bold text-slate-500 hover:bg-slate-100"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-primary hover:bg-primary shadow-xl shadow-primary/30 rounded-2xl px-8 h-12 font-black transition-all active:scale-95 disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                'Create Sprint'
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
