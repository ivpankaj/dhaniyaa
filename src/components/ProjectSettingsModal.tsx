'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { UserAvatar } from './UserAvatar';
import { ConfirmationModal } from './ConfirmationModal';

interface ProjectSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    projectId: string;
    project: any;
    onUpdate?: () => void;
}

export const ProjectSettingsModal: React.FC<ProjectSettingsModalProps> = ({ isOpen, onClose, projectId, project, onUpdate }) => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'general' | 'members'>('members');
    const [invitations, setInvitations] = useState<any[]>([]);
    const [loadingInvites, setLoadingInvites] = useState(false);

    // Invite member state
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState<'ProjectAdmin' | 'Viewer'>('Viewer');
    const [sendingInvite, setSendingInvite] = useState(false);

    // Edit mode state
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState('');
    const [editedKey, setEditedKey] = useState('');
    const [editedType, setEditedType] = useState('Software Project');
    const [editedDescription, setEditedDescription] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (isOpen && activeTab === 'members' && projectId) {
            fetchInvitations();
        }
    }, [isOpen, activeTab, projectId]);

    useEffect(() => {
        if (project) {
            setEditedName(project.name || '');
            setEditedKey(project.key || 'TF');
            setEditedType(project.type || 'Software Project');
            setEditedDescription(project.description || '');
        }
    }, [project]);

    const fetchInvitations = async () => {
        setLoadingInvites(true);
        try {
            const res = await api.get(`/api/projects/${projectId}/invitations`);
            setInvitations(res.data.data);
        } catch (error) {
            console.error('Failed to fetch invitations');
        } finally {
            setLoadingInvites(false);
        }
    };

    const handleSendInvite = async () => {
        if (!inviteEmail.trim()) {
            toast.error('Please enter an email address');
            return;
        }

        setSendingInvite(true);
        try {
            await api.post(`/api/projects/${projectId}/invite`, {
                email: inviteEmail.trim(),
                role: inviteRole
            });
            toast.success('Invitation sent successfully!');
            setInviteEmail('');
            setInviteRole('Viewer');
            fetchInvitations();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to send invitation');
        } finally {
            setSendingInvite(false);
        }
    };

    const [confirmationModal, setConfirmationModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
        variant?: 'danger' | 'warning' | 'info';
    }>({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { },
    });

    const handleRemoveMember = (memberId: string) => {
        setConfirmationModal({
            isOpen: true,
            title: 'Remove Member',
            message: 'Are you sure you want to remove this member?',
            variant: 'danger',
            onConfirm: async () => {
                try {
                    await api.delete(`/api/projects/${projectId}/members/${memberId}`);
                    toast.success('Member removed successfully');
                    onUpdate?.();
                } catch (error: any) {
                    toast.error(error.response?.data?.message || 'Failed to remove member');
                }
            }
        });
    };


    const handleChangeRole = async (memberId: string, newRole: string) => {
        try {
            await api.patch(`/api/projects/${projectId}/members/${memberId}`, { role: newRole });
            toast.success('Role updated successfully');
            onUpdate?.();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update role');
        }
    };

    const handleSaveGeneral = async () => {
        setSaving(true);
        try {
            await api.patch(`/api/projects/${projectId}`, {
                name: editedName,
                key: editedKey,
                type: editedType,
                description: editedDescription
            });
            toast.success('Project updated successfully!');
            setIsEditing(false);
            onUpdate?.();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update project');
        } finally {
            setSaving(false);
        }
    };

    const isAdmin = project?.members?.find((m: any) => m.userId?._id === user?._id)?.role === 'ProjectAdmin' || project?.createdBy === user?._id;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[250] p-2 sm:p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[90vh] animate-in zoom-in-95 duration-200">
                <div className="px-4 sm:px-8 py-4 sm:py-6 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-slate-50 to-blue-50/30">
                    <div className="min-w-0 flex-1 mr-2">
                        <h2 className="text-base sm:text-xl font-black text-slate-800 tracking-tight truncate">Project Settings</h2>
                        <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 truncate">{project?.name}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                        <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex flex-col sm:flex-row flex-1 min-h-0">
                    {/* Sidebar Nav */}
                    <aside className="w-full sm:w-40 lg:w-44 border-b sm:border-b-0 sm:border-r border-slate-100 bg-slate-50/30 p-2 sm:p-3 flex sm:flex-col gap-1.5 sm:gap-2 overflow-x-auto sm:overflow-x-visible">
                        <button
                            onClick={() => setActiveTab('general')}
                            className={`flex-1 sm:w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${activeTab === 'general' ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-slate-500 hover:bg-slate-100'}`}
                        >
                            General
                        </button>
                        <button
                            onClick={() => setActiveTab('members')}
                            className={`flex-1 sm:w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${activeTab === 'members' ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-slate-500 hover:bg-slate-100'}`}
                        >
                            Members
                        </button>
                    </aside>

                    {/* Content area */}
                    <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto custom-scrollbar">
                        {activeTab === 'general' ? (
                            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-sm font-bold text-slate-700">Project Information</h3>
                                    {isAdmin && (
                                        <button
                                            onClick={() => {
                                                if (isEditing) {
                                                    setEditedName(project.name || '');
                                                    setEditedKey(project.key || 'TF');
                                                    setEditedType(project.type || 'Software Project');
                                                    setEditedDescription(project.description || '');
                                                }
                                                setIsEditing(!isEditing);
                                            }}
                                            className="text-xs font-bold text-primary hover:text-primary/80 transition-colors"
                                        >
                                            {isEditing ? 'Cancel' : 'Edit'}
                                        </button>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">Project Name</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editedName}
                                            onChange={(e) => setEditedName(e.target.value)}
                                            className="w-full px-4 py-3 bg-white border-2 border-blue-200 focus:border-primary rounded-xl font-bold text-slate-800 outline-none transition-colors"
                                            placeholder="Enter project name"
                                        />
                                    ) : (
                                        <div className="px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold text-slate-800">
                                            {project?.name}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">Project Key</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editedKey}
                                            onChange={(e) => setEditedKey(e.target.value.toUpperCase())}
                                            className="w-full px-4 py-3 bg-white border-2 border-blue-200 focus:border-primary rounded-xl font-bold text-slate-800 outline-none transition-colors uppercase"
                                            placeholder="TF"
                                            maxLength={5}
                                        />
                                    ) : (
                                        <div className="px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold text-slate-800">
                                            {project?.key || 'TF'}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">Project Type</label>
                                    {isEditing ? (
                                        <div className="relative">
                                            <select
                                                value={editedType}
                                                onChange={(e) => setEditedType(e.target.value)}
                                                className="w-full px-4 py-3 bg-white border-2 border-blue-200 focus:border-primary rounded-xl font-bold text-slate-800 outline-none transition-colors appearance-none cursor-pointer"
                                            >
                                                <option value="Software Project">Software Project</option>
                                                <option value="Marketing Campaign">Marketing Campaign</option>
                                                <option value="Business Project">Business Project</option>
                                                <option value="Content Calendar">Content Calendar</option>
                                                <option value="Personal Board">Personal Board</option>
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold text-slate-800">
                                            {project?.type || 'Software Project'}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">Description</label>
                                    {isEditing ? (
                                        <textarea
                                            value={editedDescription}
                                            onChange={(e) => setEditedDescription(e.target.value)}
                                            className="w-full px-4 py-3 bg-white border-2 border-blue-200 focus:border-primary rounded-xl font-medium text-slate-600 outline-none transition-colors resize-none"
                                            placeholder="Enter project description"
                                            rows={4}
                                        />
                                    ) : (
                                        <div className="px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl font-medium text-slate-600 min-h-[100px]">
                                            {project?.description || 'No description provided.'}
                                        </div>
                                    )}
                                </div>

                                {isEditing && (
                                    <button
                                        onClick={handleSaveGeneral}
                                        disabled={saving}
                                        className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {saving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                                {/* Invite Member Section */}
                                {isAdmin && (
                                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-100 rounded-xl p-4 sm:p-5">
                                        <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                                            <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            Invite New Member
                                        </h3>
                                        <div className="flex flex-col sm:flex-row gap-2">
                                            <input
                                                type="email"
                                                value={inviteEmail}
                                                onChange={(e) => setInviteEmail(e.target.value)}
                                                placeholder="Enter email address"
                                                className="flex-1 px-4 py-2.5 bg-white border-2 border-blue-200 focus:border-primary rounded-lg text-sm font-medium outline-none transition-colors"
                                                onKeyDown={(e) => e.key === 'Enter' && handleSendInvite()}
                                            />
                                            <select
                                                value={inviteRole}
                                                onChange={(e) => setInviteRole(e.target.value as any)}
                                                className="px-4 py-2.5 bg-white border-2 border-blue-200 focus:border-primary rounded-lg text-sm font-bold outline-none transition-colors"
                                            >
                                                <option value="Viewer">Viewer</option>
                                                <option value="ProjectAdmin">Admin</option>
                                            </select>
                                            <button
                                                onClick={handleSendInvite}
                                                disabled={sendingInvite}
                                                className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                                            >
                                                {sendingInvite ? 'Sending...' : 'Send Invite'}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Members List */}
                                <div>
                                    <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                                        Team Members
                                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-[10px]">{project?.members?.length || 0}</span>
                                    </h3>
                                    <div className="space-y-2">
                                        {project?.members?.map((member: any) => {
                                            console.log('Member data:', {
                                                name: member.userId?.name,
                                                email: member.userId?.email,
                                                avatar: member.userId?.avatar,
                                                fullUser: member.userId
                                            });
                                            return (
                                                <div key={member.userId?._id || Math.random()} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl hover:border-blue-200 hover:shadow-sm transition-all group">
                                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                                        <UserAvatar
                                                            name={member.userId?.name || 'Unknown User'}
                                                            avatar={member.userId?.avatar}
                                                            size="md"
                                                        />
                                                        <div className="min-w-0 flex-1">
                                                            <p className="text-sm font-bold text-slate-800 truncate">{member.userId?.name || 'Unknown User'}</p>
                                                            <p className="text-[10px] font-medium text-slate-400 truncate">{member.userId?.email}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-shrink-0">
                                                        {isAdmin && member.userId?._id !== user?._id ? (
                                                            <>
                                                                <select
                                                                    value={member.role}
                                                                    onChange={(e) => handleChangeRole(member.userId._id, e.target.value)}
                                                                    className="text-[10px] font-bold uppercase tracking-wider text-slate-600 bg-slate-50 hover:bg-slate-100 px-2 py-1 rounded-md border border-slate-200 outline-none transition-colors cursor-pointer"
                                                                >
                                                                    <option value="Viewer">Viewer</option>
                                                                    <option value="ProjectAdmin">Admin</option>
                                                                </select>
                                                                <button
                                                                    onClick={() => handleRemoveMember(member.userId._id)}
                                                                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                                                    title="Remove member"
                                                                >
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                    </svg>
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
                                                                {member.role}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Pending Invitations */}
                                <div>
                                    <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                                        Pending Invitations
                                        <span className="bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full text-[10px]">{invitations.length}</span>
                                    </h3>
                                    {loadingInvites ? (
                                        <div className="py-4 text-center text-slate-400 text-xs font-bold animate-pulse">Loading invitations...</div>
                                    ) : invitations.length > 0 ? (
                                        <div className="space-y-2">
                                            {invitations.map((invite) => (
                                                <div key={invite._id} className="flex items-center justify-between p-3 bg-orange-50/50 border border-orange-200 rounded-xl hover:border-orange-300 transition-all">
                                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                                        <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                                                            @
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <p className="text-sm font-bold text-slate-800 truncate">{invite.email}</p>
                                                            <p className="text-[10px] font-medium text-slate-400 truncate">Invited by {invite.invitedBy?.name}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-shrink-0">
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-orange-600 bg-orange-100 px-2 py-1 rounded-md">
                                                            Pending
                                                        </span>
                                                        {isAdmin && (
                                                            <button
                                                                onClick={async () => {
                                                                    if (confirm('Are you sure you want to revoke this invitation?')) {
                                                                        try {
                                                                            await api.delete(`/api/invitations/${invite._id}`);
                                                                            toast.success('Invitation revoked');
                                                                            fetchInvitations();
                                                                        } catch (err) {
                                                                            console.error('Failed to revoke invitation', err);
                                                                            toast.error('Failed to revoke invitation');
                                                                        }
                                                                    }
                                                                }}
                                                                className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                                title="Revoke Invitation"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="py-8 text-center bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                                            <svg className="w-12 h-12 mx-auto text-slate-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                            </svg>
                                            <p className="text-slate-400 text-xs font-bold">No pending invitations</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>
            <ConfirmationModal
                isOpen={confirmationModal.isOpen}
                onClose={() => setConfirmationModal(prev => ({ ...prev, isOpen: false }))}
                onConfirm={confirmationModal.onConfirm}
                title={confirmationModal.title}
                message={confirmationModal.message}
                variant={confirmationModal.variant}
            />
        </div>
    );
};
