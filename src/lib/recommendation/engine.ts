import type { BiggestChallenge, BusinessCategory, RecommendationResult } from '@/types/lead';
import { services, getService } from '@/content/services';

interface ChallengeMapping {
  primaryServiceId: string;
  reason: string;
  secondaryServiceId?: string;
}

const challengeMappings: Record<BiggestChallenge, ChallengeMapping> = {
  need_more_enquiries: {
    primaryServiceId: 'ai_business_report',
    reason:
      'Your business may need to identify where potential customers are dropping off before investing in random marketing activities.',
  },
  not_professional_online: {
    primaryServiceId: 'instagram_makeover',
    reason:
      'A professional online presence builds trust and shows customers you are serious about quality.',
    secondaryServiceId: 'business_landing_page',
  },
  instagram_needs_improvement: {
    primaryServiceId: 'instagram_makeover',
    reason:
      'An optimized Instagram profile converts profile visitors into enquiries and customers.',
  },
  not_found_on_google: {
    primaryServiceId: 'google_business_profile_fix',
    reason:
      'A complete, optimized Google Business Profile helps customers find you when they search locally.',
  },
  offers_not_attracting: {
    primaryServiceId: 'offer_creation',
    reason:
      'Well-structured offers with clear benefits and urgency drive immediate customer action.',
  },
  whatsapp_unorganised: {
    primaryServiceId: 'whatsapp_business_setup',
    reason:
      'Organized WhatsApp Business with quick replies and catalogues turns chaotic chats into smooth conversions.',
  },
  dont_know_content: {
    primaryServiceId: 'monthly_content_plan',
    reason:
      'A structured content plan removes guesswork and ensures consistent, strategic posting.',
  },
  need_website: {
    primaryServiceId: 'business_landing_page',
    reason:
      'A professional landing page explains your business, builds trust, and generates WhatsApp enquiries 24/7.',
  },
  not_sure_whats_missing: {
    primaryServiceId: 'ai_business_report',
    reason:
      'A comprehensive audit reveals gaps, opportunities, and priorities so you invest in the right things first.',
  },
};

/**
 * Categories where Instagram is a core customer-facing channel.
 * Used to decide the secondary suggestion for the "not professional online" challenge.
 */
const socialMediaFocusedCategories: BusinessCategory[] = [
  'beauty_parlour_salon',
  'coaching_institute',
  'gym_fitness_centre',
  'restaurant_cafe',
  'boutique_fashion',
  'local_retail_service',
];

export function getRecommendation(
  challenge: BiggestChallenge,
  category: BusinessCategory
): RecommendationResult {
  const mapping = challengeMappings[challenge];

  let serviceId = mapping.primaryServiceId;

  if (
    challenge === 'not_professional_online' &&
    mapping.secondaryServiceId &&
    !socialMediaFocusedCategories.includes(category)
  ) {
    serviceId = mapping.secondaryServiceId;
  }

  const service = getService(serviceId);

  if (!service) {
    const fallback = getService('ai_business_report');
    return {
      serviceId: fallback!.id,
      serviceName: fallback!.name,
      price: fallback!.price,
      reason: mapping.reason,
    };
  }

  return {
    serviceId: service.id,
    serviceName: service.name,
    price: service.price,
    reason: mapping.reason,
  };
}

export function getAllRecommendations(): RecommendationResult[] {
  return services.map((s) => ({
    serviceId: s.id,
    serviceName: s.name,
    price: s.price,
    reason: '',
  }));
}