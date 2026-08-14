import { describe, expect, it } from 'vitest';
import {
  generateWhatsAppMessage,
  generateWhatsAppUrl,
  generateWhatsAppUrlFromLead,
  getWhatsAppNumber,
} from '@/lib/whatsapp/generators';
import type { PreviewLead } from '@/types/lead';

function makeLead(overrides: Partial<PreviewLead> = {}): PreviewLead {
  return {
    id: 'test-id',
    leadCode: 'SBMC-PREVIEW-2026-0001',
    businessName: 'Gupta Beauty Parlour',
    businessCategory: 'beauty_parlour_salon',
    cityArea: 'Civil Lines, Prayagraj',
    biggestChallenge: 'instagram_needs_improvement',
    whatsappNumber: '919876543210',
    preferredLanguage: 'en',
    recommendedService: 'Instagram Makeover',
    recommendedPrice: 999,
    recommendationReason: 'An optimized Instagram profile converts visitors into enquiries.',
    createdAt: '2026-08-04T00:00:00.000Z',
    updatedAt: '2026-08-04T00:00:00.000Z',
    whatsappClickedAt: null,
    status: 'new',
    source: 'preview',
    ...overrides,
  };
}

describe('WhatsApp message generator', () => {
  it('uses the correct SBMC WhatsApp number', () => {
    expect(getWhatsAppNumber()).toBe('919118876154');
  });

  it('includes all submitted details in the English message', () => {
    const lead = makeLead();
    const message = generateWhatsAppMessage(lead, 'en');

    expect(message).toContain('SBMC-PREVIEW-2026-0001');
    expect(message).toContain('Gupta Beauty Parlour');
    expect(message).toContain('Beauty Parlour and Salon');
    expect(message).toContain('Civil Lines, Prayagraj');
    expect(message).toContain('My Instagram needs improvement');
    expect(message).toContain('Instagram Makeover');
    expect(message).toContain('₹999');
    expect(message).toContain('English');
  });

  it('includes all submitted details in the Hindi message', () => {
    const lead = makeLead({ preferredLanguage: 'hi' });
    const message = generateWhatsAppMessage(lead, 'hi');

    expect(message).toContain('SBMC-PREVIEW-2026-0001');
    expect(message).toContain('Gupta Beauty Parlour');
    expect(message).toContain('ब्यूटी पार्लर और सैलून');
    expect(message).toContain('Civil Lines, Prayagraj');
    expect(message).toContain('मेरे इंस्टाग्राम को सुधार की ज़रूरत है');
    expect(message).toContain('Instagram Makeover');
    expect(message).toContain('₹999');
    expect(message).toContain('हिन्दी');
  });

  it('URL-encodes the message correctly', () => {
    const lead = makeLead({ businessName: 'Sharma & Sons Traders' });
    const url = generateWhatsAppUrlFromLead(lead, 'en');

    expect(url).toMatch(/^https:\/\/wa\.me\/919118876154\?text=/);
    expect(url).toContain(encodeURIComponent('Sharma & Sons Traders'));
    expect(url).not.toContain('Sharma & Sons Traders');
    expect(url).toContain('%20');
  });

  it('generates a well-formed URL with the text parameter', () => {
    const url = generateWhatsAppUrl('Hello SBMC');
    expect(url).toBe('https://wa.me/919118876154?text=Hello%20SBMC');
  });
});