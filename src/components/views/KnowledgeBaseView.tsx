import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Globe,
  FileText,
  HelpCircle,
  Upload,
  Trash2,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sparkles,
  Eye,
  X,
} from 'lucide-react';
import { KnowledgeSource } from '../../types';
import { api } from '../../services/api';

interface KnowledgeBaseViewProps {
  sources: KnowledgeSource[];
  onRefresh: () => void;
}

export const KnowledgeBaseView: React.FC<KnowledgeBaseViewProps> = ({ sources, onRefresh }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'website' | 'document' | 'faq' | 'text'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedSourceForPreview, setSelectedSourceForPreview] = useState<KnowledgeSource | null>(null);

  // Add source form state
  const [addType, setAddType] = useState<'website' | 'text' | 'faq' | 'document'>('website');
  const [inputTitle, setInputTitle] = useState('');
  const [inputUrl, setInputUrl] = useState('');
  const [inputContent, setInputContent] = useState('');
  const [faqQuestion, setFaqQuestion] = useState('');
  const [faqAnswer, setFaqAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredSources = sources.filter((s) => {
    const query = (searchQuery || '').toLowerCase();
    const matchesSearch =
      (s.title || '').toLowerCase().includes(query) ||
      (s.content || '').toLowerCase().includes(query);
    const matchesTab = activeTab === 'all' || s.type === activeTab;
    return matchesSearch && matchesTab;
  });

  const handleAddSource = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (addType === 'website') {
        await api.scrapeUrl(inputUrl);
      } else if (addType === 'faq') {
        await api.addKnowledgeSource({
          type: 'faq',
          title: `FAQ: ${faqQuestion.slice(0, 40)}...`,
          content: `Question: ${faqQuestion}\nAnswer: ${faqAnswer}`,
        });
      } else {
        await api.addKnowledgeSource({
          type: addType,
          title: inputTitle || (addType === 'document' ? 'Policy Document' : 'Company Knowledge Note'),
          content: inputContent,
          url: inputUrl || undefined,
        });
      }

      // Reset form
      setInputTitle('');
      setInputUrl('');
      setInputContent('');
      setFaqQuestion('');
      setFaqAnswer('');
      setIsAddModalOpen(false);
      onRefresh();
    } catch (err) {
      console.error('Add source error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this knowledge source? The AI will no longer answer questions based on this content.')) return;
    try {
      await api.deleteKnowledgeSource(id);
      onRefresh();
    } catch (e) {
      console.error('Delete error', e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Knowledge Base & RAG Index</h1>
          <p className="text-xs text-slate-500">
            Train your AI agent on your exact website, return policies, FAQs, and documents.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-ember-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-ember-700 transition"
        >
          <Plus className="h-4 w-4" />
          Add Knowledge Source
        </button>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <span className="text-xs text-slate-500">Total Sources</span>
          <div className="text-xl font-bold text-slate-900 mt-1">{sources.length} active</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <span className="text-xs text-slate-500">Indexed Chunks</span>
          <div className="text-xl font-bold text-ember-600 mt-1">
            {sources.reduce((acc, s) => acc + (s.chunkCount || 1), 0)} vector embeddings
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <span className="text-xs text-slate-500">Retrieval Grounding</span>
          <div className="text-xl font-bold text-emerald-600 mt-1">
            {sources.filter((s) => s.status === 'ready').length}/{sources.length} Sources Ready
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Every answer is cited back to a source</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All Sources' },
            { id: 'website', label: 'Websites' },
            { id: 'document', label: 'Documents' },
            { id: 'faq', label: 'FAQs' },
            { id: 'text', label: 'Text Notes' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                activeTab === tab.id
                  ? 'bg-ember-50 text-ember-700 font-semibold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search indexed knowledge..."
            className="w-full rounded-xl border border-slate-300 pl-9 pr-4 py-1.5 text-xs focus:border-ember-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Sources List */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="divide-y divide-slate-100">
          {filteredSources.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              No knowledge sources match your filter.
            </div>
          ) : (
            filteredSources.map((source) => (
              <div
                key={source.id}
                className="p-4 hover:bg-slate-50/70 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3.5">
                  <div className="h-9 w-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 shrink-0 mt-0.5">
                    {source.type === 'website' && <Globe className="h-5 w-5 text-ember-600" />}
                    {source.type === 'document' && <FileText className="h-5 w-5 text-signal-600" />}
                    {source.type === 'faq' && <HelpCircle className="h-5 w-5 text-emerald-600" />}
                    {source.type === 'text' && <BookOpen className="h-5 w-5 text-amber-600" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-slate-900">{source.title}</h3>
                      {source.status === 'ready' && (
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200">
                          Ready
                        </span>
                      )}
                      {source.status === 'processing' && (
                        <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 border border-amber-200">
                          Processing
                        </span>
                      )}
                      {source.status === 'failed' && (
                        <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-700 border border-rose-200">
                          Failed
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{source.content}</p>

                    <div className="mt-1 flex items-center gap-3 text-[11px] text-slate-400">
                      <span>{source.chunkCount || 1} indexed chunks</span>
                      <span>•</span>
                      <span>Updated {new Date(source.updatedAt).toLocaleDateString()}</span>
                      {source.url && (
                        <>
                          <span>•</span>
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-ember-600 hover:underline flex items-center gap-0.5"
                          >
                            Visit URL <ExternalLink className="h-3 w-3" />
                          </a>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => setSelectedSourceForPreview(source)}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition text-xs flex items-center gap-1"
                    title="Preview Chunks"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>Preview</span>
                  </button>
                  <button
                    onClick={() => handleDelete(source.id)}
                    className="p-1.5 rounded-lg border border-slate-200 text-rose-600 hover:bg-rose-50 transition"
                    title="Delete source"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {selectedSourceForPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-base">{selectedSourceForPreview.title}</h3>
                <p className="text-xs text-slate-400 capitalize">{selectedSourceForPreview.type} Knowledge Source</p>
              </div>
              <button
                onClick={() => setSelectedSourceForPreview(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 max-h-96 overflow-y-auto bg-slate-50 p-4 rounded-xl font-mono text-xs text-slate-700 whitespace-pre-wrap leading-relaxed border border-slate-200">
              {selectedSourceForPreview.content}
            </div>

            <div className="mt-4 flex justify-between items-center text-xs text-slate-500">
              <span>Indexed into {selectedSourceForPreview.chunkCount || 1} semantic chunks for zero-hallucination retrieval.</span>
              <button
                onClick={() => setSelectedSourceForPreview(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Knowledge Source Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Add Business Knowledge</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Type Switcher */}
            <div className="grid grid-cols-4 gap-2 my-4">
              {[
                { id: 'website', label: 'Website', icon: Globe },
                { id: 'text', label: 'Text Note', icon: FileText },
                { id: 'faq', label: 'FAQ', icon: HelpCircle },
                { id: 'document', label: 'Document', icon: Upload },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = addType === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setAddType(item.id as any)}
                    className={`p-2.5 rounded-xl border text-center text-xs font-semibold flex flex-col items-center gap-1 transition ${
                      isSelected
                        ? 'border-ember-600 bg-ember-50 text-ember-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            <form onSubmit={handleAddSource} className="space-y-4">
              {addType === 'website' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Website Page URL to Crawl
                  </label>
                  <input
                    type="url"
                    required
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    placeholder="https://acmestore.io/policies/returns"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-ember-500 focus:outline-none"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    SupportAI will fetch this page, clean the HTML, extract structured text, and build vector chunks.
                  </p>
                </div>
              )}

              {addType === 'faq' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Customer Question
                    </label>
                    <input
                      type="text"
                      required
                      value={faqQuestion}
                      onChange={(e) => setFaqQuestion(e.target.value)}
                      placeholder="e.g. Can I change my delivery address after ordering?"
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-ember-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Verified Answer
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={faqAnswer}
                      onChange={(e) => setFaqAnswer(e.target.value)}
                      placeholder="Yes, within 2 hours of placing the order by contacting support or checking your order confirmation page."
                      className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-ember-500 focus:outline-none"
                    />
                  </div>
                </>
              )}

              {(addType === 'text' || addType === 'document') && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Source Title
                    </label>
                    <input
                      type="text"
                      required
                      value={inputTitle}
                      onChange={(e) => setInputTitle(e.target.value)}
                      placeholder="e.g. VIP Member Warranty Guidelines"
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-ember-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Content / Document Text
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={inputContent}
                      onChange={(e) => setInputContent(e.target.value)}
                      placeholder="Paste your business policy, product manual, or terms here..."
                      className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-ember-500 focus:outline-none"
                    />
                  </div>
                </>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-ember-600 px-5 py-2 text-xs font-semibold text-white hover:bg-ember-700 disabled:opacity-40 transition"
                >
                  {isSubmitting ? 'Indexing Knowledge...' : 'Index & Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
