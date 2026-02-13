'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import CreateProjectModal from '@/components/CreateProjectModal';
import NotificationDropdown from '@/components/NotificationDropdown';
import CreateOrganizationModal from '@/components/CreateOrganizationModal';
import { InviteMemberModal } from '@/components/InviteMemberModal';
import { SettingsModal } from '@/components/SettingsModal';
import { ConfirmationModal } from '@/components/ConfirmationModal';

import { toast } from 'sonner';

export default function DashboardPage() {
    const { user, logout } = useAuth();


    const [confirmationModal, setConfirmationModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
    }>({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { },
    });

    const handleDeleteProject = (projectId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setConfirmationModal({
            isOpen: true,
            title: 'Delete Project',
            message: 'Are you sure you want to delete this project?',
            onConfirm: async () => {
                try {
                    await api.delete(`/api/projects/${projectId}`);
                    setProjects(prev => prev.filter(p => p._id !== projectId));
                    toast.success('Project deleted successfully');
                } catch (err: any) {
                    toast.error(err.response?.data?.message || 'Failed to delete project');
                }
            }
        });
    };

    const handleDeleteOrg = (orgId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setConfirmationModal({
            isOpen: true,
            title: 'Delete Organization',
            message: 'Are you sure you want to delete this organization? This will verify that you are the owner.',
            onConfirm: async () => {
                try {
                    await api.delete(`/api/organizations/${orgId}`);
                    const newOrgs = orgs.filter(o => o._id !== orgId);
                    setOrgs(newOrgs);
                    if (selectedOrgId === orgId) {
                        if (newOrgs.length > 0) {
                            setSelectedOrgId(newOrgs[0]._id);
                        } else {
                            setSelectedOrgId(null);
                            setViewMode('shared');
                        }
                    }
                    toast.success('Organization deleted successfully');
                } catch (err: any) {
                    toast.error(err.response?.data?.message || 'Failed to delete organization');
                }
            }
        });
    };


    const router = useRouter();
    const [orgs, setOrgs] = useState<any[]>([]);
    const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isOrgModalOpen, setIsOrgModalOpen] = useState(false);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [invitations, setInvitations] = useState<any[]>([]);
    const [inviteProject, setInviteProject] = useState<any>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'org' | 'shared'>('org');

    useEffect(() => {
        const fetchOrgs = async () => {
            try {
                const res = await api.get('/api/organizations');
                setOrgs(res.data.data);
                if (res.data.data.length > 0) {
                    setSelectedOrgId(res.data.data[0]._id);
                    setViewMode('org');
                } else {
                    // If no orgs, default to shared
                    setViewMode('shared');
                    setSelectedOrgId(null);
                }
            } catch (err) {
                console.error('Failed to fetch orgs');
                setLoading(false);
            }
        };

        const fetchInvitations = async () => {
            try {
                const res = await api.get('/api/invitations');
                setInvitations(res.data.data);
            } catch (err) {
                console.error('Failed to fetch invitations');
            }
        };

        fetchOrgs();
        fetchInvitations();
    }, []);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                let url = '/api/projects';
                if (viewMode === 'org' && selectedOrgId) {
                    url = `/api/projects?organizationId=${selectedOrgId}`;
                } else if (viewMode === 'shared') {
                    url = '/api/projects'; // Back-end handles "my projects" if no orgId
                } else {
                    return; // Should not happen ideally
                }

                const res = await api.get(url);
                setProjects(res.data.data);
            } catch (err) {
                console.error('Failed to fetch projects');
            } finally {
                setLoading(false);
            }
        };

        if (selectedOrgId || viewMode === 'shared') {
            setLoading(true);
            fetchProjects();
        }
    }, [selectedOrgId, viewMode]);

    const handleCreateProject = async (projectData: any) => {
        const res = await api.post('/api/projects', projectData);
        setProjects([...projects, res.data.data]);
    };

    const handleCreateOrg = async (orgData: any) => {
        const res = await api.post('/api/organizations', orgData);
        setOrgs([...orgs, res.data.data]);
        setSelectedOrgId(res.data.data._id);
        setViewMode('org');
    };

    const handleAcceptInvitation = async (id: string, projectId: string) => {
        try {
            await api.post(`/api/invitations/${id}/accept`);
            setInvitations(invitations.filter(i => i._id !== id));
            if (selectedOrgId || viewMode === 'shared') {
                // Refresh projects
                const url = (viewMode === 'org' && selectedOrgId) ? `/api/projects?organizationId=${selectedOrgId}` : '/api/projects';
                const res = await api.get(url);
                setProjects(res.data.data);
            }
        } catch (error) {
            console.error('Failed to accept invitation');
        }
    };

    const handleRejectInvitation = async (id: string) => {
        try {
            await api.post(`/api/invitations/${id}/reject`);
            setInvitations(invitations.filter(i => i._id !== id));
        } catch (error) {
            console.error('Failed to reject invitation');
        }
    };

    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden relative">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-sidebar text-sidebar-foreground flex flex-col shrink-0 overflow-hidden transition-transform duration-300 transform lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                <div className="p-6 flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded flex items-center justify-center shrink-0 shadow-sm transition-transform hover:scale-105">
                        <span className="text-sidebar font-black text-xl">D</span>
                    </div>
                    <h1 className="text-xl font-black tracking-tighter truncate">dhaniyaa</h1>
                </div>

                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
                    <div className="mb-8">
                        <button
                            onClick={() => {
                                setViewMode('shared');
                                setSelectedOrgId(null);
                            }}
                            className={`w-full text-left px-3 py-2.5 rounded font-bold text-sm transition-all mb-6 flex items-center gap-2 ${viewMode === 'shared' ? 'bg-white/15 text-white shadow-inner' : 'hover:bg-white/10 opacity-70 hover:opacity-100'}`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            All Projects
                        </button>

                        <div className="flex justify-between items-center px-3 mb-3">
                            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">Organizations</h3>
                            <button
                                onClick={() => setIsOrgModalOpen(true)}
                                className="hover:bg-white/10 rounded p-1 transition-all group active:scale-90"
                                title="Create Organization"
                            >
                                <svg className="w-4 h-4 opacity-70 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </button>
                        </div>
                        <div className="space-y-0.5">
                            {orgs.map(org => (
                                <button
                                    key={org._id}
                                    onClick={() => {
                                        setSelectedOrgId(org._id);
                                        setViewMode('org');
                                    }}
                                    className={`w-full text-left px-3 py-2.5 rounded font-semibold text-sm transition-all relative group ${selectedOrgId === org._id && viewMode === 'org' ? 'bg-white/15 text-white shadow-inner' : 'hover:bg-white/10 opacity-70 hover:opacity-100'}`}
                                >
                                    {selectedOrgId === org._id && viewMode === 'org' && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-2/3 bg-sidebar-accent rounded-r-full"></div>
                                    )}
                                    <div className="flex justify-between items-center w-full">
                                        <span className="truncate block">{org.name}</span>
                                        {org.owner === user?._id && (
                                            <div
                                                onClick={(e) => handleDeleteOrg(org._id, e)}
                                                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 text-red-400 rounded transition-all"
                                                title="Delete Organization"
                                            >
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </nav>

                <div className="p-4 bg-black/10 space-y-1">
                    <div className="flex items-center gap-3 px-3 py-3 mb-2 rounded bg-white/5 border border-white/5">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0 overflow-hidden text-slate-500 font-bold">
                            {user?.avatar ? (
                                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                                <span>{user?.name?.charAt(0).toUpperCase()}</span>
                            )}
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-xs font-bold truncate text-white">{user?.name}</span>
                            <span className="text-[10px] truncate text-white/50">{user?.email}</span>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsSettingsModalOpen(true)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm font-bold hover:bg-white/10 text-white/70 hover:text-white transition-all group"
                    >
                        <svg className="w-4 h-4 opacity-70 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Settings
                    </button>
                    <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm font-bold hover:bg-red-500/20 text-red-100/70 hover:text-white transition-all group">
                        <svg className="w-4 h-4 opacity-70 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 bg-[#F4F5F7]">
                <header className="h-16 bg-white border-b border-border flex justify-between items-center px-4 md:px-8 shrink-0 z-10">
                    <div className="flex items-center gap-4">
                        {/* Hamburger Menu icon */}
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        <div className="flex flex-col min-w-0">
                            <nav className="hidden sm:block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5 opacity-70">
                                Workspace / {viewMode === 'shared' ? 'All Projects' : (orgs.find(o => o._id === selectedOrgId)?.name || 'General')}
                            </nav>
                            <h2 className="text-sm sm:text-xl font-extrabold tracking-tight truncate">
                                {viewMode === 'shared' ? 'All Projects' : (orgs.find(o => o._id === selectedOrgId)?.name || `Welcome back, ${user?.name?.split(' ')[0]}`)}
                            </h2>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
                        <NotificationDropdown />
                        {selectedOrgId && (
                            <>
                                {selectedOrgId && (user?.role === 'OrganizationOwner' || projects.some(p => p.organizationId === selectedOrgId && (p.createdBy === user?._id || p.members?.find((m: any) => m.userId === user?._id && m.role === 'ProjectAdmin')))) && (
                                    <button
                                        onClick={() => setIsInviteModalOpen(true)}
                                        className="hidden md:flex px-4 py-2 text-slate-500 font-bold text-sm hover:bg-slate-100 rounded transition-all"
                                    >
                                        Invite Members
                                    </button>
                                )}
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="bg-primary text-primary-foreground px-3 sm:px-5 py-2 rounded font-bold text-xs sm:text-sm hover:translate-y-[-1px] active:translate-y-[1px] transition-all shadow-[0_4px_14px_0_rgba(0,82,204,0.39)] whitespace-nowrap"
                                >
                                    <span className="hidden sm:inline">Create Project</span>
                                    <span className="sm:hidden">Create</span>
                                </button>
                            </>
                        )}
                    </div>
                </header>

                <div className="flex-1 overflow-auto p-4 md:p-8 custom-scrollbar">
                    <section className="max-w-7xl mx-auto">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-32 gap-6">
                                <div className="relative">
                                    <div className="w-12 h-12 rounded-full border-4 border-primary/20 animate-pulse"></div>
                                    <div className="absolute inset-0 w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                                </div>
                                <p className="text-muted-foreground font-bold text-sm tracking-widest uppercase animate-pulse">Initializing Workspace...</p>
                            </div>
                        ) : (
                            <>
                                {invitations.length > 0 && (
                                    <div className="mb-10 animate-in slide-in-from-top-4 duration-500">
                                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                                            Pending Invitations
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {invitations.map((invite) => (
                                                <div key={invite._id} className="bg-white p-6 rounded-2xl border border-blue-100 shadow-[0_4px_20px_rgba(59,130,246,0.08)] flex flex-col">
                                                    <div className="flex items-start justify-between mb-4">
                                                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                            </svg>
                                                        </div>
                                                        <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded-full uppercase tracking-wider">Invited</span>
                                                    </div>
                                                    <h4 className="text-lg font-bold text-slate-800 mb-1">Project Invitation</h4>
                                                    <p className="text-sm text-slate-500 mb-6">
                                                        <span className="font-bold text-slate-700">{invite.invitedBy?.name}</span> invited you to join <span className="font-bold text-slate-700">{invite.projectId?.name}</span>.
                                                    </p>
                                                    <div className="flex gap-3 mt-auto">
                                                        <button
                                                            onClick={() => handleAcceptInvitation(invite._id, invite.projectId?._id)}
                                                            className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/20 transition-all"
                                                        >
                                                            Accept
                                                        </button>
                                                        <button
                                                            onClick={() => handleRejectInvitation(invite._id)}
                                                            className="flex-1 bg-slate-100 text-slate-600 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all"
                                                        >
                                                            Decline
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {(!selectedOrgId && viewMode !== 'shared') ? (
                                    <div className="flex flex-col items-center justify-center py-32 text-center bg-white rounded-2xl border border-border shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                                        <div className="w-24 h-24 bg-accent rounded-3xl flex items-center justify-center mb-8 rotate-3 shadow-inner">
                                            <svg className="w-12 h-12 text-primary -rotate-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-7h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                            </svg>
                                        </div>
                                        <h3 className="text-3xl font-extrabold mb-3 tracking-tight text-slate-800">Welcome to dhaniyaa</h3>
                                        <p className="text-slate-500 max-w-sm mb-10 font-bold leading-relaxed">The next-gen solution for modern engineering teams. Start by defining your first organization.</p>
                                        <button
                                            onClick={() => setIsOrgModalOpen(true)}
                                            className="bg-primary text-primary-foreground px-10 py-4 rounded-xl font-black hover:shadow-2xl hover:scale-105 active:scale-95 transition-all text-lg"
                                        >
                                            Create Organization
                                        </button>
                                    </div>
                                ) : projects.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                                        {projects.map((project: any) => (
                                            <div
                                                key={project._id}
                                                onClick={() => router.push(`/projects/${project._id}`)}
                                                className="bg-white p-7 rounded-2xl border border-border hover:border-primary cursor-pointer transition-all hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] group relative flex flex-col min-h-[220px]"
                                            >
                                                <div className="absolute top-0 left-0 w-2 h-full bg-primary rounded-l-2xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                                                <div className="flex items-start justify-between mb-6">
                                                    <div className="w-14 h-14 bg-accent rounded-2xl flex items-center justify-center shadow-sm group-hover:rotate-6 transition-transform">
                                                        <span className="text-primary font-black text-2xl">{project.name.charAt(0).toUpperCase()}</span>
                                                    </div>
                                                    <div className="flex flex-col items-end">
                                                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Key: {project.key || 'TF'}</span>
                                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                                                    </div>
                                                </div>
                                                <h4 className="text-xl font-extrabold mb-3 group-hover:text-primary transition-colors tracking-tight">{project.name}</h4>
                                                <p className="text-muted-foreground text-sm mb-8 line-clamp-2 leading-relaxed h-10 font-medium">{project.description || 'Elevating team productivity with streamlined workflows.'}</p>

                                                <div className="mt-auto flex items-center justify-between pt-5 border-t border-border">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex -space-x-2.5">
                                                            {[1, 2, 3].map(i => (
                                                                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">
                                                                    {i === 3 ? (project.members?.length || 1) : ''}
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <span className="text-xs font-bold text-muted-foreground">{project.members?.length || 1} members</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {(project.members?.find((m: any) => m.userId === user?._id)?.role === 'ProjectAdmin' || project.createdBy === user?._id || user?.role === 'OrganizationOwner') && (
                                                            <div className="w-8 h-8 rounded-full bg-accent text-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-primary hover:text-white"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setInviteProject(project);
                                                                    setIsInviteModalOpen(true);
                                                                }}
                                                                title="Invite Members"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                                                </svg>
                                                            </div>
                                                        )}
                                                        <div className="w-8 h-8 rounded-full bg-accent text-primary flex items-center justify-center opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                            </svg>
                                                        </div>
                                                        {project.createdBy === user?._id && (
                                                            <div className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all hover:bg-red-500 hover:text-white"
                                                                onClick={(e) => handleDeleteProject(project._id, e)}
                                                                title="Delete Project"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-32 bg-white rounded-2xl border border-dashed border-border shadow-sm text-center">
                                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                                            <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                            </svg>
                                        </div>
                                        <p className="text-slate-500 mb-8 font-bold tracking-tight">
                                            {viewMode === 'shared' ? "You haven't joined any projects yet." : "Your organization is ready for its first project."}
                                        </p>
                                        {viewMode !== 'shared' && (
                                            <button
                                                onClick={() => setIsModalOpen(true)}
                                                className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-black hover:shadow-xl transition-all"
                                            >
                                                Create New Project
                                            </button>
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </section>
                </div>

                {/* Modals */}
                {selectedOrgId && (
                    <CreateProjectModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onCreate={handleCreateProject}
                        orgId={selectedOrgId as string}
                    />
                )}
                <CreateOrganizationModal
                    isOpen={isOrgModalOpen}
                    onClose={() => setIsOrgModalOpen(false)}
                    onCreate={handleCreateOrg}
                />
                {selectedOrgId && (
                    <InviteMemberModal
                        isOpen={isInviteModalOpen}
                        onClose={() => {
                            setIsInviteModalOpen(false);
                            setInviteProject(null);
                        }}
                        type={inviteProject ? 'project' : 'organization'}
                        id={inviteProject ? inviteProject._id : selectedOrgId}
                    />
                )}
                <SettingsModal
                    isOpen={isSettingsModalOpen}
                    onClose={() => setIsSettingsModalOpen(false)}
                />
                <ConfirmationModal
                    isOpen={confirmationModal.isOpen}
                    onClose={() => setConfirmationModal(prev => ({ ...prev, isOpen: false }))}
                    onConfirm={confirmationModal.onConfirm}
                    title={confirmationModal.title}
                    message={confirmationModal.message}
                />
            </main>
        </div>
    );
}
