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
    title: isHi ? 'गोपनीयता नीति | SBMC' : 'Privacy Notice | SBMC',
    description: isHi
      ? 'SBMC प्रीव्यू वेबसाइट की गोपनीयता जानकारी। जानें कि आपकी जानकारी कैसे संभाली जाती है।'
      : 'SBMC preview website privacy information. Learn how your information is handled.',
  };
}

export default async function PrivacyPage({
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
          title: '1. यह एक प्रीव्यू वेबसाइट है',
          body: 'यह SBMC की एक प्रीव्यू (पूर्वावलोकन) वेबसाइट है। इस संस्करण में कोई सुरक्षित सर्वर बैकएंड नहीं है। बिज़नेस चेक में दी गई जानकारी केवल आपके वर्तमान ब्राउज़र में localStorage में सेव होती है।',
        },
        {
          title: '2. localStorage सुरक्षित स्टोरेज नहीं है',
          body: 'localStorage एक ब्राउज़र-आधारित स्टोरेज है। यह सुरक्षित सर्वर स्टोरेज नहीं है। इसका मतलब है: (a) डेटा केवल इसी डिवाइस और ब्राउज़र पर रहता है; (b) किसी अन्य डिवाइस पर लीड्स दिखाई नहीं देतीं; (c) ब्राउज़र स्टोरेज साफ़ करने से लीड्स हमेशा के लिए हट जाती हैं; (d) जब तक आप व्हाट्सएप नहीं खोलते, जानकारी SBMC तक नहीं पहुँचती।',
        },
        {
          title: '3. कौन सी जानकारी एकत्र होती है',
          body: `बिज़नेस चेक में: बिज़नेस का नाम, बिज़नेस कैटेगरी, लोकेशन, सबसे बड़ी समस्या, व्हाट्सएप नंबर, पसंदीदा भाषा, और सुझाई गई सर्विस। हम कभी भी पासवर्ड, सरकारी ID, भुगतान विवरण, अपलोड किए गए फ़ाइलें या संवेदनशील व्यक्तिगत दस्तावेज़ नहीं माँगते या संग्रहीत नहीं करते।`,
        },
        {
          title: '4. जानकारी कैसे साझा होती है',
          body: `जब आप "व्हाट्सएप पर जारी रखें" बटन दबाते हैं, तो बिज़नेस चेक की जानकारी व्हाट्सएप मैसेज में भेजी जाती है जो आपके द्वारा भेजी जाती है। व्हाट्सएप खोलने से पहले कोई जानकारी SBMC को नहीं भेजी जाती। व्हाट्सएप पर मैसेज भेजकर आप ${business.whatsappNumber} पर जानकारी साझा करने के लिए सहमत होते हैं।`,
        },
        {
          title: '5. अपना डेटा हटाना',
          body: 'प्रीव्यू डेटा हटाने के लिए अपने ब्राउज़र की साइट स्टोरेज साफ़ करें, या /preview-leads पेज से लीड्स हटाएँ। व्हाट्सएप पर भेजे गए मैसेज को आप अपने व्हाट्सएप चैट से हटा सकते हैं।',
        },
        {
          title: '6. प्रोडक्शन उपयोग',
          body: 'यह प्रीव्यू लीड स्टोरेज प्रणाली नहीं है। सार्वजनिक लॉन्च से पहले, localStorage को एक सुरक्षित सर्वर-साइड डेटाबेस और वैलिडेशन सिस्टम से बदलना आवश्यक है।',
        },
      ]
    : [
        {
          title: '1. This is a preview website',
          body: 'This is a preview version of the SBMC website. This version has no secure server backend. Information provided in the business check is stored only in your current browser using localStorage.',
        },
        {
          title: '2. localStorage is not secure storage',
          body: 'localStorage is a browser-based storage. It is not secure server storage. This means: (a) data stays only on this device and browser; (b) leads are not visible on another device; (c) clearing browser storage permanently removes leads; (d) information is not sent to SBMC until you open WhatsApp.',
        },
        {
          title: '3. What information is collected',
          body: `In the business check: business name, business category, location, biggest challenge, WhatsApp number, preferred language, and the recommended service. We never ask for or store passwords, government IDs, payment details, uploaded files, or sensitive personal documents.`,
        },
        {
          title: '4. How information is shared',
          body: `When you click "Continue on WhatsApp", the business check information is included in a WhatsApp message that you send. Nothing is sent to SBMC before you open WhatsApp. By sending the message on WhatsApp, you agree to share the information with ${business.whatsappNumber}.`,
        },
        {
          title: '5. Deleting your data',
          body: 'To remove preview data, clear your browser site storage, or delete leads from the /preview-leads page. Messages sent on WhatsApp can be deleted from your WhatsApp chat.',
        },
        {
          title: '6. Production use',
          body: 'This is not a production lead-storage system. Before public launch, localStorage must be replaced with a secure server-side database and validation system.',
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
          <span aria-current="page">{isHi ? 'गोपनीयता नीति' : 'Privacy'}</span>
        </nav>

        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-charcoal sm:text-4xl">
          {isHi ? 'गोपनीयता नोटिस' : 'Privacy Notice'}
        </h1>
        <p className="mt-3 text-sm text-neutral-400">
          {isHi ? 'अंतिम अपडेट: अगस्त 2026' : 'Last updated: August 2026'}
        </p>

        <div className="mt-8 space-y-6">
          {sections.map((section) => (
            <section key={section.title} className="glass-light rounded-xl p-6">
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