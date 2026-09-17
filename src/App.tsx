import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { FeedbackPortalView } from './components/views/FeedbackPortalView';
import { ChatWidget } from './components/ChatWidget';
import { AuthModal } from './components/AuthModal';
import { OnboardingModal } from './components/OnboardingModal';
import { api } from './services/api';
import {
  DEMO_USER,
  DEMO_WORKSPACE,
  DEMO_AGENT,
  DEMO_WIDGET_SETTINGS,
  DEMO_KNOWLEDGE_SOURCES,
  DEMO_CONVERSATIONS,
  DEMO_CUSTOMERS,
  DEMO_ANALYTICS,
  DEMO_UNANSWERED_QUESTIONS,
  DEMO_MEMBERS,
} from './data/demoData';
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
} from './types';
import { Bot, RefreshCw } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard' | 'feedback_portal'>('landing');
  const [activeSubView, setActiveSubView] = useState<string>('overview');

  // Core Data States with solid demo fallbacks
  const [user, setUser] = useState<User | null>(DEMO_USER);
  const [workspace, setWorkspace] = useState<Workspace>(DEMO_WORKSPACE);
  const [members, setMembers] = useState<any[]>(DEMO_MEMBERS);
  const [agent, setAgent] = useState<Agent>(DEMO_AGENT);
  const [widgetSettings, setWidgetSettings] = useState<WidgetSettings>(DEMO_WIDGET_SETTINGS);
  const [knowledgeSources, setKnowledgeSources] = useState<KnowledgeSource[]>(DEMO_KNOWLEDGE_SOURCES);
  const [conversations, setConversations] = useState<Conversation[]>(DEMO_CONVERSATIONS);
  const [customers, setCustomers] = useState<Customer[]>(DEMO_CUSTOMERS);
  const [analytics, setAnalytics] = useState<AnalyticsSummary>(DEMO_ANALYTICS);
  const [unansweredQuestions, setUnansweredQuestions] = useState<UnansweredQuestion[]>(DEMO_UNANSWERED_QUESTIONS);

  // Modals & Chat Widget States
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const [authRes, agentRes, knowRes, convRes, custRes, analRes, uqRes] = await Promise.allSettled([
        api.getMe(),
        api.getAgent(),
        api.getKnowledge(),
        api.getConversations(),
        api.getCustomers(),
        api.getAnalytics(),
        api.getUnansweredQuestions(),
      ]);

      if (authRes.status === 'fulfilled' && authRes.value.user) {
        setUser(authRes.value.user);
        setWorkspace(authRes.value.workspace);
        if (authRes.value.members) {
          setMembers(authRes.value.members);
        }
      }
      if (agentRes.status === 'fulfilled' && agentRes.value.agent) {
        setAgent(agentRes.value.agent);
        setWidgetSettings(agentRes.value.widgetSettings);
      }
      if (knowRes.status === 'fulfilled' && knowRes.value.sources) {
        setKnowledgeSources(knowRes.value.sources);
      }
      if (convRes.status === 'fulfilled' && convRes.value.conversations) {
        setConversations(convRes.value.conversations);
      }
      if (custRes.status === 'fulfilled' && custRes.value.customers) {
        setCustomers(custRes.value.customers);
      }
      if (analRes.status === 'fulfilled' && analRes.value.analytics) {
        setAnalytics(analRes.value.analytics);
      }
      if (uqRes.status === 'fulfilled' && uqRes.value.questions) {
        setUnansweredQuestions(uqRes.value.questions);
      }
    } catch (e) {
      console.warn('Backend load warning, using initial state:', e);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleUpdateAgent = (newAgent: Agent, newSettings: WidgetSettings) => {
    setAgent(newAgent);
    setWidgetSettings(newSettings);
  };

  const handlePlanUpdated = (plan: string, usage: any) => {
    setWorkspace((prev) => ({
      ...prev,
      plan: plan as any,
      usage: usage || prev.usage,
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased selection:bg-ember-600 selection:text-white">
      {initialLoading ? (
        <div className="fixed inset-0 z-[100] bg-[#F5F3EE] flex">
          {/* Skeleton sidebar */}
          <div className="w-60 bg-ink-950 shrink-0 flex flex-col gap-3 p-4 hidden md:flex">
            <div className="flex items-center gap-2.5 mt-2 mb-4">
              <div className="h-7 w-7 rounded-lg bg-ember-800/60 animate-pulse" />
              <div className="flex-1 space-y-1.5">
                <div className="h-2.5 w-24 bg-ink-700 rounded animate-pulse" />
                <div className="h-2 w-16 bg-ink-800 rounded animate-pulse" />
              </div>
            </div>
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex items-center gap-2.5 px-3 py-2">
                <div className="h-4 w-4 rounded bg-ink-700 animate-pulse" />
                <div className="h-2.5 rounded bg-ink-700 animate-pulse" style={{ width: `${55 + Math.random() * 40}%` }} />
              </div>
            ))}
          </div>
          {/* Skeleton main content */}
          <div className="flex-1 p-8 space-y-6">
            {/* Logo + brand */}
            <div className="flex items-center gap-3 mb-8">
              <div className="h-9 w-9 rounded-xl bg-ember-600 flex items-center justify-center shadow-lg shadow-ember-950/30">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div className="space-y-1">
                <div className="h-3 w-28 bg-slate-200 rounded animate-pulse" />
                <div className="h-2 w-20 bg-slate-100 rounded animate-pulse" />
              </div>
            </div>
            {/* Skeleton metric cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
                  <div className="h-2.5 w-20 bg-slate-100 rounded animate-pulse" />
                  <div className="h-7 w-14 bg-slate-200 rounded animate-pulse" />
                  <div className="h-2 w-24 bg-slate-100 rounded animate-pulse" />
                </div>
              ))}
            </div>
            {/* Skeleton table card */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
              <div className="h-3 w-40 bg-slate-200 rounded animate-pulse" />
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex gap-4 items-center py-2 border-t border-slate-50">
                  <div className="h-2.5 w-28 bg-slate-100 rounded animate-pulse" />
                  <div className="flex-1 h-2 bg-slate-100 rounded animate-pulse" />
                  <div className="h-5 w-16 bg-slate-100 rounded-full animate-pulse" />
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-2 text-xs text-slate-400 pt-2">
              <RefreshCw className="h-3 w-3 animate-spin text-ember-500" />
              <span>Waking up your AI support desk…</span>
            </div>
          </div>
        </div>
      ) : null}

      {/* Persistent Global Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={(v) => setCurrentView(v as any)}
        user={user}
        workspace={workspace}
        agent={agent}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        onToggleChatWidget={() => setIsWidgetOpen(!isWidgetOpen)}
        isWidgetOpen={isWidgetOpen}
      />

      {/* Main Views Container */}
      <div className="flex-1">
        {currentView === 'landing' && (
          <LandingPage
            agent={agent}
            widgetSettings={widgetSettings}
            onStartFree={() => setIsOnboardingOpen(true)}
            onOpenDashboard={() => setCurrentView('dashboard')}
            onOpenFeedbackPortal={() => setCurrentView('feedback_portal')}
          />
        )}

        {currentView === 'dashboard' && (
          <Dashboard
            user={user}
            workspace={workspace}
            members={members}
            agent={agent}
            widgetSettings={widgetSettings}
            knowledgeSources={knowledgeSources}
            conversations={conversations}
            customers={customers}
            analytics={analytics}
            unansweredQuestions={unansweredQuestions}
            activeSubView={activeSubView}
            setActiveSubView={setActiveSubView}
            onRefreshData={loadAllData}
            onOpenTestChat={() => setIsWidgetOpen(true)}
            onUpdateAgent={handleUpdateAgent}
            onPlanUpdated={handlePlanUpdated}
          />
        )}

        {currentView === 'feedback_portal' && (
          <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="mb-4 flex items-center justify-between">
              <button
                onClick={() => setCurrentView('dashboard')}
                className="text-xs font-semibold text-ember-700 hover:underline"
              >
                ← Back to SaaS Dashboard
              </button>
            </div>
            <FeedbackPortalView />
          </div>
        )}
      </div>

      {/* Floating Customer Chat Widget (Live RAG & Escalation Sandbox) */}
      <ChatWidget
        agent={agent}
        settings={widgetSettings}
        isOpen={isWidgetOpen}
        onOpen={() => setIsWidgetOpen(true)}
        onClose={() => setIsWidgetOpen(false)}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(newUser, newWorkspace) => {
          setUser(newUser);
          setWorkspace(newWorkspace);
          setCurrentView('dashboard');
        }}
      />

      {/* 5-Step AI Agent Onboarding Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onComplete={(newWorkspace, newAgent) => {
          setWorkspace(newWorkspace);
          setAgent(newAgent);
          setCurrentView('dashboard');
        }}
        onOpenTestChat={() => {
          setIsWidgetOpen(true);
        }}
      />
    </div>
  );
}
