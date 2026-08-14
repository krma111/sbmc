import type {
  BiggestChallenge,
  BusinessCategory,
  BusinessCheckData,
  LeadFunnelStatus,
  PreferredLanguage,
  PreviewLead,
  RecommendationResult,
  ServerLead,
} from '@/types/lead';
import { addEvent, generateId, generateLeadCode, getLeadById, getLeadByVisitor, getLeads, removeLead, saveLead } from './store';

const STATUS_VALID = new Set<LeadFunnelStatus>([
  'form_started',
  'completed',
  'whatsapp_started',
  'whatsapp_replied',
  'interested',
  'booked',
  'not_interested',
  'nurture',
  'silent',
]);

function emptyLead(visitorId: string, preferredLanguage: PreferredLanguage): ServerLead {
  const now = new Date().toISOString();
  return {
    id: generateId(),
    leadCode: generateLeadCode(getLeads().length),
    visitorId,
    businessName: null,
    businessCategory: null,
    cityArea: null,
    biggestChallenge: null,
    whatsappNumber: null,
    recommendedService: null,
    recommendedPrice: null,
    recommendationReason: null,
    preferredLanguage,
    consent: false,
    funnelStatus: 'form_started',
    currentStep: 1,
    createdAt: now,
    updatedAt: now,
    whatsappClickedAt: null,
    lastFollowUpAt: null,
    followUpCount: 0,
    notInterestedReason: null,
    snoozedUntil: null,
    notes: '',
    source: 'server',
  };
}

export interface BusinessStepPayload {
  visitorId: string;
  step: number;
  data: Partial<Omit<BusinessCheckData, 'consent'>> & { consent?: boolean };
}

export function recordStep(payload: BusinessStepPayload): ServerLead {
  const existing = getLeadByVisitor(payload.visitorId);
  const lead = existing ?? emptyLead(payload.visitorId, payload.data.preferredLanguage ?? 'en');
  const now = new Date().toISOString();

  lead.businessName = typeof payload.data.businessName === 'string' ? payload.data.businessName.slice(0, 100) : lead.businessName;
  if (payload.data.businessCategory) lead.businessCategory = payload.data.businessCategory;
  lead.cityArea = typeof payload.data.cityArea === 'string' ? payload.data.cityArea.slice(0, 100) : lead.cityArea;
  if (payload.data.biggestChallenge) lead.biggestChallenge = payload.data.biggestChallenge;
  if (payload.data.consent === true && payload.data.whatsappNumber) {
    lead.whatsappNumber = payload.data.whatsappNumber;
    lead.consent = true;
  }
  if (typeof payload.data.preferredLanguage === 'string') lead.preferredLanguage = payload.data.preferredLanguage;
  lead.currentStep = Math.max(lead.currentStep, Math.min(payload.step, 5));
  lead.updatedAt = now;
  saveLead(lead);
  addEvent({
    type: 'step_saved',
    leadId: lead.id,
    visitorId: lead.visitorId,
    timestamp: now,
    data: { step: payload.step },
  });
  return lead;
}

export function submitLead(input: {
  visitorId: string;
  data: BusinessCheckData;
  recommendation: RecommendationResult;
}): ServerLead {
  const existing = getLeadByVisitor(input.visitorId);
  const now = new Date().toISOString();
  const lead: ServerLead = existing
    ? {
        ...existing,
        businessName: input.data.businessName,
        businessCategory: input.data.businessCategory,
        cityArea: input.data.cityArea,
        biggestChallenge: input.data.biggestChallenge,
        whatsappNumber: input.data.whatsappNumber,
        preferredLanguage: input.data.preferredLanguage,
        consent: true,
        recommendedService: input.recommendation.serviceName,
        recommendedPrice: input.recommendation.price,
        recommendationReason: input.recommendation.reason,
        currentStep: 5,
        funnelStatus: 'completed',
        updatedAt: now,
      }
    : {
        ...emptyLead(input.visitorId, input.data.preferredLanguage),
        businessName: input.data.businessName,
        businessCategory: input.data.businessCategory,
        cityArea: input.data.cityArea,
        biggestChallenge: input.data.biggestChallenge,
        whatsappNumber: input.data.whatsappNumber,
        preferredLanguage: input.data.preferredLanguage,
        consent: true,
        recommendedService: input.recommendation.serviceName,
        recommendedPrice: input.recommendation.price,
        recommendationReason: input.recommendation.reason,
        currentStep: 5,
        funnelStatus: 'completed',
      };
  saveLead(lead);
  addEvent({ type: 'lead_submitted', leadId: lead.id, visitorId: lead.visitorId, timestamp: now });
  return lead;
}

