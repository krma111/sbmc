import { SectionHeading } from '@/components/ui/Card';
import { businessCategories } from '@/content/categories';

interface BusinessTypesSectionProps {
  t: {
    heading: string;
    primary: string;
    secondary: string;
  };
}

export function BusinessTypesSection({ t }: BusinessTypesSectionProps) {
  const primary = businessCategories.filter((c) => c.isPrimary);
  const secondary = businessCategories.filter((c) => !c.isPrimary);

  return (
    <section id="for-your-business" className="scroll-mt-20 border-t border-white/10 bg-white/[0.03] py-16 sm:py-24">
      <div className="container">
        <SectionHeading eyebrow="Industries" title={t.heading} />

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {primary.map((cat) => (
            <article
              key={cat.id}
              className="glass flex flex-col rounded-xl border border-white/15 p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-cyan/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-cyan">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan" aria-hidden="true" />
                {t.primary}
              </span>
              <h3 className="mt-4 text-lg font-bold tracking-tight text-white">{cat.name}</h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-neutral-300">{cat.description}</p>
            </article>
          ))}
        </div>

        <div className="glass mt-8 rounded-xl border border-white/15 p-6">
          <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-neutral-400">{t.secondary}</h3>
          <ul className="mt-4 grid gap-x-6 gap-y-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {secondary.map((cat) => (
              <li key={cat.id} className="flex items-start gap-2 text-sm font-medium text-white">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m5 13 4 4L19 7" />
                </svg>
                {cat.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}