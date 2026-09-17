import React, { useEffect, useState } from 'react';
import {
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Minus,
  BookOpen,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import {
  AnalyticsSummary,
  Conversation,
  Workspace,
  Agent,
  KnowledgeSource,
  UnansweredQuestion,
} from '../../types';

function useCountUp(target: number, duration = 900) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setValue(target); clearInterval(timer); }
      else { setValue(Math.floor(start)); }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return value;
}

interface OverviewViewProps {
  analytics: AnalyticsSummary;
  recentConversations: Conversation[];
  workspace: Workspace;
  agent: Agent;
  knowledgeSources: KnowledgeSource[];
  unansweredQuestions: UnansweredQuestion[];
  onNavigate: (view: string) => void;
  onSelectConversation: (id: string) => void;
  onOpenTestChat: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  analytics,
  recentConversations,
  workspace,
  agent,
  knowledgeSources,
  unansweredQuestions,
  onNavigate,
  onSelectConversation,
  onOpenTestChat,
}) => {
  // Honest week-over-week trend, derived from real daily totals instead of
  // an invented percentage.
  const days = analytics.conversationsByDay;
  let trendPct: number | null = null;
  if (days.length >= 2) {
    const midpoint = Math.floor(days.length / 2);
    const firstHalf = days.slice(0, midpoint);
    const secondHalf = days.slice(midpoint);
    const firstAvg = firstHalf.reduce((sum, d) => sum + d.total, 0) / (firstHalf.length || 1);
    const secondAvg = secondHalf.reduce((sum, d) => sum + d.total, 0) / (secondHalf.length || 1);
    if (firstAvg > 0) {
      trendPct = Math.round(((secondAvg - firstAvg) / firstAvg) * 100);
    }
  }

  const resolutionSegments = Math.max(0, Math.min(4, Math.round((analytics.aiResolvedRate / 100) * 4)));
  const totalChunks = knowledgeSources.reduce((sum, s) => sum + s.chunkCount, 0);
  const unresolvedQuestions = unansweredQuestions.filter((q) => q.status !== 'resolved').slice(0, 2);
  const unresolvedCount = unansweredQuestions.filter((q) => q.status !== 'resolved').length;

  const totalConvAnimated = useCountUp(analytics.totalConversations);
  const aiRateAnimated = useCountUp(analytics.aiResolvedRate);
  const avgRespAnimated = useCountUp(analytics.avgResponseTimeSec);
  const escalatedAnimated = useCountUp(analytics.escalatedCount);

  return (
    <div className="space-y-4">
      <div className="mb-1">
        <h1 className="font-display text-xl font-semibold text-ink-950">Overview</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          {agent.name} is handling support for {workspace.name}.
        </p>
      </div>

      {/* High Density Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-tight">
            Total Conversations
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">{totalConvAnimated}</div>
          {trendPct !== null ? (
            <div
              className={`text-[10px] font-medium mt-1 flex items-center gap-1 ${
                trendPct > 0 ? 'text-emerald-600' : trendPct < 0 ? 'text-rose-600' : 'text-slate-400'
              }`}
            >
              {trendPct > 0 ? (
                <TrendingUp className="h-3 w-3" />
              ) : trendPct < 0 ? (
                <TrendingDown className="h-3 w-3" />
              ) : (
                <Minus className="h-3 w-3" />
              )}
              <span>
                {trendPct > 0 ? '+' : ''}
                {trendPct}% vs. earlier this week
              </span>
            </div>
          ) : (
            <div className="text-[10px] text-slate-400 mt-1">Trend builds up as data comes in</div>
          )}
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-tight">
            AI Resolution Rate
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">{aiRateAnimated}%</div>
          <div className="flex gap-1 mt-2">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full ${i < resolutionSegments ? 'bg-emerald-500' : 'bg-slate-200'}`}
              />
            ))}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-tight">
            Avg Response Time
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">{avgRespAnimated}s</div>
          <div className="text-[10px] text-signal-600 font-medium mt-1">Instant RAG response</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-tight">
            Human Escalations
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">{escalatedAnimated}</div>
          <div className="text-[10px] text-slate-400 mt-1">{analytics.escalationRate}% of total traffic</div>
        </div>
      </div>

      {/* Main High Density Grid: Table (Col-span 2) + Knowledge & Improvements (Col-span 1) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column: Recent Conversations Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white">
            <div>
              <h2 className="font-bold text-slate-800 text-sm">Recent Conversations</h2>
              <p className="text-[11px] text-slate-400">Live interactions handled by AI and human agents</p>
            </div>
            <button
              onClick={() => onNavigate('conversations')}
              className="text-xs font-semibold text-signal-600 hover:text-signal-700 hover:underline flex items-center gap-1"
            >
              View All ({recentConversations.length})
            </button>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 text-[10px] uppercase text-slate-500 font-bold border-b border-slate-100">
                <tr>
                  <th className="px-4 py-2.5">Customer</th>
                  <th className="px-4 py-2.5">Last Message</th>
                  <th className="px-4 py-2.5">Status</th>
                  <th className="px-4 py-2.5">Sentiment</th>
                  <th className="px-4 py-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="text-xs text-slate-600 divide-y divide-slate-100">
                {recentConversations.slice(0, 6).map((conv) => (
                  <tr
                    key={conv.id}
                    onClick={() => {
                      onSelectConversation(conv.id);
                      onNavigate('conversations');
                    }}
                    className="border-b border-slate-50 hover:bg-slate-50/80 cursor-pointer transition"
                  >
                    <td className="px-4 py-2.5 font-medium text-slate-900">
                      <div>{conv.customerName}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{conv.customerEmail}</div>
                    </td>
                    <td className="px-4 py-2.5 max-w-[200px] truncate text-slate-700">
                      "{conv.lastMessage}"
                    </td>
                    <td className="px-4 py-2.5">
                      {conv.status === 'resolved' && (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-medium">
                          AI Resolved
                        </span>
                      )}
                      {conv.status === 'waiting_human' && (
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-[10px] font-medium">
                          Escalated
                        </span>
                      )}
                      {conv.status === 'ai_handling' && (
                        <span className="px-2 py-0.5 bg-signal-100 text-signal-700 rounded-full text-[10px] font-medium">
                          AI Chatting
                        </span>
                      )}
                      {conv.status === 'human_handling' && (
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-[10px] font-medium">
                          Human Active
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 capitalize text-[11px]">
                      {conv.sentiment === 'positive' && (
                        <span className="text-emerald-600 font-medium">Positive</span>
                      )}
                      {conv.sentiment === 'neutral' && (
                        <span className="text-slate-500">Neutral</span>
                      )}
                      {conv.sentiment === 'negative' && (
                        <span className="text-rose-600 font-medium">Negative</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <span className="text-signal-600 font-semibold hover:underline text-[11px]">
                        Open →
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Knowledge Status & AI Improvements */}
        <div className="flex flex-col gap-4">
          {/* Knowledge Status Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
            <h2 className="font-bold text-slate-800 text-sm mb-3">Knowledge Status</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-bold text-slate-700">Support Docs & FAQs</div>
                  <div className="text-[10px] text-slate-400">
                    {totalChunks.toLocaleString()} chunks embedded
                  </div>
                </div>
                <div className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  READY
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-bold text-slate-700">Company Website Crawler</div>
                  <div className="text-[10px] text-slate-400">{workspace.website || 'acmestore.io'}</div>
                </div>
                <div className="text-[10px] font-bold text-signal-600 bg-signal-50 px-2 py-0.5 rounded border border-signal-200">
                  SYNCED
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('knowledge')}
              className="w-full mt-3.5 py-1.5 border border-dashed border-slate-300 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
            >
              + Add Knowledge Source
            </button>
          </div>

          {/* AI Improvements (High Density Theme Accent Module) */}
          <div className="bg-ink-950 rounded-xl p-4 text-white shadow-2xs flex-1 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-2">
                <h2 className="font-bold text-sm">AI Improvements</h2>
                {unresolvedCount > 0 && (
                  <span className="px-1.5 py-0.5 bg-signal-500 text-white text-[10px] rounded uppercase font-bold">
                    {unresolvedCount} New
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 mb-3">
                Questions the AI couldn't answer confidently from existing docs
              </p>

              {unresolvedQuestions.length > 0 ? (
                <div className="space-y-2">
                  {unresolvedQuestions.map((q) => (
                    <div key={q.id} className="p-2.5 bg-ink-900/80 rounded-lg border border-ink-700">
                      <div className="text-[10px] text-signal-400 font-bold mb-0.5">Customer asked:</div>
                      <div className="text-xs text-slate-200 leading-relaxed italic line-clamp-2">
                        "{q.question}"
                      </div>
                      <button
                        onClick={() => onNavigate('unanswered')}
                        className="mt-2 text-[10px] bg-signal-600 hover:bg-signal-500 text-white px-2.5 py-1 rounded font-bold transition"
                      >
                        Teach Answer
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 bg-ink-900/80 rounded-lg border border-ink-700 flex items-center gap-2.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                  <div className="text-xs text-slate-300">All caught up — no unanswered questions right now.</div>
                </div>
              )}
            </div>

            <div className="pt-3 mt-3 border-t border-ink-700/60 flex items-center justify-between text-[11px] text-slate-400">
              <span>Zero hallucinations active</span>
              <button
                onClick={() => onNavigate('unanswered')}
                className="text-signal-400 hover:underline font-semibold"
              >
                Review All →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
