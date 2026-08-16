'use client';

import { useCallback, useRef, useState } from 'react';
import type { PreviewLead } from '@/types/lead';
import { generateWhatsAppUrlFromLead, generateWhatsAppMessage, getWhatsAppNumber } from '@/lib/whatsapp/generators';
import { leadRepository } from '@/lib/preview-storage';
import { recordClickOnServer } from '@/lib/api/leads';
import { businessCategories } from '@/content/categories';

interface ResultScreenProps {
  locale: 'en' | 'hi';
  lead: PreviewLead;
  t: {
    heading: string;
    leadId: string;
    businessName: string;
    businessCategory: string;
    location: string;
    challenge: string;
    recommendedService: string;
    price: string;
    reason: string;
    freeSampleNote: string;
    continueWhatsApp: string;
    editAnswers: string;
    startAgain: string;
    whatsappOpening: string;
    copyMessage: string;
    copyNumber: string;
    messageCopied: string;
    numberCopied: string;
  };
  onEdit: () => void;
  onRestart: () => void;
}

const challengeLabels: Record<string, { en: string; hi: string }> = {
  need_more_enquiries: { en: 'I need more enquiries', hi: 'मुझे और इन्क्वायरी चाहिए' },
  not_professional_online: { en: 'My business does not look professional online', hi: 'मेरा बिज़नेस ऑनलाइन प्रोफेशनल नहीं दिखता' },
  instagram_needs_improvement: { en: 'My Instagram needs improvement', hi: 'मेरे इंस्टाग्राम को सुधार की ज़रूरत है' },
  not_found_on_google: { en: 'Customers cannot find me properly on Google', hi: 'ग्राहक मुझे गूगल पर ठीक से नहीं ढूंढ पाते' },
  offers_not_attracting: { en: 'My offers are not attracting attention', hi: 'मेरे ऑफर्स ध्यान नहीं खींच रहे' },
  whatsapp_unorganised: { en: 'My WhatsApp customer handling is unorganised', hi: 'मेरा व्हाट्सएप कस्टमर हैंडलिंग अव्यवस्थित है' },
  dont_know_content: { en: 'I do not know what content to post', hi: 'मुझे नहीं पता क्या कंटेंट पोस्ट करूँ' },
  need_website: { en: 'I need a website or landing page', hi: 'मुझे वेबसाइट या लैंडिंग पेज चाहिए' },
  not_sure_whats_missing: { en: 'I am not sure what my business is missing', hi: 'मुझे नहीं पता मेरे बिज़नेस में क्या कमी है' },
};

