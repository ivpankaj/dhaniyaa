'use client';

import { DragDropContext, Droppable, Draggable, DroppableProvided, DroppableStateSnapshot, DraggableProvided, DraggableStateSnapshot } from '@hello-pangea/dnd';
import { useState, useEffect, useRef } from 'react';
import api from '@/lib/api';
import { useSocket } from '@/hooks/useSocket';

interface Ticket {
    _id: string;
    title: string;
    status: string;
    priority: string;
    type?: string;
    assignee?: { name: string; email: string };
}

const columns = {
    'To Do': { title: 'To Do', items: [] as Ticket[] },
    'In Progress': { title: 'In Progress', items: [] as Ticket[] },
    'In Review': { title: 'In Review', items: [] as Ticket[] },
    'Done': { title: 'Done', items: [] as Ticket[] },
};

export default function KanbanBoard({ projectId, sprintId, onTicketClick, searchQuery }: { projectId: string; sprintId?: string | null; onTicketClick: (ticket: any) => void; searchQuery?: string }) {
    const [boardData, setBoardData] = useState(columns);
    const [loading, setLoading] = useState(true);
    const socket = useSocket(projectId);
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const fetchTickets = async () => {
            setLoading(true);
            try {
                let url = `/api/tickets?projectId=${projectId}`;
                if (sprintId) {
                    url += `&sprintId=${sprintId}`;
                }

                const res = await api.get(url);
                const tickets = res.data.data;

                const newBoard = {
                    'To Do': { title: 'To Do', items: [] as any[] },
                    'In Progress': { title: 'In Progress', items: [] as any[] },
                    'In Review': { title: 'In Review', items: [] as any[] },
                    'Done': { title: 'Done', items: [] as any[] },
                };

                tickets.forEach((ticket: any) => {
                    if (newBoard[ticket.status as keyof typeof columns]) {
                        newBoard[ticket.status as keyof typeof columns].items.push(ticket);
                    }
                });
                setBoardData(newBoard);
            } catch (err) {
                console.error('Failed to fetch tickets', err);
            } finally {
                setLoading(false);
            }
        };

        if (projectId) fetchTickets();
    }, [projectId, sprintId]);

    useEffect(() => {
        if (!socket) return;

        socket.on('ticket_created', (ticket: Ticket) => {
            setBoardData(prev => {
                const newBoard = { ...prev };
                if (newBoard[ticket.status as keyof typeof columns]) {
                    newBoard[ticket.status as keyof typeof columns].items.push(ticket);
                }
                return JSON.parse(JSON.stringify(newBoard));
            });
        });

        socket.on('ticket_updated', (updatedTicket: Ticket) => {
            setBoardData(prev => {
                const newBoard = { ...prev };
                Object.keys(newBoard).forEach(key => {
                    newBoard[key as keyof typeof columns].items = newBoard[key as keyof typeof columns].items.filter(t => t._id !== updatedTicket._id);
                });

                if (newBoard[updatedTicket.status as keyof typeof columns]) {
                    newBoard[updatedTicket.status as keyof typeof columns].items.push(updatedTicket);
                }

                return JSON.parse(JSON.stringify(newBoard));
            });
        });

        return () => {
            socket.off('ticket_created');
            socket.off('ticket_updated');
        };
    }, [socket]);

    const onDragEnd = async (result: any) => {
        if (!result.destination) return;
        const { source, destination } = result;

        if (source.droppableId !== destination.droppableId) {
            const sourceColumn = boardData[source.droppableId as keyof typeof columns];
            const destColumn = boardData[destination.droppableId as keyof typeof columns];
            const sourceItems = [...sourceColumn.items];
            const destItems = [...destColumn.items];
            const [removed] = sourceItems.splice(source.index, 1);

            removed.status = destination.droppableId;
            destItems.splice(destination.index, 0, removed);

            setBoardData({
                ...boardData,
                [source.droppableId]: { ...sourceColumn, items: sourceItems },
                [destination.droppableId]: { ...destColumn, items: destItems },
            });

            try {
                await api.patch(`/api/tickets/${removed._id}/status`, {
                    status: destination.droppableId
                });
            } catch (err) {
                console.error('Failed to update status', err);
            }
        } else {
            const column = boardData[source.droppableId as keyof typeof columns];
            const copiedItems = [...column.items];
            const [removed] = copiedItems.splice(source.index, 1);
            copiedItems.splice(destination.index, 0, removed);
            setBoardData({
                ...boardData,
                [source.droppableId]: { ...column, items: copiedItems }
            });
        }
    };

    const handleDragStart = () => {
        // Clear any existing scroll interval
        if (scrollIntervalRef.current) {
            clearInterval(scrollIntervalRef.current);
            scrollIntervalRef.current = null;
        }
    };

    const handleDragUpdate = (update: any) => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const containerRect = container.getBoundingClientRect();

        // Get the draggable element's position
        const draggableId = update.draggableId;
        const draggableElement = document.querySelector(`[data-rbd-draggable-id="${draggableId}"]`);

        if (!draggableElement) return;

        const draggableRect = draggableElement.getBoundingClientRect();
        const scrollThreshold = 100; // pixels from edge to trigger scroll
        const scrollSpeed = 15; // pixels per interval

        // Clear existing interval
        if (scrollIntervalRef.current) {
            clearInterval(scrollIntervalRef.current);
            scrollIntervalRef.current = null;
        }

        // Check if near left edge
        if (draggableRect.left - containerRect.left < scrollThreshold) {
            scrollIntervalRef.current = setInterval(() => {
                if (container.scrollLeft > 0) {
                    container.scrollLeft -= scrollSpeed;
                } else if (scrollIntervalRef.current) {
                    clearInterval(scrollIntervalRef.current);
                    scrollIntervalRef.current = null;
                }
            }, 16); // ~60fps
        }
        // Check if near right edge
        else if (containerRect.right - draggableRect.right < scrollThreshold) {
            scrollIntervalRef.current = setInterval(() => {
                const maxScroll = container.scrollWidth - container.clientWidth;
                if (container.scrollLeft < maxScroll) {
                    container.scrollLeft += scrollSpeed;
                } else if (scrollIntervalRef.current) {
                    clearInterval(scrollIntervalRef.current);
                    scrollIntervalRef.current = null;
                }
            }, 16); // ~60fps
        }
    };

    // Cleanup scroll interval on unmount
    useEffect(() => {
        return () => {
            if (scrollIntervalRef.current) {
                clearInterval(scrollIntervalRef.current);
            }
        };
    }, []);

    const getPriorityColor = (p: string) => {
        switch (p) {
            case 'High': return 'text-red-600 bg-red-100';
            case 'Critical': return 'text-white bg-red-600';
            case 'Low': return 'text-green-600 bg-green-100';
            default: return 'text-blue-600 bg-blue-100';
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'Bug': return <span className="text-xs bg-red-500 text-white p-0.5 rounded shadow-sm">B</span>;
            case 'Story': return <span className="text-xs bg-green-500 text-white p-0.5 rounded shadow-sm">S</span>;
            default: return <span className="text-xs bg-blue-500 text-white p-0.5 rounded shadow-sm">T</span>;
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-full w-full gap-4">
                <div className="w-12 h-12 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest animate-pulse">Loading Board...</p>
            </div>
        );
    }

    // Filter board data for display
    const getDisplayedBoard = () => {
        if (!searchQuery?.trim()) return boardData;

        const q = searchQuery.toLowerCase();
        const newBoard = JSON.parse(JSON.stringify(boardData));

        Object.keys(newBoard).forEach(key => {
            newBoard[key].items = newBoard[key].items.filter((item: Ticket) =>
                item.title.toLowerCase().includes(q) ||
                item._id.toLowerCase().includes(q) ||
                item.assignee?.name.toLowerCase().includes(q)
            );
        });

        return newBoard;
    };

    const displayedBoard = getDisplayedBoard();
    const isDragDisabled = !!searchQuery?.trim();

    return (
        <div ref={containerRef} className="flex h-full overflow-x-auto p-3 md:p-6 gap-4 md:gap-6 select-none custom-scrollbar pb-10 bg-slate-50/20">
            <DragDropContext onDragEnd={onDragEnd} onDragStart={handleDragStart} onDragUpdate={handleDragUpdate}>
                {Object.entries(displayedBoard).map(([columnId, column]: [string, any]) => (
                    <div key={columnId} className="flex flex-col w-[280px] sm:w-[320px] bg-white rounded-2xl md:rounded-3xl p-4 md:p-5 shrink-0 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 h-full max-h-full">
                        <div className="flex justify-between items-center mb-6 px-1">
                            <h3 className="text-[12px] font-black tracking-[0.2em] uppercase text-slate-800 flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${columnId === 'To Do' ? 'bg-slate-300' :
                                    columnId === 'In Progress' ? 'bg-blue-500' :
                                        columnId === 'In Review' ? 'bg-purple-500' : 'bg-green-500'
                                    } shadow-sm`} />
                                {column.title}
                            </h3>
                            <span className="bg-slate-100/80 text-slate-500 px-2.5 py-1 rounded-xl text-[10px] font-black border border-slate-50">{column.items.length}</span>
                        </div>

                        <Droppable droppableId={columnId} isDropDisabled={isDragDisabled}>
                            {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className={`flex-1 space-y-3 p-1 rounded-2xl transition-colors duration-200 overflow-y-auto custom-scrollbar min-h-[150px] ${snapshot.isDraggingOver ? 'bg-blue-50/30 ring-2 ring-blue-200 ring-inset' : ''}`}
                                    style={{ minHeight: '200px' }}
                                >
                                    {column.items.map((ticket: Ticket, index: number) => (
                                        <Draggable key={ticket._id} draggableId={ticket._id} index={index} isDragDisabled={isDragDisabled}>
                                            {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    onClick={(e) => {
                                                        // Only trigger click if not dragging
                                                        if (!snapshot.isDragging) {
                                                            onTicketClick(ticket);
                                                        }
                                                    }}
                                                    className={`
                                                        bg-white p-5 rounded-[20px] border-2 border-slate-50 shadow-sm transition-all duration-300 cursor-pointer
                                                        ${snapshot.isDragging ? 'shadow-2xl -rotate-1 scale-[1.02] z-50 border-primary ring-4 ring-primary/5' : 'hover:shadow-lg hover:border-primary/20 hover:translate-y-[-2px]'}
                                                    `}
                                                >
                                                    <div className="flex items-start justify-between mb-3">
                                                        <p className="text-sm font-bold text-slate-800 leading-base flex-1">{ticket.title}</p>
                                                        {/* Drag handle */}
                                                        {!isDragDisabled && (
                                                            <div
                                                                {...provided.dragHandleProps}
                                                                className="ml-2 p-1 hover:bg-slate-100 rounded cursor-grab active:cursor-grabbing shrink-0"
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                                                                </svg>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex justify-between items-center bg-slate-50/50 p-2 rounded-xl border border-slate-100/50">
                                                        <div className="flex items-center gap-2">
                                                            {getTypeIcon(ticket.type || 'Task')}
                                                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg tracking-wide uppercase ${getPriorityColor(ticket.priority)}`}>
                                                                {ticket.priority}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[10px] font-black text-slate-300 mr-1 italic">#{ticket._id.slice(-4)}</span>
                                                            {ticket.assignee ? (
                                                                <div className="w-7 h-7 rounded-lg bg-primary text-white flex items-center justify-center text-[10px] font-black shadow-lg shadow-primary/20 ring-2 ring-white" title={ticket.assignee.name || 'Unassigned'}>
                                                                    {(ticket.assignee.name || '?').charAt(0).toUpperCase()}
                                                                </div>
                                                            ) : (
                                                                <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center opacity-40">
                                                                    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                                    </svg>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </div>
                ))}
            </DragDropContext>
        </div>
    );
}
