import { describe, expect, it, beforeEach } from 'vitest';
import { LocalStorageLeadRepository } from '@/lib/preview-storage/LocalStorageLeadRepository';
import type { CreateLeadInput } from '@/types/lead';

class MemoryStorage {
  private store = new Map<string, string>();
  getItem(key: string) {
    return this.store.has(key) ? this.store.get(key)! : null;
  }
  setItem(key: string, value: string) {
    this.store.set(key, value);
  }
  removeItem(key: string) {
    this.store.delete(key);
  }
  clear() {
    this.store.clear();
  }
}

describe('LocalStorageLeadRepository', () => {
  let repo: LocalStorageLeadRepository;
  let storage: MemoryStorage;

  beforeEach(() => {
    storage = new MemoryStorage();
    repo = new LocalStorageLeadRepository(storage);
  });

  function leadInput(overrides: Partial<CreateLeadInput> = {}): CreateLeadInput {
    return {
      businessName: 'Gupta Beauty Parlour',
      businessCategory: 'beauty_parlour_salon',
      cityArea: 'Civil Lines, Prayagraj',
      biggestChallenge: 'instagram_needs_improvement',
      whatsappNumber: '919876543210',
      preferredLanguage: 'en',
      recommendedService: 'Instagram Makeover',
      recommendedPrice: 999,
      recommendationReason: 'Test reason',
      status: 'new',
      source: 'preview',
      ...overrides,
    };
  }

  it('creates a lead with a unique preview lead code', async () => {
    const lead = await repo.createLead(leadInput());
    expect(lead.id).toBeTruthy();
    expect(lead.leadCode).toMatch(/^SBMC-PREVIEW-\d{4}-\d{4}$/);
    expect(lead.createdAt).toBeTruthy();
    expect(lead.updatedAt).toBeTruthy();
    expect(lead.whatsappClickedAt).toBeNull();
  });

  it('increments the lead code counter', async () => {
    const first = await repo.createLead(leadInput());
    const second = await repo.createLead(leadInput());
    expect(first.leadCode.endsWith('0001')).toBe(true);
    expect(second.leadCode.endsWith('0002')).toBe(true);
  });

  it('stores leads in localStorage under the preview key', async () => {
    await repo.createLead(leadInput());
    const raw = storage.getItem('sbmc_preview_leads');
    expect(raw).toBeTruthy();
    const parsed = JSON.parse(raw!);
    expect(parsed).toHaveLength(1);
  });

  it('gets a lead by id', async () => {
    const created = await repo.createLead(leadInput());
    const found = await repo.getLead(created.id);
    expect(found?.businessName).toBe('Gupta Beauty Parlour');
  });

  it('returns null for an unknown lead', async () => {
    const found = await repo.getLead('nope');
    expect(found).toBeNull();
  });

  it('gets all leads', async () => {
    await repo.createLead(leadInput({ businessName: 'A' }));
    await repo.createLead(leadInput({ businessName: 'B' }));
    const leads = await repo.getAllLeads();
    expect(leads).toHaveLength(2);
  });

  it('updates a lead', async () => {
    const created = await repo.createLead(leadInput());
    const updated = await repo.updateLead(created.id, { status: 'whatsapp_started' });
    expect(updated?.status).toBe('whatsapp_started');
    expect(Date.parse(updated!.updatedAt)).toBeGreaterThanOrEqual(Date.parse(created.updatedAt));
  });

  it('clears all preview leads', async () => {
    await repo.createLead(leadInput());
    await repo.clearPreviewLeads();
    expect(await repo.getAllLeads()).toHaveLength(0);
  });

  it('handles corrupted stored data safely', async () => {
    storage.setItem('sbmc_preview_leads', '{not valid json');
    const leads = await repo.getAllLeads();
    expect(leads).toEqual([]);
  });

  it('handles missing stored data safely', async () => {
    const leads = await repo.getAllLeads();
    expect(leads).toEqual([]);
  });

  it('saves and restores a draft', () => {
    repo.saveDraft({ currentStep: 3, data: { businessName: 'Test Shop' }, updatedAt: 'now' });
    const draft = repo.getDraft();
    expect(draft?.currentStep).toBe(3);
    expect(draft?.data.businessName).toBe('Test Shop');
  });

  it('clears a draft', () => {
    repo.saveDraft({ currentStep: 1, data: {}, updatedAt: 'now' });
    repo.clearDraft();
    expect(repo.getDraft()).toBeNull();
  });

  it('saves and restores language preference', () => {
    repo.saveLanguage('hi');
    expect(repo.getLanguage()).toBe('hi');
  });

  it('records events', () => {
    repo.recordEvent({ type: 'whatsapp_click', leadId: 'x', timestamp: 'now' });
    expect(repo.getEventsSync()).toHaveLength(1);
  });
});