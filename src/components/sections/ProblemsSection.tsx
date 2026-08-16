import { SectionHeading } from '@/components/ui/Card';
import Link from 'next/link';

interface ProblemsSectionProps {
  locale: 'en' | 'hi';
  t: {
    heading: string;
    cards: { id: string; title: string; likelySolution: string }[];
  };
}

export function ProblemsSection({ locale, t }: ProblemsSectionProps) {
  return (
    <section className="ambient-section py-16 sm:py-24">
      <div className="container">
        <SectionHeading eyebrow="Problem First" title={t.heading} />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {t.cards.map((card) => (
            <article
              key={card.id}
              className="glass group flex flex-col rounded-xl border border-white/15 p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-cyan/40 hover:shadow-md"
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white transition-colors group-hover:bg-cyan/10 group-hover:text-cyan" aria-hidden="true">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8" />
                  </svg>
                </span>
                <h3 className="text-base font-bold leading-6 tracking-tight text-white">{card.title}</h3>
              </div>
              <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
                <p className="text-xs font-semibold text-neutral-400">
                  {locale === 'hi' ? 'à¤¸à¤‚à¤­à¤¾à¤µà¤¿à¤¤ à¤¶à¥à¤°à¥à¤†à¤¤:' : 'Possible start:'}
                </p>
                <p className="text-right text-sm font-bold text-green">{card.likelySolution}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href={`/${locale}/business-check`}
            className="inline-flex min-h-12 items-center justify-center rounded-lg bg-white px-7 text-sm font-bold text-charcoal shadow-md transition-colors hover:bg-neutral-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan"
          >
            {locale === 'hi' ? 'à¤®à¥à¤«à¤¼à¥à¤¤ à¤¬à¤¿à¤œà¤¼à¤¨à¥‡à¤¸ à¤šà¥‡à¤• à¤¶à¥à¤°à¥‚ à¤•à¤°à¥‡à¤‚' : 'Start Your Free Business Check'}
          </Link>
        </div>
      </div>
    </section>
  );
}