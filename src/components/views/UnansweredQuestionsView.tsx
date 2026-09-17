import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  Plus,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ArrowRight,
  BookOpen,
  X,
} from 'lucide-react';
import { UnansweredQuestion } from '../../types';
import { api } from '../../services/api';

interface UnansweredQuestionsViewProps {
  onKnowledgeUpdated: () => void;
}

export const UnansweredQuestionsView: React.FC<UnansweredQuestionsViewProps> = ({
  onKnowledgeUpdated,
}) => {
  const [questions, setQuestions] = useState<UnansweredQuestion[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<UnansweredQuestion | null>(null);
  const [answerText, setAnswerText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const res = await api.getUnansweredQuestions();
      setQuestions(res.questions);
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenModal = (q: UnansweredQuestion) => {
    setSelectedQuestion(q);
    setAnswerText('');
    setSuccessMessage('');
  };

  const handleSaveAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuestion || !answerText.trim() || submitting) return;

    setSubmitting(true);
    try {
      await api.addAnswerToKnowledgeBase(selectedQuestion.id, answerText.trim());
      setSuccessMessage('Answer indexed and added to Knowledge Base! Agent now answers this query.');
      setQuestions((prev) =>
        prev.map((q) => (q.id === selectedQuestion.id ? { ...q, status: 'resolved' as const } : q))
      );
      onKnowledgeUpdated();
      setTimeout(() => {
        setSelectedQuestion(null);
        setSuccessMessage('');
      }, 1800);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-amber-100 text-amber-800 px-2.5 py-0.5 text-xs font-semibold">
              Knowledge Gap Engine
            </span>
            <span className="text-xs text-slate-500">Autonomous Hallucination Prevention</span>
          </div>
          <h1 className="text-xl font-display font-semibold text-slate-900 mt-1">Unanswered Customer Questions</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Questions asked by customers that weren't found in your knowledge base. Add answers here to continuously train your AI.
          </p>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="divide-y divide-slate-100">
          {questions.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              All questions answered! Great job keeping your knowledge base up to date.
            </div>
          ) : (
            questions.map((q) => (
              <div
                key={q.id}
                className="p-5 hover:bg-slate-50/70 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-900 text-sm">"{q.question}"</h3>
                    {q.status === 'resolved' ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="h-3 w-3" /> Answer Added
                      </span>
                    ) : (
                      <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 border border-amber-200">
                        Missing Knowledge
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <span className="font-semibold text-amber-600">
                      Asked {q.count} {q.count === 1 ? 'time' : 'times'} by customers
                    </span>
                    <span>•</span>
                    <span>Last asked {new Date(q.lastAsked).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="shrink-0">
                  {q.status !== 'resolved' ? (
                    <button
                      onClick={() => handleOpenModal(q)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-ember-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-ember-700 transition"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add Answer to KB
                    </button>
                  ) : (
                    <span className="text-xs text-slate-400 font-medium">Trained & Active</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Answer Modal */}
      {selectedQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Add Verified Answer</h3>
              <button
                onClick={() => setSelectedQuestion(null)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
              <span className="font-semibold">Customer Inquiry: </span>
              <span>"{selectedQuestion.question}"</span>
              <div className="text-[11px] text-amber-700 mt-1">
                This question has been asked {selectedQuestion.count} times.
              </div>
            </div>

            {successMessage && (
              <div className="mt-3 p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleSaveAnswer} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Verified Company Answer
                </label>
                <textarea
                  rows={4}
                  required
                  autoFocus
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  placeholder="e.g. Yes, we offer express overnight shipping for $15 via FedEx on all orders placed before 2 PM EST."
                  className="w-full rounded-xl border border-slate-300 p-3 text-sm text-slate-900 focus:border-ember-500 focus:outline-none"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  This will be automatically indexed into your vector knowledge base. The AI will immediately use it to answer future customers.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedQuestion(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !answerText.trim()}
                  className="rounded-xl bg-ember-600 px-5 py-2 text-xs font-semibold text-white hover:bg-ember-700 disabled:opacity-40 transition"
                >
                  {submitting ? 'Indexing...' : 'Save & Train Agent'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
