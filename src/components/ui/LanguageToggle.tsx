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

  const isEn = locale === 'en';

  return (
    <button
      type="button"
      onClick={switchLanguage}
      aria-label={isEn ? 'Switch to Hindi' : 'Switch to English'}
      className="group relative inline-flex h-10 items-center rounded-full border border-white/20 bg-white/5 p-1 text-xs font-bold backdrop-blur-sm transition-colors hover:border-cyan/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan"
    >
      <span
        className={`pointer-events-none absolute inset-y-1 w-[46px] rounded-full bg-cyan shadow-md shadow-cyan/30 transition-transform duration-300 ease-out ${
          isEn ? 'left-1' : 'translate-x-[50px]'
        }`}
        aria-hidden="true"
      />
      <span
        className={`relative z-10 flex h-8 w-[46px] items-center justify-center rounded-full transition-colors duration-300 ${
          isEn ? 'text-charcoal' : 'text-neutral-400 group-hover:text-white'
        }`}
        aria-hidden="true"
      >
        EN
      </span>
      <span
        className={`relative z-10 flex h-8 w-[50px] items-center justify-center rounded-full transition-colors duration-300 ${
          isEn ? 'text-neutral-400 group-hover:text-white' : 'text-charcoal'
        }`}
        aria-hidden="true"
      >
        हि
      </span>
    </button>
  );
}