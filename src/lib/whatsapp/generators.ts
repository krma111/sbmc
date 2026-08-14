import type { PreviewLead, BusinessCategory, BiggestChallenge, PreferredLanguage } from '@/types/lead';
import { businessCategories } from '@/content/categories';
import { getRecommendation } from '@/lib/recommendation/engine';

const challengeLabels: Record<BiggestChallenge, string> = {
  need_more_enquiries: 'I need more enquiries',
  not_professional_online: 'My business does not look professional online',
  instagram_needs_improvement: 'My Instagram needs improvement',
  not_found_on_google: 'Customers cannot find me properly on Google',
  offers_not_attracting: 'My offers are not attracting attention',
  whatsapp_unorganised: 'My WhatsApp customer handling is unorganised',
  dont_know_content: 'I do not know what content to post',
  need_website: 'I need a website or landing page',
  not_sure_whats_missing: 'I am not sure what my business is missing',
};

const challengeLabelsHi: Record<BiggestChallenge, string> = {
  need_more_enquiries: 'मुझे और इन्क्वायरी चाहिए',
  not_professional_online: 'मेरा बिज़नेस ऑनलाइन प्रोफेशनल नहीं दिखता',
  instagram_needs_improvement: 'मेरे इंस्टाग्राम को सुधार की ज़रूरत है',
  not_found_on_google: 'ग्राहक मुझे गूगल पर ठीक से नहीं ढूंढ पाते',
  offers_not_attracting: 'मेरे ऑफर्स ध्यान नहीं खींच रहे',
  whatsapp_unorganised: 'मेरा व्हाट्सएप कस्टमर हैंडलिंग अव्यवस्थित है',
  dont_know_content: 'मुझे नहीं पता क्या कंटेंट पोस्ट करूँ',
  need_website: 'मुझे वेबसाइट या लैंडिंग पेज चाहिए',
  not_sure_whats_missing: 'मुझे नहीं पता मेरे बिज़नेस में क्या कमी है',
};

const categoryLabels: Record<BusinessCategory, string> = {
  beauty_parlour_salon: 'Beauty Parlour and Salon',
  coaching_institute: 'Coaching Institute',
  computer_laptop_shop: 'Computer and Laptop Shop',
  gym_fitness_centre: 'Gym and Fitness Centre',
  restaurant_cafe: 'Restaurant and Café',
  clinic_healthcare: 'Clinic and Healthcare Practice',
  real_estate: 'Real Estate',
  boutique_fashion: 'Boutique and Fashion Store',
  local_retail_service: 'Local Retail or Service Business',
  other: 'Other Local Business',
};

const categoryLabelsHi: Record<BusinessCategory, string> = {
  beauty_parlour_salon: 'ब्यूटी पार्लर और सैलून',
  coaching_institute: 'कोचिंग इंस्टीट्यूट',
  computer_laptop_shop: 'कंप्यूटर और लैपटॉप शॉप',
  gym_fitness_centre: 'जिम और फिटनेस सेंटर',
  restaurant_cafe: 'रेस्टोरेंट और कैफे',
  clinic_healthcare: 'क्लिनिक और हेल्थकेयर प्रैक्टिस',
  real_estate: 'रियल एस्टेट',
  boutique_fashion: 'बुटीक और फैशन स्टोर',
  local_retail_service: 'लोकल रिटेल या सर्विस बिज़नेस',
  other: 'अन्य लोकल बिज़नेस',
};

const whatsappNumber = '919118876154';
const whatsappBaseUrl = `https://wa.me/${whatsappNumber}`;

export function generateWhatsAppMessage(lead: PreviewLead, language: PreferredLanguage = 'en'): string {
  const challengeLabel = language === 'hi' ? challengeLabelsHi[lead.biggestChallenge] : challengeLabels[lead.biggestChallenge];
  const categoryLabel = language === 'hi' ? categoryLabelsHi[lead.businessCategory] : categoryLabels[lead.businessCategory];
  const languageLabel = language === 'hi' ? 'हिन्दी' : 'English';

  if (language === 'hi') {
    return `नमस्ते SBMC 👋

मैंने आपकी वेबसाइट पर बिज़नेस चेक पूरा किया है।

Lead ID: ${lead.leadCode}
बिज़नेस का नाम: ${lead.businessName}
बिज़नेस कैटेगरी: ${categoryLabel}
शहर/एरिया: ${lead.cityArea}
मुख्य समस्या: ${challengeLabel}
सुझाई गई सेवा: ${lead.recommendedService}
दिखाई गई कीमत: ₹${lead.recommendedPrice}
पसंदीदा भाषा: ${languageLabel}

मैं सुझाए गए समाधान के बारे में आगे बात करना चाहता/चाहती हूँ। कृपया मेरे पर्सनलाइज़्ड मुफ़्त सैंपल के लिए आवश्यक जानकारी भी बताएँ।`;
  }

  return `Hello SBMC 👋

I completed the business check on your website.

Lead ID: ${lead.leadCode}
Business Name: ${lead.businessName}
Business Category: ${categoryLabel}
City/Area: ${lead.cityArea}
Biggest Challenge: ${challengeLabel}
Recommended Service: ${lead.recommendedService}
Price Shown: ₹${lead.recommendedPrice}
Preferred Language: ${languageLabel}

I would like to continue and understand the recommended solution. Please also tell me what information you need for my personalised free sample.`;
}

export function generateWhatsAppUrl(message: string): string {
  const encodedMessage = encodeURIComponent(message);
  return `${whatsappBaseUrl}?text=${encodedMessage}`;
}

export function generateWhatsAppUrlFromLead(lead: PreviewLead, language: PreferredLanguage = 'en'): string {
  const message = generateWhatsAppMessage(lead, language);
  return generateWhatsAppUrl(message);
}

export function getWhatsAppNumber(): string {
  return whatsappNumber;
}

export function getWhatsAppBaseUrl(): string {
  return whatsappBaseUrl;
}