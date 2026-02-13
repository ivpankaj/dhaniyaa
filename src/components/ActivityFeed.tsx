import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';

export default function ActivityFeed({ ticketId }: { ticketId: string }) {
    const [activities, setActivities] = useState<any[]>([]);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const res = await api.get(`/api/activities/${ticketId}`);
                setActivities(res.data.data);
            } catch (err) {
                console.error('Failed to fetch activities');
            }
        };
        fetchActivities();
    }, [ticketId]);

    if (activities.length === 0) {
        return <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest italic py-4">No recent activity detected.</p>;
    }

    return (
        <div className="space-y-4 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
            {activities.map((activity) => (
                <div key={activity._id} className="relative pl-8 animate-in fade-in slide-in-from-left-2 duration-300">
                    <div className="absolute left-0 top-1.5 w-[24px] h-[24px] rounded-full bg-white border-2 border-slate-100 flex items-center justify-center z-10 shadow-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/40"></div>
                    </div>
                    <div className="flex flex-col">
                        <p className="text-xs font-medium text-slate-600 leading-relaxed">
                            <span className="font-black text-slate-800 tracking-tight">{activity.userId?.name || 'System'}</span>{' '}
                            <span className="opacity-80">{activity.details || activity.action}</span>
                        </p>
                        <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">
                            {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}
