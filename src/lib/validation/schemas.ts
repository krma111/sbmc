import { z } from 'zod';
import type { BusinessCategory, BiggestChallenge, PreferredLanguage } from '@/types/lead';

export const businessNameSchema = z
  .string()
  .trim()
  .min(2, 'Business name must be at least 2 characters')
  .max(100, 'Business name must be less than 100 characters')
  .refine((val) => val.replace(/\s+/g, ' ').length > 0, 'Business name cannot be empty')
  .transform((val) => val.replace(/\s+/g, ' ').replace(/<[^>]*>/g, ''));

export const businessCategorySchema = z.enum([
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
]) as z.ZodType<BusinessCategory>;

export const cityAreaSchema = z
  .string()
  .trim()
  .min(2, 'Location must be at least 2 characters')
  .max(100, 'Location must be less than 100 characters')
  .transform((val) => val.replace(/\s+/g, ' ').replace(/<[^>]*>/g, ''));

export const biggestChallengeSchema = z.enum([
  'need_more_enquiries',
  'not_professional_online',
  'instagram_needs_improvement',
  'not_found_on_google',
  'offers_not_attracting',
  'whatsapp_unorganised',
  'dont_know_content',
  'need_website',
  'not_sure_whats_missing',
]) as z.ZodType<BiggestChallenge>;

export const whatsappNumberSchema = z
  .string()
  .transform((val) => val.replace(/[\s\-\(\)]/g, ''))
  .refine((val) => {
    const cleaned = val.replace(/^(\+91|91)/, '');
    return /^[6-9]\d{9}$/.test(cleaned);
  }, 'Please enter a valid 10-digit Indian mobile number')
  .refine((val) => {
    const cleaned = val.replace(/^(\+91|91)/, '');
    return !/^(\d)\1{9}$/.test(cleaned);
  }, 'Please enter a valid mobile number')
  .transform((val) => {
    const cleaned = val.replace(/^(\+91|91)/, '');
    return `91${cleaned}`;
  });

export const preferredLanguageSchema = z.enum(['en', 'hi']) as z.ZodType<PreferredLanguage>;

export const consentSchema = z.boolean().refine((val) => val === true, 'You must agree to continue on WhatsApp');

export const step1Schema = z.object({
  businessName: businessNameSchema,
});

export const step2Schema = z.object({
  businessCategory: businessCategorySchema,
});

export const step3Schema = z.object({
  cityArea: cityAreaSchema,
});

export const step4Schema = z.object({
  biggestChallenge: biggestChallengeSchema,
});

export const step5Schema = z.object({
  whatsappNumber: whatsappNumberSchema,
  preferredLanguage: preferredLanguageSchema,
  consent: consentSchema,
});

export const businessCheckSchema = z.object({
  businessName: businessNameSchema,
  businessCategory: businessCategorySchema,
  cityArea: cityAreaSchema,
  biggestChallenge: biggestChallengeSchema,
  whatsappNumber: whatsappNumberSchema,
  preferredLanguage: preferredLanguageSchema,
  consent: consentSchema,
});

export type Step1Data = z.infer<typeof step1Schema>;
export type Step2Data = z.infer<typeof step2Schema>;
export type Step3Data = z.infer<typeof step3Schema>;
export type Step4Data = z.infer<typeof step4Schema>;
export type Step5Data = z.infer<typeof step5Schema>;
export type BusinessCheckData = z.infer<typeof businessCheckSchema>;