'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCheck, Bell } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import api from '@/lib/api';
import { UserAvatar } from '@/components/UserAvatar';
import { Button } from '@/components/ui/button';

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/api/notifications');
            setNotifications(res.data.data);
        } catch (err) {
            console.error('Failed to fetch notifications');
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id: string, isRead: boolean) => {
        if (isRead) return;
        try {
            await api.patch(`/api/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
        } catch (err) {
            console.error('Failed to mark as read');
        }
    };

    const markAllRead = async () => {
        try {
            await api.patch('/api/notifications/read-all');
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (err) {
            console.error('Failed to mark all as read');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/50 p-6 md:p-10">
            <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="p-2 hover:bg-slate-200 rounded-xl transition-colors text-slate-500">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Notifications</h1>
                            <p className="text-slate-500 font-medium text-sm">Stay updated with your team activity</p>
                        </div>
                    </div>
                    {notifications.length > 0 && notifications.some(n => !n.isRead) && (
                        <Button
                            onClick={markAllRead}
                            variant="outline"
                            className="gap-2 bg-white border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl"
                        >
                            <CheckCheck className="w-4 h-4" />
                            Mark all read
                        </Button>
                    )}
                </div>

                {/* List */}
                <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                    {loading ? (
                        <div className="py-20 flex flex-col items-center justify-center space-y-4">
                            <div className="w-10 h-10 border-4 border-slate-100 border-t-primary rounded-full animate-spin"></div>
                            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Loading updates...</p>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="py-32 flex flex-col items-center justify-center text-center px-6">
                            <div className="w-24 h-24 rounded-3xl bg-slate-50 flex items-center justify-center mb-6 text-slate-300">
                                <Bell className="w-10 h-10" />
                            </div>
                            <h3 className="text-lg font-black text-slate-700 tracking-tight mb-2">You're all caught up!</h3>
                            <p className="text-slate-400 font-medium">No new notifications to show right now.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {notifications.map((notification) => (
                                <div
                                    key={notification._id}
                                    onClick={() => markAsRead(notification._id, notification.isRead)}
                                    className={`p-6 flex gap-5 cursor-pointer hover:bg-slate-50/80 transition-all group relative ${!notification.isRead ? 'bg-blue-50/30' : ''}`}
                                >
                                    {!notification.isRead && (
                                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500"></div>
                                    )}

                                    <UserAvatar
                                        name={notification.sender?.name || 'System'}
                                        avatar={notification.sender?.avatar}
                                        size="md"
                                        className={`shadow-md ring-4 ring-white ${!notification.isRead ? 'ring-blue-50' : ''}`}
                                    />

                                    <div className="flex-1 min-w-0 pt-1">
                                        <div className="flex items-start justify-between gap-4 mb-2">
                                            <div className="text-sm md:text-base text-slate-600 leading-relaxed font-medium">
                                                <span className="font-black text-slate-900">{notification.sender?.name || 'System'}</span>
                                                {' '}
                                                {notification.message}
                                            </div>
                                            <span className="shrink-0 text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-100 px-2 py-1 rounded-lg whitespace-nowrap">
                                                {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                            </span>
                                        </div>
                                    </div>

                                    {!notification.isRead && (
                                        <div className="self-center">
                                            <div className="w-2.5 h-2.5 bg-blue-500 rounded-full shadow-lg shadow-blue-500/30"></div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
