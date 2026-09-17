import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  X,
  Send,
  User,
  Bot,
  ThumbsUp,
  ThumbsDown,
  ExternalLink,
  LifeBuoy,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Minimize2,
  Maximize2,
} from 'lucide-react';
import { Agent, WidgetSettings, Message } from '../types';
import { api } from '../services/api';

interface ChatWidgetProps {
  agent: Agent;
  settings: WidgetSettings;
  isOpen: boolean;
  onClose: () => void;
  onOpen?: () => void;
  standalone?: boolean;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({
  agent,
  settings,
  isOpen,
  onClose,
  onOpen,
  standalone = false,
}) => {
  const [conversationId, setConversationId] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEscalated, setIsEscalated] = useState(false);
  const [customerName, setCustomerName] = useState('Website Visitor');
  const [customerEmail, setCustomerEmail] = useState('');
  const [showLeadPrompt, setShowLeadPrompt] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState<Record<string, 'helpful' | 'unhelpful'>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with agent greeting
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'msg_welcome',
          conversationId: 'conv_init',
          sender: 'ai',
          senderName: agent.name,
          text: settings.greeting || agent.greeting,
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  }, [agent, settings]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (!isOpen || standalone) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, standalone, onClose]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: `msg_u_${Date.now()}`,
      conversationId: conversationId || 'temp',
      sender: 'customer',
      senderName: customerName,
      text: text.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const res = await api.sendChatMessage({
        conversationId: conversationId || undefined,
        message: text.trim(),
        customerEmail: customerEmail || undefined,
        customerName,
      });

      setConversationId(res.conversationId);
      setMessages((prev) => [...prev, res.aiMessage]);
      if (res.escalated) {
        setIsEscalated(true);
      }
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `msg_err_${Date.now()}`,
          conversationId: conversationId || 'temp',
          sender: 'ai',
          senderName: agent.name,
          text: 'I ran into a temporary connection issue. Would you like me to connect you with our human support team?',
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEscalateToHuman = () => {
    handleSend('Please connect me with a human support agent.');
  };

  const handleFeedback = async (messageId: string, feedback: 'helpful' | 'unhelpful') => {
    setFeedbackGiven((prev) => ({ ...prev, [messageId]: feedback }));
    try {
      await api.submitMessageFeedback(messageId, feedback);
    } catch (e) {
      console.error('Feedback error', e);
    }
  };

  const quickQuestions = [
    'What is your return policy?',
    'How long does shipping take?',
    'Tell me about warranty & guarantees',
    'Where is my order #ACM-98421?',
  ];

  if (!isOpen && !standalone) {
    return (
      <div className={`fixed z-50 ${settings.launcherPosition === 'bottom-left' ? 'bottom-5 left-5' : 'bottom-5 right-5'}`}>
        {/* Pulsing glow ring */}
        <span
          className="absolute inset-0 rounded-full animate-ping opacity-25 pointer-events-none"
          style={{ backgroundColor: settings.primaryColor || '#a94e12' }}
        />
        <div className="relative group">
          <button
            onClick={onOpen}
            style={{ backgroundColor: settings.primaryColor || '#a94e12' }}
            className="relative flex h-14 w-14 items-center justify-center rounded-full text-white
              shadow-2xl hover:scale-110 active:scale-95 transition-all duration-200
              focus:outline-none focus:ring-4 focus:ring-ember-300/50
              ring-2 ring-white/20 backdrop-blur-sm"
            title="Open Support Chat"
            aria-label="Open Support Chat"
          >
            <MessageSquare className="h-6 w-6 transition-transform group-hover:-rotate-6 drop-shadow" />
          </button>
          {/* Glassmorphism tooltip */}
          <div className="absolute bottom-full mb-3 right-0 pointer-events-none
            opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0">
            <div className="bg-ink-950/90 backdrop-blur-md text-white text-xs font-semibold
              px-3 py-1.5 rounded-xl shadow-lg border border-white/10 whitespace-nowrap">
              💬 Chat with AI Support
            </div>
          </div>
        </div>
      </div>
    );
  }

  const containerClasses = standalone
    ? 'w-full max-w-md mx-auto h-[600px] border border-slate-200 rounded-2xl shadow-xl bg-white flex flex-col overflow-hidden'
    : `fixed z-50 ${
        settings.launcherPosition === 'bottom-left' ? 'bottom-5 left-5' : 'bottom-5 right-5'
      } w-[92vw] sm:w-[380px] h-[580px] max-h-[85vh] rounded-2xl shadow-2xl border border-slate-200 bg-white flex flex-col overflow-hidden transition-all duration-200`;

  return (
    <div className={containerClasses}>
      {/* Widget Header */}
      <div
        style={{ backgroundColor: settings.primaryColor || '#a94e12' }}
        className="px-4 py-3.5 text-white flex items-center justify-between shadow-sm select-none"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            {agent.avatar ? (
              <img
                src={agent.avatar}
                alt={agent.name}
                className="h-9 w-9 rounded-full object-cover border-2 border-white/60 shadow-xs"
              />
            ) : (
              <div className="h-9 w-9 rounded-full bg-white/20 flex items-center justify-center font-bold">
                {agent.name.charAt(0)}
              </div>
            )}
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-white"></span>
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-semibold text-sm leading-tight">
              <span>{settings.widgetTitle || agent.name}</span>
              <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full font-normal">
                AI Agent
              </span>
            </div>
            <p className="text-[11px] text-white/80 leading-tight">
              {settings.welcomeSubtext || 'Answers 24/7 using company knowledge'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-white/80">
          {!standalone && (
            <button
              onClick={onClose}
              className="p-1 rounded-md hover:bg-white/20 hover:text-white transition"
              title="Close chat"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Escalation Banner if Waiting for Human */}
      {isEscalated && (
        <div className="bg-amber-50 border-b border-amber-200 px-3.5 py-2 flex items-center justify-between text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <LifeBuoy className="h-4 w-4 text-amber-600 shrink-0" />
            <span>Transferred to human support team. An agent will respond soon.</span>
          </div>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
        {messages.map((msg) => {
          const isUser = msg.sender === 'customer';
          const isHumanAgent = msg.sender === 'human';

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-start gap-2 max-w-[85%]">
                {!isUser && (
                  <div className="h-7 w-7 rounded-full bg-signal-100 text-signal-700 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                    {isHumanAgent ? 'H' : 'AI'}
                  </div>
                )}
                <div>
                  <div
                    style={isUser ? { backgroundColor: settings.primaryColor || '#a94e12' } : undefined}
                    className={`rounded-xl px-3.5 py-2.5 text-xs shadow-2xs leading-relaxed ${
                      isUser
                        ? 'text-white rounded-br-xs'
                        : isHumanAgent
                        ? 'bg-emerald-50 text-slate-800 border border-emerald-200 rounded-bl-xs'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs'
                    }`}
                  >
                    {isHumanAgent && (
                      <div className="text-[10px] font-bold text-emerald-700 mb-1 flex items-center gap-1">
                        <User className="h-3 w-3" />
                        Human Specialist ({msg.senderName})
                      </div>
                    )}
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>

                  {/* Sources chips if available */}
                  {!isUser && msg.sourcesUsed && msg.sourcesUsed.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {msg.sourcesUsed.map((src, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 text-[10px] bg-slate-200/70 text-slate-700 px-2 py-0.5 rounded-md font-medium"
                        >
                          <Sparkles className="h-2.5 w-2.5 text-ember-600" />
                          {src}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Message Timestamp & Thumbs Up / Down */}
                  <div
                    className={`flex items-center gap-2 mt-1 px-1 text-[10px] text-slate-400 ${
                      isUser ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <span>
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>

                    {!isUser && !isHumanAgent && (
                      <div className="flex items-center gap-1 ml-2">
                        <button
                          onClick={() => handleFeedback(msg.id, 'helpful')}
                          className={`p-0.5 hover:text-emerald-600 transition ${
                            feedbackGiven[msg.id] === 'helpful' ? 'text-emerald-600 font-bold' : ''
                          }`}
                          title="Helpful"
                        >
                          <ThumbsUp className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => handleFeedback(msg.id, 'unhelpful')}
                          className={`p-0.5 hover:text-rose-600 transition ${
                            feedbackGiven[msg.id] === 'unhelpful' ? 'text-rose-600 font-bold' : ''
                          }`}
                          title="Not helpful"
                        >
                          <ThumbsDown className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* AI Typing Indicator */}
        {isLoading && (
          <div className="flex items-center gap-2 text-slate-400 text-xs pl-2">
            <div className="flex space-x-1">
              <div className="h-2 w-2 rounded-full bg-ember-500 animate-bounce"></div>
              <div className="h-2 w-2 rounded-full bg-ember-500 animate-bounce [animation-delay:0.2s]"></div>
              <div className="h-2 w-2 rounded-full bg-ember-500 animate-bounce [animation-delay:0.4s]"></div>
            </div>
            <span>{agent.name} is checking business knowledge...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Inquiries */}
      {messages.length <= 2 && (
        <div className="p-2 border-t border-slate-100 bg-white">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-1.5 px-1">Suggested questions:</p>
          <div className="flex flex-wrap gap-1.5">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-md text-left transition font-medium"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Box */}
      <div className="p-3 border-t border-slate-200 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your question..."
            className="flex-1 rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-ember-500 focus:outline-none transition"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            style={{ backgroundColor: settings.primaryColor || '#a94e12' }}
            className="flex h-8 w-8 items-center justify-center rounded-md text-white shadow-xs hover:opacity-90 disabled:opacity-40 transition shrink-0"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </form>

        {/* Footer toolbar: Human Agent option & Powered by */}
        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 px-1">
          {settings.enableHumanEscalation && !isEscalated ? (
            <button
              type="button"
              onClick={handleEscalateToHuman}
              className="text-signal-700 hover:underline flex items-center gap-1 font-medium"
            >
              <LifeBuoy className="h-3 w-3" />
              Request Human Agent
            </button>
          ) : (
            <span className="text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Verified Knowledge
            </span>
          )}
          <span>Powered by SupportAI</span>
        </div>
      </div>
    </div>
  );
};
