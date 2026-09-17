import React, { useState } from 'react';
import {
  CreditCard,
  Check,
  Zap,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { Workspace } from '../../types';
import { api } from '../../services/api';

interface BillingViewProps {
  workspace: Workspace;
  onPlanUpdated: (plan: string, usage: any) => void;
}

export const BillingView: React.FC<BillingViewProps> = ({
  workspace,
  onPlanUpdated,
}) => {
  const [upgradingPlan, setUpgradingPlan] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState('');

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Ideal for local stores and testing SupportAI capabilities',
      maxMessages: 100,
      maxDocs: 3,
      features: [
        '100 AI messages / month',
        '3 knowledge base sources',
        'Zero-hallucination RAG',
        'Standard website chat widget',
        'Community support',
      ],
    },
    {
      id: 'starter',
      name: 'Starter',
      price: '$19',
      period: 'per month',
      description: 'For growing boutique stores and early startups',
      maxMessages: 1000,
      maxDocs: 15,
      features: [
        '1,000 AI messages / month',
        '15 knowledge base sources',
        'Custom widget colors & branding',
        'Human takeover live chat inbox',
        'Unanswered questions detection',
        'Standard email support',
      ],
    },
    {
      id: 'growth',
      name: 'Growth',
      price: '$49',
      period: 'per month',
      popular: true,
      description: 'For high-traffic e-commerce stores & SaaS products',
      maxMessages: 5000,
      maxDocs: 50,
      features: [
        '5,000 AI messages / month',
        '50 knowledge base sources',
        'Dedicated Feedback Portal & AI Matrix',
        'Shopify order status lookup hook',
        'Autonomous customer sentiment scoring',
        'Multi-member support team seats',
      ],
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$99',
      period: 'per month',
      description: 'For scaling brands, agencies, and high volume operations',
      maxMessages: 20000,
      maxDocs: 200,
      features: [
        '20,000 AI messages / month',
        '200 knowledge base sources',
        'Multi-agent workspaces',
        'Custom Webhooks & REST API access',
        'Dedicated account manager',
        '99.9% SLA uptime guarantee',
      ],
    },
  ];

  const handleUpgrade = async (planId: string) => {
    setUpgradingPlan(planId);
    try {
      const res = await api.upgradePlan(planId);
      onPlanUpdated(res.plan, res.usage);
      setSuccessNotice(`Successfully switched to the ${planId.toUpperCase()} plan!`);
      setTimeout(() => setSuccessNotice(''), 4000);
    } catch (e) {
      console.error(e);
    } finally {
      setUpgradingPlan(null);
    }
  };

  const usagePercent = Math.min(
    100,
    Math.round((workspace.usage.aiMessages / workspace.usage.maxMessages) * 100)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-display font-semibold text-slate-900">Subscription & Usage Limits</h1>
        <p className="text-xs text-slate-500">
          Manage your subscription tier, billing methods, and monthly message allowances.
        </p>
      </div>

      {successNotice && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{successNotice}</span>
        </div>
      )}

      {/* Current Usage Progress Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-slate-900 text-sm">Monthly AI Messages Allowance</h2>
              <span className="capitalize font-bold text-xs bg-ember-50 text-ember-700 px-2.5 py-0.5 rounded-full border border-ember-200">
                {workspace.plan} Tier
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Cycles refresh on the 1st of each calendar month.
            </p>
          </div>

          <div className="text-right">
            <span className="text-xl font-bold text-slate-900">
              {workspace.usage.aiMessages.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500">
              {' '}
              / {workspace.usage.maxMessages.toLocaleString()} msgs ({usagePercent}%)
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              usagePercent > 90
                ? 'bg-rose-500'
                : usagePercent > 70
                ? 'bg-amber-500'
                : 'bg-ember-600'
            }`}
            style={{ width: `${usagePercent}%` }}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>Knowledge Sources: {workspace.usage.docsCount} active sources</span>
          <span>Demo Billing: Sample Card on File •••• 4242</span>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {plans.map((p) => {
          const isCurrent = (workspace?.plan || '').toLowerCase() === p.id.toLowerCase();

          return (
            <div
              key={p.id}
              className={`rounded-2xl bg-white p-6 flex flex-col justify-between transition ${
                p.popular
                  ? 'border-2 border-ember-600 shadow-md relative'
                  : 'border border-slate-200 shadow-xs'
              }`}
            >
              {p.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-ember-600 text-white px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  Recommended
                </div>
              )}

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-lg">{p.name}</h3>
                  {isCurrent && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-500 mt-1 min-h-[32px]">{p.description}</p>

                <div className="mt-4 mb-6">
                  <span className="text-3xl font-extrabold text-slate-900">{p.price}</span>
                  <span className="text-xs text-slate-500"> / {p.period}</span>
                </div>

                <ul className="space-y-2.5 text-xs text-slate-600">
                  {p.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                {isCurrent ? (
                  <button
                    disabled
                    className="w-full rounded-xl bg-slate-100 py-2.5 text-xs font-semibold text-slate-500 cursor-default"
                  >
                    Current Active Plan
                  </button>
                ) : (
                  <button
                    onClick={() => handleUpgrade(p.id)}
                    disabled={upgradingPlan === p.id}
                    className={`w-full rounded-xl py-2.5 text-xs font-semibold shadow-xs transition ${
                      p.popular
                        ? 'bg-ember-600 text-white hover:bg-ember-700'
                        : 'bg-slate-900 text-white hover:bg-slate-800'
                    }`}
                  >
                    {upgradingPlan === p.id ? 'Updating Plan...' : `Switch to ${p.name}`}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
