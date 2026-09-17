export type UserRole = 'owner' | 'admin' | 'agent' | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  createdAt: string;
}

export type PlanType = 'free' | 'starter' | 'growth' | 'pro';

export interface WorkspaceUsage {
  aiMessages: number;
  maxMessages: number;
  docsCount: number;
  maxDocs: number;
  activeConversations: number;
}

export interface Workspace {
  id: string;
  name: string;
  industry: string;
  website: string;
  slug: string;
  plan: PlanType;
  usage: WorkspaceUsage;
  createdAt: string;
}

export interface WorkspaceMember {
  id: string;
  workspaceId: string;
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'active' | 'invited';
  joinedAt: string;
}

export type AgentPersonality = 'friendly' | 'professional' | 'casual' | 'concise' | 'helpful';
export type ResponseLength = 'short' | 'balanced' | 'detailed';

export interface EscalationRules {
  customerRequestsHuman: boolean;
  unknownAnswerThreshold: boolean;
  refundDispute: boolean;
  angrySentiment: boolean;
  technicalIssue: boolean;
  highValueCustomer: boolean;
}

export interface Agent {
  id: string;
  workspaceId: string;
  name: string;
  avatar: string;
  roleTitle: string;
  personality: AgentPersonality;
  instructions: string;
  greeting: string;
  language: string;
  responseLength: ResponseLength;
  escalationRules: EscalationRules;
  escalationTriggers?: string[];
  customEscalationTrigger?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WidgetSettings {
  agentId: string;
  widgetTitle: string;
  greeting: string;
  primaryColor: string;
  launcherPosition: 'bottom-right' | 'bottom-left';
  logoUrl?: string;
  enableHumanEscalation: boolean;
  welcomeSubtext?: string;
}

export type KnowledgeSourceType = 'website' | 'text' | 'faq' | 'document';
export type KnowledgeStatus = 'ready' | 'processing' | 'failed';

export interface KnowledgeSource {
  id: string;
  workspaceId: string;
  type: KnowledgeSourceType;
  title: string;
  content: string;
  url?: string;
  status: KnowledgeStatus;
  chunkCount: number;
  createdAt: string;
  updatedAt: string;
  error?: string;
}

export interface KnowledgeChunk {
  id: string;
  sourceId: string;
  workspaceId: string;
  sourceTitle: string;
  sourceType: KnowledgeSourceType;
  text: string;
  embedding?: number[];
  similarityScore?: number;
}

export type ConversationStatus = 'open' | 'ai_handling' | 'waiting_human' | 'human_handling' | 'resolved';
export type SentimentType = 'positive' | 'neutral' | 'negative';

export interface Conversation {
  id: string;
  workspaceId: string;
  agentId: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  status: ConversationStatus;
  sentiment: SentimentType;
  assignedTo?: string;
  lastMessage: string;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  sender: 'customer' | 'ai' | 'human';
  senderName: string;
  text: string;
  timestamp: string;
  feedback?: 'helpful' | 'unhelpful' | null;
  sourcesUsed?: string[];
  isEscalationNotice?: boolean;
}

export interface Customer {
  id: string;
  workspaceId: string;
  name: string;
  email: string;
  phone?: string;
  totalConversations: number;
  csatScore?: number;
  tags: string[];
  lastSeen: string;
  company?: string;
  createdAt: string;
  metadata?: {
    recentOrder?: string;
    lifetimeValue?: number;
  };
}

export interface UnansweredQuestion {
  id: string;
  workspaceId: string;
  question: string;
  count: number;
  lastAsked: string;
  status: 'unresolved' | 'resolved';
  suggestedAnswer?: string;
  category?: string;
}

export type FeedbackCategory =
  | 'feature_request'
  | 'bug_friction'
  | 'integration'
  | 'ux_improvement'
  | 'pricing'
  | 'performance';

export type FeedbackStatus = 'under_review' | 'planned' | 'in_progress' | 'completed';

export interface FeedbackItem {
  id: string;
  workspaceId: string;
  title: string;
  description: string;
  category: FeedbackCategory;
  sentimentScore: number; // -1.0 to 1.0
  sentimentLabel: 'very_positive' | 'positive' | 'neutral' | 'negative' | 'frustrated';
  sentiment?: string;
  priorityTier?: 'P0_CRITICAL' | 'P1_HIGH' | 'P2_NORMAL' | string;
  clusterCount?: number;
  upvotes: number;
  userVoted?: boolean;
  userEmail: string;
  userName: string;
  status: FeedbackStatus;
  priorityScore: number; // 0 - 100 calculated from sentiment, frequency, upvotes
  recurringPatternCount: number;
  recurringTheme?: string;
  aiAnalysis?: {
    summary: string;
    urgencyReason: string;
    recommendedAction: string;
    impactLevel: 'High' | 'Medium' | 'Low';
  };
  createdAt: string;
}

export interface AnalyticsSummary {
  totalConversations: number;
  aiResolvedCount: number;
  aiResolvedRate: number;
  escalatedCount: number;
  escalationRate: number;
  avgResponseTimeSec: number;
  customerSatisfactionPercent: number;
  totalKnowledgeSources: number;
  conversationsByDay: { date: string; total: number; resolved: number; escalated: number }[];
  questionsByCategory: { category: string; count: number; percentage: number }[];
  feedbackHelpfulness: { helpfulCount: number; unhelpfulCount: number; percentage: number };
}
