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
    <section className="py-16 sm:py-24">
      <div className="container">
        <SectionHeading
          eyebrow="Portfolio"
          title={t.heading}
          description={
            locale === 'hi'
              ? 'à¤¯à¤¹à¤¾à¤ SBMC à¤•à¥‡ à¤šà¥à¤¨à¥‡ à¤—à¤ à¤µà¤¾à¤¸à¥à¤¤à¤µà¤¿à¤• à¤¡à¤¿à¤œà¤¼à¤¾à¤‡à¤¨ à¤”à¤° à¤…à¤¨à¥à¤®à¥‹à¤¦à¤¿à¤¤ à¤¸à¥ˆà¤‚à¤ªà¤² à¤¦à¤¿à¤–à¤¾à¤ à¤œà¤¾à¤¤à¥‡ à¤¹à¥ˆà¤‚à¥¤'
              : 'Real SBMC designs and approved samples are shown here.'
          }
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {t.categories.map((category, i) => (
            <article
              key={category}
              className="group flex min-h-[160px] flex-col justify-between rounded-xl border-2 border-dashed border-white/15 bg-white/[0.03]/60 p-6 transition-colors hover:border-cyan/50 hover:bg-cyan/5"
            >
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                {locale === 'hi' ? 'à¤œà¤²à¥à¤¦ à¤† à¤°à¤¹à¤¾ à¤¹à¥ˆ' : 'Coming soon'} â€” {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-4 text-lg font-bold tracking-tight text-white">{category}</h3>
              <p className="mt-2 text-xs leading-5 text-neutral-400">
                {locale === 'hi'
                  ? 'à¤µà¤¾à¤¸à¥à¤¤à¤µà¤¿à¤• SBMC à¤•à¥à¤°à¤¿à¤à¤Ÿà¤¿à¤µ à¤¯à¤¹à¤¾à¤ à¤œà¥‹à¤¡à¤¼à¥‡ à¤œà¤¾à¤à¤à¤—à¥‡à¥¤'
                  : 'Real SBMC creatives will be added here.'}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}