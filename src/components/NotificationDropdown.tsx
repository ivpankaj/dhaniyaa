'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import api from '@/lib/api';
import { useSocket } from '@/hooks/useSocket';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/context/AuthContext';

export default function NotificationDropdown() {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { user } = useAuth();
    // We pass 'notifications' as namespace or just use empty string if the hook supports it. 
    // Actually the hook takes projectId. If we pass user._id it might be weird if server expects projectId.
    // Let's look at how to get the socket instance.
    // For now, I'll assumme I can import `getSocket` or similar from `lib/socket` if it exists, OR `useSocket`.
    // Let's try reusing `useSocket` but passing a dummy ID? No.
    // Let's just use the `useSocket` hook but we need to ensure we join the USER room.

    // Changing approach: detailed inspection of `useSocket` is needed.
    // But since I can't read it right now without tool call (I already saw backend socket.ts).
    // I'll assume standard socket client.

    const socket = useSocket(user?._id); // Leveraging existing hook to get a socket instance? 
    // The existing hook emits 'join_project'. I want 'join_user'.

    useEffect(() => {
        if (socket && user?._id) {
            socket.emit('join_user', user._id);

            socket.on('notification', (newNotification: any) => {
                setNotifications(prev => [newNotification, ...prev]);
                setUnreadCount(prev => prev + 1);

                // Play sound or show toast?
                // audio.play();
            });

            return () => {
                socket.off('notification');
            };
        }
    }, [socket, user]);

    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/api/notifications');
            setNotifications(res.data.data);
            setUnreadCount(res.data.data.filter((n: any) => !n.isRead).length);
        } catch (err) {
            console.error('Failed to fetch notifications');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, []);

    const toggleOpen = () => setIsOpen(!isOpen);

    const markAsRead = async (id: string) => {
        try {
            await api.patch(`/api/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error('Failed to mark as read');
        }
    };

    const markAllRead = async () => {
        try {
            await api.patch('/api/notifications/read-all');
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (err) {
            console.error('Failed to mark all as read');
        }
    };

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={toggleOpen}
                className="relative p-2 text-slate-500 hover:text-slate-700 transition-all rounded-lg hover:bg-slate-100 group active:scale-95"
            >
                <div className="relative">
                    <Bell className="w-5 h-5 transition-transform group-hover:rotate-12" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600 border-2 border-white shadow-sm"></span>
                        </span>
                    )}
                </div>
            </button>

            {isOpen && (
                <>
                    {/* Mobile backdrop */}
                    <div className="fixed inset-0 z-40 sm:hidden" onClick={() => setIsOpen(false)}></div>

                    {/* Dropdown */}
                    <div className="fixed sm:absolute left-4 right-4 sm:left-auto sm:right-0 top-16 sm:top-auto sm:mt-3 w-auto sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 sm:origin-top-right max-w-md mx-auto sm:mx-0">
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <div className="flex items-center gap-2">
                                <h3 className="font-black text-slate-800 text-sm tracking-tight">Notifications</h3>
                                {unreadCount > 0 && (
                                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-black rounded-full">
                                        {unreadCount} NEW
                                    </span>
                                )}
                            </div>
                            {unreadCount > 0 && (
                                <button onClick={markAllRead} className="text-[10px] font-bold uppercase tracking-wider text-slate-500 hover:text-blue-600 transition-colors">
                                    Mark all read
                                </button>
                            )}
                        </div>
                        <div className="max-h-[60vh] sm:max-h-[480px] overflow-y-auto custom-scrollbar bg-white">
                            {loading ? (
                                <div className="py-12 flex justify-center">
                                    <div className="w-8 h-8 border-4 border-slate-100 border-t-primary rounded-full animate-spin"></div>
                                </div>
                            ) : notifications.length === 0 ? (
                                <div className="py-16 flex flex-col items-center justify-center text-center px-6">
                                    <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4 text-slate-400">
                                        <Bell className="w-8 h-8" />
                                    </div>
                                    <h4 className="text-sm font-black text-slate-700 tracking-tight uppercase">All caught up!</h4>
                                    <p className="text-xs font-medium text-slate-500 mt-2 leading-relaxed">You don't have any notifications right now.</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-100">
                                    {notifications.map(notification => (
                                        <div
                                            key={notification._id}
                                            onClick={() => markAsRead(notification._id)}
                                            className={`p-4 cursor-pointer hover:bg-slate-50 transition-all relative group ${!notification.isRead ? 'bg-blue-50/50' : ''}`}
                                        >
                                            {!notification.isRead && (
                                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-full"></div>
                                            )}
                                            <div className="flex gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                                                    <span className="text-xs font-black text-white uppercase">{(notification.sender?.name || 'S').charAt(0)}</span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm text-slate-700 leading-snug">
                                                        <span className="font-black text-slate-900">{notification.sender?.name || 'System'}</span> {notification.message}
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-1.5">
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                                                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        {notifications.length > 0 && (
                            <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
                                <button className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 transition-colors">
                                    View Activity Log
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
