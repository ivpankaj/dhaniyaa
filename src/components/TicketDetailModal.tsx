'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useSocket } from '@/hooks/useSocket';
import { formatDistanceToNow } from 'date-fns';
import ActivityFeed from './ActivityFeed';
import { toast } from 'sonner';
import { uploadToCloudinary } from '@/lib/upload';
import { UserAvatar } from './UserAvatar';

interface TicketDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    ticket: any;
    members: any[];
    projectId: string;
    onUpdate?: (ticket: any) => void;
}

export default function TicketDetailModal({ isOpen, onClose, ticket, members, projectId, onUpdate }: TicketDetailModalProps) {
    const [comments, setComments] = useState<any[]>([]);
    const [newComment, setNewComment] = useState('');
    const [status, setStatus] = useState(ticket?.status || 'To Do');
    const [priority, setPriority] = useState(ticket?.priority || 'Medium');
    const [assignee, setAssignee] = useState(ticket?.assignee?._id || '');
    const [loadingComments, setLoadingComments] = useState(false);
    const [isPosting, setIsPosting] = useState(false);
    const [commentAttachments, setCommentAttachments] = useState<string[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
    const commentFileRef = useRef<HTMLInputElement>(null);
    const popupCommentFileRef = useRef<HTMLInputElement>(null);

    const { user } = useAuth();
    const socket = useSocket(projectId);
    const commentsEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (ticket) {
            setStatus(ticket.status);
            setPriority(ticket.priority);
            setAssignee(ticket.assignee?._id || '');
            fetchComments();
        }
    }, [ticket]);

    useEffect(() => {
        if (isCommentsModalOpen || comments.length > 0) {
            setTimeout(() => {
                commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    }, [comments, isCommentsModalOpen]);

    const fetchComments = async () => {
        if (!ticket) return;
        setLoadingComments(true);
        try {
            const res = await api.get(`/api/comments/${ticket._id}`);
            setComments(res.data.data);
        } catch (err) {
            console.error('Failed to fetch comments', err);
        } finally {
            setLoadingComments(false);
        }
    };

    useEffect(() => {
        if (!socket || !ticket) return;

        const handleCommentCreated = (comment: any) => {
            if (String(comment.ticketId) === String(ticket._id)) {
                setComments(prev => {
                    // Avoid duplicates if already added (unlikely but safe)
                    if (prev.some(c => c._id === comment._id)) return prev;
                    return [...prev, comment];
                });
            }
        };

        const handleTicketUpdated = (updatedTicket: any) => {
            if (updatedTicket._id === ticket._id) {
                setStatus(updatedTicket.status);
                setPriority(updatedTicket.priority);
                setAssignee(updatedTicket.assignee?._id || '');
                if (onUpdate) onUpdate(updatedTicket);
            }
        };

        socket.on('comment_created', handleCommentCreated);
        socket.on('ticket_updated', handleTicketUpdated);

        return () => {
            socket.off('comment_created', handleCommentCreated);
            socket.off('ticket_updated', handleTicketUpdated);
        };
    }, [socket, ticket]);


    const handleStatusChange = async (newStatus: string) => {
        const oldStatus = status;
        setStatus(newStatus);
        try {
            await api.patch(`/api/tickets/${ticket._id}/status`, { status: newStatus });
            toast.success(`Status updated to ${newStatus}`);
        } catch (err) {
            toast.error('Failed to update status');
            setStatus(oldStatus);
        }
    };

    const handleUpdateTicket = async (updates: any) => {
        try {
            await api.patch(`/api/tickets/${ticket._id}`, updates);
        } catch (err) {
            toast.error('Failed to update ticket');
        }
    };

    const handlePostComment = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!newComment.trim() || isPosting) return;

        setIsPosting(true);
        try {
            await api.post('/api/comments', {
                ticketId: ticket._id,
                message: newComment,
                attachments: commentAttachments
            });
            setNewComment('');
            setCommentAttachments([]);
        } catch (err) {
            toast.error('Failed to post comment');
        } finally {
            setIsPosting(false);
        }
    };

    const handleCommentFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        setIsUploading(true);
        try {
            const uploadPromises = files.map(f => uploadToCloudinary(f));
            const urls = await Promise.all(uploadPromises);
            setCommentAttachments(prev => [...prev, ...urls]);
            toast.success('Images attached to comment');
        } catch (err) {
            toast.error('Failed to upload images');
        } finally {
            setIsUploading(false);
        }
    };

    if (!isOpen || !ticket) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-6xl max-h-[95vh] rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden animate-in zoom-in-95 duration-200">

                {/* Main Content */}
                <div className="flex-1 flex flex-col p-6 md:p-8 overflow-y-auto border-r border-slate-100 bg-white custom-scrollbar">
                    <header className="mb-8 pr-12 md:pr-0">
                        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">
                            <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 shadow-sm">{ticket.type || 'Task'}</span>
                            <span className="opacity-40">/</span>
                            <span>{ticket.key || ticket._id.slice(-6)}</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight leading-tight">{ticket.title}</h2>
                    </header>

                    <section className="mb-10">
                        <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-500 mb-4">Description</h3>
                        <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 min-h-[120px] mb-6">
                            <p className="text-slate-700 font-medium leading-relaxed max-w-none">
                                {ticket.description || 'Provide a detailed description to help your team understand this issue.'}
                            </p>
                        </div>

                        {ticket.attachments && ticket.attachments.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                                {ticket.attachments.map((url: string, i: number) => (
                                    <div key={i} className="aspect-square rounded-2xl overflow-hidden border-2 border-slate-100 shadow-sm cursor-zoom-in hover:scale-[1.02] transition-transform">
                                        <img src={url} alt="Attachment" className="w-full h-full object-cover" onClick={() => window.open(url, '_blank')} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Comments Section */}
                    <div className="mt-8">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-500">Comments</h3>
                                <span className="px-2 py-0.5 bg-slate-100 rounded-full text-[10px] font-black text-slate-400">{comments.length}</span>
                            </div>
                            <button
                                onClick={() => setIsCommentsModalOpen(true)}
                                className="text-[10px] font-black uppercase tracking-wider text-primary hover:text-primary/80 transition-all flex items-center gap-1.5 px-3 py-1.5 hover:bg-primary/5 rounded-lg"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                                View All
                            </button>
                        </div>

                        <div className="space-y-6 mb-8">
                            {loadingComments ? (
                                <div className="space-y-4">
                                    {[1, 2].map(i => <div key={i} className="h-20 bg-slate-50 rounded-2xl animate-pulse" />)}
                                </div>
                            ) : comments.length === 0 ? (
                                <div className="py-8 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest italic">Be the first to comment</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {comments.map((comment) => {
                                        const isCurrentUser = String(comment.userId?._id || comment.userId) === String(user?._id);
                                        let dateStr = 'just now';
                                        try { if (comment.createdAt) dateStr = formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true }); } catch (e) { }

                                        return (
                                            <div key={comment._id} className={`flex gap-3 ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
                                                <UserAvatar
                                                    name={comment.userId?.name || 'Unknown'}
                                                    avatar={comment.userId?.avatar}
                                                    size="sm"
                                                    className={`${isCurrentUser ? 'bg-primary text-white' : ''}`}
                                                />
                                                <div className={`flex flex-col max-w-[85%] ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                                                    <div className="flex items-center gap-2 mb-1 px-1">
                                                        {!isCurrentUser && <span className="font-bold text-slate-700 text-[11px]">{comment.userId?.name}</span>}
                                                        <span className="text-[9px] font-bold text-slate-400">{dateStr}</span>
                                                    </div>
                                                    <div className={`px-5 py-3 rounded-2xl text-sm font-semibold leading-relaxed border-2 shadow-sm transition-all ${isCurrentUser
                                                        ? 'bg-primary text-white border-primary rounded-tr-none shadow-primary/20'
                                                        : 'bg-white text-slate-700 border-slate-200 rounded-tl-none'
                                                        }`}>
                                                        {comment.message}
                                                        {comment.attachments && comment.attachments.length > 0 && (
                                                            <div className="mt-3 grid grid-cols-1 gap-2">
                                                                {comment.attachments.map((url: string, i: number) => (
                                                                    <img key={i} src={url} alt="Comment attachment" className="max-w-[300px] max-h-64 object-contain rounded-xl border border-white/20 shadow-sm cursor-zoom-in" onClick={() => window.open(url, '_blank')} />
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                            <div ref={commentsEndRef} />
                        </div>

                        <form
                            onSubmit={handlePostComment}
                            className="flex gap-4 p-4 bg-white border-2 border-slate-200 rounded-2xl shadow-md focus-within:border-primary/40 transition-all mb-4"
                        >
                            <div className="flex-1">
                                <textarea
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                                            handlePostComment();
                                        }
                                    }}
                                    placeholder="Type your comment here... (Ctrl + Enter to send)"
                                    className="w-full bg-transparent border-none text-slate-800 font-medium text-sm min-h-[60px] max-h-[200px] outline-none placeholder:text-slate-400 py-2 resize-none custom-scrollbar"
                                    rows={2}
                                />
                            </div>
                            <div className="flex items-end pb-1 pr-2 gap-2">
                                <button
                                    type="button"
                                    onClick={() => commentFileRef.current?.click()}
                                    disabled={isUploading}
                                    className="h-9 w-9 p-0 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors"
                                >
                                    {isUploading ? (
                                        <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h14a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    )}
                                </button>
                                <input type="file" ref={commentFileRef} className="hidden" accept="image/*" multiple onChange={handleCommentFileChange} />
                                <Button
                                    type="submit"
                                    disabled={(!newComment.trim() && commentAttachments.length === 0) || isPosting}
                                    className="bg-primary hover:bg-primary shadow-lg shadow-primary/20 h-9 w-9 p-0 rounded-xl transition-all active:scale-95 disabled:opacity-50"
                                >
                                    {isPosting ? (
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <svg className="w-4 h-4 text-white rotate-90" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
                                    )}
                                </Button>
                            </div>
                        </form>
                        {commentAttachments.length > 0 && (
                            <div className="flex gap-2 mb-4 p-2 bg-slate-50 rounded-xl border border-slate-100 overflow-x-auto">
                                {commentAttachments.map((url, i) => (
                                    <div key={i} className="relative w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden border border-slate-200">
                                        <img src={url} alt="Attached" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => setCommentAttachments(prev => prev.filter((_, idx) => idx !== i))}
                                            className="absolute inset-0 bg-red-500/80 text-white flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                                        >
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Sidebar Details */}
            <div className="w-full md:w-[360px] bg-white flex flex-col h-full border-l border-slate-100 overflow-hidden shrink-0 relative z-10">
                {/* Fixed Header */}
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-20">
                    <div className="flex gap-1">
                        <Button size="sm" variant="ghost" className="w-8 h-8 p-0 rounded-lg hover:bg-slate-100 text-slate-400 group"><svg className="w-4 h-4 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg></Button>
                        <Button size="sm" variant="ghost" className="w-8 h-8 p-0 rounded-lg hover:bg-slate-100 text-slate-400 group"><svg className="w-4 h-4 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg></Button>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center hover:bg-slate-200 rounded-lg transition-all text-slate-400 hover:text-slate-600" aria-label="Close">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-9 custom-scrollbar bg-slate-50/30">
                    <section className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
                            Status & Priority
                        </h3>
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter ml-1">Current Workflow State</span>
                                <div className="relative group">
                                    <select
                                        value={status}
                                        onChange={(e) => handleStatusChange(e.target.value)}
                                        className={`w-full appearance-none px-4 py-3.5 rounded-2xl font-black text-xs tracking-tight border-2 transition-all cursor-pointer ${status === 'Done' ? 'bg-green-50 border-green-200 text-green-700' :
                                            status === 'In Progress' ? 'bg-blue-50 border-blue-200 text-blue-700' :
                                                'bg-white border-slate-100 text-slate-700 hover:border-slate-200 shadow-sm'
                                            }`}
                                    >
                                        <option value="To Do">To Do</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="In Review">In Review</option>
                                        <option value="Done">Done</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter ml-1">Priority Level</span>
                                <select
                                    value={priority}
                                    onChange={(e) => {
                                        setPriority(e.target.value);
                                        handleUpdateTicket({ priority: e.target.value });
                                    }}
                                    className="w-full bg-white px-4 py-3.5 rounded-2xl font-black text-xs border-2 border-slate-100 hover:border-slate-200 transition-all outline-none cursor-pointer shadow-sm"
                                >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                    <option value="Critical">Critical</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    <section className="animate-in fade-in slide-in-from-right-4 duration-300 delay-75">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
                            Ownership
                        </h3>
                        <div className="flex items-center gap-4 p-4 bg-white border-2 border-slate-100 rounded-[24px] shadow-sm hover:border-primary/20 transition-all group">
                            <UserAvatar
                                name={ticket.assignee?.name || 'Unassigned'}
                                avatar={ticket.assignee?.avatar}
                                size="md"
                                className="group-hover:scale-105 transition-transform"
                            />
                            <div className="flex-1 min-w-0">
                                <span className="block text-[9px] font-black text-slate-400 uppercase leading-none mb-1">Assignee</span>
                                <select
                                    value={assignee}
                                    onChange={(e) => {
                                        setAssignee(e.target.value);
                                        handleUpdateTicket({ assignee: e.target.value });
                                    }}
                                    className="w-full bg-transparent border-none outline-none font-black text-[13px] text-slate-700 cursor-pointer p-0"
                                >
                                    <option value="">Unassigned</option>
                                    {members.filter(m => {
                                        const mId = m.userId?._id || m.userId;
                                        return String(mId) !== String(user?._id);
                                    }).map((member: any) => (
                                        <option key={member.userId?._id || member.userId} value={member.userId?._id || member.userId}>
                                            {member.userId?.name || member.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </section>

                    <div className="space-y-4 pt-8 border-t border-slate-100 animate-in fade-in slide-in-from-right-4 duration-300 delay-100">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Reporter</span>
                            <div className="flex items-center gap-2">
                                <span className="text-[11px] font-black text-slate-800 tracking-tight">{ticket.reporter?.name}</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Created At</span>
                            <span className="text-[11px] font-bold text-slate-500">{formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}</span>
                        </div>
                    </div>

                    <section className="animate-in fade-in slide-in-from-right-4 duration-300 delay-150 pb-4">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-5 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
                            Activity Log
                        </h4>
                        <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-4">
                            <div className="max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                                <ActivityFeed ticketId={ticket._id} />
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            {/* Comments Dedicated Modal / Popup */}
            {isCommentsModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsCommentsModalOpen(false)} />

                    <div className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-white sticky top-0 z-10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-lg font-black text-slate-800 tracking-tight leading-none mb-1">Discussion Thread</h2>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{ticket.title}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsCommentsModalOpen(false)}
                                className="w-10 h-10 rounded-2xl hover:bg-slate-50 flex items-center justify-center text-slate-400 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        {/* Real Thread */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar bg-slate-50/30">
                            {loadingComments ? (
                                <div className="space-y-6">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="flex gap-4 animate-pulse">
                                            <div className="w-10 h-10 bg-slate-200 rounded-xl" />
                                            <div className="flex-1 space-y-2">
                                                <div className="h-4 bg-slate-200 rounded-lg w-1/4" />
                                                <div className="h-12 bg-slate-200 rounded-2xl w-full" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : comments.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                                    <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                                        <svg className="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" /></svg>
                                    </div>
                                    <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest">No conversation here yet</h3>
                                    <p className="text-xs font-bold text-slate-400 mt-2 italic">Be the one to break the silence!</p>
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    {comments.map((comment) => {
                                        const isCurrentUser = String(comment.userId?._id || comment.userId) === String(user?._id);
                                        let dateStr = 'just now';
                                        try { if (comment.createdAt) dateStr = formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true }); } catch (e) { }

                                        return (
                                            <div key={comment._id} className={`flex gap-4 ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
                                                <UserAvatar
                                                    name={comment.userId?.name || 'Unknown'}
                                                    avatar={comment.userId?.avatar}
                                                    size="md"
                                                    className={`${isCurrentUser ? 'bg-primary text-white' : ''}`}
                                                />
                                                <div className={`flex flex-col max-w-[85%] ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                                                    <div className="flex items-center gap-2 mb-1.5 px-2">
                                                        {!isCurrentUser && <span className="font-extrabold text-slate-800 text-xs tracking-tight">{comment.userId?.name}</span>}
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter opacity-60">{dateStr}</span>
                                                    </div>
                                                    <div className={`px-6 py-4 rounded-3xl text-sm font-semibold leading-relaxed border-2 shadow-sm transition-all min-w-[160px] ${isCurrentUser
                                                        ? 'bg-primary text-white border-primary rounded-tr-none shadow-primary/20'
                                                        : 'bg-white text-slate-700 border-slate-200 rounded-tl-none'
                                                        }`}>
                                                        {comment.message}
                                                        {comment.attachments && comment.attachments.length > 0 && (
                                                            <div className="mt-4 flex flex-wrap gap-3">
                                                                {comment.attachments.map((url: string, i: number) => (
                                                                    <img key={i} src={url} alt="Comment attachment" className="max-w-[400px] max-h-80 object-contain rounded-2xl border border-white/20 shadow-sm cursor-zoom-in hover:opacity-90 transition-opacity" onClick={() => window.open(url, '_blank')} />
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div ref={commentsEndRef} />
                                </div>
                            )}
                        </div>

                        {/* Input Area At Bottom of Modal */}
                        <div className="p-8 bg-white border-t border-slate-50">
                            <form
                                onSubmit={handlePostComment}
                                className="flex gap-4 p-4 bg-slate-50 border-2 border-slate-200 rounded-[24px] focus-within:border-primary/40 focus-within:bg-white transition-all shadow-inner"
                            >
                                <div className="flex-1">
                                    <textarea
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                                                handlePostComment();
                                            }
                                        }}
                                        placeholder="Type a message... (Ctrl + Enter to send)"
                                        className="w-full bg-transparent border-none text-slate-800 font-semibold text-sm min-h-[44px] max-h-[160px] outline-none placeholder:text-slate-400 py-3 resize-none custom-scrollbar"
                                        rows={1}
                                    />
                                </div>
                                <div className="flex items-end pb-1.5 pr-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => popupCommentFileRef.current?.click()}
                                        disabled={isUploading}
                                        className="h-11 w-11 flex items-center justify-center text-slate-400 hover:bg-white hover:text-primary transition-all rounded-2xl"
                                    >
                                        {isUploading ? (
                                            <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                                        ) : (
                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h14a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        )}
                                    </button>
                                    <input type="file" ref={popupCommentFileRef} className="hidden" accept="image/*" multiple onChange={handleCommentFileChange} />
                                    <Button
                                        type="submit"
                                        disabled={(!newComment.trim() && commentAttachments.length === 0) || isPosting}
                                        className="bg-primary hover:bg-primary shadow-xl shadow-primary/30 h-11 w-11 p-0 rounded-2xl transition-all active:scale-90 disabled:opacity-50"
                                    >
                                        {isPosting ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        ) : (
                                            <svg className="w-5 h-5 text-white rotate-90" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
                                        )}
                                    </Button>
                                </div>
                            </form>
                            {commentAttachments.length > 0 && (
                                <div className="flex gap-3 mt-4 p-3 bg-slate-100 rounded-2xl border border-slate-200 overflow-x-auto">
                                    {commentAttachments.map((url, i) => (
                                        <div key={i} className="relative w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden border-2 border-white shadow-sm">
                                            <img src={url} alt="Attached" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => setCommentAttachments(prev => prev.filter((_, idx) => idx !== i))}
                                                className="absolute inset-0 bg-red-500/80 text-white flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
