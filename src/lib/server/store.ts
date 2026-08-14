import fs from 'node:fs';
import path from 'node:path';
import type { ServerLead, ServerEvent } from '@/types/lead';

const DATA_DIR = path.join(process.cwd(), 'data');
const FILE = path.join(DATA_DIR, 'leads.json');

interface StoreShape {
  leads: ServerLead[];
  events: ServerEvent[];
}

let cache: StoreShape | null = null;

function load(): StoreShape {
  if (cache) return cache;
  try {
    const raw = fs.readFileSync(FILE, 'utf-8');
    const parsed = JSON.parse(raw) as Partial<StoreShape>;
    cache = { leads: parsed.leads ?? [], events: parsed.events ?? [] };
  } catch {
    cache = { leads: [], events: [] };
  }
  return cache;
}

function save(shape: StoreShape): void {
  cache = shape;
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    const tmp = `${FILE}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify(shape, null, 2));
    fs.renameSync(tmp, FILE);
  } catch {
    // Persistence failure must not crash the request loop; data lives in memory.
  }
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export function generateLeadCode(existingCount: number): string {
  const year = new Date().getFullYear();
  return `SBMC-PREVIEW-${year}-${String(existingCount + 1).padStart(4, '0')}`;
}

export function getLeads(): ServerLead[] {
  return load().leads;
}

export function getLeadById(id: string): ServerLead | null {
  return load().leads.find((lead) => lead.id === id) ?? null;
}

export function getLeadByVisitor(visitorId: string): ServerLead | null {
  return load().leads.find((lead) => lead.visitorId === visitorId) ?? null;
}

export function saveLead(lead: ServerLead): void {
  const store = load();
  const index = store.leads.findIndex((l) => l.id === lead.id);
  if (index === -1) {
    store.leads.push(lead);
  } else {
    store.leads[index] = lead;
  }
  save(store);
}

export function removeLead(id: string): void {
  const store = load();
  store.leads = store.leads.filter((lead) => lead.id !== id);
  save(store);
}

export function getEvents(): ServerEvent[] {
  return load().events;
}

export function addEvent(event: ServerEvent): void {
  const store = load();
  store.events.unshift(event);
  if (store.events.length > 5000) store.events = store.events.slice(0, 5000);
  save(store);
}