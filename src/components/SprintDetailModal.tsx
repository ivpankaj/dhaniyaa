'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface SprintDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    sprint: any;
}

export default function SprintDetailModal({ isOpen, onClose, sprint }: SprintDetailModalProps) {
    const [tickets, setTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && sprint) {
            fetchSprintTickets();
        }
    }, [isOpen, sprint]);

    const fetchSprintTickets = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/api/tickets/sprint/${sprint._id}`);
            setTickets(res.data.data);
        } catch (err) {
            console.error('Failed to fetch sprint tickets', err);
            toast.error('Failed to load cycle details');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !sprint) return null;

    const completed = tickets.filter(t => t.status === 'Done');
    const incomplete = tickets.filter(t => t.status !== 'Done');

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[200] p-2 sm:p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-4xl rounded-xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[95vh] sm:max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="p-4 sm:p-8 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
                    <div className="flex-1 min-w-0 mr-2">
                        <div className="flex items-center gap-2 sm:gap-3 mb-2">
                            <h2 className="text-lg sm:text-2xl font-black text-slate-800 tracking-tight truncate">{sprint.name}</h2>
                            <span className="text-[9px] sm:text-[10px] font-black px-1.5 sm:px-2 py-0.5 rounded-full bg-slate-200 text-slate-500 uppercase tracking-widest border border-slate-300 whitespace-nowrap">
                                {sprint.status}
                            </span>
                        </div>
                        <p className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-wider truncate">
                            {format(new Date(sprint.startDate), 'MMM do')} — {format(new Date(sprint.endDate), 'MMM do, yyyy')}
                        </p>
                        {sprint.goal && (
                            <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-primary/5 rounded-xl border border-primary/10">
                                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-primary block mb-1">Cycle Goal</span>
                                <p className="text-xs sm:text-sm font-medium text-slate-700 italic line-clamp-2">"{sprint.goal}"</p>
                            </div>
                        )}
                    </div>
                    <button onClick={onClose} className="p-1.5 sm:p-2 hover:bg-slate-200 rounded-full transition-colors shrink-0">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar space-y-6 sm:space-y-10">
                    {/* Summary Stats */}
                    {sprint.summary && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6">
                            <div className="bg-white border-2 border-slate-100 p-4 sm:p-6 rounded-2xl shadow-sm text-center">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Total Issues</span>
                                <span className="text-2xl sm:text-3xl font-black text-slate-800">{sprint.summary.totalTickets}</span>
                            </div>
                            <div className="bg-green-50 border-2 border-green-100 p-4 sm:p-6 rounded-2xl shadow-sm text-center">
                                <span className="text-[10px] font-black text-green-600/60 uppercase tracking-widest block mb-1">Completed</span>
                                <span className="text-2xl sm:text-3xl font-black text-green-600">{sprint.summary.completedTickets}</span>
                                <p className="text-[9px] font-black text-green-600/40 uppercase mt-1">
                                    {Math.round((sprint.summary.completedTickets / sprint.summary.totalTickets) * 100) || 0}% Success
                                </p>
                            </div>
                            <div className="bg-amber-50 border-2 border-amber-100 p-4 sm:p-6 rounded-2xl shadow-sm text-center">
                                <span className="text-[10px] font-black text-amber-600/60 uppercase tracking-widest block mb-1">Pushed Back</span>
                                <span className="text-2xl sm:text-3xl font-black text-amber-600">{sprint.summary.pushedBackTickets}</span>
                                <p className="text-[9px] font-black text-amber-600/40 uppercase mt-1">Returned to List</p>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-6 sm:gap-8">
                        {/* Completed Tickets */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                Completed Work ({completed.length})
                            </h3>
                            <div className="space-y-2">
                                {loading ? (
                                    [1, 2].map(i => <div key={i} className="h-12 bg-slate-50 rounded-xl animate-pulse" />)
                                ) : completed.length === 0 ? (
                                    <p className="text-[10px] font-bold text-slate-400 italic py-4">No tickets were completed in this cycle.</p>
                                ) : (
                                    completed.map(ticket => (
                                        <div key={ticket._id} className="p-3 bg-white border border-slate-100 rounded-xl flex items-center justify-between shadow-sm">
                                            <div className="flex items-center gap-3">
                                                <div className="w-1 h-4 bg-green-500 rounded-full" />
                                                <span className="text-sm font-bold text-slate-700">{ticket.title}</span>
                                            </div>
                                            <span className="text-[9px] font-bold text-slate-300">#{ticket._id.slice(-4)}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Incomplete Tickets */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                                Pushed Back ({incomplete.length})
                            </h3>
                            <div className="space-y-2">
                                {loading ? (
                                    [1, 2].map(i => <div key={i} className="h-12 bg-slate-50 rounded-xl animate-pulse" />)
                                ) : incomplete.length === 0 ? (
                                    <p className="text-[10px] font-bold text-slate-400 italic py-4">Perfect cycle! All committed work was finished.</p>
                                ) : (
                                    incomplete.map(ticket => (
                                        <div key={ticket._id} className="p-3 bg-slate-50/50 border border-dashed border-slate-200 rounded-xl flex items-center justify-between">
                                            <div className="flex items-center gap-3 opacity-60">
                                                <div className="w-1 h-4 bg-slate-300 rounded-full" />
                                                <span className="text-sm font-bold text-slate-500">{ticket.title}</span>
                                            </div>
                                            <span className="text-[9px] font-bold text-slate-300">#{ticket._id.slice(-4)}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50/30 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 sm:px-6 py-2 sm:py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
                    >
                        Close Report
                    </button>
                </div>
            </div>
        </div>
    );
}
