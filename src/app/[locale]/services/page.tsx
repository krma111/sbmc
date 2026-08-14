import type { Metadata } from 'next';
import Link from 'next/link';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { getTranslations, type Locale } from '@/lib/translations/getTranslations';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale: Locale = localeParam === 'hi' ? 'hi' : 'en';
  const isHi = locale === 'hi';

  return {
    title: isHi ? 'सेवाएँ और कीमतें | SBMC' : 'Services & Prices | SBMC',
    description: isHi
      ? 'SBMC की सेवाएँ: पोस्टर, फेस्टिवल पैक, ऑफर क्रिएशन, इंस्टाग्राम मेकओवर, गूगल बिज़नेस फिक्स, व्हाट्सएप सेटअप, AI रिपोर्ट, कंटेंट प्लान, लैंडिंग पेज और पूर्ण ग्रोथ सेटअप।'
      : 'SBMC services: posters, festival packs, offer creation, Instagram makeover, Google Business fix, WhatsApp setup, AI report, content plan, landing page, and complete growth setup.',
  };
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale: Locale = localeParam === 'hi' ? 'hi' : 'en';
  const t = getTranslations(locale);

  return (
    <>
      <section className="bg-neutral-50 py-12 sm:py-16">
        <div className="container">
          <nav aria-label="Breadcrumb" className="text-xs font-semibold text-neutral-400">
            <Link href={`/${locale}`} className="hover:text-cyan">
              {locale === 'hi' ? 'होम' : 'Home'}
            </Link>
            <span aria-hidden="true"> / </span>
            <span aria-current="page">{locale === 'hi' ? 'सेवाएँ' : 'Services'}</span>
          </nav>
          <h1 className="mt-4 text-balance text-3xl font-extrabold tracking-tight text-charcoal sm:text-4xl">
            {t.services.heading}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-neutral-500">
            {locale === 'hi'
              ? 'हर सेवा एक स्पष्ट शुरुआती कीमत के साथ। अंतिम स्कोप काम शुरू होने से पहले कन्फर्म किया जाता है।'
              : 'Every service with a clear starting price. Final scope is confirmed before work begins.'}
          </p>
        </div>
      </section>

      <ServicesSection t={t.services} />

      <section className="border-t border-neutral-100 py-12">
        <div className="container text-center">
          <Link
            href={`/${locale}/business-check`}
            className="inline-flex min-h-12 items-center justify-center rounded-lg bg-charcoal px-7 text-sm font-bold text-white shadow-md transition-colors hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan"
          >
            {locale === 'hi' ? 'मुफ़्त बिज़नेस चेक शुरू करें' : 'Start Your Free Business Check'}
          </Link>
        </div>
      </section>
    </>
  );
}