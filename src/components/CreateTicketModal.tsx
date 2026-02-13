'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { uploadToCloudinary } from '@/lib/upload';
import { useRef } from 'react';

interface CreateTicketModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (data: any) => Promise<void>;
    projectId: string;
    members: any[];
}

export default function CreateTicketModal({ isOpen, onClose, onCreate, projectId, members }: CreateTicketModalProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('Medium');
    const [type, setType] = useState('Task');
    const [assignee, setAssignee] = useState('');
    const [attachments, setAttachments] = useState<string[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { user } = useAuth();
    if (!isOpen) return null;

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        setIsUploading(true);
        try {
            const uploadPromises = files.map(file => uploadToCloudinary(file));
            const urls = await Promise.all(uploadPromises);
            setAttachments(prev => [...prev, ...urls]);
            toast.success('Images uploaded');
        } catch (err) {
            toast.error('Failed to upload images');
        } finally {
            setIsUploading(false);
        }
    };

    const removeAttachment = (index: number) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        setLoading(true);
        try {
            await onCreate({
                title,
                description,
                priority,
                type,
                projectId,
                assignee: assignee || undefined,
                status: 'To Do',
                attachments
            });
            toast.success('Ticket created successfully');
            onClose();
            setTitle('');
            setDescription('');
            setPriority('Medium');
            setType('Task');
            setAssignee('');
            setAttachments([]);
        } catch (err: any) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Failed to create ticket');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
                    <div>
                        <h2 className="text-xl font-black text-slate-800 tracking-tight">Create Issue</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Project: Software Development</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors" aria-label="Close">
                        <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
                    <div className="p-8 space-y-6 overflow-y-auto custom-scrollbar flex-1">
                        <div>
                            <label className="block text-[11px] font-black uppercase tracking-widest text-slate-500 mb-2">Issue Type</label>
                            <div className="flex flex-wrap gap-3">
                                {['Task', 'Bug', 'Story'].map(t => (
                                    <button
                                        key={t}
                                        type="button"
                                        onClick={() => setType(t)}
                                        className={`px-4 py-2 rounded-lg text-sm font-bold border-2 transition-all ${type === t ? 'border-primary bg-primary/5 text-primary shadow-sm' : 'border-slate-100 hover:border-slate-300 text-slate-500'}`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-[11px] font-black uppercase tracking-widest text-slate-500 mb-2">Short Summary</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-primary focus:bg-white outline-none transition-all font-bold text-slate-800"
                                placeholder="What needs to be done?"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-[11px] font-black uppercase tracking-widest text-slate-500 mb-2">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-primary focus:bg-white outline-none transition-all text-slate-700 font-medium"
                                placeholder="Add more context here..."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[11px] font-black uppercase tracking-widest text-slate-500 mb-2">Priority</label>
                                <select
                                    value={priority}
                                    onChange={(e) => setPriority(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-primary focus:bg-white outline-none transition-all font-bold text-slate-700 appearance-none cursor-pointer"
                                >
                                    <option>Low</option>
                                    <option>Medium</option>
                                    <option>High</option>
                                    <option>Critical</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[11px] font-black uppercase tracking-widest text-slate-500 mb-2">Assignee</label>
                                <select
                                    value={assignee}
                                    onChange={(e) => setAssignee(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-primary focus:bg-white outline-none transition-all font-bold text-slate-700 appearance-none cursor-pointer"
                                >
                                    <option value="">Unassigned</option>
                                    {members.filter(m => {
                                        const mId = m.userId?._id || m.userId;
                                        return String(mId) !== String(user?._id);
                                    }).map(member => (
                                        <option key={member.userId?._id || member.userId} value={member.userId?._id || member.userId}>
                                            {member.name || member.email || member.userId?.name || member.userId?.email}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[11px] font-black uppercase tracking-widest text-slate-500 mb-3">Attachments</label>
                            <div className="flex flex-wrap gap-4">
                                {attachments.map((url, i) => (
                                    <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-slate-100 group">
                                        <img src={url} alt="Attachment" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeAttachment(i)}
                                            className="absolute inset-0 bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isUploading}
                                    className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-primary hover:text-primary transition-all hover:bg-primary/5 active:scale-95"
                                >
                                    {isUploading ? (
                                        <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <svg className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                                            <span className="text-[8px] font-black uppercase tracking-wider">Add</span>
                                        </>
                                    )}
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    multiple
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
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
                            className="bg-primary text-white px-8 py-3 rounded-xl font-black shadow-lg hover:shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                        >
                            {loading ? 'Creating...' : 'Create Issue'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
