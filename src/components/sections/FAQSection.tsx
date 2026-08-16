'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { SectionHeading } from '@/components/ui/Card';

interface FAQSectionProps {
  t: {
    heading: string;
  };
  faqs: { q: string; a: string }[];
}

export function FAQSection({ t, faqs }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="ambient-section scroll-mt-20 py-16 sm:py-24">
      <div className="container max-w-4xl">
        <SectionHeading eyebrow="FAQ" title={t.heading} />

        <div className="glass mt-10 divide-y divide-neutral-200 rounded-xl border border-white/15 shadow-sm">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={faq.q}>
                <h3>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-cyan"
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                  >
                    <span className="text-base font-bold tracking-tight text-white">{faq.q}</span>
                    <span
                      className={cn(
                        'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/15 text-neutral-400 transition-transform duration-200',
                        isOpen && 'rotate-45 border-cyan text-cyan'
                      )}
                      aria-hidden="true"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </span>
                  </button>
                </h3>
                <div
                  id={`faq-panel-${i}`}
                  role="region"
                  aria-label={faq.q}
                  className={cn('grid transition-all duration-300 ease-out', isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0')}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-5 text-sm leading-6 text-neutral-300">{faq.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}