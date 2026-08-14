import type { BusinessCategory } from '@/types/lead';

export interface BusinessCategoryInfo {
  id: BusinessCategory;
  name: string;
  nameHi: string;
  description: string;
  isPrimary: boolean;
}

export const businessCategories: BusinessCategoryInfo[] = [
  {
    id: 'beauty_parlour_salon',
    name: 'Beauty Parlour and Salon',
    nameHi: 'ब्यूटी पार्लर और सैलून',
    description: 'Improve service presentation, seasonal offers, social trust, bridal visibility, local discovery, and booking communication.',
    isPrimary: true,
  },
  {
    id: 'coaching_institute',
    name: 'Coaching Institute',
    nameHi: 'कोचिंग इंस्टीट्यूट',
    description: 'Improve course communication, admission campaigns, parent trust, batch visibility, and enquiry handling.',
    isPrimary: true,
  },
  {
    id: 'computer_laptop_shop',
    name: 'Computer and Laptop Shop',
    nameHi: 'कंप्यूटर और लैपटॉप शॉप',
    description: 'Improve product presentation, specifications, repair trust, offers, availability communication, and local enquiries.',
    isPrimary: true,
  },
  {
    id: 'gym_fitness_centre',
    name: 'Gym and Fitness Centre',
    nameHi: 'जिम और फिटनेस सेंटर',
    description: 'Improve membership communication, class schedules, trainer profiles, local discovery, and trial booking.',
    isPrimary: false,
  },
  {
    id: 'restaurant_cafe',
    name: 'Restaurant and Café',
    nameHi: 'रेस्टोरेंट और कैफे',
    description: 'Improve menu presentation, offers, ambience showcase, local discovery, and reservation handling.',
    isPrimary: false,
  },
  {
    id: 'clinic_healthcare',
    name: 'Clinic and Healthcare Practice',
    nameHi: 'क्लिनिक और हेल्थकेयर प्रैक्टिस',
    description: 'Improve service trust, doctor profiles, appointment booking, patient communication, and local visibility.',
    isPrimary: false,
  },
  {
    id: 'real_estate',
    name: 'Real Estate',
    nameHi: 'रियल एस्टेट',
    description: 'Improve property presentation, agent credibility, enquiry handling, and local market authority.',
    isPrimary: false,
  },
  {
    id: 'boutique_fashion',
    name: 'Boutique and Fashion Store',
    nameHi: 'बुटीक और फैशन स्टोर',
    description: 'Improve collection showcase, seasonal offers, style guidance, and customer engagement.',
    isPrimary: false,
  },
  {
    id: 'local_retail_service',
    name: 'Local Retail or Service Business',
    nameHi: 'लोकल रिटेल या सर्विस बिज़नेस',
    description: 'Improve product/service visibility, offers, customer trust, and local discovery.',
    isPrimary: false,
  },
  {
    id: 'other',
    name: 'Other Local Business',
    nameHi: 'अन्य लोकल बिज़नेस',
    description: 'Custom solutions for any local business type not listed above.',
    isPrimary: false,
  },
];

export function getCategory(id: BusinessCategory): BusinessCategoryInfo | undefined {
  return businessCategories.find((c) => c.id === id);
}

export function getPrimaryCategories(): BusinessCategoryInfo[] {
  return businessCategories.filter((c) => c.isPrimary);
}

export function getSecondaryCategories(): BusinessCategoryInfo[] {
  return businessCategories.filter((c) => !c.isPrimary);
}