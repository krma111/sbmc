import type { CreateLeadInput, LeadRepository, PreviewLead, BusinessCheckDraft } from '@/types/lead';

const LEADS_KEY = 'sbmc_preview_leads';
const DRAFT_KEY = 'sbmc_business_check_draft';
const LANGUAGE_KEY = 'sbmc_language';
const EVENTS_KEY = 'sbmc_preview_events';

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function defaultStorage(): StorageLike {
  if (isBrowser()) return window.localStorage;
  throw new Error('localStorage is not available in this environment');
}

function safeParse<T>(json: string | null, fallback: T): T {
  if (!json) return fallback;
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

function generateLeadCode(existingLeads: PreviewLead[]): string {
  const year = new Date().getFullYear();
  const count = existingLeads.length + 1;
  return `SBMC-PREVIEW-${year}-${String(count).padStart(4, '0')}`;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export class LocalStorageLeadRepository implements LeadRepository {
  private storage: StorageLike;

  constructor(storage?: StorageLike) {
    this.storage = storage ?? defaultStorage();
  }

  async createLead(leadData: CreateLeadInput): Promise<PreviewLead> {
    const existingLeads = this.getAllLeadsSync();
    const now = new Date().toISOString();

    const newLead: PreviewLead = {
      ...leadData,
      id: generateId(),
      leadCode: generateLeadCode(existingLeads),
      createdAt: now,
      updatedAt: now,
      whatsappClickedAt: null,
      status: leadData.status ?? 'new',
      source: 'preview',
    };

    const updatedLeads = [...existingLeads, newLead];
    this.storage.setItem(LEADS_KEY, JSON.stringify(updatedLeads));

    return newLead;
  }

  async getLead(id: string): Promise<PreviewLead | null> {
    const leads = this.getAllLeadsSync();
    return leads.find((lead) => lead.id === id) || null;
  }

  async getAllLeads(): Promise<PreviewLead[]> {
    return this.getAllLeadsSync();
  }

  getAllLeadsSync(): PreviewLead[] {
    const json = this.storage.getItem(LEADS_KEY);
    return safeParse<PreviewLead[]>(json, []);
  }

  async updateLead(id: string, updates: Partial<PreviewLead>): Promise<PreviewLead | null> {
    const leads = this.getAllLeadsSync();
    const index = leads.findIndex((lead) => lead.id === id);

    if (index === -1) return null;

    const updatedLead: PreviewLead = {
      ...leads[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    leads[index] = updatedLead;
    this.storage.setItem(LEADS_KEY, JSON.stringify(leads));

    return updatedLead;
  }

  async clearPreviewLeads(): Promise<void> {
    this.storage.removeItem(LEADS_KEY);
  }

  // Draft methods
  saveDraft(draft: BusinessCheckDraft): void {
    this.storage.setItem(DRAFT_KEY, JSON.stringify(draft));
  }

  getDraft(): BusinessCheckDraft | null {
    const json = this.storage.getItem(DRAFT_KEY);
    return safeParse<BusinessCheckDraft | null>(json, null);
  }

  clearDraft(): void {
    this.storage.removeItem(DRAFT_KEY);
  }

  // Language methods
  saveLanguage(language: 'en' | 'hi'): void {
    this.storage.setItem(LANGUAGE_KEY, language);
  }

  getLanguage(): 'en' | 'hi' {
    return (this.storage.getItem(LANGUAGE_KEY) as 'en' | 'hi') || 'en';
  }

  // Events methods
  recordEvent(event: { type: string; leadId?: string; timestamp: string; data?: Record<string, unknown> }): void {
    const events = this.getEventsSync();
    events.push(event);
    this.storage.setItem(EVENTS_KEY, JSON.stringify(events));
  }

  getEventsSync(): Array<{ type: string; leadId?: string; timestamp: string; data?: Record<string, unknown> }> {
    const json = this.storage.getItem(EVENTS_KEY);
    return safeParse(json, []);
  }
}

let _leadRepository: LocalStorageLeadRepository | null = null;

export function getLeadRepository(): LocalStorageLeadRepository {
  if (!_leadRepository) {
    _leadRepository = new LocalStorageLeadRepository();
  }
  return _leadRepository;
}

/**
 * Lazy singleton so importing this module never touches `window`/`localStorage`
 * in non-browser environments (SSR, tests).
 */
export const leadRepository = new Proxy(
  {} as LocalStorageLeadRepository,
  {
    get(_target, prop: string | symbol, receiver) {
      return Reflect.get(getLeadRepository(), prop, receiver);
    },
  }
);