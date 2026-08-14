import type { BusinessCheckData, PreviewLead } from '@/types/lead';

const VISITOR_KEY = 'sbmc_visitor_id';

export function getVisitorId(): string {
  if (typeof window === 'undefined') return 'anon';
  let id = window.localStorage.getItem(VISITOR_KEY);
  if (!id) {
    id = `v_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
    window.localStorage.setItem(VISITOR_KEY, id);
  }
  return id;
}

export async function saveStepOnServer(step: number, data: Partial<BusinessCheckData>): Promise<void> {
  try {
    await fetch('/api/leads/step', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visitorId: getVisitorId(), step, data }),
    });
  } catch {
    // Offline or server down — browser draft still covers this visit.
  }
}

export async function createLeadOnServer(data: BusinessCheckData): Promise<PreviewLead | null> {
  try {
    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visitorId: getVisitorId(), data }),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { lead?: PreviewLead };
    return json.lead ?? null;
  } catch {
    return null;
  }
}

export async function recordClickOnServer(leadId: string): Promise<void> {
  try {
    await fetch(`/api/leads/${encodeURIComponent(leadId)}/click`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visitorId: getVisitorId() }),
    });
  } catch {
    // Ignored for preview-only leads.
  }
}