'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { LeadFunnelStatus, ServerLead } from '@/types/lead';
import type { NextFollowUp } from '@/lib/server/followups';
import { businessCategories } from '@/content/categories';
import { cn } from '@/lib/utils';

const AUTH_KEY = 'sbmc_admin_auth';

interface EnrichedLead extends ServerLead {
  derivedStatus?: LeadFunnelStatus;
  nextFollowUp: NextFollowUp;
  followUpMessage: string | null;
  waUrl: string | null;
}

interface Summary {
  total: number;
  newToday: number;
  byStatus: Record<string, number>;
  dueFollowUps: EnrichedLead[];
  silent?: number;
  notInterestedReasons: Record<string, number>;
}

const STATUS_LABELS: Record<string, string> = {
  form_started: 'Started',
  completed: 'Received',
  whatsapp_started: 'WA Opened',
  whatsapp_replied: 'Replied',
  interested: 'Interested',
  booked: 'Booked',
  not_interested: 'Not Interested',
  nurture: 'Nurture',
  silent: 'Silent',
};

const STATUS_STYLES: Record<string, string> = {
  form_started: 'bg-neutral-100 text-neutral-500',
  completed: 'bg-cyan/10 text-cyan',
  whatsapp_started: 'bg-blue-100 text-blue-700',
  whatsapp_replied: 'bg-violet-100 text-violet-700',
  interested: 'bg-green/10 text-green',
  booked: 'bg-green text-white',
  not_interested: 'bg-red-100 text-red-700',
  nurture: 'bg-amber-100 text-amber-700',
  silent: 'bg-neutral-200 text-neutral-600',
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

function formatPhone(phone: string | null): string {
  if (!phone) return '—';
  const digits = phone.replace(/^91/, '');
  return digits.length === 10 ? `+91 ${digits.slice(0, 5)} ${digits.slice(5)}` : phone;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function adminToken(): string {
  return typeof window !== 'undefined' ? window.sessionStorage.getItem(AUTH_KEY) ?? '' : '';
}

async function adminFetch(path: string, init?: RequestInit): Promise<Response> {
  const headers = new Headers(init?.headers);
  headers.set('x-admin-token', adminToken());
  const res = await fetch(path, { ...init, headers });
  if (res.status === 401) {
    window.sessionStorage.removeItem(AUTH_KEY);
    window.location.reload();
    throw new Error('Unauthorized');
  }
  return res;
}

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

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [booted, setBooted] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [leads, setLeads] = useState<EnrichedLead[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);

  const [tab, setTab] = useState<'followups' | 'leads'>('followups');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | LeadFunnelStatus>('all');
  const [selected, setSelected] = useState<EnrichedLead | null>(null);
  const [notice, setNotice] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    setAuthed(Boolean(window.sessionStorage.getItem(AUTH_KEY)));
    setBooted(true);
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [leadsRes, summaryRes] = await Promise.all([adminFetch('/api/leads'), adminFetch('/api/admin/summary')]);
      const leadsJson = (await leadsRes.json()) as { leads: EnrichedLead[] };
      const summaryJson = (await summaryRes.json()) as Summary;
      setLeads(leadsJson.leads);
      setSummary(summaryJson);
    } catch {
      // 401 handled inside adminFetch
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authed) void refresh();
  }, [authed, refresh]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setLoginError('Invalid password');
        return;
      }
      window.sessionStorage.setItem(AUTH_KEY, password);
      setAuthed(true);
    } catch {
      setLoginError('Could not reach the server');
    }
  };

  const flash = useCallback((msg: string) => {
    setNotice(msg);
    window.setTimeout(() => setNotice(''), 3000);
  }, []);

  const patch = useCallback(
    async (id: string, body: Record<string, unknown>, msg?: string) => {
      setBusyId(id);
      try {
        const res = await adminFetch(`/api/leads/${encodeURIComponent(id)}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        if (res.ok) {
          await refresh();
          if (msg) flash(msg);
        }
      } catch {
        // 401 handled inside adminFetch
      } finally {
        setBusyId(null);
      }
    },
    [refresh, flash]
  );

  const handleNotInterested = async (lead: EnrichedLead) => {
    const reason = window.prompt('Why is this lead not interested? (price, timing, other…)', 'Not the right time');
    if (reason === null) return;
    await patch(
      lead.id,
      { funnelStatus: 'not_interested', notInterestedReason: reason.trim() || null },
      'Marked not interested — follow-ups stopped, moved to nurture'
    );
  };

  const handleSnooze = (lead: EnrichedLead) => {
    const until = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();
    void patch(lead.id, { snoozedUntil: until }, 'Snoozed for 3 days');
  };

  const handleDelete = async (lead: EnrichedLead) => {
    if (!window.confirm(`Delete lead ${lead.leadCode}? This cannot be undone.`)) return;
    setBusyId(lead.id);
    await adminFetch(`/api/leads/${encodeURIComponent(lead.id)}`, { method: 'DELETE' });
    if (selected?.id === lead.id) setSelected(null);
    await refresh();
    flash('Lead deleted.');
    setBusyId(null);
  };

  const handleRecordFollowUp = async (lead: EnrichedLead) => {
    setBusyId(lead.id);
    await adminFetch(`/api/leads/${encodeURIComponent(lead.id)}/followup`, { method: 'POST' });
    await refresh();
    flash('Follow-up recorded — next one scheduled.');
    setBusyId(null);
  };

  const handleExportJson = () => {
    if (leads.length === 0) return;
    downloadFile('sbmc-leads.json', JSON.stringify(leads, null, 2), 'application/json');
    flash('Exported JSON.');
  };

  const handleExportCsv = () => {
    if (leads.length === 0) return;
    const headers = [
      'leadCode', 'businessName', 'businessCategory', 'cityArea', 'biggestChallenge', 'whatsappNumber',
      'recommendedService', 'recommendedPrice', 'funnelStatus', 'currentStep', 'createdAt', 'whatsappClickedAt', 'lastFollowUpAt',
    ];
    const escape = (v: unknown) => {
      const str = String(v ?? '');
      return str.includes(',') || str.includes('"') || str.includes('\n') ? `"${str.replace(/"/g, '""')}"` : str;
    };
    const rows = leads.map((l) =>
      [
        l.leadCode, l.businessName ?? '', l.businessCategory ?? '', l.cityArea ?? '', l.biggestChallenge ?? '', l.whatsappNumber ?? '',
        l.recommendedService ?? '', l.recommendedPrice ?? '', l.funnelStatus, l.currentStep, l.createdAt, l.whatsappClickedAt ?? '', l.lastFollowUpAt ?? '',
      ].map(escape).join(',')
    );
    downloadFile('sbmc-leads.csv', [headers.join(','), ...rows].join('\n'), 'text/csv;charset=utf-8');
    flash('Exported CSV.');
  };

  const filteredLeads = useMemo(() => {
    return leads
      .filter((lead) => {
        if (search) {
          const haystack = `${lead.businessName ?? ''} ${lead.whatsappNumber ?? ''} ${lead.cityArea ?? ''} ${lead.leadCode}`.toLowerCase();
          if (!haystack.includes(search.toLowerCase())) return false;
        }
        if (statusFilter !== 'all' && lead.funnelStatus !== statusFilter) return false;
        return true;
      })
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [leads, search, statusFilter]);

  const dueFollowUps = useMemo(
    () => (summary?.dueFollowUps ?? []).slice().sort((a, b) => (a.nextFollowUp.dueAt ?? 0) - (b.nextFollowUp.dueAt ?? 0)),
    [summary]
  );

  const categoryName = (id: string) => businessCategories.find((c) => c.id === id)?.name ?? id;

  if (!booted) {
    return <div className="flex min-h-screen items-center justify-center bg-neutral-50"><p className="text-sm text-neutral-400">Loading…</p></div>;
  }

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50 p-4">
        <div className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
          <p className="eyebrow">Admin</p>
          <h1 className="font-display mt-2 text-2xl font-semibold tracking-tight text-charcoal">SBMC Leads</h1>
          <p className="mt-1 text-sm text-neutral-500">Enter the admin password to see captured leads and follow-ups.</p>
          {loginError ? (
            <p role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 p-2.5 text-sm font-semibold text-red-700">{loginError}</p>
          ) : null}
          <form onSubmit={handleLogin} className="mt-5 flex flex-col gap-3">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin password"
              className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm text-charcoal placeholder:text-neutral-400 focus:border-cyan focus:outline-none focus:ring-2 focus:ring-cyan/20"
            />
            <button type="submit" className="inline-flex min-h-11 items-center justify-center rounded-lg bg-charcoal px-5 text-sm font-bold text-white transition-colors hover:bg-neutral-800">
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  const dueCount = dueFollowUps.length;

  return (
    <div className="min-h-screen bg-neutral-50 pb-16">
      <div className="border-b border-neutral-200 bg-white">
        <div className="container flex flex-wrap items-center justify-between gap-3 py-4">
          <div>
            <p className="eyebrow">Admin</p>
            <h1 className="font-display mt-1 text-xl font-semibold tracking-tight text-charcoal sm:text-2xl">SBMC Lead Dashboard</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={handleExportJson} className="inline-flex min-h-10 items-center justify-center rounded-lg border border-neutral-300 bg-white px-3 text-xs font-bold text-charcoal transition-colors hover:border-cyan hover:text-cyan">Export JSON</button>
            <button type="button" onClick={handleExportCsv} className="inline-flex min-h-10 items-center justify-center rounded-lg border border-neutral-300 bg-white px-3 text-xs font-bold text-charcoal transition-colors hover:border-cyan hover:text-cyan">Export CSV</button>
            <button
              type="button"
              onClick={() => {
                window.sessionStorage.removeItem(AUTH_KEY);
                setAuthed(false);
              }}
              className="inline-flex min-h-10 items-center justify-center rounded-lg border border-neutral-300 bg-white px-3 text-xs font-bold text-neutral-500 transition-colors hover:text-charcoal"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="container pt-6">
        {notice ? (
          <p role="status" aria-live="polite" className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm font-semibold text-green-800">{notice}</p>
        ) : null}

        {summary ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {[
              ['Total leads', String(summary.total), 'text-charcoal'],
              ['New today', String(summary.newToday), 'text-cyan'],
              ['Follow-ups due', String(dueCount), dueCount ? 'text-red-600' : 'text-neutral-400'],
              ['Silent (auto)', String(summary.silent ?? 0), summary.silent ? 'text-neutral-600' : 'text-neutral-400'],
              ['Booked', String(summary.byStatus.booked ?? 0), 'text-green'],
            ].map(([label, value, color]) => (
              <div key={label} className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
                <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">{label}</p>
                <p className={cn('font-display mt-1.5 text-2xl font-semibold', color)}>{value}</p>
              </div>
            ))}
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap items-center gap-2">
          {[
            { id: 'followups' as const, label: `Follow-ups ${dueCount ? `(${dueCount})` : ''}`, active: tab === 'followups' },
            { id: 'leads' as const, label: `All leads (${leads.length})`, active: tab === 'leads' },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                'inline-flex min-h-10 items-center justify-center rounded-lg px-4 text-sm font-bold transition-colors',
                t.active ? 'bg-charcoal text-white' : 'border border-neutral-200 bg-white text-neutral-500 hover:text-charcoal'
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'followups' ? (
          <div className="mt-6">
            {dueFollowUps.length === 0 ? (
              <div className="rounded-xl border border-dashed border-neutral-300 bg-white p-10 text-center">
                <p className="text-sm font-semibold text-neutral-400">No follow-ups due right now.</p>
                <p className="mt-1 text-xs text-neutral-400">Leads get follow-ups at +2h, +24h, +3d, +7d after capture — even if they never messaged you.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {dueFollowUps.map((lead) => (
                  <FollowUpCard
                    key={lead.id}
                    lead={lead}
                    busy={busyId === lead.id}
                    onView={() => setSelected(lead)}
                    onRecord={() => void handleRecordFollowUp(lead)}
                    onReply={() => void patch(lead.id, { funnelStatus: 'whatsapp_replied' }, 'Marked replied — follow-ups stopped')}
                    onNotInterested={() => void handleNotInterested(lead)}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search business, phone, area, code…"
                className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm text-charcoal placeholder:text-neutral-400 focus:border-cyan focus:outline-none focus:ring-2 focus:ring-cyan/20"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | LeadFunnelStatus)}
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm text-charcoal focus:border-cyan focus:outline-none focus:ring-2 focus:ring-cyan/20"
              >
                <option value="all">All statuses</option>
                {Object.entries(STATUS_LABELS).map(([id, label]) => (
                  <option key={id} value={id}>{label}</option>
                ))}
              </select>
            </div>

            {loading ? (
              <p className="py-8 text-center text-sm font-semibold text-neutral-400">Loading leads…</p>
            ) : filteredLeads.length === 0 ? (
              <div className="rounded-xl border border-dashed border-neutral-300 bg-white p-10 text-center">
                <p className="text-sm font-semibold text-neutral-400">No leads yet.</p>
                <p className="mt-1 text-xs text-neutral-400">Complete the business check on the site to create one — even partial answers are captured.</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white shadow-sm">
                <table className="w-full min-w-[960px] text-left text-sm">
                  <caption className="sr-only">All captured leads</caption>
                  <thead>
                    <tr className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wider text-neutral-500">
                      <th scope="col" className="px-4 py-3 font-bold">Lead</th>
                      <th scope="col" className="px-4 py-3 font-bold">Business</th>
                      <th scope="col" className="px-4 py-3 font-bold">Area</th>
                      <th scope="col" className="px-4 py-3 font-bold">WhatsApp</th>
                      <th scope="col" className="px-4 py-3 font-bold">Recommended</th>
                      <th scope="col" className="px-4 py-3 font-bold">Status</th>
                      <th scope="col" className="px-4 py-3 font-bold">Abandoned at</th>
                      <th scope="col" className="px-4 py-3 font-bold">When</th>
                      <th scope="col" className="px-4 py-3 font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {filteredLeads.map((lead) => (
                      <tr key={lead.id} className="transition-colors hover:bg-neutral-50/70">
                        <td className="px-4 py-3 font-mono text-xs font-semibold text-cyan">{lead.leadCode}</td>
                        <td className="px-4 py-3">
                          <p className="font-semibold text-charcoal">{lead.businessName ?? <span className="text-neutral-400">Partial</span>}</p>
                          <p className="text-[11px] text-neutral-400">{categoryName(lead.businessCategory ?? 'other')}</p>
                        </td>
                        <td className="px-4 py-3 text-xs text-neutral-500">{lead.cityArea || '—'}</td>
                        <td className="px-4 py-3 font-mono text-xs text-neutral-500">{formatPhone(lead.whatsappNumber)}</td>
                        <td className="px-4 py-3 text-xs font-semibold text-charcoal">
                          {lead.recommendedService || '—'}
                          {lead.recommendedPrice ? <span className="text-neutral-400"> (₹{lead.recommendedPrice.toLocaleString('en-IN')})</span> : null}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className={cn('inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide', STATUS_STYLES[lead.funnelStatus] ?? 'bg-neutral-100 text-neutral-500')}>
                              {STATUS_LABELS[lead.funnelStatus] ?? lead.funnelStatus}
                            </span>
                            {lead.derivedStatus === 'silent' && lead.funnelStatus !== 'silent' ? (
                              <span className="inline-flex whitespace-nowrap rounded-full bg-neutral-700 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white" title="Follow-up schedule exhausted, no reply">
                                silent ›
                              </span>
                            ) : null}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-neutral-500">{lead.currentStep >= 5 ? '—' : `step ${lead.currentStep}/5`}</td>
                        <td className="px-4 py-3 text-xs text-neutral-500">{timeAgo(lead.updatedAt)}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1.5">
                            <button type="button" onClick={() => setSelected(lead)} className="rounded-md border border-neutral-200 bg-white px-2.5 py-1.5 text-[11px] font-bold text-charcoal transition-colors hover:border-cyan hover:text-cyan">View</button>
                            {lead.waUrl ? (
                              <a href={lead.waUrl} target="_blank" rel="noopener noreferrer" className="rounded-md bg-green px-2.5 py-1.5 text-[11px] font-bold text-white transition-colors hover:bg-green/90">Follow-up</a>
                            ) : null}
                            <button
                              type="button"
                              onClick={() => void patch(lead.id, { funnelStatus: 'whatsapp_replied' }, 'Marked replied')}
                              disabled={busyId === lead.id}
                              className="rounded-md border border-violet-200 bg-white px-2.5 py-1.5 text-[11px] font-bold text-violet-700 transition-colors hover:bg-violet-50 disabled:opacity-50"
                            >
                              Replied
                            </button>
                            <button
                              type="button"
                              onClick={() => void patch(lead.id, { funnelStatus: 'booked' }, 'Marked booked')}
                              disabled={busyId === lead.id}
                              className="rounded-md border border-green/30 bg-green/5 px-2.5 py-1.5 text-[11px] font-bold text-green transition-colors hover:bg-green/10 disabled:opacity-50"
                            >
                              Booked
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {selected ? (
        <LeadModal
          lead={selected}
          onClose={() => setSelected(null)}
          onReplied={() => void patch(selected.id, { funnelStatus: 'whatsapp_replied' }, 'Marked replied — follow-ups stopped')}
          onInterested={() => void patch(selected.id, { funnelStatus: 'interested' }, 'Marked interested')}
          onBooked={() => void patch(selected.id, { funnelStatus: 'booked' }, 'Marked booked')}
          onNotInterested={() => void handleNotInterested(selected)}
          onNurture={() => void patch(selected.id, { funnelStatus: 'nurture' }, 'Moved to nurture list')}
          onSnooze={() => handleSnooze(selected)}
          onDelete={() => void handleDelete(selected)}
        />
      ) : null}
    </div>
  );
}

function FollowUpCard({ lead, busy, onView, onRecord, onReply, onNotInterested }: {
  lead: EnrichedLead; busy: boolean; onView: () => void; onRecord: () => void; onReply: () => void; onNotInterested: () => void;
}) {
  const dueAt = lead.nextFollowUp.dueAt ?? 0;
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-2 font-mono text-xs font-semibold text-cyan">
            {lead.leadCode}
            <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-bold uppercase', STATUS_STYLES[lead.funnelStatus] ?? 'bg-neutral-100 text-neutral-500')}>
              {STATUS_LABELS[lead.funnelStatus] ?? lead.funnelStatus}
            </span>
          </p>
          <h3 className="mt-1 text-sm font-bold text-charcoal">
            {lead.businessName || 'Partial lead'} · {formatPhone(lead.whatsappNumber)} · {lead.cityArea || '—'}
          </h3>
          <p className="mt-0.5 text-xs text-neutral-500">
            {lead.recommendedService || <span className="italic">No recommendation yet</span>} · Follow-up #{lead.followUpCount + 1} · due{' '}
            <span className="font-semibold text-red-600">{timeAgo(new Date(dueAt).toISOString())}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {lead.waUrl ? (
            <a href={lead.waUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-9 items-center justify-center rounded-lg bg-green px-3 text-xs font-bold text-white transition-colors hover:bg-green/90">
              Open WhatsApp
            </a>
          ) : null}
          <button type="button" onClick={onRecord} disabled={busy} className="inline-flex min-h-9 items-center justify-center rounded-lg border border-cyan/40 bg-cyan/5 px-3 text-xs font-bold text-cyan transition-colors hover:bg-cyan/10 disabled:opacity-50">
            Record sent
          </button>
          <button type="button" onClick={onReply} disabled={busy} className="inline-flex min-h-9 items-center justify-center rounded-lg border border-violet-200 bg-white px-3 text-xs font-bold text-violet-700 transition-colors hover:bg-violet-50 disabled:opacity-50">
            Replied
          </button>
          <button type="button" onClick={onNotInterested} disabled={busy} className="inline-flex min-h-9 items-center justify-center rounded-lg border border-neutral-200 bg-white px-3 text-xs font-bold text-neutral-500 transition-colors hover:text-charcoal disabled:opacity-50">
            Not wanted
          </button>
          <button type="button" onClick={onView} disabled={busy} className="inline-flex min-h-9 items-center justify-center rounded-lg border border-neutral-200 bg-white px-3 text-xs font-bold text-charcoal transition-colors hover:border-cyan hover:text-cyan disabled:opacity-50">
            Details
          </button>
        </div>
      </div>
      {lead.followUpMessage ? (
        <p className="mt-3 whitespace-pre-wrap rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-xs leading-5 text-neutral-600">{lead.followUpMessage}</p>
      ) : null}
    </div>
  );
}

function LeadModal({ lead, onClose, onReplied, onInterested, onBooked, onNotInterested, onNurture, onSnooze, onDelete }: {
  lead: EnrichedLead;
  onClose: () => void;
  onReplied: () => void;
  onInterested: () => void;
  onBooked: () => void;
  onNotInterested: () => void;
  onNurture: () => void;
  onSnooze: () => void;
  onDelete: () => void;
}) {
  const category = businessCategories.find((c) => c.id === lead.businessCategory);
  const rows: [string, string][] = [
    ['Lead code', lead.leadCode],
    ['Business', lead.businessName ?? '— (partial)'],
    ['Category', category?.name ?? lead.businessCategory ?? '—'],
    ['Area', lead.cityArea ?? '—'],
    ['Challenge', CHALLENGE_LABELS[lead.biggestChallenge ?? ''] ?? lead.biggestChallenge ?? '—'],
    ['WhatsApp', formatPhone(lead.whatsappNumber)],
    ['Language', lead.preferredLanguage === 'hi' ? 'Hindi' : 'English'],
    ['Recommended', lead.recommendedService ?? '—'],
    ['Price', lead.recommendedPrice ? `₹${lead.recommendedPrice.toLocaleString('en-IN')}` : '—'],
    ['Status', STATUS_LABELS[lead.funnelStatus] ?? lead.funnelStatus],
    ['Created', new Date(lead.createdAt).toLocaleString()],
    ['WA clicked', lead.whatsappClickedAt ? new Date(lead.whatsappClickedAt).toLocaleString() : 'No'],
    ['Follow-ups sent', String(lead.followUpCount)],
    ['Not-interested reason', lead.notInterestedReason ?? '—'],
    ['Notes', lead.notes || '—'],
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-lead-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 id="admin-lead-title" className="font-display text-lg font-semibold tracking-tight text-charcoal">{lead.leadCode}</h2>
          <button type="button" onClick={onClose} aria-label="Close lead details" className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 text-neutral-400 transition-colors hover:border-neutral-300 hover:text-charcoal">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <dl className="mt-5 space-y-3 text-sm">
          {rows.map(([label, value]) => (
            <div key={label} className="flex items-start justify-between gap-4 border-b border-neutral-100 pb-2.5">
              <dt className="shrink-0 text-xs font-bold uppercase tracking-wider text-neutral-400">{label}</dt>
              <dd className="text-right font-semibold text-charcoal">{value}</dd>
            </div>
          ))}
        </dl>

        {lead.followUpMessage ? (
          <div className="mt-5 rounded-lg border border-neutral-200 bg-neutral-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">Next follow-up message</p>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-neutral-600">{lead.followUpMessage}</p>
          </div>
        ) : null}

        <div className="mt-5 grid grid-cols-2 gap-2">
          {lead.waUrl ? (
            <a href={lead.waUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center justify-center rounded-lg bg-green px-3 text-xs font-bold text-white transition-colors hover:bg-green/90">
              Send follow-up (WhatsApp)
            </a>
          ) : null}
          <button type="button" onClick={onReplied} className="inline-flex min-h-10 items-center justify-center rounded-lg border border-violet-200 bg-white px-3 text-xs font-bold text-violet-700 transition-colors hover:bg-violet-50">Replied</button>
          <button type="button" onClick={onInterested} className="inline-flex min-h-10 items-center justify-center rounded-lg border border-cyan/40 bg-cyan/5 px-3 text-xs font-bold text-cyan transition-colors hover:bg-cyan/10">Interested</button>
          <button type="button" onClick={onBooked} className="inline-flex min-h-10 items-center justify-center rounded-lg border border-green/30 bg-green/5 px-3 text-xs font-bold text-green transition-colors hover:bg-green/10">Booked</button>
          <button type="button" onClick={onNotInterested} className="inline-flex min-h-10 items-center justify-center rounded-lg border border-red-200 bg-white px-3 text-xs font-bold text-red-700 transition-colors hover:bg-red-50">Not interested</button>
          <button type="button" onClick={onNurture} className="inline-flex min-h-10 items-center justify-center rounded-lg border border-amber-200 bg-white px-3 text-xs font-bold text-amber-700 transition-colors hover:bg-amber-50">
            {lead.derivedStatus === 'silent' || lead.funnelStatus === 'silent' ? 'Silent → Nurture' : 'Nurture'}
          </button>
          <button type="button" onClick={onSnooze} className="inline-flex min-h-10 items-center justify-center rounded-lg border border-neutral-200 bg-white px-3 text-xs font-bold text-neutral-600 transition-colors hover:text-charcoal">Snooze 3d</button>
          <button type="button" onClick={onDelete} className="inline-flex min-h-10 items-center justify-center rounded-lg bg-red-600 px-3 text-xs font-bold text-white transition-colors hover:bg-red-700">Delete</button>
        </div>
      </div>
    </div>
  );
}