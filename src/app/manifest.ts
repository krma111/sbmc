import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SBMC — Social Branding Management Company',
    short_name: 'SBMC',
    description:
      'AI-Powered Growth Partner for Local Businesses. Start with a free business check.',
    start_url: '/en',
    display: 'standalone',
    background_color: '#FFFFFF',
    theme_color: '#181A1F',
    icons: [
      {
        src: '/brand/sbmc-logo.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}