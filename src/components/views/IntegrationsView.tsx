import React, { useState } from 'react';
import {
  Code,
  Copy,
  Check,
  ShoppingBag,
  Layers,
  MessageCircle,
  Mail,
  Send,
  Sparkles,
  ExternalLink,
  Search,
} from 'lucide-react';
import { Agent, WidgetSettings } from '../../types';
import { api } from '../../services/api';

interface IntegrationsViewProps {
  agent: Agent;
  widgetSettings: WidgetSettings;
}

export const IntegrationsView: React.FC<IntegrationsViewProps> = ({
  agent,
  widgetSettings,
}) => {
  const [copied, setCopied] = useState(false);
  const [orderQuery, setOrderQuery] = useState('ACM-98421');
  const [orderResult, setOrderResult] = useState<any>(null);
  const [lookingUp, setLookingUp] = useState(false);

  const embedSnippet = `<!-- SupportAI Live Chat Widget -->
<script
  src="https://cdn.supportai.io/widget.v1.js"
  data-agent-id="${agent.id}"
  data-primary-color="${widgetSettings.primaryColor}"
  data-position="${widgetSettings.launcherPosition}"
  async
></script>`;

  const handleCopySnippet = () => {
    navigator.clipboard.writeText(embedSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShopifyLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderQuery) return;
    setLookingUp(true);
    try {
      const res = await api.lookupShopifyOrder(orderQuery);
      setOrderResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLookingUp(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <h1 className="text-xl font-display font-semibold text-slate-900">Integrations & Website Embed</h1>
        <p className="text-xs text-slate-500">
          Install the SupportAI widget on your store or connect external platforms.
        </p>
      </div>

      {/* 1. Website Embed Snippet Box */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-ember-100 text-ember-600 flex items-center justify-center">
              <Code className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-sm">Website Embed Snippet</h2>
              <p className="text-[11px] text-slate-500">
                Paste this script tag right before the closing <code className="text-ember-600 font-mono">&lt;/body&gt;</code> or in your <code className="text-ember-600 font-mono">&lt;head&gt;</code> tag.
              </p>
            </div>
          </div>

          <button
            onClick={handleCopySnippet}
            className="inline-flex items-center gap-1.5 rounded-xl bg-ember-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-ember-700 transition"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-300" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? 'Copied Code!' : 'Copy Snippet'}</span>
          </button>
        </div>

        {/* Code Box */}
        <div className="rounded-xl bg-slate-900 p-4 font-mono text-xs text-emerald-400 overflow-x-auto">
          <pre>{embedSnippet}</pre>
        </div>

        {/* Platform Quick Guides */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="font-bold text-slate-800">Shopify</div>
            <div className="text-[11px] text-slate-500 mt-1">
              Online Store → Themes → Edit Code → theme.liquid
            </div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="font-bold text-slate-800">WordPress / Woo</div>
            <div className="text-[11px] text-slate-500 mt-1">
              Header and Footer Scripts plugin or theme customizer.
            </div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="font-bold text-slate-800">Webflow / Framer</div>
            <div className="text-[11px] text-slate-500 mt-1">
              Project Settings → Custom Code → Footer Code.
            </div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="font-bold text-slate-800">React / Next.js</div>
            <div className="text-[11px] text-slate-500 mt-1">
              Include inside your layout file or custom script component.
            </div>
          </div>
        </div>
      </div>

      {/* 2. Shopify Order Tracking Integration Simulator */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <ShoppingBag className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-slate-900 text-sm">Shopify Order Lookup & Fulfillment</h2>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                  Connected & Active
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Allows the AI agent to answer customer inquiries like "Where is my order #ACM-98421?" autonomously with live tracking data.
              </p>
            </div>
          </div>
        </div>

        {/* Test Lookup Form */}
        <form onSubmit={handleShopifyLookup} className="flex gap-2 max-w-md">
          <input
            type="text"
            value={orderQuery}
            onChange={(e) => setOrderQuery(e.target.value)}
            placeholder="Enter Order # e.g. ACM-98421"
            className="flex-1 rounded-xl border border-slate-300 px-3.5 py-2 text-xs focus:border-ember-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={lookingUp}
            className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition shrink-0"
          >
            {lookingUp ? 'Querying...' : 'Test Query'}
          </button>
        </form>

        {/* Order Result Card */}
        {orderResult && (
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 text-xs space-y-2 max-w-lg">
            {orderResult.found ? (
              <>
                <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                  <span className="font-bold text-slate-900">{orderResult.order.orderNumber}</span>
                  <span className="rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 font-semibold text-[10px]">
                    {orderResult.order.fulfillmentStatus}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Customer:</span>
                  <span className="font-medium text-slate-900">{orderResult.order.customerName}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Carrier & Tracking:</span>
                  <span className="font-mono text-ember-600">{orderResult.order.trackingNumber}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Estimated Delivery:</span>
                  <span className="font-medium text-slate-900">{orderResult.order.estimatedDelivery}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Total Amount:</span>
                  <span className="font-bold text-slate-900">${orderResult.order.totalPrice}</span>
                </div>
              </>
            ) : (
              <div className="text-rose-600">Order not found in store database.</div>
            )}
          </div>
        )}
      </div>

      {/* 3. Additional Channels Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-2 opacity-90">
          <div className="flex items-center justify-between">
            <MessageCircle className="h-6 w-6 text-emerald-500" />
            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
              Enterprise
            </span>
          </div>
          <h3 className="font-bold text-slate-900 text-sm">WhatsApp Business API</h3>
          <p className="text-xs text-slate-500">
            Route incoming WhatsApp messages to your SupportAI agent and human inbox.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-2 opacity-90">
          <div className="flex items-center justify-between">
            <Mail className="h-6 w-6 text-ember-500" />
            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
              Enterprise
            </span>
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Email Inbound Parser</h3>
          <p className="text-xs text-slate-500">
            Forward support@yourdomain.com emails for autonomous drafts and responses.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-2 opacity-90">
          <div className="flex items-center justify-between">
            <Layers className="h-6 w-6 text-purple-500" />
            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
              API
            </span>
          </div>
          <h3 className="font-bold text-slate-900 text-sm">REST API & Webhooks</h3>
          <p className="text-xs text-slate-500">
            Listen to conversation events and sync resolution metadata to external CRMs.
          </p>
        </div>
      </div>
    </div>
  );
};
