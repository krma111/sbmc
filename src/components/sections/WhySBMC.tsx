import { SectionHeading } from '@/components/ui/Card';

interface WhySBMCProps {
  t: {
    heading: string;
    cards: { title: string; description: string }[];
  };
}

export function WhySBMC({ t }: WhySBMCProps) {
  const icons = [
    <svg key="p" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" />
    </svg>,
    <svg key="pr" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14.7 6.3a4.5 4.5 0 0 0-6.4 6.4L3 18v3h3l5.3-5.3a4.5 4.5 0 0 0 6.4-6.4L14 12l-2-2 2.7-3.7Z" />
    </svg>,
    <svg key="t" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>,
    <svg key="l" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2 3 7v10l9 5 9-5V7l-9-5Z" />
      <path d="M12 22V12" />
    </svg>,
  ];

  return (
    <section className="ambient-section border-t border-white/10 bg-white/[0.03] py-16 sm:py-24">
      <div className="container">
        <SectionHeading eyebrow="Why SBMC" title={t.heading} />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {t.cards.map((card, i) => (
            <article key={card.title} className="glass rounded-xl border border-white/15 p-6 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-charcoal text-cyan">{icons[i]}</div>
              <h3 className="mt-4 text-base font-bold tracking-tight text-white">{card.title}</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-300">{card.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}