import React, { useState, useEffect } from 'react';
import {
  ThumbsUp,
  Sparkles,
  Plus,
  Filter,
  ArrowUp,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Layers,
  MessageSquare,
  HelpCircle,
  Lightbulb,
  Bug,
  RefreshCw,
  Zap,
} from 'lucide-react';
import { FeedbackItem } from '../../types';
import { api } from '../../services/api';

interface FeedbackPortalViewProps {
  initialItems?: FeedbackItem[];
}

export const FeedbackPortalView: React.FC<FeedbackPortalViewProps> = ({ initialItems }) => {
  const [items, setItems] = useState<FeedbackItem[]>(initialItems || []);
  const [viewMode, setViewMode] = useState<'matrix' | 'portal'>('matrix');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rePrioritizing, setRePrioritizing] = useState(false);

  // Submit Feedback Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [categoryHint, setCategoryHint] = useState('feature');

  useEffect(() => {
    loadFeedback();
  }, []);

  const loadFeedback = async () => {
    setLoading(true);
    try {
      const res = await api.getFeedbackPortalItems();
      setItems(res.feedbackItems);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await api.upvoteFeedback(id);
      setItems((prev) => prev.map((item) => (item.id === id ? res.feedbackItem : item)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    try {
      const res = await api.submitFeedback({
        title,
        description,
        userName: userName || 'Customer',
        userEmail: userEmail || 'customer@store.io',
        categoryHint,
      });

      setItems((prev) => [res.feedbackItem, ...prev]);
      setTitle('');
      setDescription('');
      setIsSubmitModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRePrioritize = async () => {
    setRePrioritizing(true);
    try {
      const res = await api.rePrioritizeFeedback();
      if (res.feedbackItems) {
        setItems(res.feedbackItems);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRePrioritizing(false);
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
    return matchesCat && matchesStatus;
  });

  // Sort by priority score for matrix view, or upvotes for portal view
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (viewMode === 'matrix') {
      return (b.priorityScore || 0) - (a.priorityScore || 0);
    }
    return b.upvotes - a.upvotes;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl border border-signal-200 bg-linear-to-r from-signal-50/70 to-ember-50/70 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-signal-600 text-white px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider">
              AI Backlog Optimizer
            </span>
            <span className="text-xs text-signal-700 font-semibold">Priority Engine Active</span>
          </div>
          <h1 className="text-xl font-display font-semibold text-slate-900 mt-1">Customer Feedback & Feature Matrix</h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Collects customer suggestions, analyzes sentiment severity, detects recurring friction patterns, and automatically ranks engineering priorities.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleRePrioritize}
            disabled={rePrioritizing}
            className="inline-flex items-center gap-2 rounded-xl bg-signal-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-signal-700 disabled:opacity-50 transition"
          >
            <Sparkles className={`h-3.5 w-3.5 ${rePrioritizing ? 'animate-spin' : ''}`} />
            {rePrioritizing ? 'AI Prioritizing...' : 'Run AI Prioritizer'}
          </button>
          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            <Plus className="h-3.5 w-3.5" />
            New Feedback
          </button>
        </div>
      </div>

      {/* Mode Switcher & Metric Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 bg-white">
          <span className="text-xs text-slate-500 font-medium">Total Feedback Items</span>
          <div className="text-xl font-bold text-slate-900 mt-1">{items.length} logged</div>
        </div>
        <div className="p-4 rounded-xl border border-slate-200 bg-white">
          <span className="text-xs text-slate-500 font-medium">Critical Issues (P0 / P1)</span>
          <div className="text-xl font-bold text-rose-600 mt-1">
            {items.filter((i) => i.priorityTier === 'P0_CRITICAL' || i.priorityTier === 'P1_HIGH').length} items
          </div>
        </div>
        <div className="p-4 rounded-xl border border-slate-200 bg-white">
          <span className="text-xs text-slate-500 font-medium">Recurring Friction Clusters</span>
          <div className="text-xl font-bold text-amber-600 mt-1">
            {items.reduce((acc, i) => acc + ((i.clusterCount ?? 0) > 1 ? 1 : 0), 0)} recurring patterns
          </div>
        </div>
        <div className="p-4 rounded-xl border border-slate-200 bg-white">
          <span className="text-xs text-slate-500 font-medium">Community Upvotes</span>
          <div className="text-xl font-bold text-signal-600 mt-1">
            {items.reduce((acc, i) => acc + i.upvotes, 0)} total votes
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* View Toggle */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
          <button
            onClick={() => setViewMode('matrix')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              viewMode === 'matrix' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-signal-600" />
            Engineering Priority Matrix
          </button>
          <button
            onClick={() => setViewMode('portal')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              viewMode === 'portal' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ThumbsUp className="h-3.5 w-3.5 text-ember-600" />
            Public Customer Portal
          </button>
        </div>

        {/* Category & Status Filters */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-700"
          >
            <option value="all">All Categories</option>
            <option value="feature_request">Feature Requests</option>
            <option value="bug_friction">Bugs / Friction</option>
            <option value="integration">Integrations</option>
            <option value="ux_improvement">UX / Navigation</option>
            <option value="pricing">Pricing & Billing</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-700"
          >
            <option value="all">All Statuses</option>
            <option value="under_review">Under Review</option>
            <option value="planned">Planned</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Feedback Items List / Matrix */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="divide-y divide-slate-100">
          {sortedItems.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              No feedback items found matching filter.
            </div>
          ) : (
            sortedItems.map((item, index) => {
              const priorityTier =
                item.priorityTier ||
                (item.priorityScore >= 80 ? 'P0_CRITICAL' : item.priorityScore >= 60 ? 'P1_HIGH' : 'P2_NORMAL');
              const isP0 = priorityTier === 'P0_CRITICAL';
              const isP1 = priorityTier === 'P1_HIGH';

              return (
                <div
                  key={item.id}
                  className="p-5 hover:bg-slate-50/70 transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  {/* Upvote Pill */}
                  <div className="flex items-center gap-4">
                    <button
                      onClick={(e) => handleUpvote(item.id, e)}
                      className="flex flex-col items-center justify-center h-12 w-12 rounded-xl border border-slate-200 bg-slate-50 hover:bg-signal-50 hover:border-signal-300 hover:text-signal-600 transition group shrink-0"
                    >
                      <ArrowUp className="h-4 w-4 text-slate-500 group-hover:text-signal-600" />
                      <span className="text-xs font-bold text-slate-800 group-hover:text-signal-600">
                        {item.upvotes}
                      </span>
                    </button>

                    {/* Content */}
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-slate-900 text-sm">{item.title}</h3>

                        {/* Priority Score Badge in Matrix Mode */}
                        {viewMode === 'matrix' && (
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                              isP0
                                ? 'bg-rose-100 text-rose-700 border border-rose-200'
                                : isP1
                                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            Score: {item.priorityScore}/100 • {priorityTier.replace('_', ' ')}
                          </span>
                        )}

                        <span className="capitalize text-[11px] bg-signal-50 text-signal-700 border border-signal-200 px-2 py-0.5 rounded-full font-medium">
                          {item.category?.replace?.('_', ' ') || item.category || 'General'}
                        </span>

                        <span className="capitalize text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                          {(item.status || 'under_review').replace('_', ' ')}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">{item.description}</p>

                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-1">
                        <span>Submitted by {item.userName || 'Anonymous'}</span>
                        <span>•</span>
                        <span className="capitalize font-medium text-slate-600">
                          Sentiment: {(item.sentiment || item.sentimentLabel || 'neutral').replace('_', ' ')}
                        </span>
                        {((item.clusterCount ?? item.recurringPatternCount) || 1) > 1 && (
                          <>
                            <span>•</span>
                            <span className="font-semibold text-amber-600 flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              {item.clusterCount ?? item.recurringPatternCount} customers reported this friction
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Metric Details in Matrix Mode */}
                  {viewMode === 'matrix' && (
                    <div className="flex items-center gap-3 self-end md:self-center shrink-0">
                      <div className="text-right">
                        <div className="text-xs font-bold text-slate-800">
                          Priority #{index + 1}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          AI Weighted Calculation
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* New Feedback Submission Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Submit Idea or Report Issue</h3>
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitFeedback} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Title / Summary
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Add Apple Pay checkout button in chat widget"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-ember-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description & Impact
                </label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain the problem or how this feature will help your workflow..."
                  className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-ember-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={categoryHint}
                    onChange={(e) => setCategoryHint(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                  >
                    <option value="feature_request">Feature Request</option>
                    <option value="bug_friction">Bug / Friction</option>
                    <option value="integration">Integration</option>
                    <option value="ux_improvement">UX / Design</option>
                    <option value="pricing">Pricing & Billing</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Customer Name"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-signal-600 px-5 py-2 text-xs font-semibold text-white hover:bg-signal-700 shadow-xs transition"
                >
                  Submit Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
