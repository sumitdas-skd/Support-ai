import React, { useState } from 'react';
import {
  Users,
  Search,
  Mail,
  MessageSquare,
  Clock,
  Star,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  ShoppingBag,
} from 'lucide-react';
import { Customer } from '../../types';

interface CustomersViewProps {
  customers: Customer[];
  onOpenCustomerChat?: (customerEmail: string) => void;
}

export const CustomersView: React.FC<CustomersViewProps> = ({
  customers,
  onOpenCustomerChat,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const filtered = customers.filter(
    (c) =>
      (c.name || '').toLowerCase().includes((search || '').toLowerCase()) ||
      (c.email || '').toLowerCase().includes((search || '').toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-display font-semibold text-slate-900">Customer Profiles & CRM</h1>
          <p className="text-xs text-slate-500">
            View customer interaction history, satisfaction ratings, and order details.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customers by name or email..."
            className="w-full rounded-xl border border-slate-300 pl-9 pr-3 py-1.5 text-xs focus:border-ember-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50 text-[11px] font-semibold uppercase text-slate-500 border-b border-slate-200">
            <tr>
              <th className="px-5 py-3">Customer</th>
              <th className="px-4 py-3">Status / Tags</th>
              <th className="px-4 py-3">Total Chats</th>
              <th className="px-4 py-3">CSAT</th>
              <th className="px-4 py-3">Last Seen</th>
              <th className="px-5 py-3 text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((c) => (
              <tr
                key={c.id}
                onClick={() => setSelectedCustomer(c)}
                className="hover:bg-slate-50/70 cursor-pointer transition"
              >
                <td className="px-5 py-3.5">
                  <div className="font-semibold text-slate-900">{c.name}</div>
                  <div className="text-[11px] text-slate-400">{c.email}</div>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex flex-wrap gap-1">
                    {c.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-ember-50 text-ember-700 border border-ember-200 px-2 py-0.5 text-[10px] font-semibold"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3.5 font-medium text-slate-700">{c.totalConversations} sessions</td>
                <td className="px-4 py-3.5">
                  {c.csatScore ? (
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
                      <Star className="h-3 w-3 fill-emerald-500 text-emerald-500" />
                      {c.csatScore} / 5
                    </span>
                  ) : (
                    <span className="text-slate-400">Unrated</span>
                  )}
                </td>
                <td className="px-4 py-3.5 text-slate-400 text-[11px]">
                  {new Date(c.lastSeen).toLocaleDateString()}
                </td>
                <td className="px-5 py-3.5 text-right">
                  <ChevronRight className="h-4 w-4 text-slate-400 inline" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Customer Detail Drawer */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-base">Customer Profile</h3>
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>

              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-ember-100 text-ember-700 font-bold text-lg flex items-center justify-center">
                  {selectedCustomer.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">{selectedCustomer.name}</h2>
                  <div className="text-xs text-slate-500 flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {selectedCustomer.email}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Customer ID:</span>
                  <span className="font-mono text-slate-800">{selectedCustomer.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Support Chats:</span>
                  <span className="font-bold text-slate-800">{selectedCustomer.totalConversations}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Satisfaction Score:</span>
                  <span className="font-bold text-emerald-600">
                    {selectedCustomer.csatScore ? `${selectedCustomer.csatScore}/5` : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">First Contact:</span>
                  <span className="text-slate-800">{new Date(selectedCustomer.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {selectedCustomer.metadata && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    E-commerce / Store Data
                  </h4>
                  <div className="p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Recent Order:</span>
                      <span className="font-semibold text-ember-600">
                        {selectedCustomer.metadata.recentOrder || '#ACM-98421'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Lifetime Value:</span>
                      <span className="font-bold text-slate-800">
                        ${selectedCustomer.metadata.lifetimeValue || 349.99}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-slate-100">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="w-full rounded-xl bg-slate-900 py-2.5 text-xs font-semibold text-white hover:bg-slate-800"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
