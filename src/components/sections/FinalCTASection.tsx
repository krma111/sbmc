import Link from 'next/link';

interface FinalCTASectionProps {
  locale: 'en' | 'hi';
  t: {
    heading: string;
    copy: string;
    button: string;
  };
}

export function FinalCTASection({ locale, t }: FinalCTASectionProps) {
  return (
    <section className="border-t border-white/10 bg-charcoal py-16 text-white sm:py-20">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-cyan">
            {locale === 'hi' ? 'à¤®à¥à¤«à¤¼à¥à¤¤ à¤¬à¤¿à¤œà¤¼à¤¨à¥‡à¤¸ à¤šà¥‡à¤•' : 'Free Business Check'}
          </p>
          <h2 className="mt-4 text-balance text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
            {t.heading}
          </h2>
          <p className="mt-4 text-base leading-7 text-neutral-300">{t.copy}</p>
          <Link
            href={`/${locale}/business-check`}
            className="mt-8 inline-flex min-h-13 items-center justify-center rounded-lg bg-green px-8 py-4 text-base font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-green/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan"
          >
            {t.button}
          </Link>
        </div>
      </div>
    </section>
  );
}