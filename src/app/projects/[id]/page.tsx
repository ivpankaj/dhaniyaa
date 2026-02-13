'use client';

import { useState, useEffect } from 'react';
import KanbanBoard from '@/components/KanbanBoard';
import api from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';
import CreateTicketModal from '@/components/CreateTicketModal';
import TicketDetailModal from '@/components/TicketDetailModal';
import { InviteMemberModal } from '@/components/InviteMemberModal';
import { useAuth } from '@/context/AuthContext';
import { ProjectSettingsModal } from '@/components/ProjectSettingsModal';

export default function ProjectBoardPage() {
    const { user } = useAuth();
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const [project, setProject] = useState<any>(null);
    const [activeSprints, setActiveSprints] = useState<any[]>([]);
    const [selectedSprintId, setSelectedSprintId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState<any>(null);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const [projectRes, sprintsRes] = await Promise.all([
                    api.get(`/api/projects/${params.id}`),
                    api.get(`/api/sprints?projectId=${params.id}`)
                ]);
                setProject(projectRes.data.data);
                const actives = sprintsRes.data.data.filter((s: any) => s.status === 'ACTIVE');
                setActiveSprints(actives);

                // Default to first active sprint if none selected
                if (actives.length > 0 && !selectedSprintId) {
                    setSelectedSprintId(actives[0]._id);
                }
            } catch (err) {
                console.error('Failed to fetch project data');
            } finally {
                setLoading(false);
            }
        };
        if (params.id) fetchData();
    }, [params.id]);

    const handleCreateTicket = async (ticketData: any) => {
        await api.post('/api/tickets', {
            ...ticketData,
            organizationId: project.organizationId,
            sprintId: selectedSprintId
        });
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-screen bg-background text-foreground gap-4">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="font-bold text-sm uppercase tracking-widest opacity-50">Loading Project Board...</p>
        </div>
    );

    if (!project) return (
        <div className="flex flex-col items-center justify-center h-screen bg-background text-foreground">
            <h1 className="text-2xl font-bold mb-4">Project not found</h1>
            <button onClick={() => router.push('/dashboard')} className="text-primary hover:underline font-bold">Back to Dashboard</button>
        </div>
    );

    const currentSprint = activeSprints.find(s => s._id === selectedSprintId);

    return (
        <div className="flex flex-col h-screen bg-[#F4F5F7] text-foreground overflow-hidden">
            {/* Nav Header */}
            <header className="h-14 bg-white border-b border-border flex items-center px-6 shrink-0 z-20">
                <button
                    onClick={() => router.push('/dashboard')}
                    className="p-2 hover:bg-slate-100 rounded-md mr-4 text-slate-500 transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </button>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-white font-black text-sm shadow-sm">
                        {project.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h1 className="text-sm font-bold tracking-tight">{project.name}</h1>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{project.key || 'Software Project'}</p>
                    </div>
                </div>

                <div className="ml-auto flex items-center gap-1 sm:gap-2">
                    <button
                        onClick={() => router.push(`/projects/${project._id}/backlog`)}
                        className="px-2 sm:px-4 py-1.5 text-[10px] sm:text-xs font-bold hover:bg-slate-100 rounded transition-colors border border-transparent hover:border-border whitespace-nowrap"
                    >
                        Backlog
                    </button>
                    <button className="px-2 sm:px-4 py-1.5 text-[10px] sm:text-xs font-bold bg-primary text-white rounded shadow-sm hover:opacity-90 active:scale-95 transition-all whitespace-nowrap">
                        Board
                    </button>
                    <div className="hidden sm:block w-px h-4 bg-border mx-1"></div>
                    {(user?.role === 'OrganizationOwner' || project.createdBy === user?._id || project.members?.find((m: any) => m.userId?._id === user?._id && m.role === 'ProjectAdmin')) && (
                        <button
                            onClick={() => setIsSettingsModalOpen(true)}
                            className="p-1.5 sm:p-2 hover:bg-slate-100 rounded text-slate-500 transition-colors"
                            title="Settings"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.731 1.731 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </button>
                    )}
                </div>
            </header>

            {/* Board Header */}
            <div className="px-4 md:px-8 pt-6 md:pt-8 pb-4 shrink-0">
                <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
                    <div className="flex-1 min-w-0">
                        <h2 className="text-xl md:text-2xl font-extrabold tracking-tight mb-2 md:mb-1">Task Board</h2>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm font-medium">
                            {activeSprints.length > 0 ? (
                                <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar-hide max-w-full sm:max-w-[400px] lg:max-w-[600px] py-1">
                                    {activeSprints.map((sprint) => (
                                        <button
                                            key={sprint._id}
                                            onClick={() => setSelectedSprintId(sprint._id)}
                                            className={`
                                                flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all shrink-0
                                                ${selectedSprintId === sprint._id
                                                    ? 'bg-blue-50 text-blue-700 border-blue-100 shadow-sm'
                                                    : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'}
                                            `}
                                        >
                                            <span className={`w-1.5 h-1.5 rounded-full ${selectedSprintId === sprint._id ? 'bg-blue-500 animate-pulse' : 'bg-slate-300'}`}></span>
                                            <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider">{sprint.name}</span>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <span className="text-muted-foreground bg-slate-100 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">No active sprint</span>
                            )}
                            <div className="flex items-center gap-2">
                                <div className="flex -space-x-2">
                                    {(project.members || []).slice(0, 5).map((m: any, i: number) => (
                                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold text-primary shadow-sm" title={m.userId?.name || m.userId?.email}>
                                            {(m.userId?.name || '?').charAt(0).toUpperCase()}
                                        </div>
                                    ))}
                                    {project.members?.length > 5 && (
                                        <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400 shadow-sm">
                                            +{project.members.length - 5}
                                        </div>
                                    )}
                                </div>
                                {(user?.role === 'OrganizationOwner' || project.createdBy === user?._id || project.members?.find((m: any) => m.userId?._id === user?._id && m.role === 'ProjectAdmin')) && (
                                    <button
                                        onClick={() => setIsInviteModalOpen(true)}
                                        className="w-8 h-8 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary transition-all bg-white/50"
                                        title="Invite Member"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                placeholder="Search board..."
                                className="bg-white border border-border px-10 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-full sm:w-64 shadow-sm"
                            />
                            <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <button
                            onClick={() => setIsTicketModalOpen(true)}
                            className="bg-primary text-white px-5 py-2 rounded-xl font-black text-sm shadow-lg shadow-primary/20 hover:translate-y-[-1px] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                            disabled={!selectedSprintId}
                        >
                            Create Ticket
                        </button>
                    </div>
                </div>
            </div>

            {/* Board Context */}
            <main className="flex-1 overflow-hidden px-4">
                {selectedSprintId ? (
                    <KanbanBoard
                        projectId={params.id}
                        sprintId={selectedSprintId}
                        onTicketClick={(ticket) => setSelectedTicket(ticket)}
                    />
                ) : (
                    <div className="h-full mx-4 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-300 rounded-2xl bg-white/50 mb-4">
                        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <p className="font-bold text-sm mb-6">Start a sprint to enable the board view.</p>
                        <button
                            onClick={() => router.push(`/projects/${project._id}/backlog`)}
                            className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg hover:shadow-primary/30 transition-all"
                        >
                            Go to Backlog
                        </button>
                    </div>
                )}
            </main>

            {/* Modals */}
            <CreateTicketModal
                isOpen={isTicketModalOpen}
                onClose={() => setIsTicketModalOpen(false)}
                onCreate={handleCreateTicket}
                projectId={params.id}
                members={project.members || []}
            />

            <TicketDetailModal
                isOpen={!!selectedTicket}
                onClose={() => setSelectedTicket(null)}
                ticket={selectedTicket}
                members={project.members || []}
                projectId={params.id}
            />

            <InviteMemberModal
                isOpen={isInviteModalOpen}
                onClose={() => setIsInviteModalOpen(false)}
                type="project"
                id={params.id}
                onSuccess={() => {
                    // Refresh project data to show new member
                    api.get(`/api/projects/${params.id}`).then(res => setProject(res.data.data));
                }}
            />

            <ProjectSettingsModal
                isOpen={isSettingsModalOpen}
                onClose={() => setIsSettingsModalOpen(false)}
                projectId={params.id}
                project={project}
            />
        </div>
    );
}
