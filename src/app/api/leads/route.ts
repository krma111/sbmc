import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/server/auth';
import { listLeads, submitLead, toPreviewLead } from '@/lib/server/leads';
import { businessCheckSchema } from '@/lib/validation/schemas';
import { getRecommendation } from '@/lib/recommendation/engine';
import { computeNextFollowUp, derivedFunnelStatus, followUpMessage, waLink } from '@/lib/server/followups';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const token = request.headers.get('x-admin-token') ?? request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (!isAdminRequest(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const status = request.nextUrl.searchParams.get('status');
  const leads = listLeads().filter((lead) => !status || lead.funnelStatus === status);
  const enriched = leads.map((lead) => {
    const message = lead.whatsappNumber ? followUpMessage(lead) : null;
    return {
      ...lead,
      derivedStatus: derivedFunnelStatus(lead),
      nextFollowUp: computeNextFollowUp(lead),
      followUpMessage: message,
      waUrl: message && lead.whatsappNumber ? waLink(lead.whatsappNumber, message) : null,
    };
  });
  return NextResponse.json({ leads: enriched });
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { visitorId, data } = (body ?? {}) as { visitorId?: string; data?: unknown };
  if (!visitorId || typeof visitorId !== 'string') {
    return NextResponse.json({ error: 'Missing visitorId' }, { status: 400 });
  }

  const parsed = businessCheckSchema.safeParse(data);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid lead data', issues: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const valid = parsed.data;
  const recommendation = getRecommendation(valid.biggestChallenge, valid.businessCategory);
  const lead = submitLead({ visitorId, data: valid, recommendation });

  return NextResponse.json({ lead: toPreviewLead(lead) }, { status: 201 });
}