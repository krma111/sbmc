import { NextRequest, NextResponse } from 'next/server';
import { recordStep } from '@/lib/server/leads';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  let body: { visitorId?: string; step?: number; data?: Record<string, unknown> };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const visitorId = typeof body?.visitorId === 'string' ? body.visitorId.trim() : '';
  const step = Number(body?.step);
  if (!visitorId || !Number.isInteger(step) || step < 1 || step > 5) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const data = (body?.data ?? {}) as Record<string, unknown>;

  const lead = recordStep({
    visitorId,
    step,
    data: {
      businessName: typeof data.businessName === 'string' ? data.businessName : undefined,
      businessCategory: typeof data.businessCategory === 'string' ? (data.businessCategory as import('@/types/lead').BusinessCategory) : undefined,
      cityArea: typeof data.cityArea === 'string' ? data.cityArea : undefined,
      biggestChallenge: typeof data.biggestChallenge === 'string' ? (data.biggestChallenge as import('@/types/lead').BiggestChallenge) : undefined,
      whatsappNumber: typeof data.whatsappNumber === 'string' ? data.whatsappNumber : undefined,
      preferredLanguage: data.preferredLanguage === 'hi' ? 'hi' : 'en',
      consent: data.consent === true,
    },
  });

  return NextResponse.json({ lead: { id: lead.id, currentStep: lead.currentStep, funnelStatus: lead.funnelStatus } });
}