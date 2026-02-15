'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import CreateSprintModal from '@/components/CreateSprintModal';
import TicketDetailModal from '@/components/TicketDetailModal';
import SprintDetailModal from '@/components/SprintDetailModal';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

import { useAuth } from '@/context/AuthContext';
import { ConfirmationModal } from '@/components/ConfirmationModal';

export default function BacklogPage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const { user } = useAuth();
    const [project, setProject] = useState<any>(null);
    const [sprints, setSprints] = useState<any[]>([]);
    const [allTickets, setAllTickets] = useState<any[]>([]);
    const [selectedTicket, setSelectedTicket] = useState<any>(null);
    const [selectedSprintForDetails, setSelectedSprintForDetails] = useState<any>(null);
    const [isSprintModalOpen, setIsSprintModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [projectRes, sprintsRes, ticketsRes] = await Promise.all([
                api.get(`/api/projects/${params.id}`),
                api.get(`/api/sprints?projectId=${params.id}`),
                api.get(`/api/tickets?projectId=${params.id}`),
            ]);
            setProject(projectRes.data.data);
            setSprints(sprintsRes.data.data);
            setAllTickets(ticketsRes.data.data);
        } catch (err) {
            console.error('Failed to fetch backlog data');
            toast.error('Failed to load backlog');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (params.id) fetchData();
    }, [params.id]);


    const [confirmationModal, setConfirmationModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
        variant?: 'danger' | 'warning' | 'info';
        confirmText?: string;
    }>({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { },
    });

    const handleSprintCreated = (newSprint: any) => {
        setSprints([...sprints, newSprint]);
    };

    const handleDeleteSprint = (sprintId: string) => {
        setConfirmationModal({
            isOpen: true,
            title: 'Delete Cycle',
            message: 'Are you sure you want to delete this cycle? Tickets will be returned to the unscheduled list.',
            variant: 'danger',
            onConfirm: async () => {
                try {
                    await api.delete(`/api/sprints/${sprintId}`);
                    toast.success('Cycle deleted successfully');
                    fetchData();
                } catch (err: any) {
                    toast.error(err.response?.data?.message || 'Failed to delete cycle');
                }
            }
        });
    };


    const onDragEnd = async (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const sprintId = destination.droppableId === 'BACKLOG' ? null : destination.droppableId;

        // Optimistic update
        const movedTicket = allTickets.find(t => t._id === draggableId);
        if (movedTicket) {
            const updatedTickets = allTickets.map(t =>
                t._id === draggableId ? { ...t, sprintId } : t
            );
            setAllTickets(updatedTickets);
        }

        try {
            await api.patch(`/api/tickets/${draggableId}`, { sprintId });
            toast.success('Ticket moved successfully');
            // Background refresh to ensure consistency
            fetchData();
        } catch (err) {
            toast.error('Failed to move ticket');
            // Revert on failure (or just re-fetch)
            fetchData();
        }
    };

    const handleStartSprint = async (sprintId: string) => {
        try {
            await api.patch(`/api/sprints/${sprintId}`, { status: 'ACTIVE' });
            fetchData();
            toast.success('Cycle started!');
        } catch (err) {
            toast.error('Failed to start cycle');
        }
    };

    const handleCompleteSprint = (sprintId: string) => {
        setConfirmationModal({
            isOpen: true,
            title: 'Complete Cycle',
            message: 'Are you sure you want to complete this cycle? Incomplete tickets will be returned to the unscheduled list.',
            variant: 'warning',
            confirmText: 'Complete',
            onConfirm: async () => {
                try {
                    await api.patch(`/api/sprints/${sprintId}/complete`);
                    fetchData();
                    toast.success('Cycle completed!');
                } catch (err) {
                    toast.error('Failed to complete cycle');
                }
            }
        });
    };


    const backlogTickets = allTickets.filter(t => !t.sprintId);

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground animate-pulse">Loading Planner...</p>
        </div>
    );

    return (
        <div className="flex flex-col h-screen bg-[#F4F5F7]">
            {/* Header */}
            <header className="h-14 bg-white border-b border-border flex items-center px-6 shrink-0 z-20">
                <button
                    onClick={() => router.push(`/projects/${params.id}`)}
                    className="p-2 hover:bg-slate-100 rounded-md mr-4 text-slate-500 transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </button>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-white font-black text-sm shadow-sm">
                        {project?.name.charAt(0).toUpperCase() || 'P'}
                    </div>
                    <div>
                        <h1 className="text-sm font-bold tracking-tight">{project?.name || 'Project'}</h1>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{project?.type || 'SOFTWARE PROJECT'}</p>
                    </div>
                </div>
                <div className="ml-auto flex items-center gap-2">
                    <button
                        onClick={() => router.push(`/projects/${params.id}`)}
                        className="px-4 py-1.5 text-xs font-bold hover:bg-slate-100 rounded transition-colors border border-transparent hover:border-border"
                    >
                        Task Board
                    </button>
                    <button className="px-4 py-1.5 text-xs font-bold bg-primary text-white rounded shadow-sm">
                        Planner
                    </button>
                </div>
            </header>

            <div className="flex-1 overflow-auto custom-scrollbar p-1 md:p-8">
                <div className="max-w-6xl mx-auto">
                    <header className="flex justify-between items-end mb-6 md:mb-10 px-2 md:px-0">
                        <div>
                            <nav className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1 opacity-60">Planning</nav>
                            <h1 className="text-2xl md:text-3xl font-black tracking-tight">Project Plan</h1>
                        </div>
                        <Button
                            onClick={() => setIsSprintModalOpen(true)}
                            className="bg-primary hover:shadow-lg active:scale-95 transition-all font-bold px-4 md:px-6 text-xs md:text-sm"
                        >
                            Create Cycle
                        </Button>
                    </header>

                    <DragDropContext onDragEnd={onDragEnd}>
                        <div className="space-y-6 md:space-y-12 pb-20">
                            {/* Planned Sprints */}
                            {sprints.filter(s => s.status !== 'COMPLETED').map((sprint) => {
                                const isCreator = String(sprint.createdBy?._id || sprint.createdBy) === String(user?._id);
                                return (
                                    <Droppable key={sprint._id} droppableId={sprint._id}>
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}
                                                className={`
                                            bg-white rounded-2xl border-2 transition-all duration-300 overflow-hidden
                                            ${sprint.status === 'ACTIVE' ? 'border-primary shadow-xl ring-4 ring-primary/5' : 'border-border shadow-sm hover:border-slate-300'}
                                            ${snapshot.isDraggingOver ? 'bg-slate-50 ring-2 ring-primary/20' : ''}
                                        `}
                                            >
                                                <div className={`p-4 flex items-center justify-between border-b border-border ${sprint.status === 'ACTIVE' ? 'bg-primary/[0.03]' : 'bg-slate-50'}`}>
                                                    <div className="flex flex-col">
                                                        <div className="flex items-center gap-3">
                                                            <h3 className="font-black text-slate-800 tracking-tight text-sm md:text-base">{sprint.name}</h3>
                                                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border tracking-widest uppercase ${sprint.status === 'ACTIVE' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-400 border-slate-200'}`}>
                                                                {sprint.status}
                                                            </span>
                                                        </div>
                                                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
                                                            {format(new Date(sprint.startDate), 'MMM d')} - {format(new Date(sprint.endDate), 'MMM d')}
                                                        </p>
                                                    </div>
                                                    <div className="flex gap-2 items-center">
                                                        {isCreator && (
                                                            <button
                                                                onClick={() => handleDeleteSprint(sprint._id)}
                                                                className="p-2 rounded-lg hover:bg-red-50 text-slate-300 hover:text-red-500 transition-colors mr-2"
                                                                title="Delete Cycle"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                            </button>
                                                        )}
                                                        {sprint.status === 'PLANNED' && (
                                                            <Button
                                                                size="sm"
                                                                className="bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all font-bold text-[10px] md:text-xs px-3 md:px-4 h-8"
                                                                onClick={() => handleStartSprint(sprint._id)}
                                                            >
                                                                Start Cycle
                                                            </Button>
                                                        )}
                                                        {sprint.status === 'ACTIVE' && (
                                                            <Button
                                                                size="sm"
                                                                className="bg-green-600 hover:bg-green-700 text-white transition-all font-bold text-[10px] md:text-xs px-3 md:px-4 h-8"
                                                                onClick={() => handleCompleteSprint(sprint._id)}
                                                            >
                                                                Complete Cycle
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="p-2 space-y-1 min-h-[60px] bg-white">
                                                    {allTickets.filter(t => t.sprintId === sprint._id).map((ticket, index) => (
                                                        <Draggable key={ticket._id} draggableId={ticket._id} index={index}>
                                                            {(provided, snapshot) => (
                                                                <div
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                    onClick={(e) => {
                                                                        if (!snapshot.isDragging) {
                                                                            setSelectedTicket(ticket);
                                                                        }
                                                                    }}
                                                                    style={{ ...provided.draggableProps.style }}
                                                                    className={`
                                                                    group bg-white p-3 rounded-lg flex justify-between items-center cursor-move border transition-all
                                                                    ${snapshot.isDragging ? 'shadow-lg border-primary z-50 rotate-1' : 'hover:bg-slate-50 border-transparent hover:border-slate-200'}
                                                                `}
                                                                >
                                                                    <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                                                                        <div className={`w-1.5 h-6 shrink-0 rounded-full ${ticket.priority === 'High' || ticket.priority === 'Critical' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                                                                        <span className="text-xs md:text-sm font-bold text-slate-700 truncate group-hover:text-primary transition-colors">{ticket.title}</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-2 md:gap-4 shrink-0 ml-2">
                                                                        {ticket.assignee && (
                                                                            <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-primary text-white flex items-center justify-center text-[9px] md:text-[10px] font-black shadow-sm ring-2 ring-white" title={ticket.assignee.name || 'Unassigned'}>
                                                                                {(ticket.assignee.name || '?').charAt(0).toUpperCase()}
                                                                            </div>
                                                                        )}
                                                                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter hidden sm:inline-block ${ticket.status === 'Done' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>{ticket.status}</span>
                                                                        <span className="text-[9px] font-bold text-slate-300 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">#{ticket._id.slice(-4)}</span>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </Draggable>
                                                    ))}
                                                    {provided.placeholder}
                                                    {allTickets.filter(t => t.sprintId === sprint._id).length === 0 && (
                                                        <div className="py-8 text-center border-2 border-dashed border-slate-100 rounded-xl m-2">
                                                            <p className="text-[10px] text-slate-300 font-black uppercase tracking-[0.2em]">Drag tickets here to plan</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </Droppable>
                                );
                            })}

                            {/* Backlog Section */}
                            <Droppable droppableId="BACKLOG">
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className={`
                                        bg-white rounded-2xl border border-border shadow-sm overflow-hidden transition-colors
                                        ${snapshot.isDraggingOver ? 'bg-slate-50 ring-2 ring-slate-200' : ''}
                                    `}
                                    >
                                        <div className="p-4 bg-slate-50 border-b border-border flex justify-between items-center">
                                            <div>
                                                <h3 className="font-black text-slate-800 tracking-tight">Unscheduled Tasks</h3>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{backlogTickets.length} Issues</p>
                                            </div>
                                        </div>
                                        <div className="p-2 space-y-1 min-h-[100px]">
                                            {backlogTickets.map((ticket, index) => (
                                                <Draggable key={ticket._id} draggableId={ticket._id} index={index}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            onClick={(e) => {
                                                                if (!snapshot.isDragging) {
                                                                    setSelectedTicket(ticket);
                                                                }
                                                            }}
                                                            style={{ ...provided.draggableProps.style }}
                                                            className={`
                                                                group bg-white p-3 rounded-lg flex justify-between items-center cursor-move border transition-all
                                                                ${snapshot.isDragging ? 'shadow-lg border-primary z-50 rotate-1' : 'hover:bg-slate-50 border-transparent hover:border-slate-200'}
                                                            `}
                                                        >
                                                            <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                                                                <div className={`w-1.5 h-6 shrink-0 rounded-full ${ticket.priority === 'High' || ticket.priority === 'Critical' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                                                                <span className="text-xs md:text-sm font-bold text-slate-700 truncate group-hover:text-primary transition-colors">{ticket.title}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2 md:gap-4 shrink-0 ml-2">
                                                                {ticket.assignee && (
                                                                    <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-primary text-white flex items-center justify-center text-[9px] md:text-[10px] font-black shadow-sm ring-2 ring-white" title={ticket.assignee.name}>
                                                                        {ticket.assignee.name.charAt(0).toUpperCase()}
                                                                    </div>
                                                                )}
                                                                <span className="text-[9px] font-bold text-slate-300 group-hover:text-slate-500 transition-colors">#{ticket.key || ticket._id.slice(-4)}</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                            {backlogTickets.length === 0 && (
                                                <div className="py-12 text-center text-slate-400">
                                                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 opacity-50">
                                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </div>
                                                    <p className="text-xs font-bold uppercase tracking-widest opacity-60">No unscheduled tasks</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </Droppable>

                            {/* Completed Sprints Section */}
                            {sprints.filter(s => s.status === 'COMPLETED').length > 0 && (
                                <div className="pt-8">
                                    <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-6 flex items-center gap-3">
                                        <span className="w-12 h-[1px] bg-slate-200"></span>
                                        Completed Cycles
                                        <span className="w-12 h-[1px] bg-slate-200"></span>
                                    </h2>
                                    <div className="space-y-4 opacity-100 transition-opacity">
                                        {sprints.filter(s => s.status === 'COMPLETED').map((sprint) => (
                                            <div
                                                key={sprint._id}
                                                onClick={() => setSelectedSprintForDetails(sprint)}
                                                className="bg-white/50 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-sm overflow-hidden grayscale-[0.5] opacity-80 hover:opacity-100 hover:grayscale-0 transition-all cursor-pointer hover:border-primary/30 group/sprint"
                                            >
                                                <div className="p-4 flex items-center justify-between border-b border-slate-50 bg-slate-50/30 group-hover/sprint:bg-primary/[0.02]">
                                                    <div>
                                                        <h3 className="font-bold text-slate-600 tracking-tight">{sprint.name}</h3>
                                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{format(new Date(sprint.startDate), 'MMM d')} - {format(new Date(sprint.endDate), 'MMM d')}</p>
                                                    </div>
                                                    <span className="text-[9px] font-black px-2 py-1 rounded-lg bg-slate-100 text-slate-400 border border-slate-200 uppercase tracking-widest">Completed</span>
                                                </div>
                                                <div className="p-2">
                                                    {allTickets.filter(t => t.sprintId === sprint._id).map(ticket => (
                                                        <div key={ticket._id} className="p-2 flex justify-between items-center opacity-70">
                                                            <span className="text-[11px] font-medium text-slate-500 line-through decoration-slate-300">{ticket.title}</span>
                                                            <span className="text-[9px] font-bold text-slate-300">#{ticket.key || ticket._id.slice(-4)}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </DragDropContext>
                </div>
            </div>

            <CreateSprintModal
                isOpen={isSprintModalOpen}
                onClose={() => setIsSprintModalOpen(false)}
                projectId={params.id}
                onSprintCreated={handleSprintCreated}
            />

            <TicketDetailModal
                isOpen={!!selectedTicket}
                onClose={() => setSelectedTicket(null)}
                ticket={selectedTicket}
                members={project?.members || []}
                projectId={params.id}
                onUpdate={fetchData}
            />

            <SprintDetailModal
                isOpen={!!selectedSprintForDetails}
                onClose={() => setSelectedSprintForDetails(null)}
                sprint={selectedSprintForDetails}
            />
            <ConfirmationModal
                isOpen={confirmationModal.isOpen}
                onClose={() => setConfirmationModal(prev => ({ ...prev, isOpen: false }))}
                onConfirm={confirmationModal.onConfirm}
                title={confirmationModal.title}
                message={confirmationModal.message}
                variant={confirmationModal.variant}
                confirmText={confirmationModal.confirmText}
            />
        </div>
    );
}
