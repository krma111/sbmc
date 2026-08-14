import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/server/auth';
import { listLeads } from '@/lib/server/leads';
import { computeNextFollowUp, derivedFunnelStatus, FOLLOW_UP_OFFSETS_MS } from '@/lib/server/followups';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request.headers.get('x-admin-token'))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const now = Date.now();
  const leads = listLeads();

  const byStatus: Record<string, number> = {};
  for (const lead of leads) {
    byStatus[lead.funnelStatus] = (byStatus[lead.funnelStatus] ?? 0) + 1;
  }

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const newToday = leads.filter((lead) => new Date(lead.createdAt).getTime() >= startOfToday.getTime()).length;

  const dueFollowUps = leads
    .map((lead) => ({ lead, next: computeNextFollowUp(lead, now) }))
    .filter(({ next }) => next.due && next.eligible)
    .map(({ lead, next }) => ({ ...lead, nextFollowUp: next }))
    .sort((a, b) => (a.nextFollowUp.dueAt ?? 0) - (b.nextFollowUp.dueAt ?? 0));

  const notInterestedReasons: Record<string, number> = {};
  for (const lead of leads) {
    if (lead.funnelStatus === 'not_interested' && lead.notInterestedReason) {
      notInterestedReasons[lead.notInterestedReason] = (notInterestedReasons[lead.notInterestedReason] ?? 0) + 1;
    }
  }

  const silent = leads.filter((lead) => derivedFunnelStatus(lead, now) === 'silent');
  const nurtureSuggestions = silent.map((lead) => ({
    id: lead.id,
    leadCode: lead.leadCode,
    businessName: lead.businessName,
    whatsappNumber: lead.whatsappNumber,
    whatsappClickedAt: lead.whatsappClickedAt,
    created: lead.createdAt,
  }));

  return NextResponse.json({
    total: leads.length,
    newToday,
    byStatus,
    dueFollowUps,
    silent: silent.length,
    nurtureSuggestions,
    notInterestedReasons,
    followUpOffsetsHours: FOLLOW_UP_OFFSETS_MS.map((ms) => Math.round(ms / 3_600_000)),
  });
}