import { describe, expect, it } from 'vitest';
import { getRecommendation } from '@/lib/recommendation/engine';
import type { BiggestChallenge, BusinessCategory } from '@/types/lead';

const challenges: BiggestChallenge[] = [
  'need_more_enquiries',
  'not_professional_online',
  'instagram_needs_improvement',
  'not_found_on_google',
  'offers_not_attracting',
  'whatsapp_unorganised',
  'dont_know_content',
  'need_website',
  'not_sure_whats_missing',
];

const categories: BusinessCategory[] = [
  'beauty_parlour_salon',
  'coaching_institute',
  'computer_laptop_shop',
  'gym_fitness_centre',
  'restaurant_cafe',
  'clinic_healthcare',
  'real_estate',
  'boutique_fashion',
  'local_retail_service',
  'other',
];

describe('recommendation engine', () => {
  it('maps "need more enquiries" to the AI Business Report', () => {
    const rec = getRecommendation('need_more_enquiries', 'local_retail_service');
    expect(rec.serviceId).toBe('ai_business_report');
    expect(rec.price).toBe(1999);
  });

  it('maps "instagram needs improvement" to Instagram Makeover', () => {
    const rec = getRecommendation('instagram_needs_improvement', 'boutique_fashion');
    expect(rec.serviceId).toBe('instagram_makeover');
    expect(rec.price).toBe(999);
  });

  it('maps "not found on google" to Google Business Profile Fix', () => {
    const rec = getRecommendation('not_found_on_google', 'clinic_healthcare');
    expect(rec.serviceId).toBe('google_business_profile_fix');
    expect(rec.price).toBe(999);
  });

  it('maps "offers not attracting" to Offer Creation', () => {
    const rec = getRecommendation('offers_not_attracting', 'restaurant_cafe');
    expect(rec.serviceId).toBe('offer_creation');
    expect(rec.price).toBe(499);
  });

  it('maps "whatsapp unorganised" to WhatsApp Business Setup', () => {
    const rec = getRecommendation('whatsapp_unorganised', 'computer_laptop_shop');
    expect(rec.serviceId).toBe('whatsapp_business_setup');
    expect(rec.price).toBe(1499);
  });

  it('maps "dont know content" to Monthly Content Plan', () => {
    const rec = getRecommendation('dont_know_content', 'coaching_institute');
    expect(rec.serviceId).toBe('monthly_content_plan');
    expect(rec.price).toBe(2499);
  });

  it('maps "need website" to Business Landing Page', () => {
    const rec = getRecommendation('need_website', 'real_estate');
    expect(rec.serviceId).toBe('business_landing_page');
    expect(rec.price).toBe(4999);
  });

  it('maps "not sure what is missing" to AI Business Report', () => {
    const rec = getRecommendation('not_sure_whats_missing', 'beauty_parlour_salon');
    expect(rec.serviceId).toBe('ai_business_report');
    expect(rec.price).toBe(1999);
  });

  it('maps "not professional online" to Instagram Makeover for social categories', () => {
    const rec = getRecommendation('not_professional_online', 'beauty_parlour_salon');
    expect(rec.serviceId).toBe('instagram_makeover');
  });

  it('shows a secondary suggestion (landing page) for non-social categories when primary is not prioritised', () => {
    const rec = getRecommendation('not_professional_online', 'clinic_healthcare');
    expect(rec.serviceId).toBe('business_landing_page');
  });

  it('is deterministic — same input always gives same output', () => {
    const a = getRecommendation('not_found_on_google', 'beauty_parlour_salon');
    const b = getRecommendation('not_found_on_google', 'beauty_parlour_salon');
    expect(a).toEqual(b);
  });

  it('always returns a recommendation for every challenge and category combination', () => {
    for (const challenge of challenges) {
      for (const category of categories) {
        const rec = getRecommendation(challenge, category);
        expect(rec.serviceId).toBeTruthy();
        expect(rec.serviceName).toBeTruthy();
        expect(rec.price).toBeGreaterThan(0);
        expect(rec.reason).toBeTruthy();
      }
    }
  });
});