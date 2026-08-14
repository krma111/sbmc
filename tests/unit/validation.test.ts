import { describe, expect, it } from 'vitest';
import {
  businessNameSchema,
  cityAreaSchema,
  whatsappNumberSchema,
  consentSchema,
  step1Schema,
  step3Schema,
  step5Schema,
} from '@/lib/validation/schemas';

describe('businessNameSchema', () => {
  it('accepts a valid business name', () => {
    expect(businessNameSchema.parse('Gupta Beauty Parlour')).toBe('Gupta Beauty Parlour');
  });

  it('rejects empty input', () => {
    const result = step1Schema.safeParse({ businessName: '' });
    expect(result.success).toBe(false);
  });

  it('rejects input shorter than 2 characters', () => {
    const result = step1Schema.safeParse({ businessName: 'A' });
    expect(result.success).toBe(false);
  });

  it('rejects input longer than 100 characters', () => {
    const result = step1Schema.safeParse({ businessName: 'X'.repeat(101) });
    expect(result.success).toBe(false);
  });

  it('trims repeated spaces', () => {
    expect(businessNameSchema.parse('Gupta   Beauty  Parlour')).toBe('Gupta Beauty Parlour');
  });

  it('removes HTML tags', () => {
    expect(businessNameSchema.parse('<script>alert(1)</script>Gupta')).toBe('alert(1)Gupta');
  });

  it('rejects meaningless whitespace-only input', () => {
    const result = step1Schema.safeParse({ businessName: '     ' });
    expect(result.success).toBe(false);
  });
});

describe('cityAreaSchema', () => {
  it('accepts a valid location', () => {
    expect(cityAreaSchema.parse('Civil Lines, Prayagraj')).toBe('Civil Lines, Prayagraj');
  });

  it('rejects empty input', () => {
    const result = step3Schema.safeParse({ cityArea: '' });
    expect(result.success).toBe(false);
  });

  it('rejects input shorter than 2 characters', () => {
    const result = step3Schema.safeParse({ cityArea: 'X' });
    expect(result.success).toBe(false);
  });

  it('rejects input longer than 100 characters', () => {
    const result = step3Schema.safeParse({ cityArea: 'X'.repeat(101) });
    expect(result.success).toBe(false);
  });
});

describe('whatsappNumberSchema', () => {
  it('normalises a plain 10-digit number', () => {
    expect(whatsappNumberSchema.parse('9876543210')).toBe('919876543210');
  });

  it('normalises +91 format', () => {
    expect(whatsappNumberSchema.parse('+91 98765 43210')).toBe('919876543210');
  });

  it('normalises 91 prefix', () => {
    expect(whatsappNumberSchema.parse('919876543210')).toBe('919876543210');
  });

  it('removes spaces, hyphens, and brackets', () => {
    expect(whatsappNumberSchema.parse('+91 (98765) 432-10')).toBe('919876543210');
  });

  it('rejects invalid length (too short)', () => {
    const result = step5Schema.safeParse({
      whatsappNumber: '98765',
      preferredLanguage: 'en',
      consent: true,
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid length (too long)', () => {
    const result = step5Schema.safeParse({
      whatsappNumber: '98765432100',
      preferredLanguage: 'en',
      consent: true,
    });
    expect(result.success).toBe(false);
  });

  it('rejects numbers starting with 0', () => {
    const result = step5Schema.safeParse({
      whatsappNumber: '0876543210',
      preferredLanguage: 'en',
      consent: true,
    });
    expect(result.success).toBe(false);
  });

  it('rejects numbers starting with 5', () => {
    const result = step5Schema.safeParse({
      whatsappNumber: '5876543210',
      preferredLanguage: 'en',
      consent: true,
    });
    expect(result.success).toBe(false);
  });

  it('rejects obvious fake repeated digits', () => {
    const result = step5Schema.safeParse({
      whatsappNumber: '0000000000',
      preferredLanguage: 'en',
      consent: true,
    });
    expect(result.success).toBe(false);
  });

  it('rejects repeated digits like 1111111111', () => {
    const result = step5Schema.safeParse({
      whatsappNumber: '1111111111',
      preferredLanguage: 'en',
      consent: true,
    });
    expect(result.success).toBe(false);
  });
});

describe('consentSchema', () => {
  it('requires consent to be true', () => {
    expect(consentSchema.safeParse(false).success).toBe(false);
    expect(consentSchema.safeParse(true).success).toBe(true);
  });

  it('fails the step when consent is not provided', () => {
    const result = step5Schema.safeParse({
      whatsappNumber: '9876543210',
      preferredLanguage: 'en',
      consent: false,
    });
    expect(result.success).toBe(false);
  });
});