export function ResultScreen({ locale, lead, t, onEdit, onRestart }: ResultScreenProps) {
  const [opening, setOpening] = useState(false);
  const [copied, setCopied] = useState<'message' | 'number' | null>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);

  const category = businessCategories.find((c) => c.id === lead.businessCategory);
  const challenge = challengeLabels[lead.biggestChallenge]?.[locale] ?? lead.biggestChallenge;

  const handleWhatsApp = useCallback(() => {
    if (opening) return;
    setOpening(true);

    const url = generateWhatsAppUrlFromLead(lead, locale);

    leadRepository.updateLead(lead.id, {
      status: 'whatsapp_started',
      whatsappClickedAt: new Date().toISOString(),
    });
    leadRepository.recordEvent({
      type: 'whatsapp_click',
      leadId: lead.id,
      timestamp: new Date().toISOString(),
    });
    recordClickOnServer(lead.id);

    const link = linkRef.current;
    if (link) {
      link.href = url;
      link.click();
    } else {
      const popup = window.open(url, '_blank', 'noopener,noreferrer');
      if (!popup) {
        const fallback = document.createElement('a');
        fallback.href = url;
        fallback.target = '_blank';
        fallback.rel = 'noopener noreferrer';
        fallback.click();
      }
    }

    setTimeout(() => setOpening(false), 1500);
  }, [lead, locale, opening]);

  const handleCopyMessage = async () => {
    const message = generateWhatsAppMessage(lead, locale);
    try {
      await navigator.clipboard.writeText(message);
      setCopied('message');
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = message;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied('message');
    }
    setTimeout(() => setCopied(null), 2500);
  };

  const handleCopyNumber = async () => {
    const number = `+91 ${getWhatsAppNumber().slice(2, 7)} ${getWhatsAppNumber().slice(7)}`;
    try {
      await navigator.clipboard.writeText(number);
      setCopied('number');
    } catch {
      setCopied('number');
    }
    setTimeout(() => setCopied(null), 2500);
  };

  const rows: { label: string; value: string }[] = [
    { label: t.leadId, value: lead.leadCode },
    { label: t.businessName, value: lead.businessName },
    { label: t.businessCategory, value: category?.name ?? lead.businessCategory },
    { label: t.location, value: lead.cityArea },
    { label: t.challenge, value: challenge },
    { label: t.recommendedService, value: lead.recommendedService },
  ];

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="glass-light overflow-hidden rounded-2xl shadow-sm">
        <div className="border-b-4 border-green bg-charcoal p-6 sm:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-green">
            <svg className="mr-1.5 inline h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <path d="m8.5 12.5 2.5 2.5 5-5.5" />
            </svg>
            {t.heading}
          </p>
          <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">{lead.recommendedService}</h2>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-cyan">
            <span className="align-top text-lg text-cyan/70">₹</span>
            {lead.recommendedPrice.toLocaleString('en-IN')}
          </p>
        </div>

        <div className="p-6 sm:p-8">
          <dl className="divide-y divide-neutral-100">
            {rows.map((row) => (
              <div key={row.label} className="flex flex-col gap-0.5 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                <dt className="shrink-0 text-xs font-bold uppercase tracking-wider text-neutral-400">{row.label}</dt>
                <dd className="text-sm font-semibold text-charcoal">{row.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-4 rounded-xl border border-cyan/30 bg-cyan/5 p-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-cyan">{t.reason}</h3>
            <p className="mt-2 text-sm leading-6 text-neutral-600">{lead.recommendationReason}</p>
          </div>

          <div className="mt-4 rounded-xl border border-green/30 bg-green/5 p-5">
            <p className="text-sm leading-6 text-neutral-600">{t.freeSampleNote}</p>
          </div>

          <div className="mt-7 flex flex-col gap-3">
            <a
              ref={linkRef}
              href={generateWhatsAppUrlFromLead(lead, locale)}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden"
              aria-hidden="true"
              tabIndex={-1}
            />
            <button
              type="button"
              onClick={handleWhatsApp}
              disabled={opening}
              aria-busy={opening}
              className="inline-flex min-h-13 items-center justify-center gap-2.5 rounded-lg bg-green px-6 py-4 text-base font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-green/90 hover:shadow-lg disabled:cursor-wait disabled:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.86 9.86 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.23 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.16-.48-.29Z" />
              </svg>
              {opening ? t.whatsappOpening : t.continueWhatsApp}
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleCopyMessage}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border-2 border-neutral-200 bg-white px-4 text-sm font-bold text-charcoal transition-colors hover:border-cyan hover:text-cyan focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="9" y="9" width="13" height="13" rx="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                {copied === 'message' ? t.messageCopied : t.copyMessage}
              </button>
              <button
                type="button"
                onClick={handleCopyNumber}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border-2 border-neutral-200 bg-white px-4 text-sm font-bold text-charcoal transition-colors hover:border-cyan hover:text-cyan focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="9" y="9" width="13" height="13" rx="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                {copied === 'number' ? t.numberCopied : t.copyNumber}
              </button>
            </div>

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={onEdit}
                className="inline-flex min-h-11 flex-1 items-center justify-center rounded-lg border-2 border-neutral-200 bg-white px-4 text-sm font-bold text-charcoal transition-colors hover:border-neutral-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan"
              >
                {t.editAnswers}
              </button>
              <button
                type="button"
                onClick={onRestart}
                className="inline-flex min-h-11 flex-1 items-center justify-center rounded-lg border-2 border-neutral-200 bg-white px-4 text-sm font-bold text-charcoal transition-colors hover:border-neutral-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan"
              >
                {t.startAgain}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}