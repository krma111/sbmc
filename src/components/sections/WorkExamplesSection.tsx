import { SectionHeading } from '@/components/ui/Card';

interface WorkExamplesSectionProps {
  locale: 'en' | 'hi';
  t: {
    heading: string;
    categories: string[];
  };
}

export function WorkExamplesSection({ locale, t }: WorkExamplesSectionProps) {
  return (
    <section className="ambient-section py-16 sm:py-24">
      <div className="container">
        <SectionHeading
          eyebrow="Portfolio"
          title={t.heading}
          description={
            locale === 'hi'
              ? 'यहाँ SBMC के चुने गए वास्तविक डिज़ाइन और अनुमोदित सैंपल दिखाए जाते हैं।'
              : 'Real SBMC designs and approved samples are shown here.'
          }
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {t.categories.map((category, i) => (
            <article
              key={category}
              className="glass group flex min-h-[160px] flex-col justify-between rounded-xl border-2 border-dashed border-white/15 p-6 transition-colors hover:border-cyan/50 hover:bg-cyan/5"
            >
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                {locale === 'hi' ? 'जल्द आ रहा है' : 'Coming soon'} — {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-4 text-lg font-bold tracking-tight text-white">{category}</h3>
              <p className="mt-2 text-xs leading-5 text-neutral-400">
                {locale === 'hi'
                  ? 'वास्तविक SBMC क्रिएटिव यहाँ जोड़े जाएँगे।'
                  : 'Real SBMC creatives will be added here.'}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}