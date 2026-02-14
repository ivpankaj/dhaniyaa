'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell, CheckCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import { useSocket } from '@/hooks/useSocket';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/context/AuthContext';
import { UserAvatar } from './UserAvatar';

export default function NotificationDropdown() {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { user } = useAuth();
    const socket = useSocket(user?._id);

    useEffect(() => {
        if (socket && user?._id) {
            socket.emit('join_user', user._id);

            socket.on('notification', (newNotification: any) => {
                setNotifications(prev => [newNotification, ...prev]);
                setUnreadCount(prev => prev + 1);
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
        const interval = setInterval(fetchNotifications, 30000);
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
                className={`relative p-2.5 transition-all rounded-xl group active:scale-95 ${isOpen ? 'bg-primary/10 text-primary' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}
            >
                <div className="relative">
                    <Bell className={`w-5 h-5 transition-transform group-hover:rotate-12 ${isOpen ? 'fill-primary/20' : ''}`} />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border-2 border-white shadow-sm"></span>
                        </span>
                    )}
                </div>
            </button>

            {isOpen && (
                <>
                    {/* Mobile backdrop */}
                    <div className="fixed inset-0 z-40 sm:hidden bg-slate-900/20 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>

                    {/* Dropdown */}
                    <div className="fixed sm:absolute left-4 right-4 sm:left-auto sm:right-0 top-20 sm:top-auto sm:mt-4 w-auto sm:w-[420px] bg-white rounded-[24px] shadow-2xl shadow-slate-200 ring-1 ring-slate-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 sm:origin-top-right max-w-md mx-auto sm:mx-0">

                        {/* Header */}
                        <div className="px-6 py-4 border-b border-slate-50 flex justify-between items-center bg-white sticky top-0 z-10">
                            <div className="flex items-center gap-3">
                                <h3 className="font-extrabold text-slate-800 text-sm tracking-tight">Notifications</h3>
                                {unreadCount > 0 && (
                                    <span className="px-2.5 py-1 bg-primary/10 text-primary text-[10px] font-black rounded-full uppercase tracking-wider">
                                        {unreadCount} New
                                    </span>
                                )}
                            </div>
                            {unreadCount > 0 && (
                                <button onClick={markAllRead} className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-primary transition-colors hover:bg-slate-50 px-2 py-1 rounded-lg">
                                    <CheckCheck className="w-3.5 h-3.5" />
                                    Mark all read
                                </button>
                            )}
                        </div>

                        {/* List */}
                        <div className="max-h-[60vh] sm:max-h-[440px] overflow-y-auto custom-scrollbar bg-slate-50/30 p-2">
                            {loading ? (
                                <div className="py-16 flex flex-col items-center justify-center gap-3">
                                    <div className="w-8 h-8 border-4 border-slate-100 border-t-primary rounded-full animate-spin"></div>
                                </div>
                            ) : notifications.length === 0 ? (
                                <div className="py-20 flex flex-col items-center justify-center text-center px-6">
                                    <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center mb-4 text-slate-300">
                                        <Bell className="w-8 h-8" />
                                    </div>
                                    <h4 className="text-sm font-black text-slate-600 tracking-tight uppercase">No notifications</h4>
                                    <p className="text-xs font-medium text-slate-400 mt-1">You are all caught up!</p>
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    {notifications.map(notification => (
                                        <div
                                            key={notification._id}
                                            onClick={() => markAsRead(notification._id)}
                                            className={`p-4 cursor-pointer hover:bg-white transition-all duration-200 relative group rounded-2xl border border-transparent hover:border-slate-100 hover:shadow-sm ${!notification.isRead ? 'bg-white border-blue-100/50 shadow-sm' : ''}`}
                                        >
                                            {!notification.isRead && (
                                                <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-full"></div>
                                            )}
                                            <div className="flex gap-4 items-start pl-2">
                                                <UserAvatar
                                                    name={notification.sender?.name || 'System'}
                                                    avatar={notification.sender?.avatar}
                                                    size="md"
                                                    className={`shadow-sm ring-2 ring-white ${!notification.isRead ? 'ring-primary/10' : ''}`}
                                                />
                                                <div className="flex-1 min-w-0 pt-0.5">
                                                    <div className="text-xs md:text-sm text-slate-600 leading-snug font-medium">
                                                        <span className="font-black text-slate-800">{notification.sender?.name || 'System'}</span>
                                                        {' '}
                                                        <span className={!notification.isRead ? 'text-slate-700' : 'text-slate-500'}>{notification.message}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-100/50 px-1.5 py-0.5 rounded">
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

                        {/* Footer */}
                        <div className="p-3 bg-white border-t border-slate-50">
                            <Link
                                href="/notifications"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/5 transition-all w-full py-3 rounded-xl border border-dashed border-primary/20 hover:border-primary/50"
                            >
                                View all notifications
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
