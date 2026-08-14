import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const lastModified = new Date();

  return [
    { url: origin, lastModified, changeFrequency: 'weekly', priority: 1 },
    { url: `${origin}/en`, lastModified, changeFrequency: 'weekly', priority: 1 },
    { url: `${origin}/hi`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${origin}/en/business-check`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${origin}/hi/business-check`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${origin}/en/services`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${origin}/hi/services`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${origin}/en/about`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${origin}/hi/about`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${origin}/en/privacy`, lastModified, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${origin}/hi/privacy`, lastModified, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${origin}/en/terms`, lastModified, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${origin}/hi/terms`, lastModified, changeFrequency: 'yearly', priority: 0.2 },
  ];
}