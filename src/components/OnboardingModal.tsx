import React, { useEffect, useState } from 'react';
import {
  X,
  Bot,
  Building2,
  FileText,
  Globe,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  MessageSquare,
} from 'lucide-react';
import { api } from '../services/api';
import { Workspace, Agent } from '../types';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (workspace: Workspace, agent: Agent) => void;
  onOpenTestChat: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  onOpenTestChat,
}) => {
  const [step, setStep] = useState<number>(1);
  const [businessName, setBusinessName] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');
  const [website, setWebsite] = useState('');
  const [selectedFocus, setSelectedFocus] = useState<string[]>([
    'Product questions',
    'Returns & exchanges',
    'Pricing & discounts',
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [createdAgent, setCreatedAgent] = useState<Agent | null>(null);

  useEffect(() => {
    if (!isOpen || step >= 5) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, step, onClose]);

  if (!isOpen) return null;

  const focusOptions = [
    'Product questions',
    'Pricing & discounts',
    'Returns & exchanges',
    'Booking & reservations',
    'Technical support',
    'Shipping & order tracking',
    'General customer questions',
  ];

  const toggleFocus = (option: string) => {
    const current = selectedFocus || [];
    if (current.includes(option)) {
      setSelectedFocus(current.filter((f) => f !== option));
    } else {
      setSelectedFocus([...current, option]);
    }
  };

  const handleFinishOnboarding = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.completeOnboarding({
        businessName: businessName || 'My Business',
        businessDescription,
        website,
        focusAreas: selectedFocus,
      });
      onComplete(res.workspace, res.agent);
      setCreatedAgent(res.agent);
      setStep(5);
    } catch (e: any) {
      setError(e?.message || "We couldn't generate your agent. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/60 backdrop-blur-xs p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && step < 5) onClose();
      }}
    >
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ember-600 text-white">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-slate-900 text-sm">Create Your Support AI</h3>
              <p className="text-[11px] text-slate-400">Step {step} of 5</p>
            </div>
          </div>
          {step < 5 && (
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-1.5 rounded-full my-4 overflow-hidden">
          <div
            className="bg-ember-600 h-full transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>

        {/* STEP 1: Business Name */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-ember-600">
                Step 1
              </span>
              <h2 className="text-xl font-display font-semibold text-slate-900 mt-0.5">What is your business name?</h2>
              <p className="text-xs text-slate-500 mt-1">
                This name will be displayed in your AI widget header and system prompts.
              </p>
            </div>

            <div className="relative">
              <Building2 className="absolute left-3.5 top-3 h-5 w-5 text-slate-400" />
              <input
                type="text"
                autoFocus
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Acme Store, Lumina Tech, Artisan Roasters"
                className="w-full rounded-xl border border-slate-300 pl-11 pr-4 py-2.5 text-sm focus:border-ember-500 focus:outline-none"
              />
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setStep(2)}
                disabled={!businessName.trim()}
                className="inline-flex items-center gap-2 rounded-xl bg-ember-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-ember-700 disabled:opacity-40 transition"
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Business Description */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-ember-600">
                Step 2
              </span>
              <h2 className="text-xl font-display font-semibold text-slate-900 mt-0.5">What does your business do?</h2>
              <p className="text-xs text-slate-500 mt-1">
                Describe your products, services, or target audience in a sentence or two.
              </p>
            </div>

            <div>
              <textarea
                rows={3}
                autoFocus
                value={businessDescription}
                onChange={(e) => setBusinessDescription(e.target.value)}
                placeholder="e.g. We manufacture premium noise-canceling audio gear and lifestyle accessories for creators and travelers."
                className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-ember-500 focus:outline-none"
              />
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="inline-flex items-center gap-2 rounded-xl bg-ember-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-ember-700 transition"
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Website URL */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-ember-600">
                Step 3
              </span>
              <h2 className="text-xl font-display font-semibold text-slate-900 mt-0.5">What is your website URL?</h2>
              <p className="text-xs text-slate-500 mt-1">
                We can automatically scan policies and product info from your domain.
              </p>
            </div>

            <div className="relative">
              <Globe className="absolute left-3.5 top-3 h-5 w-5 text-slate-400" />
              <input
                type="url"
                autoFocus
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://acmestore.io"
                className="w-full rounded-xl border border-slate-300 pl-11 pr-4 py-2.5 text-sm focus:border-ember-500 focus:outline-none"
              />
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="inline-flex items-center gap-2 rounded-xl bg-ember-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-ember-700 transition"
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: What Should AI Help With */}
        {step === 4 && (
          <div className="space-y-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-ember-600">
                Step 4
              </span>
              <h2 className="text-xl font-display font-semibold text-slate-900 mt-0.5">
                What should your AI agent help customers with?
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Select key domains for initial prompt tuning and escalation logic.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
              {focusOptions.map((opt) => {
                const isSelected = (selectedFocus || []).includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => toggleFocus(opt)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-medium text-left transition ${
                      isSelected
                        ? 'border-ember-600 bg-ember-50/70 text-ember-800'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{opt}</span>
                    {isSelected && <CheckCircle2 className="h-4 w-4 text-ember-600 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {error && (
              <div className="rounded-lg bg-rose-50 border border-rose-200 p-2.5 text-xs text-rose-700">
                {error}
              </div>
            )}

            <div className="pt-4 flex items-center justify-between">
              <button
                onClick={() => setStep(3)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              <button
                onClick={handleFinishOnboarding}
                disabled={loading || selectedFocus.length === 0}
                className="inline-flex items-center gap-2 rounded-xl bg-ember-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-ember-700 disabled:opacity-40 transition"
              >
                {loading ? 'Creating AI Agent...' : 'Generate My Agent'}
                <Sparkles className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: AI Agent Ready */}
        {step === 5 && (
          <div className="text-center py-6 space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 shadow-xs">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <div>
              <h2 className="text-2xl font-display font-semibold text-slate-900">Your AI agent is ready!</h2>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                We've configured your AI agent for <span className="font-semibold text-slate-700">{businessName || 'your business'}</span> with initial knowledge, customer focus rules, and anti-hallucination guardrails.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-left text-xs space-y-2 max-w-sm mx-auto">
              <div className="flex justify-between">
                <span className="text-slate-500">Agent Name:</span>
                <span className="font-semibold text-slate-800">{createdAgent?.name || 'Your Agent'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Personality:</span>
                <span className="font-semibold text-slate-800 capitalize">
                  {createdAgent?.personality || 'Friendly'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Escalation Handover:</span>
                <span className="font-semibold text-emerald-600">Active (Human Desk Enabled)</span>
              </div>
            </div>

            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-2.5">
              <button
                onClick={() => {
                  onClose();
                  onOpenTestChat();
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-ember-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-ember-700 transition"
              >
                <MessageSquare className="h-4 w-4" />
                Test Chat Now
              </button>
              <button
                onClick={onClose}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
