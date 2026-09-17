import React, { useState } from 'react';
import {
  LayoutDashboard,
  Bot,
  BookOpen,
  MessageSquare,
  Users,
  BarChart3,
  HelpCircle,
  ThumbsUp,
  Code,
  CreditCard,
  Settings,
  Menu,
  X,
} from 'lucide-react';
import {
  User,
  Workspace,
  Agent,
  WidgetSettings,
  KnowledgeSource,
  Conversation,
  Customer,
  AnalyticsSummary,
  UnansweredQuestion,
  WorkspaceMember,
} from '../types';

import { OverviewView } from './views/OverviewView';
import { AgentBuilderView } from './views/AgentBuilderView';
import { KnowledgeBaseView } from './views/KnowledgeBaseView';
import { ConversationsView } from './views/ConversationsView';
import { CustomersView } from './views/CustomersView';
import { AnalyticsView } from './views/AnalyticsView';
import { UnansweredQuestionsView } from './views/UnansweredQuestionsView';
import { FeedbackPortalView } from './views/FeedbackPortalView';
import { IntegrationsView } from './views/IntegrationsView';
import { BillingView } from './views/BillingView';
import { SettingsView } from './views/SettingsView';

interface DashboardProps {
  user: User | null;
  workspace: Workspace;
  members: WorkspaceMember[];
  agent: Agent;
  widgetSettings: WidgetSettings;
  knowledgeSources: KnowledgeSource[];
  conversations: Conversation[];
  customers: Customer[];
  analytics: AnalyticsSummary;
  unansweredQuestions: UnansweredQuestion[];
  activeSubView: string;
  setActiveSubView: (view: string) => void;
  onRefreshData: () => void;
  onOpenTestChat: () => void;
  onUpdateAgent: (agent: Agent, settings: WidgetSettings) => void;
  onPlanUpdated: (plan: string, usage: any) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  workspace,
  members,
  agent,
  widgetSettings,
  knowledgeSources,
  conversations,
  customers,
  analytics,
  unansweredQuestions,
  activeSubView,
  setActiveSubView,
  onRefreshData,
  onOpenTestChat,
  onUpdateAgent,
  onPlanUpdated,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedConversationId, setSelectedConversationId] = useState<string | undefined>(
    conversations[0]?.id
  );

  const waitingForHumanCount = conversations.filter((c) => c.status === 'waiting_human').length;
  const unresolvedQuestionCount = unansweredQuestions.filter((q) => q.status !== 'resolved').length;
  const usagePercent = Math.min(
    100,
    Math.round((workspace.usage.aiMessages / workspace.usage.maxMessages) * 100)
  );

  const navGroups = [
    {
      group: 'Main Menu',
      items: [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'agent_builder', label: 'AI Agent Customizer', icon: Bot },
        {
          id: 'knowledge',
          label: 'Knowledge Base (RAG)',
          icon: BookOpen,
          badge: `${knowledgeSources.length} docs`,
          badgeColor: 'bg-signal-500/30 text-signal-200',
        },
        {
          id: 'conversations',
          label: 'Live Chat Desk',
          icon: MessageSquare,
          badge: waitingForHumanCount > 0 ? `${waitingForHumanCount} alert` : undefined,
          badgeColor: 'bg-amber-500/30 text-amber-200 font-bold',
        },
      ],
    },
    {
      group: 'Intelligence & Feedback',
      items: [
        {
          id: 'unanswered',
          label: 'Unanswered Questions',
          icon: HelpCircle,
          badge: unresolvedQuestionCount > 0 ? `${unresolvedQuestionCount} missing` : undefined,
          badgeColor: 'bg-rose-500/30 text-rose-200',
        },
        {
          id: 'feedback_portal',
          label: 'Feedback & Priorities',
          icon: ThumbsUp,
          badge: 'AI Matrix',
          badgeColor: 'bg-signal-500 text-white font-bold',
        },
        { id: 'customers', label: 'Customers CRM', icon: Users },
        { id: 'analytics', label: 'Analytics & CSAT', icon: BarChart3 },
      ],
    },
    {
      group: 'Workspace & Setup',
      items: [
        { id: 'integrations', label: 'Widget & Shopify', icon: Code },
        { id: 'billing', label: 'Billing & Plans', icon: CreditCard },
        { id: 'settings', label: 'Settings', icon: Settings },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F3EE] flex flex-col md:flex-row font-sans">
      {/* Mobile Header Bar */}
      <div className="md:hidden flex items-center justify-between bg-ink-950 border-b border-ink-800 px-4 py-3 sticky top-16 z-30">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-ember-600 rounded-md flex items-center justify-center text-white">
            <Bot className="w-4 h-4" />
          </div>
          <span className="font-display font-semibold text-white text-sm">{workspace.name}</span>
          <span className="text-[10px] bg-ember-900/60 text-ember-300 border border-ember-700/60 px-2 py-0.5 rounded font-semibold uppercase">
            {workspace.plan}
          </span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 rounded-lg border border-ink-700 text-slate-300 hover:bg-ink-800"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* High Density Left Sidebar Navigation */}
      <aside
        className={`w-full md:w-60 bg-ink-950 border-r border-ink-800 shrink-0 md:sticky md:top-16 md:h-[calc(100vh-64px)] flex flex-col justify-between overflow-y-auto ${
          mobileMenuOpen ? 'block' : 'hidden md:flex'
        }`}
      >
        <div className="p-3 space-y-4">
          {/* Workspace Status in Dark Sidebar */}
          <div className="px-2 pt-2 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-ember-600 rounded-lg flex items-center justify-center text-white shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
              <div className="truncate">
                <div className="font-display font-semibold text-white text-xs truncate">{workspace.name}</div>
                <div className="text-[10px] text-slate-400 truncate">{workspace.website || 'supportai.io'}</div>
              </div>
            </div>
            <span className="text-[10px] font-bold text-ember-400 bg-ember-950/80 border border-ember-800/80 px-1.5 py-0.5 rounded uppercase">
              {workspace.plan}
            </span>
          </div>

          {/* Grouped Nav Items */}
          <nav className="space-y-4">
            {navGroups.map((grp, gIdx) => (
              <div key={gIdx} className="space-y-0.5">
                <div className="text-slate-500 text-[10px] uppercase font-bold tracking-wider px-3 pt-1 pb-1">
                  {grp.group}
                </div>
                {grp.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSubView === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveSubView(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs transition ${
                        isActive
                          ? 'bg-ember-600 text-white font-semibold shadow-xs'
                          : 'text-slate-300 hover:bg-ink-800 hover:text-white font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon
                          className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-400'}`}
                        />
                        <span>{item.label}</span>
                      </div>

                      {item.badge && (
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                            isActive
                              ? 'bg-white/25 text-white'
                              : item.badgeColor || 'bg-ink-700 text-slate-300'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer: High Density Usage Card & Quick Action */}
        <div className="pt-2">
          {/* Plan Usage Box */}
          <div className="p-3.5 bg-ink-900 mx-3 mb-3 rounded-xl border border-ink-800/80">
            <div className="text-[10px] text-ember-400 font-bold uppercase mb-1 flex justify-between items-center">
              <span>{workspace.plan} Plan</span>
              <span className="text-white font-bold">{usagePercent}%</span>
            </div>
            <div className="w-full bg-ink-700 h-1 rounded-full mb-2 overflow-hidden">
              <div
                className="bg-ember-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${usagePercent}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-400 flex justify-between">
              <span>
                {workspace.usage.aiMessages.toLocaleString()} / {workspace.usage.maxMessages.toLocaleString()} msgs
              </span>
            </div>
          </div>

          {/* Quick Launch Test Chat */}
          <div className="p-3 border-t border-ink-800 bg-[#12100C] space-y-2">
            <div className="flex items-center justify-between text-xs px-1">
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="font-semibold text-slate-300 text-[11px]">{agent.name}: Online</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-medium">RAG Ready</span>
            </div>

            <button
              onClick={onOpenTestChat}
              className="w-full flex items-center justify-center gap-2 rounded-md border border-ink-700 bg-ink-800 hover:bg-ink-700/90 py-1.5 text-xs font-semibold text-white shadow-2xs transition"
            >
              <MessageSquare className="h-3.5 w-3.5 text-ember-400" />
              Test Chat Widget
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content View Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-7 max-w-7xl mx-auto w-full overflow-x-hidden">
        {activeSubView === 'overview' && (
          <OverviewView
            analytics={analytics}
            recentConversations={conversations}
            workspace={workspace}
            agent={agent}
            knowledgeSources={knowledgeSources}
            unansweredQuestions={unansweredQuestions}
            onNavigate={(v) => setActiveSubView(v)}
            onSelectConversation={(id) => {
              setSelectedConversationId(id);
              setActiveSubView('conversations');
            }}
            onOpenTestChat={onOpenTestChat}
          />
        )}

        {activeSubView === 'agent_builder' && (
          <AgentBuilderView
            agent={agent}
            widgetSettings={widgetSettings}
            onUpdate={onUpdateAgent}
          />
        )}

        {activeSubView === 'knowledge' && (
          <KnowledgeBaseView sources={knowledgeSources} onRefresh={onRefreshData} />
        )}

        {activeSubView === 'conversations' && (
          <ConversationsView
            conversations={conversations}
            selectedConversationId={selectedConversationId}
            onSelectConversation={(id) => setSelectedConversationId(id)}
            currentUser={user}
            onRefresh={onRefreshData}
          />
        )}

        {activeSubView === 'unanswered' && (
          <UnansweredQuestionsView onKnowledgeUpdated={onRefreshData} />
        )}

        {activeSubView === 'feedback_portal' && <FeedbackPortalView />}

        {activeSubView === 'customers' && (
          <CustomersView
            customers={customers}
            onOpenCustomerChat={() => setActiveSubView('conversations')}
          />
        )}

        {activeSubView === 'analytics' && <AnalyticsView analytics={analytics} />}

        {activeSubView === 'integrations' && (
          <IntegrationsView agent={agent} widgetSettings={widgetSettings} />
        )}

        {activeSubView === 'billing' && (
          <BillingView workspace={workspace} onPlanUpdated={onPlanUpdated} />
        )}

        {activeSubView === 'settings' && (
          <SettingsView workspace={workspace} currentUser={user} members={members} />
        )}
      </main>
    </div>
  );
};
