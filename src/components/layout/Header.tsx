'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { LanguageToggle } from '@/components/ui/LanguageToggle';

interface HeaderProps {
  locale: 'en' | 'hi';
  t: {
    nav: {
      howItWorks: string;
      services: string;
      pricing: string;
      forYourBusiness: string;
      faq: string;
      startFreeCheck: string;
    };
  };
}

export function Header({ locale, t }: HeaderProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const base = `/${locale}`;

  const links = [
    { href: `${base}#how-it-works`, label: t.nav.howItWorks },
    { href: `${base}#services`, label: t.nav.services },
    { href: `${base}#pricing`, label: t.nav.pricing },
    { href: `${base}#for-your-business`, label: t.nav.forYourBusiness },
    { href: `${base}#faq`, label: t.nav.faq },
  ];

  const checkHref = `${base}/business-check`;

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0A0C11]/85 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link
          href={base}
          className="flex shrink-0 items-center gap-2.5 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan"
          aria-label={`SBMC — ${locale === 'hi' ? 'सोशल ब्रांडिंग मैनेजमेंट कंपनी' : 'Social Branding Management Company'}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/sbmc-logo.svg" alt="" width={36} height={36} className="h-9 w-9 rounded-lg" />
          <span className="flex flex-col leading-none">
            <span className="text-lg font-extrabold tracking-tight text-white">SBMC</span>
            <span className="mt-0.5 hidden text-[9px] font-semibold uppercase tracking-[0.18em] text-neutral-400 sm:block">
              {locale === 'hi' ? 'सोशल ब्रांडिंग कंपनी' : 'Social Branding Mgmt Co.'}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label={locale === 'hi' ? 'मुख्य नेविगेशन' : 'Primary navigation'}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="py-2 text-sm font-semibold text-neutral-300 transition-colors hover:text-cyan focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <LanguageToggle locale={locale} pathname={pathname} />
          <Link
            href={checkHref}
            className="hidden min-h-10 items-center justify-center rounded-lg bg-cyan px-4 text-sm font-bold text-charcoal shadow-sm transition-colors hover:bg-cyan/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan md:inline-flex"
          >
            {t.nav.startFreeCheck}
          </Link>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 bg-white/10 text-white transition-colors hover:border-cyan focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? (locale === 'hi' ? 'मेन्यू बंद करें' : 'Close menu') : (locale === 'hi' ? 'मेन्यू खोलें' : 'Open menu')}
          >
            {open ? (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {open ? (
        <nav
          id="mobile-menu"
          className="header-menu-open border-t border-white/10 bg-[#0A0C11]/95 px-4 pb-6 pt-3 shadow-xl backdrop-blur-xl lg:hidden"
          aria-label={locale === 'hi' ? 'मोबाइल नेविगेशन' : 'Mobile navigation'}
        >
          <div className="flex flex-col">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="border-b border-white/10 py-3.5 text-sm font-semibold text-neutral-200 transition-colors last:border-0 hover:text-cyan focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={checkHref}
              onClick={() => setOpen(false)}
              className="mt-4 inline-flex min-h-11 items-center justify-center rounded-lg bg-cyan px-4 text-sm font-bold text-charcoal"
            >
              {t.nav.startFreeCheck}
            </Link>
          </div>
        </nav>
      ) : null}
    </header>
  );
}