export function listLeads(): ServerLead[] {
  return getLeads();
}

export function getLead(leadId: string): ServerLead | null {
  return getLeadById(leadId);
}

export function patchLead(
  leadId: string,
  patch: {
    funnelStatus?: LeadFunnelStatus;
    notInterestedReason?: string | null;
    snoozedUntil?: string | null;
    notes?: string;
  }
): ServerLead | null {
  const lead = getLeadById(leadId);
  if (!lead) return null;
  const now = new Date().toISOString();
  const next: ServerLead = { ...lead, updatedAt: now };
  if (patch.funnelStatus && STATUS_VALID.has(patch.funnelStatus)) {
    next.funnelStatus = patch.funnelStatus;
  }
  if (patch.notInterestedReason !== undefined) next.notInterestedReason = patch.notInterestedReason;
  if (patch.snoozedUntil !== undefined) next.snoozedUntil = patch.snoozedUntil;
  if (typeof patch.notes === 'string') next.notes = patch.notes;
  saveLead(next);
  addEvent({ type: 'status_changed', leadId: next.id, timestamp: now, data: { status: next.funnelStatus } });
  return next;
}

export function deleteLead(leadId: string): boolean {
  const lead = getLeadById(leadId);
  if (!lead) return false;
  removeLead(leadId);
  addEvent({ type: 'lead_deleted', leadId, visitorId: lead.visitorId, timestamp: new Date().toISOString() });
  return true;
}

export function recordClick(leadId: string, visitorId: string): ServerLead | null {
  const lead = getLeadById(leadId);
  if (!lead || lead.visitorId !== visitorId) return null;
  const now = new Date().toISOString();
  const next: ServerLead = { ...lead, funnelStatus: 'whatsapp_started', whatsappClickedAt: now, updatedAt: now };
  saveLead(next);
  addEvent({ type: 'whatsapp_click', leadId, visitorId, timestamp: now });
  return next;
}

export function recordFollowUp(leadId: string): ServerLead | null {
  const lead = getLeadById(leadId);
  if (!lead) return null;
  const now = new Date().toISOString();
  const next: ServerLead = {
    ...lead,
    lastFollowUpAt: now,
    followUpCount: lead.followUpCount + 1,
    updatedAt: now,
  };
  saveLead(next);
  addEvent({ type: 'follow_up_sent', leadId, timestamp: now, data: { count: next.followUpCount } });
  return next;
}

export function toPreviewLead(lead: ServerLead): PreviewLead {
  return {
    id: lead.id,
    leadCode: lead.leadCode,
    businessName: lead.businessName ?? '',
    businessCategory: (lead.businessCategory ?? 'other') as BusinessCategory,
    cityArea: lead.cityArea ?? '',
    biggestChallenge: (lead.biggestChallenge ?? 'not_sure_whats_missing') as BiggestChallenge,
    whatsappNumber: lead.whatsappNumber ?? '',
    preferredLanguage: lead.preferredLanguage,
    recommendedService: lead.recommendedService ?? '',
    recommendedPrice: lead.recommendedPrice ?? 0,
    recommendationReason: lead.recommendationReason ?? '',
    createdAt: lead.createdAt,
    updatedAt: lead.updatedAt,
    whatsappClickedAt: lead.whatsappClickedAt,
    status:
      lead.funnelStatus === 'whatsapp_started'
        ? 'whatsapp_started'
        : lead.funnelStatus === 'completed'
          ? 'recommendation_shown'
          : 'new',
    source: 'preview',
  };
}