import type { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations, type Locale } from '@/lib/translations/getTranslations';
import { business } from '@/content/business';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale: Locale = localeParam === 'hi' ? 'hi' : 'en';
  const isHi = locale === 'hi';

  return {
    title: isHi ? 'हमारे बारे में | SBMC' : 'About SBMC | SBMC',
    description: isHi
      ? 'SBMC — एक बिज़नेस ओनर द्वारा बिज़नेस ओनर्स के लिए बनाई गई AI-पावर्ड ग्रोथ कंपनी। प्रयागराज, उत्तर प्रदेश।'
      : 'SBMC — an AI-powered growth company built by a business owner for business owners. Based in Prayagraj, Uttar Pradesh.',
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale: Locale = localeParam === 'hi' ? 'hi' : 'en';
  const t = getTranslations(locale);

  const isHi = locale === 'hi';

  return (
    <div className="py-12 sm:py-16">
      <div className="container max-w-3xl">
        <nav aria-label="Breadcrumb" className="text-xs font-semibold text-neutral-400">
          <Link href={`/${locale}`} className="hover:text-cyan">
            {isHi ? 'होम' : 'Home'}
          </Link>
          <span aria-hidden="true"> / </span>
          <span aria-current="page">{isHi ? 'हमारे बारे में' : 'About'}</span>
        </nav>

        <h1 className="mt-4 text-balance text-3xl font-extrabold tracking-tight text-charcoal sm:text-4xl">
          {t.positioning.heading}
        </h1>

        <div className="mt-6 space-y-5 text-base leading-7 text-neutral-500">
          <p>
            {isHi
              ? 'SBMC (सोशल ब्रांडिंग मैनेजमेंट कंपनी) एक AI-पावर्ड ग्रोथ पार्टनर है जो लोकल बिज़नेस के लिए बनाई गई है। हम प्रयागराज, उत्तर प्रदेश में स्थित हैं और पूरे भारत में रिमोट सर्विस देते हैं।'
              : 'SBMC (Social Branding Management Company) is an AI-powered growth partner built for local businesses. We are based in Prayagraj, Uttar Pradesh, and serve businesses across India remotely.'}
          </p>
          <p>
            {isHi
              ? `हमारा फाउंडर ${business.founder} एक बिज़नेस ओनर हैं। हम जानते हैं कि रैंडम मार्केटिंग सर्विसेज़ खरीदना और उम्मीद करना कैसा लगता है। इसलिए SBMC पहले आपके बिज़नेस को समझता है, आपकी सबसे बड़ी समस्या की पहचान करता है, और सही पहला कदम सुझाता है — बिना अनावश्यक सर्विसेज़ थोपे।`
              : `Our founder, ${business.founder}, is a business owner. We know what it feels like to buy random marketing services and hope something works. That is why SBMC first understands your business, identifies your biggest challenge, and recommends the right first step — without forcing unnecessary services.`}
          </p>
          <p>
            {isHi
              ? 'हमारा तरीका सरल है: समझें → विश्लेषण करें → बनाएँ → बढ़ें।'
              : 'Our method is simple: Understand → Analyze → Build → Grow.'}
          </p>
        </div>

        <div className="mt-10 rounded-2xl border border-charcoal bg-charcoal p-8 text-white">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-cyan">SBMC Method</p>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {business.method.map((step, i) => (
              <div key={step}>
                <p className="text-xs font-semibold text-neutral-400">{String(i + 1).padStart(2, '0')}</p>
                <p className="mt-1 text-base font-bold">{step}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            href={`/${locale}/business-check`}
            className="inline-flex min-h-12 items-center justify-center rounded-lg bg-charcoal px-6 text-sm font-bold text-white shadow-md transition-colors hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan"
          >
            {isHi ? 'मुफ़्त बिज़नेस चेक शुरू करें' : 'Start Your Free Business Check'}
          </Link>
          <Link
            href={`/${locale}/services`}
            className="inline-flex min-h-12 items-center justify-center rounded-lg border-2 border-neutral-200 bg-white px-6 text-sm font-bold text-charcoal transition-colors hover:border-cyan hover:text-cyan focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan"
          >
            {isHi ? 'सेवाएँ देखें' : 'View Services'}
          </Link>
        </div>
      </div>
    </div>
  );
}