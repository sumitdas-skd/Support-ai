import React, { useEffect, useRef, useState } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
} from 'lucide-react';
import { AnalyticsSummary } from '../../types';

interface AnalyticsViewProps {
  analytics: AnalyticsSummary;
}

// Animated counter hook
function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setValue(target);
        clearInterval(timer);
      } else {
        setValue(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return value;
}

// Pie chart category colors
const PIE_COLORS = ['#a94e12', '#2e8b7a', '#6366f1', '#f59e0b', '#ec4899', '#10b981'];

// Custom tooltip for area chart
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-ink-950 text-white rounded-xl px-3 py-2 text-xs shadow-lg border border-ink-800">
        <div className="font-bold mb-1">{label}</div>
        {payload.map((p: any, i: number) => (
          <div key={i} className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: p.color }} />
            <span className="text-slate-300">{p.name}:</span>
            <span className="font-semibold">{p.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ analytics }) => {
  const totalConvCount = useCountUp(analytics.totalConversations);
  const aiRateCount = useCountUp(analytics.aiResolvedRate);
  const escalationRateCount = useCountUp(analytics.escalationRate);
  const csatCount = useCountUp(analytics.customerSatisfactionPercent);
  const avgResponseCount = useCountUp(analytics.avgResponseTimeSec);

  const pieData = analytics.questionsByCategory.map((cat) => ({
    name: cat.category,
    value: cat.count,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-display font-semibold text-slate-900">
          Support Analytics & Resolution Intelligence
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Real-time metrics on automated resolution, human escalation rates, and customer sentiment.
        </p>
      </div>

      {/* KPI Cards with animated counters */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Conversations</span>
            <MessageSquare className="h-4 w-4 text-ember-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">{totalConvCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">Past 30 days</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">AI Automation</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 tabular-nums">{aiRateCount}%</div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1">
            {analytics.aiResolvedCount} resolved by AI
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Escalations</span>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600 tabular-nums">{escalationRateCount}%</div>
          <div className="text-[11px] text-slate-400 mt-1">{analytics.escalatedCount} human transfers</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Avg Response</span>
            <Clock className="h-4 w-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">{avgResponseCount}s</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">Instant RAG retrieval</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">CSAT Score</span>
            <ThumbsUp className="h-4 w-4 text-ember-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">{csatCount}%</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">
            {analytics.feedbackHelpfulness.helpfulCount} positive ratings
          </div>
        </div>
      </div>

      {/* Area Chart: Daily Conversation Volume */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">Conversation Volume</h2>
            <p className="text-xs text-slate-500">Daily chats handled autonomously vs escalated (last 7 days)</p>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            {analytics.conversationsByDay.reduce((acc, d) => acc + d.total, 0)} total
          </span>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={analytics.conversationsByDay} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="gradResolved" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2e8b7a" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#2e8b7a" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradEscalated" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a94e12" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#a94e12" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="date"
              tickFormatter={(d) => d.slice(5)}
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="resolved"
              name="AI Resolved"
              stroke="#2e8b7a"
              strokeWidth={2}
              fill="url(#gradResolved)"
              dot={{ r: 3, fill: '#2e8b7a', strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
            <Area
              type="monotone"
              dataKey="escalated"
              name="Escalated"
              stroke="#a94e12"
              strokeWidth={2}
              fill="url(#gradEscalated)"
              dot={{ r: 3, fill: '#a94e12', strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom row: Pie chart + Bar chart + CSAT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Donut / Pie Chart — Inquiry Categories */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 mb-1">Inquiry Breakdown</h2>
          <p className="text-xs text-slate-500 mb-4">By category</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={78}
                paddingAngle={3}
                dataKey="value"
              >
                {pieData.map((_, index) => (
                  <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, name: string) => [value, name]}
                contentStyle={{
                  background: '#17130f',
                  border: '1px solid #362b1f',
                  borderRadius: 10,
                  fontSize: 11,
                  color: '#fff',
                }}
              />
              <Legend
                iconSize={8}
                iconType="circle"
                wrapperStyle={{ fontSize: 10 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar chart — Category counts */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 mb-1">Top Topics</h2>
          <p className="text-xs text-slate-500 mb-4">Customer inquiry volume</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={analytics.questionsByCategory}
              layout="vertical"
              margin={{ top: 0, right: 8, bottom: 0, left: -10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis
                type="category"
                dataKey="category"
                tick={{ fontSize: 10, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
                width={90}
              />
              <Tooltip
                contentStyle={{
                  background: '#17130f',
                  border: '1px solid #362b1f',
                  borderRadius: 10,
                  fontSize: 11,
                  color: '#fff',
                }}
              />
              <Bar dataKey="count" name="Chats" fill="#a94e12" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* CSAT Helpfulness */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-1">Message Helpfulness</h2>
            <p className="text-xs text-slate-500 mb-4">Direct customer ratings on AI answers</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <ThumbsUp className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xl font-bold text-emerald-700">
                    {analytics.feedbackHelpfulness.helpfulCount}
                  </div>
                  <div className="text-[10px] text-emerald-800 font-medium">Helpful</div>
                </div>
              </div>
              <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/50 flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
                  <ThumbsDown className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xl font-bold text-rose-700">
                    {analytics.feedbackHelpfulness.unhelpfulCount}
                  </div>
                  <div className="text-[10px] text-rose-800 font-medium">Unhelpful</div>
                </div>
              </div>
            </div>

            {/* Satisfaction bar */}
            <div className="mt-4">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-500 font-medium">Satisfaction rate</span>
                <span className="font-bold text-slate-700">{analytics.feedbackHelpfulness.percentage}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-1000"
                  style={{ width: `${analytics.feedbackHelpfulness.percentage}%` }}
                />
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 mt-4">
            <span className="font-semibold text-slate-800">Quality Guarantee: </span>
            Unhelpful ratings automatically flag conversations for supervisor review.
          </div>
        </div>
      </div>
    </div>
  );
};
