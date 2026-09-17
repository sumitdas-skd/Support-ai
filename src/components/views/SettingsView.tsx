import React, { useState } from 'react';
import {
  Building2,
  Users,
  Key,
  Shield,
  Check,
  Copy,
  Plus,
  Trash2,
  Mail,
  UserCheck,
} from 'lucide-react';
import { Workspace, User, WorkspaceMember } from '../../types';

interface SettingsViewProps {
  workspace: Workspace;
  currentUser: User | null;
  members: WorkspaceMember[];
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  workspace,
  currentUser,
  members: initialMembers,
}) => {
  const [businessName, setBusinessName] = useState(workspace.name);
  const [website, setWebsite] = useState(workspace.website || 'https://acmestore.io');
  const [industry, setIndustry] = useState(workspace.industry || 'E-commerce & Retail');
  const [apiKeyCopied, setApiKeyCopied] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'agent' | 'viewer'>('agent');

  const [members, setMembers] = useState(initialMembers);

  const handleCopyKey = () => {
    navigator.clipboard.writeText('sk_live_supportai_' + workspace.id + '_9f82d1c');
    setApiKeyCopied(true);
    setTimeout(() => setApiKeyCopied(false), 2500);
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    setMembers([
      ...members,
      {
        id: `usr_${Date.now()}`,
        workspaceId: workspace.id,
        userId: `usr_${Date.now()}`,
        name: inviteEmail.split('@')[0],
        email: inviteEmail,
        role: inviteRole,
        status: 'active',
        joinedAt: new Date().toISOString(),
      },
    ]);
    setInviteEmail('');
    setShowInviteModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <h1 className="text-xl font-display font-semibold text-slate-900">Workspace Settings & Team</h1>
        <p className="text-xs text-slate-500">
          Manage business metadata, staff members, permissions, and developer API credentials.
        </p>
      </div>

      {/* 1. General Workspace Info */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Building2 className="h-5 w-5 text-ember-600" />
          <h2 className="font-bold text-slate-900 text-sm">Company & Workspace Profile</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Workspace / Brand Name
            </label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-ember-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Website</label>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-ember-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Industry</label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-ember-500 focus:outline-none"
            >
              <option value="E-commerce & Retail">E-commerce & Retail</option>
              <option value="SaaS & Software">SaaS & Software</option>
              <option value="Local Services & Hospitality">Local Services & Hospitality</option>
              <option value="Health & Wellness">Health & Wellness</option>
              <option value="Agency & Consulting">Agency & Consulting</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. Team Members & Roles */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-signal-600" />
            <div>
              <h2 className="font-bold text-slate-900 text-sm">Team Members & Access Roles</h2>
              <p className="text-[11px] text-slate-500">
                Support agents can reply to human chats, view analytics, and update knowledge.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowInviteModal(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-ember-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-ember-700 transition"
          >
            <Plus className="h-3.5 w-3.5" />
            Invite Staff
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {members.map((m) => (
            <div key={m.id} className="py-3 flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
                  {m.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <div className="font-semibold text-slate-900">{m.name || 'Team Member'}</div>
                  <div className="text-[11px] text-slate-400">{m.email}</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="capitalize px-2.5 py-1 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                  {m.role ? m.role.replace('_', ' ') : 'Member'}
                </span>
                <span className="text-[11px] text-slate-400">Joined {m.joinedAt || 'Recently'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. API Keys & Webhook Credentials */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Key className="h-5 w-5 text-amber-600" />
          <h2 className="font-bold text-slate-900 text-sm">Developer API Credentials</h2>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Publishable Live Agent Key
          </label>
          <div className="flex items-center gap-2">
            <input
              type="password"
              readOnly
              value={`sk_live_supportai_${workspace.id}_9f82d1c`}
              className="flex-1 rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-mono text-slate-700 select-all"
            />
            <button
              onClick={handleCopyKey}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              {apiKeyCopied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{apiKeyCopied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Keep this key secret when calling the backend `/api/chat` or indexing endpoints directly.
          </p>
        </div>
      </div>

      {/* Invite Member Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Invite Team Member</h3>
              <button onClick={() => setShowInviteModal(false)} className="text-slate-400">
                ✕
              </button>
            </div>

            <form onSubmit={handleInvite} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colleague@yourcompany.com"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-ember-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Role & Permissions</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                >
                  <option value="admin">Admin (Full Access & Billing)</option>
                  <option value="agent">Support Agent (Live Chat Takeover & Knowledge)</option>
                  <option value="viewer">Viewer (Read-Only Analytics)</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 rounded-xl hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-ember-600 px-5 py-2 text-xs font-semibold text-white hover:bg-ember-700"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
