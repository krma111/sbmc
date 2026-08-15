import Link from 'next/link';
import { Magnetic } from '@/components/experience/Magnetic';

interface HeroProps {
  locale: 'en' | 'hi';
  t: {
    headline1: string;
    headline2: string;
    supportingCopy: string;
    primaryCTA: string;
    secondaryCTA: string;
    trustLine: string;
  };
}

export function Hero({ locale, t }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-transparent">
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-cyan/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-green/10 blur-3xl" />
      </div>

      <div className="container relative flex flex-col items-center justify-center py-20 text-center sm:py-24 lg:py-32">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <h1 className="text-balance text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
            {t.headline1}
            <span className="mt-1 block text-cyan">{t.headline2}</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-neutral-300 sm:text-lg">{t.supportingCopy}</p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Magnetic>
              <Link
                href={`/${locale}/business-check`}
                className="inline-flex min-h-12 items-center justify-center rounded-lg bg-cyan px-6 text-sm font-bold text-charcoal shadow-md shadow-cyan/20 transition-all hover:-translate-y-0.5 hover:bg-cyan/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan"
              >
                {t.primaryCTA}
                <svg className="ml-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
            </Magnetic>
            <Magnetic>
              <Link
                href={`/${locale}/services`}
                className="inline-flex min-h-12 items-center justify-center rounded-lg border-2 border-white/20 bg-white/5 px-6 text-sm font-bold text-white backdrop-blur-sm transition-colors hover:border-cyan hover:text-cyan focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan"
              >
                {t.secondaryCTA}
              </Link>
            </Magnetic>
          </div>

          <p className="mx-auto mt-5 flex items-center justify-center gap-2 text-xs font-medium text-neutral-400">
            {t.trustLine}
          </p>
        </div>
      </div>
    </section>
  );
}