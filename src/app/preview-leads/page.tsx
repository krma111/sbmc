'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { PreviewLead } from '@/types/lead';
import { leadRepository } from '@/lib/preview-storage';
import { businessCategories } from '@/content/categories';
import { cn } from '@/lib/utils';

type StatusFilter = 'all' | PreviewLead['status'];
type CategoryFilter = 'all' | PreviewLead['businessCategory'];

const STATUS_LABELS: Record<PreviewLead['status'], { en: string; hi: string }> = {
  new: { en: 'New', hi: 'नई' },
  recommendation_shown: { en: 'Recommendation Shown', hi: 'सिफ़ारिश दिखाई गई' },
  whatsapp_started: { en: 'WhatsApp Started', hi: 'व्हाट्सएप शुरू किया' },
};

const CHALLENGE_LABELS: Record<string, string> = {
  need_more_enquiries: 'More enquiries',
  not_professional_online: 'Not professional online',
  instagram_needs_improvement: 'Instagram needs work',
  not_found_on_google: 'Not found on Google',
  offers_not_attracting: 'Offers not attracting',
  whatsapp_unorganised: 'WhatsApp unorganised',
  dont_know_content: 'No content plan',
  need_website: 'Needs website',
  not_sure_whats_missing: 'Not sure what is missing',
};

