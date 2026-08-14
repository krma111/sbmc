import type { Metadata } from 'next';
import { Experience3DGate } from '@/components/experience/Experience3DGate';
import { Hero } from '@/components/sections/Hero';
import { PositioningSection } from '@/components/sections/PositioningSection';
import { MethodSection } from '@/components/sections/MethodSection';
import { BusinessTypesSection } from '@/components/sections/BusinessTypesSection';
import { ProblemsSection } from '@/components/sections/ProblemsSection';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { FreeSampleSection } from '@/components/sections/FreeSampleSection';
import { WorkExamplesSection } from '@/components/sections/WorkExamplesSection';
import { WhySBMC } from '@/components/sections/WhySBMC';
import { FAQSection } from '@/components/sections/FAQSection';
import { FinalCTASection } from '@/components/sections/FinalCTASection';
import { getTranslations, type Locale } from '@/lib/translations/getTranslations';
import { faqs } from '@/content/faqs';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale: Locale = localeParam === 'hi' ? 'hi' : 'en';
  const isHi = locale === 'hi';

  return {
    title: isHi
      ? 'SBMC | प्रयागराज में लोकल बिज़नेस के लिए AI-पावर्ड ग्रोथ सर्विसेज़'
      : 'SBMC | AI-Powered Growth Services for Local Businesses in Prayagraj',
    description: isHi
      ? 'SBMC लोकल बिज़नेस को ब्रांडिंग, ऑफर्स, इंस्टाग्राम, गूगल बिज़नेस, व्हाट्सएप सिस्टम, कंटेंट और लैंडिंग पेज बेहतर बनाने में मदद करता है। मुफ़्त बिज़नेस चेक से शुरू करें।'
      : 'SBMC helps local businesses improve branding, offers, Instagram, Google Business, WhatsApp systems, content, and landing pages. Start with a free business check.',
    alternates: {
      canonical: isHi ? `/hi` : '/',
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale: Locale = localeParam === 'hi' ? 'hi' : 'en';
  const t = getTranslations(locale);

  const faqItems = faqs.map((f) => ({
    q: locale === 'hi' ? f.questionHi : f.question,
    a: locale === 'hi' ? f.answerHi : f.answer,
  }));

  return (
    <div className="relative min-h-screen overflow-clip bg-[#0A0C11]">
      <Experience3DGate />
      <main className="relative z-10">
        <Hero locale={locale} t={t.hero} />
        <PositioningSection t={t.positioning} />
        <MethodSection t={t.method} />
        <BusinessTypesSection t={t.businessTypes} />
        <ProblemsSection locale={locale} t={t.problems} />
        <ServicesSection t={t.services} />
        <FreeSampleSection locale={locale} t={t.freeSample} />
        <WorkExamplesSection locale={locale} t={t.workExamples} />
        <WhySBMC t={t.whySBMC} />
        <FAQSection t={t.faq} faqs={faqItems} />
        <FinalCTASection locale={locale} t={t.finalCTA} />
      </main>
    </div>
  );
}