import { NextRequest, NextResponse } from 'next/server';
import { recordClick } from '@/lib/server/leads';

export const runtime = 'nodejs';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let body: { visitorId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  const lead = recordClick(id, body?.visitorId ?? '');
  if (!lead) return NextResponse.json({ error: 'Not found or not yours' }, { status: 404 });
  return NextResponse.json({ lead: { id: lead.id, whatsappClickedAt: lead.whatsappClickedAt, funnelStatus: lead.funnelStatus } });
}