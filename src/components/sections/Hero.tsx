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

      <div className="container relative grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-2 lg:py-28">
        <div className="max-w-2xl text-center">
<p className="inline-flex items-center gap-2 rounded-full border border-cyan/30 bg-cyan/5 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-cyan">
<span className="h-1.5 w-1.5 rounded-full bg-cyan" aria-hidden="true" />
</p>

          <h1 className="mt-5 text-balance text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
            {t.headline1}
            <span className="mt-1 block text-cyan">{t.headline2}</span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-7 text-neutral-300 sm:text-lg">{t.supportingCopy}</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
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

          <p className="mt-5 flex items-center gap-2 text-xs font-medium text-neutral-400">
            {t.trustLine}
          </p>
        </div>

        <HeroVisual />
      </div>
    </section>
  );
}


        <path d="M70 380 C 160 330, 180 210, 260 200 S 420 160, 450 90" stroke="#1CC8F2" strokeWidth="3" strokeLinecap="round" strokeDasharray="2 10" opacity="0.7" />
        <path d="M70 380 C 160 330, 180 210, 260 200 S 420 160, 450 90" stroke="#1CC8F2" strokeWidth="1" strokeDasharray="6 6" opacity="0.9" />

        {/* Growth nodes on path */}
        <circle cx="70" cy="380" r="7" fill="#22C55E" />
        <circle cx="158" cy="310" r="6" fill="#1CC8F2" />
        <circle cx="238" cy="228" r="6" fill="#22C55E" />
        <circle cx="330" cy="196" r="6" fill="#1CC8F2" />
        <circle cx="450" cy="90" r="8" fill="#22C55E" />

        {/* Business card panels */}
        <g>
          <rect x="40" y="120" width="190" height="118" rx="14" fill="#FFFFFF" stroke="#E5E5E5" strokeWidth="1.5" />
          <rect x="40" y="120" width="190" height="40" rx="14" fill="#181A1F" />
          <rect x="40" y="150" width="190" height="10" fill="#181A1F" />
          <circle cx="62" cy="140" r="9" fill="#1CC8F2" />
          <rect x="80" y="132" width="70" height="6" rx="3" fill="#FFFFFF" opacity="0.9" />
          <rect x="80" y="143" width="50" height="4" rx="2" fill="#FFFFFF" opacity="0.5" />
          <rect x="60" y="178" width="120" height="8" rx="4" fill="#E5E5E5" />
          <rect x="60" y="194" width="100" height="8" rx="4" fill="#E5E5E5" />
          <rect x="60" y="210" width="86" height="8" rx="4" fill="#E5E5E5" />
          <rect x="160" y="212" width="50" height="18" rx="9" fill="#22C55E" />
        </g>

        <g>
          <rect x="290" y="240" width="190" height="118" rx="14" fill="#FFFFFF" stroke="#E5E5E5" strokeWidth="1.5" />
          <rect x="290" y="240" width="190" height="40" rx="14" fill="#1CC8F2" />
          <rect x="290" y="270" width="190" height="10" fill="#1CC8F2" />
          <circle cx="312" cy="260" r="9" fill="#FFFFFF" opacity="0.9" />
          <rect x="330" y="252" width="70" height="6" rx="3" fill="#181A1F" />
          <rect x="330" y="263" width="50" height="4" rx="2" fill="#181A1F" opacity="0.5" />
          <rect x="310" y="298" width="120" height="8" rx="4" fill="#E5E5E5" />
          <rect x="310" y="314" width="100" height="8" rx="4" fill="#E5E5E5" />
          <rect x="310" y="330" width="86" height="8" rx="4" fill="#E5E5E5" />
        </g>

        {/* Opportunity indicator */}
        <g>
          <circle cx="300" cy="90" r="34" fill="#22C55E" opacity="0.12" />
          <circle cx="300" cy="90" r="24" fill="#22C55E" />
          <path d="M292 90 l6 6 12-14" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        </g>

        {/* Brand shapes */}
        <circle cx="470" cy="400" r="10" fill="#1CC8F2" opacity="0.35" />
        <circle cx="30" cy="60" r="14" fill="#22C55E" opacity="0.2" />
        <rect x="440" y="250" width="40" height="40" rx="10" fill="#1CC8F2" opacity="0.15" transform="rotate(12 460 270)" />

        {/* Layered panel */}
        <g>
          <rect x="120" y="330" width="170" height="90" rx="12" fill="#181A1F" opacity="0.06" transform="rotate(-3 205 375)" />
          <rect x="150" y="315" width="170" height="90" rx="12" fill="#FFFFFF" stroke="#E5E5E5" strokeWidth="1.5" />
          <circle cx="178" cy="345" r="8" fill="#1CC8F2" />
          <rect x="194" y="340" width="70" height="6" rx="3" fill="#D4D4D4" />
          <rect x="170" y="360" width="110" height="6" rx="3" fill="#E5E5E5" />
          <rect x="170" y="374" width="90" height="6" rx="3" fill="#E5E5E5" />
          <rect x="170" y="388" width="70" height="10" rx="5" fill="#22C55E" />
        </g>
      </svg>
    </div>
  );
}