function downloadFile(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function PreviewLeadsPage() {
  const [leads, setLeads] = useState<PreviewLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [selectedLead, setSelectedLead] = useState<PreviewLead | null>(null);
  const [notice, setNotice] = useState('');

  const refresh = useCallback(() => {
    leadRepository.getAllLeads().then(setLeads).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const filteredLeads = useMemo(() => {
    return leads
      .filter((lead) => {
        if (search && !lead.businessName.toLowerCase().includes(search.toLowerCase())) return false;
        if (statusFilter !== 'all' && lead.status !== statusFilter) return false;
        if (categoryFilter !== 'all' && lead.businessCategory !== categoryFilter) return false;
        return true;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [leads, search, statusFilter, categoryFilter]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this lead?')) return;
    const remaining = leads.filter((l) => l.id !== id);
    setLeads(remaining);
    if (selectedLead?.id === id) setSelectedLead(null);
    localStorage.setItem('sbmc_preview_leads', JSON.stringify(remaining));
    setNotice('Lead deleted.');
    setTimeout(() => setNotice(''), 3000);
  };

  const handleClearAll = async () => {
    if (!window.confirm('Delete all preview leads? This cannot be undone.')) return;
    await leadRepository.clearPreviewLeads();
    setLeads([]);
    setSelectedLead(null);
    setNotice('All preview leads cleared.');
    setTimeout(() => setNotice(''), 3000);
  };

  const handleExportJson = () => {
    if (leads.length === 0) return;
    downloadFile('sbmc-preview-leads.json', JSON.stringify(leads, null, 2), 'application/json');
    setNotice('Leads exported as JSON.');
    setTimeout(() => setNotice(''), 3000);
  };

  const handleExportCsv = () => {
    if (leads.length === 0) return;
    const headers = [
      'leadCode',
      'businessName',
      'businessCategory',
      'cityArea',
      'biggestChallenge',
      'whatsappNumber',
      'recommendedService',
      'recommendedPrice',
      'status',
      'createdAt',
      'whatsappClickedAt',
    ];
    const escapeCsv = (value: string | number) => {
      const str = String(value);
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };
    const rows = leads.map((lead) =>
      [
        lead.leadCode,
        lead.businessName,
        lead.businessCategory,
        lead.cityArea,
        lead.biggestChallenge,
        lead.whatsappNumber,
        lead.recommendedService,
        lead.recommendedPrice,
        lead.status,
        lead.createdAt,
        lead.whatsappClickedAt ?? '',
      ]
        .map(escapeCsv)
        .join(',')
    );
    downloadFile('sbmc-preview-leads.csv', [headers.join(','), ...rows].join('\n'), 'text/csv;charset=utf-8');
    setNotice('Leads exported as CSV.');
    setTimeout(() => setNotice(''), 3000);
  };

  const categoryName = (id: PreviewLead['businessCategory']) =>
    businessCategories.find((c) => c.id === id)?.name ?? id;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50">
        <p className="text-sm font-semibold text-neutral-400">Loading preview leads...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-10">
      <div className="container">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-charcoal">Preview Leads</h1>
            <p className="mt-1 text-sm text-neutral-500">
              {leads.length} lead{leads.length === 1 ? '' : 's'} stored in this browser
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleExportJson}
              className="inline-flex min-h-10 items-center justify-center rounded-lg border border-neutral-300 bg-white px-4 text-xs font-bold text-charcoal transition-colors hover:border-cyan hover:text-cyan focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan"
            >
              Export JSON
            </button>
            <button
              type="button"
              onClick={handleExportCsv}
              className="inline-flex min-h-10 items-center justify-center rounded-lg border border-neutral-300 bg-white px-4 text-xs font-bold text-charcoal transition-colors hover:border-cyan hover:text-cyan focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan"
            >
              Export CSV
            </button>
            <button
              type="button"
              onClick={handleClearAll}
              className="inline-flex min-h-10 items-center justify-center rounded-lg border border-red-200 bg-red-50 px-4 text-xs font-bold text-red-700 transition-colors hover:bg-red-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
            >
              Clear All
            </button>
          </div>
        </div>

        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-semibold text-amber-900">
            Preview mode: these leads exist only in this browser and are not saved to a real database.
          </p>
          <p className="mt-1 text-xs text-amber-700">
            Clearing browser storage removes these leads permanently. They are not visible on another device and are
            not sent to SBMC unless the visitor opens WhatsApp.
          </p>
        </div>

        {notice ? (
          <p role="status" aria-live="polite" className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm font-semibold text-green-800">
            {notice}
          </p>
        ) : null}

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by business name..."
            aria-label="Search by business name"
            className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm text-charcoal placeholder:text-neutral-400 focus:border-cyan focus:outline-none focus:ring-2 focus:ring-cyan/20"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as CategoryFilter)}
            aria-label="Filter by category"
            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm text-charcoal focus:border-cyan focus:outline-none focus:ring-2 focus:ring-cyan/20"
          >
            <option value="all">All Categories</option>
            {businessCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            aria-label="Filter by status"
            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm text-charcoal focus:border-cyan focus:outline-none focus:ring-2 focus:ring-cyan/20"
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="recommendation_shown">Recommendation Shown</option>
            <option value="whatsapp_started">WhatsApp Started</option>
          </select>
        </div>

        {filteredLeads.length === 0 ? (
          <div className="mt-8 rounded-xl border border-dashed border-neutral-300 bg-white p-12 text-center">
            <p className="text-sm font-semibold text-neutral-400">No preview leads found.</p>
            <p className="mt-1 text-xs text-neutral-400">
              {leads.length === 0
                ? 'Complete the business check on the website to create a lead.'
                : 'Try adjusting your search or filters.'}
            </p>
          </div>
        ) : (
          <div className="mt-6 overflow-x-auto rounded-xl border border-neutral-200 bg-white shadow-sm">
            <table className="w-full min-w-[900px] text-left text-sm">
              <caption className="sr-only">Preview leads stored in this browser</caption>
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wider text-neutral-500">
                  <th scope="col" className="px-4 py-3 font-bold">Lead ID</th>
                  <th scope="col" className="px-4 py-3 font-bold">Business</th>
                  <th scope="col" className="px-4 py-3 font-bold">Category</th>
                  <th scope="col" className="px-4 py-3 font-bold">Location</th>
                  <th scope="col" className="px-4 py-3 font-bold">Challenge</th>
                  <th scope="col" className="px-4 py-3 font-bold">Recommended</th>
                  <th scope="col" className="px-4 py-3 font-bold">WhatsApp</th>
                  <th scope="col" className="px-4 py-3 font-bold">Status</th>
                  <th scope="col" className="px-4 py-3 font-bold">WhatsApp Clicked</th>
                  <th scope="col" className="px-4 py-3 font-bold">Date</th>
                  <th scope="col" className="px-4 py-3 font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="transition-colors hover:bg-neutral-50/70">
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-cyan">{lead.leadCode}</td>
                    <td className="px-4 py-3 font-semibold text-charcoal">{lead.businessName}</td>
                    <td className="px-4 py-3 text-xs text-neutral-500">{categoryName(lead.businessCategory)}</td>
                    <td className="px-4 py-3 text-xs text-neutral-500">{lead.cityArea}</td>
                    <td className="px-4 py-3 text-xs text-neutral-500">{CHALLENGE_LABELS[lead.biggestChallenge] ?? lead.biggestChallenge}</td>
                    <td className="px-4 py-3 text-xs font-semibold text-charcoal">
                      {lead.recommendedService}
                      <span className="text-neutral-400"> (₹{lead.recommendedPrice.toLocaleString('en-IN')})</span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-neutral-500">{lead.whatsappNumber}</td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          'inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide',
                          lead.status === 'whatsapp_started' && 'bg-green/10 text-green',
                          lead.status === 'recommendation_shown' && 'bg-cyan/10 text-cyan',
                          lead.status === 'new' && 'bg-neutral-100 text-neutral-500'
                        )}
                      >
                        {STATUS_LABELS[lead.status].en}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-neutral-500">
                      {lead.whatsappClickedAt ? new Date(lead.whatsappClickedAt).toLocaleString() : '—'}
                    </td>
                    <td className="px-4 py-3 text-xs text-neutral-500">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedLead(lead)}
                          className="rounded-md border border-neutral-200 bg-white px-2.5 py-1.5 text-[11px] font-bold text-charcoal transition-colors hover:border-cyan hover:text-cyan focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan"
                        >
                          View
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(lead.id)}
                          className="rounded-md border border-red-200 bg-white px-2.5 py-1.5 text-[11px] font-bold text-red-600 transition-colors hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedLead ? (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/60 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="lead-detail-title"
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedLead(null);
            }}
          >
            <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
              <div className="flex items-center justify-between">
                <h2 id="lead-detail-title" className="text-lg font-extrabold tracking-tight text-charcoal">
                  {selectedLead.leadCode}
                </h2>
                <button
                  type="button"
                  onClick={() => setSelectedLead(null)}
                  aria-label="Close lead details"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 text-neutral-400 transition-colors hover:border-neutral-300 hover:text-charcoal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <dl className="mt-5 space-y-3 text-sm">
                {[
                  ['Business Name', selectedLead.businessName],
                  ['Category', categoryName(selectedLead.businessCategory)],
                  ['Location', selectedLead.cityArea],
                  ['Challenge', CHALLENGE_LABELS[selectedLead.biggestChallenge] ?? selectedLead.biggestChallenge],
                  ['WhatsApp Number', selectedLead.whatsappNumber],
                  ['Preferred Language', selectedLead.preferredLanguage === 'hi' ? 'Hindi' : 'English'],
                  ['Recommended Service', selectedLead.recommendedService],
                  ['Price', `₹${selectedLead.recommendedPrice.toLocaleString('en-IN')}`],
                  ['Status', STATUS_LABELS[selectedLead.status].en],
                  ['Created', new Date(selectedLead.createdAt).toLocaleString()],
                  ['WhatsApp Clicked', selectedLead.whatsappClickedAt ? new Date(selectedLead.whatsappClickedAt).toLocaleString() : 'No'],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-start justify-between gap-4 border-b border-neutral-100 pb-2.5">
                    <dt className="shrink-0 text-xs font-bold uppercase tracking-wider text-neutral-400">{label}</dt>
                    <dd className="text-right font-semibold text-charcoal">{value}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-5 rounded-lg border border-neutral-200 bg-neutral-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">Recommendation Reason</p>
                <p className="mt-2 text-sm leading-6 text-neutral-600">{selectedLead.recommendationReason}</p>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}