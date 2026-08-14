import type { LeadFunnelStatus, ServerLead } from '@/types/lead';

/**
 * Manual-fallback follow-up engine. Computes which leads need a follow-up and
 * builds the wa.me link with the pre-filled message in the lead's language.
 * An automated sender (WhatsApp Cloud API via Supabase edge) can reuse the same schedule.
 */

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/** Offset applied after each follow-up sent. Index = follow-up count (0-based). */
export const FOLLOW_UP_OFFSETS_MS = [2 * HOUR, 24 * HOUR, 3 * DAY, 7 * DAY];

const ENGAGED_STATUSES: ReadonlySet<LeadFunnelStatus> = new Set<LeadFunnelStatus>([
  'whatsapp_replied',
  'interested',
  'booked',
]);

const STOPPED_STATUSES: ReadonlySet<LeadFunnelStatus> = new Set<LeadFunnelStatus>([
  'not_interested',
  'nurture',
  'silent',
]);

export interface NextFollowUp {
  eligible: boolean;
  step: number;
  offsetMs: number | null;
  dueAt: number | null;
  due: boolean;
  exhausted: boolean;
}

export function isFollowUpEligible(lead: ServerLead, now = Date.now()): boolean {
  if (!lead.whatsappNumber || !lead.consent) return false;
  if (ENGAGED_STATUSES.has(lead.funnelStatus) || STOPPED_STATUSES.has(lead.funnelStatus)) return false;
  if (lead.snoozedUntil && new Date(lead.snoozedUntil).getTime() > now) return false;
  return true;
}

export function computeNextFollowUp(lead: ServerLead, now = Date.now()): NextFollowUp {
  if (!isFollowUpEligible(lead, now)) {
    return { eligible: false, step: 0, offsetMs: null, dueAt: null, due: false, exhausted: true };
  }
  if (lead.followUpCount >= FOLLOW_UP_OFFSETS_MS.length) {
    return { eligible: true, step: lead.followUpCount, offsetMs: null, dueAt: null, due: false, exhausted: true };
  }
  const offsetMs = FOLLOW_UP_OFFSETS_MS[lead.followUpCount];
  const baseTime = lead.lastFollowUpAt ? new Date(lead.lastFollowUpAt).getTime() : new Date(lead.createdAt).getTime();
  const dueAt = baseTime + offsetMs;
  return { eligible: true, step: lead.followUpCount + 1, offsetMs, dueAt, due: now >= dueAt, exhausted: false };
}

export function followUpMessage(lead: ServerLead): string {
  const step = computeNextFollowUp(lead).step;
  const hi = lead.preferredLanguage === 'hi';
  const name = lead.businessName || 'there';
  const service = lead.recommendedService || 'growth services';
  const contact = hi ? 'SBMC (सोशल ब्रांडिंग मैनेजमेंट कंपनी)' : 'SBMC (Social Branding Management Company)';

  if (step >= 4) {
    return hi
      ? `नमस्ते ${name} 🤝\n\nयह SBMC से आख़िरी फॉलो-अप है — कोई दबाव नहीं। 😊\n\nजब आपका समय हो, तब भी आप हमें कभी भी WhatsApp (91188 76154) पर संपर्क कर सकते हैं। आपके लिए फ्री बिज़नेस चेक हमेशा उपलब्ध है।\n\nआपकी ग्रोथ के लिए,\n${contact}`
      : `Hi ${name} 🤝\n\nThis is SBMC's final follow-up — no pressure at all. 😊\n\nWhenever the time is right, you can always reach us on WhatsApp. The free Business Check stays available for you.\n\nWishing you growth,\n${contact}`;
  }

  if (step === 3) {
    return hi
      ? `नमस्ते ${name} 🌱\n\nएक छोटी सी चेक-इन। ज़्यादातर लोकल बिज़नेस नई इन्क्वायरी न मिलने की वजह से रुके रहते हैं।\n\n${service} के ज़रिए एक महीने में छोटे-छोटे सुधार असली फ़र्क दिखा सकते हैं। फ्री सैंपल देखने के लिए "SAMPLE" रिप्लाई करें। 😊\n\n${contact}`
      : `Hi ${name} 🌱\n\nA quick check-in. Most local businesses stall simply because they get no new enquiries.\n\nWith ${service}, small improvements within a month can make a real difference. Reply "SAMPLE" to see it free. 😊\n\n${contact}`;
  }

  if (step === 2) {
    return hi
      ? `नमस्ते ${name} 👋\n\nअभी तक कोई जवाब नहीं आया, तो सोचा आपके साथ एक फ्री सैंपल शेयर करूँ।\n\nहमारी सिफ़ारिश थी ${service}। क्या आप फ्री सैंपल लेना चाहेंगे? रिप्लाई "YES" करें और हम तुरंत भेज देते हैं।\n\n${contact}`
      : `Hi ${name} 👋\n\nI didn't hear back, so I thought I'd share a small free sample.\n\nWe recommended ${service} for your business. Would you like the sample? Reply "YES" and we'll send it right over.\n\n${contact}`;
  }

  return hi
    ? `नमस्ते ${name} 🙏\n\nआपने SBMC का फ्री बिज़नेस चेक पूरा किया था, और हमने आपके लिए ${service} की सिफ़ारिश की थी।\n\nपहला स्टेप सबके लिए फ्री है। क्या आपका यह प्लान अब भी काम का है? बस इसी चैट में बताइए और हम आगे बढ़ेंगे। 😊\n\n${contact}`
    : `Hi ${name} 🙏\n\nYou completed the free Business Check at SBMC, and we recommended ${service} for your business.\n\nThe first step is free for everyone. Still useful for you? Just reply here and we'll take it forward. 😊\n\n${contact}`;
}

export interface AdminLead extends ServerLead {
  nextFollowUp: NextFollowUp;
}

export function withFollowUpInfo(leads: ServerLead[], now = Date.now()): AdminLead[] {
  return leads.map((lead) => ({ ...lead, nextFollowUp: computeNextFollowUp(lead, now) }));
}

/**
 * Derived lifecycle status: a lead whose follow-up schedule is exhausted and who
 * never replied is surfaced as `silent` (owner can then move it to nurture).
 */
export function derivedFunnelStatus(lead: ServerLead, now = Date.now()): LeadFunnelStatus {
  if (lead.whatsappNumber && lead.consent) {
    const next = computeNextFollowUp(lead, now);
    if (next.exhausted && next.eligible) {
      const active = ['form_started', 'completed', 'whatsapp_started'];
      if (active.includes(lead.funnelStatus)) return 'silent';
    }
  }
  return lead.funnelStatus;
}

export function waLink(phone: string, message: string): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}