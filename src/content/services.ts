import type { BusinessCategory } from '@/types/lead';

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'starter' | 'growth' | 'complete';
  features: string[];
  bestFor: BusinessCategory[];
}

export const services: Service[] = [
  {
    id: 'ready_to_post_poster',
    name: 'Ready-to-Post Poster',
    description: 'A professional branded poster ready for Instagram, Facebook, and WhatsApp.',
    price: 99,
    category: 'starter',
    features: ['Custom branded design', 'Optimized for social platforms', 'Delivered in 24 hours', '1 revision included'],
    bestFor: ['beauty_parlour_salon', 'coaching_institute', 'computer_laptop_shop', 'gym_fitness_centre', 'restaurant_cafe', 'boutique_fashion', 'local_retail_service'],
  },
  {
    id: 'festival_post_pack',
    name: 'Festival Post Pack',
    description: 'Consistent branded festival creatives for relevant occasions.',
    price: 299,
    category: 'starter',
    features: ['5 festival designs', 'Brand-consistent styling', 'Ready for all platforms', 'Delivered before festival'],
    bestFor: ['beauty_parlour_salon', 'coaching_institute', 'restaurant_cafe', 'boutique_fashion', 'local_retail_service'],
  },
  {
    id: 'offer_creation',
    name: 'Offer Creation',
    description: 'Offer concept, headline, customer benefit, CTA, and promotional creative.',
    price: 499,
    category: 'starter',
    features: ['Strategic offer design', 'Compelling headline & copy', 'Promotional creative included', 'WhatsApp & social ready'],
    bestFor: ['beauty_parlour_salon', 'coaching_institute', 'computer_laptop_shop', 'gym_fitness_centre', 'restaurant_cafe', 'clinic_healthcare', 'boutique_fashion', 'local_retail_service'],
  },
  {
    id: 'instagram_makeover',
    name: 'Instagram Makeover',
    description: 'Improve bio, profile structure, highlights, presentation, and customer clarity.',
    price: 999,
    category: 'growth',
    features: ['Bio optimization', 'Profile structure overhaul', 'Highlights strategy', 'Content pillars defined', 'Visual style guide'],
    bestFor: ['beauty_parlour_salon', 'coaching_institute', 'gym_fitness_centre', 'restaurant_cafe', 'boutique_fashion', 'local_retail_service'],
  },
  {
    id: 'google_business_profile_fix',
    name: 'Google Business Profile Fix',
    description: 'Improve profile completeness, services, description, presentation, and customer trust. Specific rankings are not guaranteed.',
    price: 999,
    category: 'growth',
    features: ['Profile completeness audit', 'Services & description optimization', 'Photo & review strategy', 'Q&A setup', 'Monthly insights report'],
    bestFor: ['beauty_parlour_salon', 'coaching_institute', 'computer_laptop_shop', 'gym_fitness_centre', 'restaurant_cafe', 'clinic_healthcare', 'real_estate', 'local_retail_service', 'other'],
  },
  {
    id: 'whatsapp_business_setup',
    name: 'WhatsApp Business Setup',
    description: 'Create greeting messages, away messages, quick replies, catalogue structure, labels, and customer-response flow.',
    price: 1499,
    category: 'growth',
    features: ['Greeting & away messages', 'Quick replies library', 'Catalogue structure', 'Labels & automation', 'Response flow design'],
    bestFor: ['beauty_parlour_salon', 'computer_laptop_shop', 'clinic_healthcare', 'real_estate', 'local_retail_service', 'other'],
  },
  {
    id: 'ai_business_report',
    name: 'AI Business Report',
    description: 'A personalised report showing gaps, opportunities, priorities, and recommended actions.',
    price: 1999,
    category: 'growth',
    features: ['Comprehensive audit', 'Gap analysis', 'Opportunity mapping', 'Priority roadmap', 'Actionable recommendations'],
    bestFor: ['beauty_parlour_salon', 'coaching_institute', 'computer_laptop_shop', 'gym_fitness_centre', 'restaurant_cafe', 'clinic_healthcare', 'real_estate', 'boutique_fashion', 'local_retail_service', 'other'],
  },
  {
    id: 'monthly_content_plan',
    name: 'Monthly Content Plan',
    description: 'A structured monthly plan covering post topics, stories, timing, CTAs, and campaign direction.',
    price: 2499,
    category: 'growth',
    features: ['30-day content calendar', 'Post topics & formats', 'Story sequences', 'CTA strategy', 'Campaign themes'],
    bestFor: ['beauty_parlour_salon', 'coaching_institute', 'gym_fitness_centre', 'restaurant_cafe', 'boutique_fashion', 'local_retail_service'],
  },
  {
    id: 'business_landing_page',
    name: 'Business Landing Page',
    description: 'A professional mobile-first page that explains the business, builds trust, and generates WhatsApp enquiries.',
    price: 4999,
    category: 'complete',
    features: ['Mobile-first design', 'Trust-building sections', 'WhatsApp enquiry integration', 'SEO-optimized', 'Analytics setup'],
    bestFor: ['coaching_institute', 'real_estate', 'clinic_healthcare', 'computer_laptop_shop', 'other'],
  },
  {
    id: 'complete_business_growth_setup',
    name: 'Complete Business Growth Setup',
    description: 'A coordinated business-growth foundation covering the agreed areas of branding, offers, profiles, WhatsApp, content, and website direction.',
    price: 9999,
    category: 'complete',
    features: ['Full branding system', 'Offer strategy', 'Profile optimization', 'WhatsApp automation', 'Content engine', 'Landing page direction', '3-month roadmap'],
    bestFor: ['beauty_parlour_salon', 'coaching_institute', 'computer_laptop_shop', 'gym_fitness_centre', 'restaurant_cafe', 'clinic_healthcare', 'real_estate', 'boutique_fashion', 'local_retail_service', 'other'],
  },
];

export function getService(id: string): Service | undefined {
  return services.find((s) => s.id === id);
}

export function getServicesByCategory(category: 'starter' | 'growth' | 'complete'): Service[] {
  return services.filter((s) => s.category === category);
}

export function getServicesForBusiness(businessCategory: BusinessCategory): Service[] {
  return services.filter((s) => s.bestFor.includes(businessCategory));
}