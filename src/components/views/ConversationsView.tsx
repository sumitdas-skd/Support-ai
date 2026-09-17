import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Search,
  CheckCircle2,
  AlertTriangle,
  User,
  Bot,
  Send,
  LifeBuoy,
  Clock,
  Sparkles,
  Check,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { Conversation, Message, User as AuthUser } from '../../types';
import { api } from '../../services/api';

interface ConversationsViewProps {
  conversations: Conversation[];
  selectedConversationId?: string;
  onSelectConversation: (id: string) => void;
  currentUser: AuthUser | null;
  onRefresh: () => void;
}

export const ConversationsView: React.FC<ConversationsViewProps> = ({
  conversations,
  selectedConversationId,
  onSelectConversation,
  currentUser,
  onRefresh,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);
  const [humanReplyText, setHumanReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Set initial active conversation
  useEffect(() => {
    if (conversations.length === 0) return;
    const targetId = selectedConversationId || conversations[0].id;
    loadConversationDetails(targetId);
  }, [selectedConversationId, conversations]);

  const loadConversationDetails = async (id: string) => {
    try {
      const res = await api.getConversation(id);
      setActiveConv(res.conversation);
      setMessages(res.messages);
      onSelectConversation(id);
    } catch (e) {
      console.error('Load conversation error:', e);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const filteredConversations = conversations.filter((c) => {
    const matchesStatus = filterStatus === 'all' || c.status === filterStatus;
    const query = (searchQuery || '').toLowerCase();
    const matchesSearch =
      (c.customerName || '').toLowerCase().includes(query) ||
      (c.customerEmail || '').toLowerCase().includes(query) ||
      (c.lastMessage || '').toLowerCase().includes(query);
    return matchesStatus && matchesSearch;
  });

  const handleSendHumanReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!humanReplyText.trim() || !activeConv || sendingReply) return;

    setSendingReply(true);
    try {
      const res = await api.sendHumanMessage(
        activeConv.id,
        humanReplyText.trim(),
        currentUser?.name || 'Support Specialist'
      );
      setMessages((prev) => [...prev, res.message]);
      setActiveConv(res.conversation);
      setHumanReplyText('');
      onRefresh();
    } catch (err) {
      console.error('Human reply error', err);
    } finally {
      setSendingReply(false);
    }
  };

  const handleStatusChange = async (newStatus: Conversation['status']) => {
    if (!activeConv) return;
    try {
      const res = await api.updateConversation(activeConv.id, { status: newStatus });
      setActiveConv(res.conversation);
      onRefresh();
    } catch (e) {
      console.error('Status change error', e);
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
        {/* Left Column: Conversation List */}
        <div className="w-full sm:w-80 lg:w-96 border-r border-slate-200 flex flex-col bg-white shrink-0">
          {/* List Header & Filters */}
          <div className="p-4 border-b border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-slate-900 text-sm">Inbox & Live Chats</h2>
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-semibold">
                {filteredConversations.length}
              </span>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name, email, query..."
                className="w-full rounded-xl border border-slate-300 pl-8 pr-3 py-1.5 text-xs focus:border-ember-500 focus:outline-none"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px]">
              {[
                { id: 'all', label: 'All' },
                { id: 'waiting_human', label: 'Needs Human' },
                { id: 'human_handling', label: 'In Progress' },
                { id: 'ai_handling', label: 'AI Active' },
                { id: 'resolved', label: 'Resolved' },
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setFilterStatus(pill.id)}
                  className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition text-xs ${
                    filterStatus === pill.id
                      ? 'bg-slate-900 text-white font-semibold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>

          {/* Conversation List Items */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No conversations found.
              </div>
            ) : (
              filteredConversations.map((c) => {
                const isSelected = activeConv?.id === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => loadConversationDetails(c.id)}
                    className={`w-full text-left p-3.5 hover:bg-slate-50 transition flex flex-col gap-1.5 ${
                      isSelected ? 'bg-signal-50/80 border-l-3 border-signal-600' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-slate-900 truncate">
                        {c.customerName}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(c.updatedAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-1">{c.lastMessage}</p>

                    <div className="flex items-center justify-between mt-1 pt-1">
                      {c.status === 'ai_handling' && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-ember-700 bg-ember-100/70 px-2 py-0.5 rounded-full font-medium">
                          <Bot className="h-3 w-3" /> AI Handling
                        </span>
                      )}
                      {c.status === 'waiting_human' && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full font-bold animate-pulse">
                          <AlertTriangle className="h-3 w-3" /> Needs Human
                        </span>
                      )}
                      {c.status === 'human_handling' && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full font-medium">
                          <User className="h-3 w-3" /> Human Staff
                        </span>
                      )}
                      {c.status === 'resolved' && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-medium">
                          <CheckCircle2 className="h-3 w-3" /> Resolved
                        </span>
                      )}

                      <span className="text-[11px]">
                        {c.sentiment === 'positive' && '😊'}
                        {c.sentiment === 'neutral' && '😐'}
                        {c.sentiment === 'negative' && '⚠️'}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Chat Detail and Operator Desk */}
        {activeConv ? (
          <div className="flex-1 flex flex-col bg-slate-50">
            {/* Conversation Header */}
            <div className="p-4 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-sm">
                  {activeConv.customerName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-sm">{activeConv.customerName}</h3>
                    <span className="text-xs text-slate-400">({activeConv.customerEmail})</span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-0.5">
                    <span>Sentiment: <strong className="capitalize">{activeConv.sentiment}</strong></span>
                    <span>•</span>
                    <span>Started: {new Date(activeConv.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Status Actions */}
              <div className="flex items-center gap-2">
                <select
                  value={activeConv.status}
                  onChange={(e) => handleStatusChange(e.target.value as any)}
                  className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none"
                >
                  <option value="ai_handling">AI Handling</option>
                  <option value="waiting_human">Waiting for Human</option>
                  <option value="human_handling">Human Handling</option>
                  <option value="resolved">Mark as Resolved</option>
                </select>

                {activeConv.status !== 'resolved' ? (
                  <button
                    onClick={() => handleStatusChange('resolved')}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 transition"
                  >
                    <Check className="h-3.5 w-3.5" />
                    Resolve
                  </button>
                ) : (
                  <button
                    onClick={() => handleStatusChange('human_handling')}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                  >
                    Reopen Chat
                  </button>
                )}
              </div>
            </div>

            {/* Escalation Alert if waiting for human */}
            {activeConv.status === 'waiting_human' && (
              <div className="bg-amber-100 border-b border-amber-200 px-4 py-2.5 flex items-center justify-between text-xs text-amber-900">
                <div className="flex items-center gap-2 font-medium">
                  <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                  <span>
                    Customer requested human assistance or AI triggered escalation. Take over the conversation below.
                  </span>
                </div>
                <button
                  onClick={() => handleStatusChange('human_handling')}
                  className="bg-amber-600 text-white font-semibold px-2.5 py-1 rounded-lg text-xs hover:bg-amber-700 transition"
                >
                  Accept & Reply
                </button>
              </div>
            )}

            {/* Messages Timeline */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((m) => {
                const isCustomer = m.sender === 'customer';
                const isHuman = m.sender === 'human';

                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${isCustomer ? 'items-start' : 'items-end'}`}
                  >
                    <div className="flex items-start gap-2.5 max-w-xl">
                      {isCustomer && (
                        <div className="h-8 w-8 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                          {activeConv.customerName.charAt(0)}
                        </div>
                      )}

                      <div>
                        <div className="flex items-center gap-1.5 mb-1 px-1 text-[11px] text-slate-400">
                          <span className="font-semibold text-slate-700">{m.senderName}</span>
                          <span>•</span>
                          <span>{new Date(m.timestamp).toLocaleTimeString()}</span>
                        </div>

                        <div
                          className={`p-3 rounded-xl text-xs leading-relaxed shadow-2xs ${
                            isCustomer
                              ? 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs'
                              : isHuman
                              ? 'bg-slate-800 text-white rounded-tr-xs'
                              : 'bg-signal-600 text-white rounded-tr-xs'
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{m.text}</p>
                        </div>

                        {/* Source citations tag */}
                        {!isCustomer && m.sourcesUsed && m.sourcesUsed.length > 0 && (
                          <div className="mt-1 flex flex-wrap gap-1 justify-end">
                            {m.sourcesUsed.map((s, idx) => (
                              <span
                                key={idx}
                                className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md font-medium"
                              >
                                Grounding: {s}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {!isCustomer && (
                        <div
                          className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs text-white shrink-0 mt-0.5 ${
                            isHuman ? 'bg-slate-900' : 'bg-signal-600'
                          }`}
                        >
                          {isHuman ? 'H' : 'AI'}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Human Agent Reply Bar */}
            <div className="p-3.5 bg-white border-t border-slate-200">
              <form onSubmit={handleSendHumanReply} className="flex items-center gap-2">
                <input
                  type="text"
                  value={humanReplyText}
                  onChange={(e) => setHumanReplyText(e.target.value)}
                  placeholder={`Reply to ${activeConv.customerName} as human support operator...`}
                  className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:border-signal-500 focus:outline-none transition"
                />
                <button
                  type="submit"
                  disabled={!humanReplyText.trim() || sendingReply}
                  className="inline-flex items-center gap-1.5 rounded-md bg-signal-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-signal-700 disabled:opacity-40 transition shrink-0"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>{sendingReply ? 'Sending...' : 'Send as Human'}</span>
                </button>
              </form>
              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                <span>Replying will automatically mark ticket as Human Handled.</span>
                <span>Support Desk Operator: {currentUser?.name || 'Admin'}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400 text-xs">
            Select a conversation from the left to review messages.
          </div>
        )}
      </div>
    </div>
  );
};
