import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { getTranslations, type Locale } from '@/lib/translations/getTranslations';
import { notFound } from 'next/navigation';

const locales: Locale[] = ['en', 'hi'];

function getLocale(param: string): Locale {
  if (param === 'hi') return 'hi';
  if (param === 'en') return 'en';
  return 'en';
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = getLocale(localeParam);
  if (!locales.includes(locale)) notFound();

  const t = getTranslations(locale);

  return (
    <>
      <Header locale={locale} t={t} />
      <main className="flex-1">{children}</main>
      <Footer locale={locale} t={t} />
    </>
  );
}