import {
  User,
  Workspace,
  Agent,
  WidgetSettings,
  KnowledgeSource,
  Conversation,
  Message,
  Customer,
  UnansweredQuestion,
  FeedbackItem,
  AnalyticsSummary,
} from '../types';

// Shared fetch wrapper: throws a real Error (with the server's message when
// available) for non-2xx responses instead of silently resolving with an
// error-shaped JSON body as if it were a success payload.
async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  let body: any = null;
  try {
    body = await res.json();
  } catch {
    // Non-JSON or empty body; fall through to status-based handling below.
  }
  if (!res.ok) {
    const message = (body && (body.error || body.message)) || `Request failed with status ${res.status}`;
    throw new Error(message);
  }
  return body as T;
}

const jsonHeaders = { 'Content-Type': 'application/json' };

export const api = {
  // Auth & Workspace
  async getMe(): Promise<{ user: User; workspace: Workspace; members: any[] }> {
    return request('/api/auth/me');
  },

  async login(email: string, password?: string): Promise<{ user: User; workspace: Workspace }> {
    return request('/api/auth/login', {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify({ email, password }),
    });
  },

  async register(data: { email: string; name: string; businessName?: string }): Promise<{ user: User; workspace: Workspace }> {
    return request('/api/auth/register', {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify(data),
    });
  },

  async completeOnboarding(data: {
    businessName: string;
    businessDescription: string;
    website: string;
    focusAreas: string[];
  }): Promise<{ success: boolean; workspace: Workspace; agent: Agent }> {
    return request('/api/onboarding/complete', {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify(data),
    });
  },

  // Agent & Widget
  async getAgent(): Promise<{ agent: Agent; widgetSettings: WidgetSettings }> {
    return request('/api/agent');
  },

  async updateAgent(data: { agent?: Partial<Agent>; widgetSettings?: Partial<WidgetSettings> }): Promise<{ agent: Agent; widgetSettings: WidgetSettings }> {
    return request('/api/agent', {
      method: 'PUT',
      headers: jsonHeaders,
      body: JSON.stringify(data),
    });
  },

  // Knowledge Base
  async getKnowledge(): Promise<{ sources: KnowledgeSource[]; chunksCount: number }> {
    return request('/api/knowledge');
  },

  async addKnowledgeSource(data: { type: string; title: string; content: string; url?: string }): Promise<{ source: KnowledgeSource; newChunksCount: number }> {
    return request('/api/knowledge/source', {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify(data),
    });
  },

  async scrapeUrl(url: string): Promise<{ source: KnowledgeSource; chunksCount: number }> {
    return request('/api/knowledge/scrape', {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify({ url }),
    });
  },

  async deleteKnowledgeSource(id: string): Promise<{ success: boolean }> {
    return request(`/api/knowledge/source/${id}`, { method: 'DELETE' });
  },

  // Chat & RAG
  async sendChatMessage(params: {
    conversationId?: string;
    message: string;
    customerEmail?: string;
    customerName?: string;
  }): Promise<{
    conversationId: string;
    userMessage: Message;
    aiMessage: Message;
    conversationStatus: string;
    escalated: boolean;
    sourcesUsed: string[];
    usage: any;
  }> {
    return request('/api/chat', {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify(params),
    });
  },

  // Conversations & Human Desk
  async getConversations(): Promise<{ conversations: Conversation[]; messages: Record<string, Message[]> }> {
    return request('/api/conversations');
  },

  async getConversation(id: string): Promise<{ conversation: Conversation; messages: Message[] }> {
    return request(`/api/conversations/${id}`);
  },

  async sendHumanMessage(conversationId: string, text: string, senderName?: string): Promise<{ message: Message; conversation: Conversation }> {
    return request(`/api/conversations/${conversationId}/messages`, {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify({ text, senderName }),
    });
  },

  async updateConversation(conversationId: string, updates: Partial<Conversation>): Promise<{ conversation: Conversation }> {
    return request(`/api/conversations/${conversationId}`, {
      method: 'PATCH',
      headers: jsonHeaders,
      body: JSON.stringify(updates),
    });
  },

  async submitMessageFeedback(messageId: string, feedback: 'helpful' | 'unhelpful'): Promise<{ success: boolean; message: Message }> {
    return request(`/api/messages/${messageId}/feedback`, {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify({ feedback }),
    });
  },

  // Customers & Analytics
  async getCustomers(): Promise<{ customers: Customer[] }> {
    return request('/api/customers');
  },

  async getAnalytics(): Promise<{ analytics: AnalyticsSummary }> {
    return request('/api/analytics');
  },

  // Unanswered Questions
  async getUnansweredQuestions(): Promise<{ questions: UnansweredQuestion[] }> {
    return request('/api/unanswered-questions');
  },

  async addAnswerToKnowledgeBase(questionId: string, answer: string): Promise<{ success: boolean; question: UnansweredQuestion; source: KnowledgeSource }> {
    return request(`/api/unanswered-questions/${questionId}/add-to-kb`, {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify({ answer }),
    });
  },

  // User's Dedicated Feedback Portal & Prioritization
  async getFeedbackPortalItems(): Promise<{ feedbackItems: FeedbackItem[] }> {
    return request('/api/feedback/portal');
  },

  async submitFeedback(data: {
    title: string;
    description: string;
    userName?: string;
    userEmail?: string;
    categoryHint?: string;
  }): Promise<{ feedbackItem: FeedbackItem }> {
    return request('/api/feedback/portal', {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify(data),
    });
  },

  async upvoteFeedback(id: string): Promise<{ feedbackItem: FeedbackItem }> {
    return request(`/api/feedback/portal/${id}/upvote`, { method: 'POST' });
  },

  async rePrioritizeFeedback(): Promise<{ success: boolean; message: string; feedbackItems: FeedbackItem[] }> {
    return request('/api/feedback/re-prioritize', { method: 'POST' });
  },

  // Billing
  async upgradePlan(plan: string): Promise<{ success: boolean; plan: string; usage: any }> {
    return request('/api/billing/upgrade', {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify({ plan }),
    });
  },

  // Shopify
  async lookupShopifyOrder(orderNumber: string): Promise<any> {
    return request(`/api/integrations/shopify/orders/${orderNumber}`);
  },
};
