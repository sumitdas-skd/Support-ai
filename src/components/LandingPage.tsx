import React, { useState } from 'react';
import {
  Bot,
  ShieldCheck,
  Headphones,
  ArrowRight,
  Check,
  Sparkles,
  Search,
  BarChart3,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Store,
  ThumbsUp,
} from 'lucide-react';
import { motion } from 'motion/react';
import { Agent, WidgetSettings } from '../types';
import { ChatWidget } from './ChatWidget';

interface LandingPageProps {
  onStartFree: () => void;
  onOpenDashboard: () => void;
  onOpenFeedbackPortal: () => void;
  agent: Agent;
  widgetSettings: WidgetSettings;
}

const PLANS = [
  {
    name: 'Free',
    tagline: 'For testing and personal stores',
    monthly: 0,
    yearly: 0,
    features: ['100 AI messages / mo', 'Up to 3 Knowledge docs', 'Standard Website Widget', 'Basic analytics'],
    cta: 'Get Started',
    highlight: false,
  },
  {
    name: 'Starter',
    tagline: 'For growing boutique businesses',
    monthly: 19,
    yearly: 15,
    features: ['1,000 AI messages / mo', 'Up to 15 Knowledge docs', 'Custom branding & colors', 'Human takeover inbox'],
    cta: 'Start Starter Trial',
    highlight: false,
  },
  {
    name: 'Growth',
    tagline: 'For high-traffic stores & SaaS',
    monthly: 49,
    yearly: 39,
    features: [
      '5,000 AI messages / mo',
      'Up to 50 Knowledge docs',
      'Shopify order lookup hook',
      'AI Unanswered Questions engine',
      'Dedicated Feedback Portal',
    ],
    cta: 'Start Growth Trial',
    highlight: true,
  },
  {
    name: 'Pro',
    tagline: 'For multi-brand scale & agencies',
    monthly: 99,
    yearly: 79,
    features: ['20,000 AI messages / mo', '200 Knowledge docs', 'Multi-agent workspace', 'Priority dedicated support'],
    cta: 'Contact Sales / Start Pro',
    highlight: false,
  },
];

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartFree,
  onOpenDashboard,
  onOpenFeedbackPortal,
  agent,
  widgetSettings,
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const faqs = [
    {
      q: 'How does SupportAI learn my business knowledge?',
      a: 'You can upload documents (PDF, TXT, DOCX), connect website URLs for automatic crawling, or enter FAQs and custom text. Our RAG engine extracts, chunks, and semantically indexes your data so the AI agent only answers with verified facts.',
    },
    {
      q: 'What happens if a customer asks a question the AI does not know?',
      a: 'SupportAI is strictly configured to never hallucinate. When confidence is low or specific company data is absent, the agent transparently offers to connect the customer with your human team, marks the ticket for escalation, and adds the query to your Unanswered Questions backlog.',
    },
    {
      q: 'Can human agents take over conversations in real time?',
      a: 'Yes! The Conversations dashboard provides a live human agent desk. When a conversation is escalated or requires personal attention, your support staff can step in and reply directly to the customer in the same chat window.',
    },
    {
      q: 'How do I install the chat widget on my website?',
      a: 'You can copy and paste a simple 2-line JavaScript snippet into your website header or footer. It works with Shopify, WordPress, Webflow, React, Next.js, Squarespace, and custom HTML.',
    },
    {
      q: 'Can customers submit product feedback and feature requests?',
      a: 'Yes! SupportAI includes a dedicated Feedback Portal with built-in AI categorization and automated prioritization that organizes user ideas and pain points by sentiment urgency and recurring request patterns.',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-32 bg-paper bg-grain border-b border-slate-200">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-ember-200/40 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute top-40 -left-24 h-72 w-72 rounded-full bg-signal-200/40 blur-3xl"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-7 space-y-6 text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-ember-200 bg-white/80 px-3.5 py-1 text-xs font-semibold text-ember-700 shadow-xs">
                <Sparkles className="h-3.5 w-3.5 text-ember-600" />
                <span>Next-Gen Customer Support AI SaaS</span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-ink-950 leading-[1.08]">
                Turn customer questions into{' '}
                <span className="text-ember-600 italic">instant answers</span>.
              </h1>

              <p className="text-lg sm:text-xl text-ink-700/80 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Your AI support agent learns your business, answers customers 24/7, and sends complex
                conversations to your team.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <button
                  onClick={onStartFree}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-ember-600 px-6 py-3.5 text-base font-semibold text-white shadow-md hover:bg-ember-700 transition"
                >
                  Start Free Trial
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  onClick={onOpenDashboard}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-base font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition"
                >
                  Explore Dashboard
                </button>
                <button
                  onClick={onOpenFeedbackPortal}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-signal-200 bg-signal-50/70 px-5 py-3.5 text-base font-semibold text-signal-700 shadow-xs hover:bg-signal-100 transition"
                >
                  <ThumbsUp className="h-4 w-4" />
                  Feedback Portal
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs text-ink-700/70">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>3-minute setup</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Anti-hallucination RAG</span>
                </div>
              </div>
            </motion.div>

            {/* Right Interactive Preview */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="lg:col-span-5 flex justify-center"
            >
              <div className="w-full max-w-md">
                <div className="text-center mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-ink-700/70 bg-white/80 px-3 py-1 rounded-full border border-slate-200 shadow-xs">
                    Live Widget Sandbox
                  </span>
                </div>
                {/* Standalone embedded widget */}
                <ChatWidget
                  agent={agent}
                  settings={widgetSettings}
                  isOpen={true}
                  onClose={() => {}}
                  standalone={true}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-ember-600 mb-2">
              Simple 4-Step Workflow
            </h2>
            <p className="font-display text-3xl font-semibold text-ink-950 sm:text-4xl">
              From business knowledge to live 24/7 customer care in minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-paper p-6 rounded-2xl border border-slate-200 shadow-xs relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-ember-100 text-ember-600 font-display font-semibold text-lg mb-4">
                1
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Add Knowledge Sources</h3>
              <p className="text-sm text-slate-600">
                Paste your website URL, upload PDFs/DOCs, or enter FAQs. SupportAI automatically
                chunks and indexes verified facts.
              </p>
            </div>

            <div className="bg-paper p-6 rounded-2xl border border-slate-200 shadow-xs relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-signal-100 text-signal-600 font-display font-semibold text-lg mb-4">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Configure AI Agent</h3>
              <p className="text-sm text-slate-600">
                Choose personality (Friendly, Professional, Concise), set greeting messages, and
                define custom escalation triggers.
              </p>
            </div>

            <div className="bg-paper p-6 rounded-2xl border border-slate-200 shadow-xs relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 font-display font-semibold text-lg mb-4">
                3
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Install Chat Widget</h3>
              <p className="text-sm text-slate-600">
                Embed a lightweight script tag on your website or Shopify store. Customize theme
                colors and branding.
              </p>
            </div>

            <div className="bg-paper p-6 rounded-2xl border border-slate-200 shadow-xs relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600 font-display font-semibold text-lg mb-4">
                4
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Automate & Escalate</h3>
              <p className="text-sm text-slate-600">
                AI resolves 85%+ of tickets automatically. Complex or sensitive cases seamlessly
                transfer to your human team.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CORE VALUE PILLARS & FEATURES */}
      <section className="py-20 bg-paper border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-ember-600 mb-2">
              Engineered for Real Businesses
            </h2>
            <p className="font-display text-3xl font-semibold text-ink-950 sm:text-4xl">
              Everything required to deliver reliable, accurate support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl border border-slate-200 bg-white hover:shadow-md transition">
              <div className="h-10 w-10 rounded-xl bg-ember-600 text-white flex items-center justify-center mb-4">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Zero-Hallucination RAG</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                The agent only speaks from verified business knowledge. If information is missing,
                it transparently offers human help rather than inventing answers.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-white hover:shadow-md transition">
              <div className="h-10 w-10 rounded-xl bg-signal-600 text-white flex items-center justify-center mb-4">
                <Headphones className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Real-Time Human Handover</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                When a customer asks for a person, or expresses frustration, the ticket transfers
                to your operator desk where agents take over the live chat.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-white hover:shadow-md transition">
              <div className="h-10 w-10 rounded-xl bg-amber-600 text-white flex items-center justify-center mb-4">
                <Search className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Unanswered Questions AI</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Automatically identifies queries the AI couldn't answer, aggregates frequency, and
                gives you a 1-click button to enrich your knowledge base.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-white hover:shadow-md transition">
              <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-4">
                <ThumbsUp className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Dedicated Feedback Portal</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Invite customers to suggest features and report issues. AI automatically analyzes
                sentiment and prioritizes development based on recurring patterns.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-white hover:shadow-md transition">
              <div className="h-10 w-10 rounded-xl bg-purple-600 text-white flex items-center justify-center mb-4">
                <Store className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Shopify & Webhook Ready</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Simulate or connect order status lookups, tracking codes, and inventory queries
                directly inside customer chat.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-white hover:shadow-md transition">
              <div className="h-10 w-10 rounded-xl bg-rose-600 text-white flex items-center justify-center mb-4">
                <BarChart3 className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">CSAT & Resolution Metrics</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Track AI resolution rates, escalation volume, customer satisfaction, and message
                usage trends in real-time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. TARGET USE CASES */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-ember-600 mb-2">
              Tailored For Your Business Model
            </h2>
            <p className="font-display text-3xl font-semibold text-ink-950 sm:text-4xl">
              Who uses SupportAI to scale customer delight?
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-paper p-6 rounded-2xl border border-slate-200">
              <div className="text-2xl mb-3">🛍️</div>
              <h3 className="font-bold text-slate-900 mb-1">E-commerce Stores</h3>
              <p className="text-xs text-slate-600">
                Answer shipping questions, return windows, order status tracking, and product size
                recommendations 24/7.
              </p>
            </div>

            <div className="bg-paper p-6 rounded-2xl border border-slate-200">
              <div className="text-2xl mb-3">💻</div>
              <h3 className="font-bold text-slate-900 mb-1">SaaS Companies</h3>
              <p className="text-xs text-slate-600">
                Resolve tier pricing questions, feature documentation lookups, API guides, and
                onboarding steps immediately.
              </p>
            </div>

            <div className="bg-paper p-6 rounded-2xl border border-slate-200">
              <div className="text-2xl mb-3">📍</div>
              <h3 className="font-bold text-slate-900 mb-1">Local & Service Pros</h3>
              <p className="text-xs text-slate-600">
                Confirm operating hours, service locations, booking policies, and emergency contact
                guidelines without phone bottlenecks.
              </p>
            </div>

            <div className="bg-paper p-6 rounded-2xl border border-slate-200">
              <div className="text-2xl mb-3">🚀</div>
              <h3 className="font-bold text-slate-900 mb-1">Agencies & Consultancies</h3>
              <p className="text-xs text-slate-600">
                Deploy white-labeled customer support bots across multiple client accounts with
                isolated workspaces.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PRICING SECTION */}
      <section className="py-20 bg-paper border-b border-slate-200" id="pricing">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-xs font-bold uppercase tracking-wider text-ember-600 mb-2">
              Transparent Pricing
            </h2>
            <p className="font-display text-3xl font-semibold text-ink-950 sm:text-4xl">
              Scale your support as your business grows.
            </p>
            <p className="text-slate-600 mt-2 text-sm">
              All plans include RAG vector knowledge base, embeddable widget, and human escalation.
            </p>
          </div>

          {/* Billing Cycle Toggle */}
          <div className="flex items-center justify-center mb-10">
            <div className="inline-flex items-center rounded-full border border-slate-300 bg-white p-1 shadow-xs">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
                  billingCycle === 'monthly' ? 'bg-ember-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition flex items-center gap-1.5 ${
                  billingCycle === 'yearly' ? 'bg-ember-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Yearly
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${
                    billingCycle === 'yearly' ? 'bg-white/25 text-white' : 'bg-emerald-100 text-emerald-700'
                  }`}
                >
                  Save 20%
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {PLANS.map((plan) => {
              const price = billingCycle === 'yearly' ? plan.yearly : plan.monthly;
              return (
                <div
                  key={plan.name}
                  className={`rounded-2xl p-6 flex flex-col justify-between relative bg-white ${
                    plan.highlight
                      ? 'border-2 border-ember-600 shadow-md'
                      : 'border border-slate-200'
                  }`}
                >
                  {plan.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-ember-600 text-white px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      Most Popular
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">{plan.name}</h3>
                    <p className="text-xs text-slate-500 mt-1">{plan.tagline}</p>
                    <div className="mt-4 mb-1">
                      <span className={`text-3xl font-display font-semibold ${plan.highlight ? 'text-ember-600' : 'text-slate-900'}`}>
                        ${price}
                      </span>
                      <span className="text-xs text-slate-500"> / month</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mb-5 h-3">
                      {billingCycle === 'yearly' && plan.monthly > 0 ? `Billed $${price * 12} / year` : ' '}
                    </div>
                    <ul className="space-y-2.5 text-xs text-slate-600">
                      {plan.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <Check className={`h-4 w-4 shrink-0 ${plan.highlight ? 'text-ember-600' : 'text-emerald-600'}`} />
                          <span className={i === 0 && plan.highlight ? 'font-semibold text-slate-900' : ''}>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button
                    onClick={onStartFree}
                    className={`mt-6 w-full rounded-xl py-2.5 text-xs font-semibold transition ${
                      plan.highlight
                        ? 'bg-ember-600 text-white hover:bg-ember-700'
                        : plan.name === 'Starter'
                        ? 'bg-ink-950 text-white hover:bg-ink-900'
                        : 'border border-slate-300 bg-slate-50 text-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    {plan.cta}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. FAQ ACCORDION */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-ember-600 mb-2">FAQ</h2>
            <p className="font-display text-3xl font-semibold text-ink-950 sm:text-4xl">
              Frequently Asked Questions
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-xl border border-slate-200 bg-paper overflow-hidden shadow-2xs"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-4 text-left font-semibold text-slate-900 hover:bg-white/60 transition"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="h-4 w-4 text-slate-500 shrink-0" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-slate-500 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-200/70">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. FINAL CTA */}
      <section className="relative overflow-hidden py-20 bg-ink-950 text-white text-center bg-grain">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-ember-900/40 via-transparent to-signal-900/30"
        />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight">
            Ready to give your customers instant 24/7 answers?
          </h2>
          <p className="text-lg text-slate-300 max-w-xl mx-auto">
            Set up your AI support agent in 3 minutes. Test with your own website knowledge.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onStartFree}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-ember-600 px-7 py-3.5 text-base font-bold text-white shadow-md hover:bg-ember-500 transition"
            >
              Start Free Trial Now
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={onOpenDashboard}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-base font-semibold text-white hover:bg-white/10 transition"
            >
              Open SaaS Dashboard
            </button>
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="py-12 bg-ink-950 text-slate-400 text-xs border-t border-ink-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-ember-600 text-white flex items-center justify-center font-display font-semibold text-xs">
              S
            </div>
            <span className="font-display font-semibold text-white text-sm">SupportAI</span>
            <span>— AI Customer Support Agent Platform</span>
          </div>
          <div>© {new Date().getFullYear()} SupportAI Inc. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
};
