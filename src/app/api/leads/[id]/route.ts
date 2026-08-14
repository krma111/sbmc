import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/server/auth';
import { deleteLead, getLead, patchLead } from '@/lib/server/leads';
import { computeNextFollowUp } from '@/lib/server/followups';

export const runtime = 'nodejs';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdminRequest(request.headers.get('x-admin-token'))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  const lead = getLead(id);
  if (!lead) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ lead: { ...lead, nextFollowUp: computeNextFollowUp(lead) } });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdminRequest(request.headers.get('x-admin-token'))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const patched = patchLead(id, {
    funnelStatus: typeof body.funnelStatus === 'string' ? (body.funnelStatus as import('@/types/lead').LeadFunnelStatus) : undefined,
    notInterestedReason: typeof body.notInterestedReason === 'string' ? body.notInterestedReason : body.notInterestedReason === null ? null : undefined,
    snoozedUntil: typeof body.snoozedUntil === 'string' ? body.snoozedUntil : body.snoozedUntil === null ? null : undefined,
    notes: typeof body.notes === 'string' ? body.notes : undefined,
  });

  if (!patched) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ lead: { ...patched, nextFollowUp: computeNextFollowUp(patched) } });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdminRequest(request.headers.get('x-admin-token'))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  const deleted = deleteLead(id);
  if (!deleted) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ ok: true });
}