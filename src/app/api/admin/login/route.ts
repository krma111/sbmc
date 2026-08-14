import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/server/auth';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  let body: { password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  const ok = isAdminRequest(body?.password ?? null);
  if (!ok) return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  return NextResponse.json({ ok: true });
}