import en from '@/content/translations/en.json';
import hi from '@/content/translations/hi.json';

export type Locale = 'en' | 'hi';
export type Translations = typeof en;

const dictionaries: Record<Locale, Translations> = { en, hi };

export function getTranslations(locale: Locale): Translations {
  return dictionaries[locale] ?? en;
}

export function getLocaleFromParams(param?: string): Locale {
  return param === 'hi' ? 'hi' : 'en';
}