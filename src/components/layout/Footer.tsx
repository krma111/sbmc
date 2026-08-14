import Link from 'next/link';
import { business, whatsappUrl } from '@/content/business';
import { services } from '@/content/services';

interface FooterProps {
  locale: 'en' | 'hi';
  t: {
    footer: {
      brandMessage: string;
      quickLinks: string;
      services: string;
      about: string;
      privacy: string;
      terms: string;
      previewLeads: string;
      contact: string;
      whatsapp: string;
      rights: string;
      previewNotice: string;
    };
  };
}

const PREVIEW_MODE = process.env.NEXT_PUBLIC_PREVIEW_MODE === 'true';

const SERVICE_FEATURED_IDS = [
  'ready_to_post_poster',
  'instagram_makeover',
  'google_business_profile_fix',
  'whatsapp_business_setup',
  'ai_business_report',
  'complete_growth_setup',
];

export function Footer({ locale, t }: FooterProps) {
  const base = `/${locale}`;
  const hi = locale === 'hi';

  const quickLinks = [
    { href: base, label: hi ? 'होम' : 'Home' },
    { href: `${base}/business-check`, label: hi ? 'फ्री बिज़नेस चेक' : 'Free Business Check' },
    { href: `${base}/services`, label: t.footer.services },
    { href: `${base}/about`, label: t.footer.about },
    { href: `${base}/privacy`, label: t.footer.privacy },
    { href: `${base}/terms`, label: t.footer.terms },
  ];

  const featuredServices = SERVICE_FEATURED_IDS
    .map((id) => services.find((s) => s.id === id))
    .filter((s): s is (typeof services)[number] => Boolean(s));

  return (
    <footer className="relative border-t border-white/10 bg-[#0A0C11]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan/60 to-transparent" aria-hidden="true" />

      <div className="container py-14">
        <div className="grid gap-10 md:grid-cols-12">
          {/* Brand */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/sbmc-logo.svg" alt="" width={36} height={36} className="h-9 w-9 rounded-lg" />
              <div>
                <p className="text-lg font-extrabold tracking-tight text-white">{business.name}</p>
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-400">{business.fullName}</p>
              </div>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-6 text-neutral-300">{t.footer.brandMessage}</p>
            <p className="mt-3 max-w-sm text-xs leading-5 text-neutral-400">
              {business.positioning} — {business.primaryMarket.join(' • ')}
            </p>

            <div className="mt-5 flex flex-wrap gap-2" aria-label={hi ? 'SBMC विधि' : 'SBMC method'}>
              {business.method.map((m) => (
                <span
                  key={m}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-cyan"
                >
                  {m}
                </span>
              ))}
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-green px-5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-green/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91A9.86 9.86 0 0 0 12.04 2Zm0 18.15c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.26 8.26 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.23 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.17.24-.64.8-.78.97-.14.16-.29.18-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.16-.48-.29Z" />
              </svg>
              {t.footer.whatsapp}: {business.whatsappNumber}
            </a>
          </div>

          {/* Quick links */}
          <nav className="md:col-span-2" aria-label={t.footer.quickLinks}>
            <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-white">{t.footer.quickLinks}</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-neutral-300 transition-colors hover:text-cyan">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Featured services */}
          <nav className="md:col-span-3" aria-label={t.footer.services}>
            <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-white">{t.footer.services}</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {featuredServices.map((s) => (
                <li key={s.id}>
                  <Link href={`${base}/services`} className="text-neutral-300 transition-colors hover:text-cyan">
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div className="md:col-span-2">
            <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-white">{t.footer.contact}</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-300 transition-colors hover:text-green"
                >
                  {t.footer.whatsapp}: {business.whatsappNumber}
                </a>
              </li>
              <li className="text-neutral-300">{business.primaryMarket.join(', ')}</li>
              <li className="text-neutral-300">{business.founder}</li>
            </ul>

            {PREVIEW_MODE ? (
              <div className="mt-6 rounded-lg border border-amber-200/30 bg-amber-50/10 p-4">
                <p className="text-xs leading-5 text-amber-200">{t.footer.previewNotice}</p>
                <Link href="/preview-leads" className="mt-2 inline-block text-xs font-bold text-amber-300 underline decoration-amber-400 underline-offset-2 hover:text-amber-100">
                  {t.footer.previewLeads} →
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container flex flex-col gap-3 py-5 text-xs text-neutral-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {business.fullName}. {t.footer.rights}
          </p>
          <p className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-green" aria-hidden="true" />
            {business.positioning}
          </p>
          <p className="max-w-md">
            {hi
              ? 'यह एक प्रीव्यू वेबसाइट है। लीड्स केवल इसी ब्राउज़र में सेव होती हैं।'
              : 'This is a preview website. Leads are stored only in this browser.'}
          </p>
        </div>
      </div>
    </footer>
  );
}
