import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/server/auth';
import { recordFollowUp } from '@/lib/server/leads';
import { computeNextFollowUp } from '@/lib/server/followups';

export const runtime = 'nodejs';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdminRequest(request.headers.get('x-admin-token'))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  const lead = recordFollowUp(id);
  if (!lead) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ lead: { ...lead, nextFollowUp: computeNextFollowUp(lead) } });
}