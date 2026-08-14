import { SectionHeading } from '@/components/ui/Card';

interface PositioningSectionProps {
  t: {
    heading: string;
    copy: string;
  };
}

export function PositioningSection({ t }: PositioningSectionProps) {
  const [first, ...rest] = t.copy.split('\n\n');

  return (
    <section className="border-t border-white/10 bg-white/[0.03] py-16 sm:py-20">
      <div className="container">
        <div className="mx-auto max-w-3xl">
          <SectionHeading eyebrow="The SBMC Difference" title={t.heading} align="left" />
          <div className="mt-6 space-y-5 text-base leading-7 text-neutral-300 sm:text-lg">
            <p>{first}</p>
            <p>{rest.join('\n\n')}</p>
          </div>
        </div>
      </div>
    </section>
  );
}