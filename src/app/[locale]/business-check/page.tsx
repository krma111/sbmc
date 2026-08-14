import type { Metadata } from 'next';
import { BusinessCheckForm } from '@/components/business-check/BusinessCheckForm';
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
    title: isHi ? 'मुफ़्त बिज़नेस चेक | SBMC' : 'Free Business Check | SBMC',
    description: isHi
      ? 'पांच आसान सवालों के जवाब दें और अपने बिज़नेस के लिए पर्सनलाइज़्ड शुरुआती सिफ़ारिश पाएँ।'
      : 'Answer five simple questions and receive a personalised starting recommendation for your business.',
    robots: { index: true, follow: true },
  };
}

export default async function BusinessCheckPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale: Locale = localeParam === 'hi' ? 'hi' : 'en';
  const t = getTranslations(locale);

  return (
    <div className="bg-neutral-50 py-12 sm:py-16">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-cyan">
            {locale === 'hi' ? 'मुफ़्त बिज़नेस चेक' : 'Free Business Check'}
          </p>
          <h1 className="mt-3 text-balance text-3xl font-extrabold tracking-tight text-charcoal sm:text-4xl">
            {locale === 'hi'
              ? 'पांच सवाल, एक स्पष्ट शुरुआत'
              : 'Five questions, one clear starting point'}
          </h1>
          <p className="mt-3 text-sm leading-6 text-neutral-500">
            {locale === 'hi'
              ? 'आपका बिज़नेस जाने, सही पहला कदम सुझाएँ। कोई दबाव नहीं, कोई छिपी कीमत नहीं।'
              : 'We learn about your business and recommend the right first step. No pressure, no hidden costs.'}
          </p>
        </div>

        <div className="mt-10">
          <BusinessCheckForm locale={locale} t={t.form} resultT={t.result} />
        </div>

        <div className="mx-auto mt-10 max-w-2xl rounded-xl border border-neutral-200 bg-white p-5 text-xs leading-5 text-neutral-400">
          {locale === 'hi'
            ? 'प्रीव्यू नोट: यह एक प्रीव्यू वेबसाइट है। आपकी जानकारी केवल आपके ब्राउज़र (localStorage) में सेव होती है और यह सुरक्षित सर्वर स्टोरेज नहीं है। असली लॉन्च से पहले इसे सुरक्षित बैकएंड से बदला जाएगा।'
            : 'Preview note: This is a preview website. Your information is stored only in this browser (localStorage) and is not secure server storage. A secure backend will replace this before production.'}
        </div>
      </div>
    </div>
  );
}