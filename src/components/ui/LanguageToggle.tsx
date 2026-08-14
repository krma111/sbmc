'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { leadRepository } from '@/lib/preview-storage';

interface LanguageToggleProps {
  locale: 'en' | 'hi';
  pathname?: string;
}

export function LanguageToggle({ locale, pathname = '' }: LanguageToggleProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const other = locale === 'en' ? 'hi' : 'en';

  const switchLanguage = () => {
    const segments = pathname.split('/');
    const first = segments[1];
    const target =
      first === 'en' || first === 'hi'
        ? `/${other}/${segments.slice(2).join('/')}`
        : `/${other}${pathname === '/' ? '' : pathname}`;
    leadRepository.saveLanguage(other);
    router.push(target || `/${other}`);
  };

  return (
    <button
      type="button"
      onClick={switchLanguage}
      className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 text-sm font-semibold text-charcoal transition-colors hover:border-cyan hover:text-cyan focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan"
      aria-label={locale === 'en' ? 'Switch to Hindi' : 'Switch to English'}
    >
      {locale === 'en' ? (
        <>
          <span aria-hidden="true">हि</span>
          <span className="hidden sm:inline">हिन्दी</span>
        </>
      ) : (
        <>
          <span aria-hidden="true">EN</span>
          <span className="hidden sm:inline">English</span>
        </>
      )}
    </button>
  );
}