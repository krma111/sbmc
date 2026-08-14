import { SectionHeading } from '@/components/ui/Card';
import { services, getServicesByCategory } from '@/content/services';

interface ServicesSectionProps {
  t: {
    heading: string;
    pricingNote: string;
    categories: { starter: string; growth: string; complete: string };
  };
}

const categoryMeta = [
  { key: 'starter' as const, accent: 'border-cyan/30', chip: 'bg-cyan/10 text-cyan' },
  { key: 'growth' as const, accent: 'border-charcoal/20', chip: 'bg-charcoal/10 text-white' },
  { key: 'complete' as const, accent: 'border-green/30', chip: 'bg-green/10 text-green' },
];

export function ServicesSection({ t }: ServicesSectionProps) {
  return (
    <section id="services" className="scroll-mt-20 border-t border-white/10 py-16 sm:py-24">
      <div className="container">
        <SectionHeading eyebrow="Services & Pricing" title={t.heading} description={t.pricingNote} />

        <div className="mt-12 space-y-14">
          {categoryMeta.map(({ key, accent, chip }) => (
            <div key={key}>
              <h3 className="flex items-center gap-3 text-lg font-bold tracking-tight text-white">
                <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${chip}`}>
                  {t.categories[key]}
                </span>
                <span className="h-px flex-1 bg-white/15" aria-hidden="true" />
              </h3>

              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {getServicesByCategory(key).map((service) => (
                  <article
                    key={service.id}
                    className={`flex flex-col rounded-xl border-2 bg-white/[0.05] p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${accent}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <h4 className="text-base font-bold leading-6 tracking-tight text-white">{service.name}</h4>
                      <p className="shrink-0 text-xl font-extrabold tracking-tight text-white">
                        <span className="align-top text-xs font-bold text-neutral-400">â‚¹</span>
                        {service.price.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <p className="mt-3 flex-1 text-sm leading-6 text-neutral-300">{service.description}</p>
                    <ul className="mt-4 space-y-2 border-t border-white/10 pt-4">
                      {service.features.slice(0, 3).map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-xs font-medium text-neutral-300">
                          <svg className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="m5 13 4 4L19 7" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-10 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800">
          {t.pricingNote}
        </p>
      </div>
    </section>
  );
}