export type BusinessCategory =
  | 'beauty_parlour_salon'
  | 'coaching_institute'
  | 'computer_laptop_shop'
  | 'gym_fitness_centre'
  | 'restaurant_cafe'
  | 'clinic_healthcare'
  | 'real_estate'
  | 'boutique_fashion'
  | 'local_retail_service'
  | 'other';

export type BiggestChallenge =
  | 'need_more_enquiries'
  | 'not_professional_online'
  | 'instagram_needs_improvement'
  | 'not_found_on_google'
  | 'offers_not_attracting'
  | 'whatsapp_unorganised'
  | 'dont_know_content'
  | 'need_website'
  | 'not_sure_whats_missing';

export type PreferredLanguage = 'en' | 'hi';

export type LeadStatus = 'new' | 'recommendation_shown' | 'whatsapp_started';

export interface BusinessCheckData {
  businessName: string;
  businessCategory: BusinessCategory;
  cityArea: string;
  biggestChallenge: BiggestChallenge;
  whatsappNumber: string;
  preferredLanguage: PreferredLanguage;
  consent: boolean;
}

export interface RecommendationResult {
  serviceId: string;
  serviceName: string;
  price: number;
  reason: string;
}

export interface PreviewLead {
  id: string;
  leadCode: string;
  businessName: string;
  businessCategory: BusinessCategory;
  cityArea: string;
  biggestChallenge: BiggestChallenge;
  whatsappNumber: string;
  preferredLanguage: PreferredLanguage;
  recommendedService: string;
  recommendedPrice: number;
  recommendationReason: string;
  createdAt: string;
  updatedAt: string;
  whatsappClickedAt: string | null;
  status: LeadStatus;
  source: 'preview';
}

export type CreateLeadInput = Omit<
  PreviewLead,
  'id' | 'leadCode' | 'createdAt' | 'updatedAt' | 'whatsappClickedAt'
>;

export interface LeadRepository {
  createLead(lead: CreateLeadInput): Promise<PreviewLead>;
  getLead(id: string): Promise<PreviewLead | null>;
  getAllLeads(): Promise<PreviewLead[]>;
  updateLead(id: string, updates: Partial<PreviewLead>): Promise<PreviewLead | null>;
  clearPreviewLeads(): Promise<void>;
}

export interface BusinessCheckDraft {
  currentStep: number;
  data: Partial<BusinessCheckData>;
  updatedAt: string;
}

/**
 * Server-side funnel status. Supersedes the 3-state `LeadStatus` used for the
 * browser-only preview leads. The admin dashboard and follow-up engine work on this.
 */
export type LeadFunnelStatus =
  | 'form_started'
  | 'completed'
  | 'whatsapp_started'
  | 'whatsapp_replied'
  | 'interested'
  | 'booked'
  | 'not_interested'
  | 'nurture'
  | 'silent';

export interface ServerLead {
  id: string;
  leadCode: string;
  visitorId: string;
  businessName: string | null;
  businessCategory: BusinessCategory | null;
  cityArea: string | null;
  biggestChallenge: BiggestChallenge | null;
  whatsappNumber: string | null;
  recommendedService: string | null;
  recommendedPrice: number | null;
  recommendationReason: string | null;
  preferredLanguage: PreferredLanguage;
  consent: boolean;
  funnelStatus: LeadFunnelStatus;
  currentStep: number;
  createdAt: string;
  updatedAt: string;
  whatsappClickedAt: string | null;
  lastFollowUpAt: string | null;
  followUpCount: number;
  notInterestedReason: string | null;
  snoozedUntil: string | null;
  notes: string;
  source: 'preview' | 'server';
}

export interface ServerEvent {
  type: string;
  leadId?: string;
  visitorId?: string;
  timestamp: string;
  data?: Record<string, unknown>;
}