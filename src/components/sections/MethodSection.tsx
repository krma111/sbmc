import { SectionHeading } from '@/components/ui/Card';

interface MethodSectionProps {
  t: {
    heading: string;
    steps: { title: string; description: string }[];
  };
}

export function MethodSection({ t }: MethodSectionProps) {
  const icons = [
    <svg key="u" className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.35-4.35M8 11h6M11 8v6" />
    </svg>,
    <svg key="a" className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 3v18h18" />
      <path d="m7 15 4-4 3 3 6-7" />
    </svg>,
    <svg key="b" className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3v18M5 8h14M5 16h14" />
    </svg>,
    <svg key="g" className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 17c3-8 15-8 18 0M12 5v.01M12 17v.01" />
    </svg>,
  ];

  return (
    <section id="how-it-works" className="scroll-mt-20 py-16 sm:py-24">
      <div className="container">
        <SectionHeading eyebrow="The SBMC Method" title={t.heading} />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {t.steps.map((step, i) => (
            <article
              key={step.title}
              className="relative rounded-xl border border-white/15 bg-white/[0.05] p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-charcoal text-cyan">
                  {icons[i]}
                </div>
                <span className="text-4xl font-extrabold text-neutral-100" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <h3 className="mt-5 text-lg font-bold tracking-tight text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-300">{step.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}