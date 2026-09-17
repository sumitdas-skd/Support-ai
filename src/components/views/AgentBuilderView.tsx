import React, { useState } from 'react';
import {
  Bot,
  Save,
  Sparkles,
  Sliders,
  Shield,
  LifeBuoy,
  MessageSquare,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react';
import { Agent, WidgetSettings } from '../../types';
import { api } from '../../services/api';
import { ChatWidget } from '../ChatWidget';

interface AgentBuilderViewProps {
  agent: Agent;
  widgetSettings: WidgetSettings;
  onUpdate: (agent: Agent, widgetSettings: WidgetSettings) => void;
}

export const AgentBuilderView: React.FC<AgentBuilderViewProps> = ({
  agent: initialAgent,
  widgetSettings: initialSettings,
  onUpdate,
}) => {
  const [agent, setAgent] = useState<Agent>(initialAgent);
  const [settings, setSettings] = useState<WidgetSettings>(initialSettings);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const personalities: Array<'friendly' | 'professional' | 'casual' | 'concise'> = [
    'friendly',
    'professional',
    'casual',
    'concise',
  ];

  const handleSave = async () => {
    setSaving(true);
    setSavedSuccess(false);
    try {
      const res = await api.updateAgent({
        agent,
        widgetSettings: settings,
      });
      onUpdate(res.agent, res.widgetSettings);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (e) {
      console.error('Save agent error:', e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-display font-semibold text-slate-900">AI Agent Customizer & Personality</h1>
          <p className="text-xs text-slate-500">
            Tune how your AI agent talks, resolves customer issues, and when it transfers to humans.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {savedSuccess && (
            <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
              <CheckCircle2 className="h-4 w-4" /> Changes Published Live
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-ember-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-ember-700 disabled:opacity-50 transition"
          >
            {saving ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            {saving ? 'Saving...' : 'Save & Deploy Agent'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Configuration */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Identity & Persona */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Bot className="h-5 w-5 text-ember-600" />
              <h2 className="font-bold text-slate-900 text-sm">Identity & Persona</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Agent Display Name
                </label>
                <input
                  type="text"
                  value={agent.name}
                  onChange={(e) => setAgent({ ...agent, name: e.target.value })}
                  placeholder="Sarah or Support AI"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-ember-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Role Title</label>
                <input
                  type="text"
                  value={agent.roleTitle}
                  onChange={(e) => setAgent({ ...agent, roleTitle: e.target.value })}
                  placeholder="Customer Support Specialist"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-ember-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Tone & Personality
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {personalities.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setAgent({ ...agent, personality: p })}
                    className={`capitalize px-3 py-2 rounded-xl text-xs font-medium border text-center transition ${
                      agent.personality === p
                        ? 'border-ember-600 bg-ember-50 text-ember-700 font-bold'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Welcome Greeting Message
              </label>
              <textarea
                rows={2}
                value={agent.greeting}
                onChange={(e) => {
                  setAgent({ ...agent, greeting: e.target.value });
                  setSettings({ ...settings, greeting: e.target.value });
                }}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 focus:border-ember-500 focus:outline-none"
              />
            </div>
          </div>

          {/* 2. System Instructions & Prompt */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Sparkles className="h-5 w-5 text-signal-600" />
              <h2 className="font-bold text-slate-900 text-sm">AI Behavior & System Prompt</h2>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Custom Agent Instructions
              </label>
              <p className="text-[11px] text-slate-500 mb-2">
                Specify constraints, return guidance, promo codes, or how the agent should handle customer inquiries.
              </p>
              <textarea
                rows={5}
                value={agent.instructions}
                onChange={(e) => setAgent({ ...agent, instructions: e.target.value })}
                className="w-full font-mono text-xs rounded-xl border border-slate-300 p-3 text-slate-800 focus:border-ember-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Response Length
                </label>
                <select
                  value={agent.responseLength}
                  onChange={(e) =>
                    setAgent({ ...agent, responseLength: e.target.value as 'short' | 'balanced' | 'detailed' })
                  }
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-ember-500 focus:outline-none"
                >
                  <option value="short">Short (Quick 1-2 sentence answers)</option>
                  <option value="balanced">Balanced (Clear bullet points & context)</option>
                  <option value="detailed">Detailed (Thorough explanations)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Operating Language
                </label>
                <select
                  value={agent.language}
                  onChange={(e) => setAgent({ ...agent, language: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-ember-500 focus:outline-none"
                >
                  <option value="English (US)">English (US / Global)</option>
                  <option value="Spanish (Español)">Spanish (Español)</option>
                  <option value="French (Français)">French (Français)</option>
                  <option value="German (Deutsch)">German (Deutsch)</option>
                  <option value="Auto-Detect">Auto-Detect Customer Language</option>
                </select>
              </div>
            </div>
          </div>

          {/* 3. Human Escalation Triggers */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <LifeBuoy className="h-5 w-5 text-amber-600" />
              <h2 className="font-bold text-slate-900 text-sm">Human Escalation Triggers</h2>
            </div>

            <p className="text-xs text-slate-500">
              Select which events cause the conversation to be handed over to your human support team.
            </p>

            <div className="space-y-2.5">
              {[
                {
                  key: 'customer_requests_human',
                  ruleKey: 'customerRequestsHuman' as const,
                  label: 'Customer explicitly requests a human agent',
                  desc: 'Phrases like "talk to an agent", "real person", or clicking Request Human.',
                },
                {
                  key: 'ai_unknown_answer',
                  ruleKey: 'unknownAnswerThreshold' as const,
                  label: 'AI has low confidence or missing knowledge',
                  desc: 'Zero-hallucination trigger: avoids guessing and routes to support.',
                },
                {
                  key: 'refund_request',
                  ruleKey: 'refundDispute' as const,
                  label: 'Refund & order disputes',
                  desc: 'High-value customer retention cases requiring manager approval.',
                },
                {
                  key: 'angry_customer',
                  ruleKey: 'angrySentiment' as const,
                  label: 'Angry or frustrated customer sentiment',
                  desc: 'AI detects negative sentiment keywords or repeated dissatisfaction.',
                },
                {
                  key: 'technical_issue',
                  ruleKey: 'technicalIssue' as const,
                  label: 'Technical bug or payment processing error',
                  desc: 'Complex troubleshooting requiring engineering triage.',
                },
              ].map((trigger) => {
                const currentTriggers = agent.escalationTriggers || [];
                const isEnabled =
                  agent.escalationRules?.[trigger.ruleKey] ?? currentTriggers.includes(trigger.key);

                return (
                  <label
                    key={trigger.key}
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${
                      isEnabled ? 'bg-amber-50/60 border-amber-300' : 'bg-white border-slate-200'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isEnabled}
                      onChange={() => {
                        const nextValue = !isEnabled;
                        const newTriggers = nextValue
                          ? [...currentTriggers.filter((t) => t !== trigger.key), trigger.key]
                          : currentTriggers.filter((t) => t !== trigger.key);

                        setAgent({
                          ...agent,
                          escalationRules: {
                            ...(agent.escalationRules || {
                              customerRequestsHuman: true,
                              unknownAnswerThreshold: true,
                              refundDispute: true,
                              angrySentiment: true,
                              technicalIssue: true,
                              highValueCustomer: false,
                            }),
                            [trigger.ruleKey]: nextValue,
                          },
                          escalationTriggers: newTriggers,
                        });
                      }}
                      className="mt-0.5 h-4 w-4 rounded text-ember-600 focus:ring-ember-500"
                    />
                    <div>
                      <div className="text-xs font-semibold text-slate-900">{trigger.label}</div>
                      <div className="text-[11px] text-slate-500">{trigger.desc}</div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* 4. Widget Styling */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Sliders className="h-5 w-5 text-purple-600" />
              <h2 className="font-bold text-slate-900 text-sm">Widget Theme & Layout</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Brand Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={settings.primaryColor}
                    onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                    className="h-9 w-9 rounded-lg border border-slate-300 cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={settings.primaryColor}
                    onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                    className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Widget Launcher Position
                </label>
                <select
                  value={settings.launcherPosition}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      launcherPosition: e.target.value as 'bottom-right' | 'bottom-left',
                    })
                  }
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                >
                  <option value="bottom-right">Bottom Right of Screen</option>
                  <option value="bottom-left">Bottom Left of Screen</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sandbox: Interactive Preview */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Live Test Playground
              </span>
              <span className="text-[11px] text-slate-400">Updates live with your changes</span>
            </div>

            <ChatWidget
              agent={agent}
              settings={settings}
              isOpen={true}
              onClose={() => {}}
              standalone={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
