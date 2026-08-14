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
    title: isHi ? 'नियम और शर्तें | SBMC' : 'Terms & Conditions | SBMC',
    description: isHi
      ? 'SBMC सेवाओं के लिए नियम और शर्तें, कीमत की जानकारी और गारंटी सीमाएँ।'
      : 'SBMC terms and conditions, pricing information, and guarantee limitations.',
  };
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale: Locale = localeParam === 'hi' ? 'hi' : 'en';
  const t = getTranslations(locale);
  const isHi = locale === 'hi';

  const sections: { title: string; body: string }[] = isHi
    ? [
        {
          title: '1. सेवाएँ',
          body: 'SBMC लोकल बिज़नेस के लिए ब्रांडिंग, ऑफर्स, इंस्टाग्राम, गूगल बिज़नेस प्रोफाइल, व्हाट्सएप कम्युनिकेशन, कंटेंट प्लानिंग, रिपोर्ट्स और लैंडिंग पेज सर्विसेज़ प्रदान करता है। हर सेवा का अंतिम स्कोप काम शुरू होने से पहले स्पष्ट रूप से कन्फर्म किया जाता है।',
        },
        {
          title: '2. कीमतें',
          body: 'वेबसाइट पर दिखाई गई कीमतें शुरुआती कीमतें हैं। अंतिम स्कोप कन्फर्मेशन के बाद कीमत तय होती है। डोमेन, होस्टिंग, पेड एडवरटाइजिंग, थर्ड-पार्टी टूल्स और ongoing मेंटेनेंस अलग हैं जब तक साफ़ तौर पर शामिल न हों।',
        },
        {
          title: '3. गारंटी सीमाएँ',
          body: 'SBMC ग्राहकों की सटीक संख्या, बिक्री या विशिष्ट इन्क्वायरी लेवल की गारंटी नहीं देता। गूगल रैंकिंग प्रतिस्पर्धा, वेबसाइट अथॉरिटी, कंटेंट, प्रोफाइल क्वालिटी और कई अन्य कारकों पर निर्भर करती है; कोई भी ज़िम्मेदार व्यवसाय नंबर-वन रैंकिंग की गारंटी नहीं दे सकता।',
        },
        {
          title: '4. निःशुल्क बिज़नेस चेक',
          body: 'पांच-चरणीय बिज़नेस चेक और शुरुआती सिफ़ारिश निःशुल्क है। सिफ़ारिश स्वचालित, पूर्वानुमानित लॉजिक पर आधारित है।',
        },
        {
          title: '5. निःशुल्क सैंपल',
          body: 'जब योग्य हो, SBMC एक पर्सनलाइज़्ड सैंपल दे सकता है। सटीक सैंपल चुनी गई सर्विस और उपलब्ध जानकारी पर निर्भर करता है। पूरी रिपोर्ट, पूरी वेबसाइट, मल्टी-डिज़ाइन पैकेज, स्ट्रैटेजी डॉक्यूमेंट और पूर्ण कार्यान्वयन पेड सर्विसेज़ हैं। सैंपल देखने के बाद खरीदना अनिवार्य नहीं है।',
        },
        {
          title: '6. बौद्धिक संपदा',
          body: `SBMC द्वारा बनाए गए सभी क्रिएटिव, रिपोर्ट और डिलीवरेबल्स उचित भुगतान के बाद ग्राहक के उपयोग के लिए हैं। ग्राहक की व्यावसायिक जानकारी केवल आपसी सहमति से तीसरे पक्ष के साथ साझा की जाती है।`,
        },
        {
          title: '7. संपर्क',
          body: `प्रश्नों के लिए व्हाट्सएप: ${business.whatsappNumber}`,
        },
      ]
    : [
        {
          title: '1. Services',
          body: 'SBMC provides branding, offers, Instagram, Google Business Profile, WhatsApp communication, content planning, reports, and landing page services for local businesses. The final scope of every service is clearly confirmed before work begins.',
        },
        {
          title: '2. Pricing',
          body: 'Prices shown on the website are starting prices. The final price is confirmed after scope confirmation. Domain, hosting, paid advertising, third-party tools, and ongoing maintenance are separate unless explicitly included.',
        },
        {
          title: '3. Guarantee limitations',
          body: 'SBMC does not guarantee a specific number of customers, sales, or enquiry levels. Google rankings depend on competition, website authority, content, profile quality, reputation, and many other factors; no responsible business can guarantee a number-one ranking.',
        },
        {
          title: '4. Free business check',
          body: 'The five-step business check and initial recommendation are free. The recommendation is based on automated, predictable logic.',
        },
        {
          title: '5. Free sample',
          body: 'When eligible, SBMC may provide one personalised sample. The exact sample depends on the selected service and available information. Full reports, complete websites, multi-design packages, strategy documents, and complete implementations are paid services. There is no obligation to purchase after viewing a sample.',
        },
        {
          title: '6. Intellectual property',
          body: `All creatives, reports, and deliverables created by SBMC are provided for the client's use after due payment. Client business information is only shared with third parties with mutual consent.`,
        },
        {
          title: '7. Contact',
          body: `For questions, WhatsApp: ${business.whatsappNumber}`,
        },
      ];

  return (
    <div className="py-12 sm:py-16">
      <div className="container max-w-3xl">
        <nav aria-label="Breadcrumb" className="text-xs font-semibold text-neutral-400">
          <Link href={`/${locale}`} className="hover:text-cyan">
            {isHi ? 'होम' : 'Home'}
          </Link>
          <span aria-hidden="true"> / </span>
          <span aria-current="page">{isHi ? 'नियम और शर्तें' : 'Terms'}</span>
        </nav>

        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-charcoal sm:text-4xl">
          {isHi ? 'नियम और शर्तें' : 'Terms & Conditions'}
        </h1>
        <p className="mt-3 text-sm text-neutral-400">
          {isHi ? 'अंतिम अपडेट: अगस्त 2026' : 'Last updated: August 2026'}
        </p>

        <div className="mt-8 space-y-6">
          {sections.map((section) => (
            <section key={section.title} className="rounded-xl border border-neutral-200 bg-white p-6">
              <h2 className="text-lg font-bold tracking-tight text-charcoal">{section.title}</h2>
              <p className="mt-3 text-sm leading-6 text-neutral-500">{section.body}</p>
            </section>
          ))}
        </div>

        <p className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-800">
          {isHi
            ? 'यह प्रीव्यू लीड स्टोरेज सिस्टम नहीं है। सार्वजनिक लॉन्च से पहले, localStorage को सुरक्षित सर्वर-साइड डेटाबेस और वैलिडेशन सिस्टम से बदलें।'
            : 'This preview is not a production lead-storage system. Before public launch, replace localStorage with a secure server-side database and validation system.'}
        </p>
      </div>
    </div>
  );
}