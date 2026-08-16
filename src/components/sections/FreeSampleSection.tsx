import Link from 'next/link';
import { SectionHeading } from '@/components/ui/Card';

interface FreeSampleSectionProps {
  locale: 'en' | 'hi';
  t: {
    heading: string;
    copy: string;
    clarification: string;
    cta: string;
  };
}

export function FreeSampleSection({ locale, t }: FreeSampleSectionProps) {
  return (
    <section className="border-t border-white/10 bg-white/[0.03] py-16 sm:py-20">
      <div className="container">
        <div className="glass mx-auto max-w-3xl rounded-2xl border border-white/15 p-8 shadow-sm sm:p-10">
          <SectionHeading eyebrow="Free Sample" title={t.heading} align="left" />
          <p className="mt-5 text-base leading-7 text-neutral-300">{t.copy}</p>
          <p className="mt-4 rounded-lg border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-neutral-300">
            <strong className="text-white">{locale === 'hi' ? 'à¤¸à¥à¤ªà¤·à¥à¤Ÿà¥€à¤•à¤°à¤£: ' : 'Clarification: '}</strong>
            {t.clarification}
          </p>
          <Link
            href={`/${locale}/business-check`}
            className="mt-7 inline-flex min-h-12 items-center justify-center rounded-lg bg-green px-7 text-sm font-bold text-white shadow-md transition-colors hover:bg-green/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green"
          >
            {t.cta}
          </Link>
        </div>
      </div>
    </section>
  );
}