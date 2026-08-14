import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import './globals.css';

const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-manrope',
});

export const metadata: Metadata = {
  title: {
    default: 'SBMC | AI-Powered Growth Services for Local Businesses in Prayagraj',
    template: '%s | SBMC',
  },
  description:
    'SBMC helps local businesses improve branding, offers, Instagram, Google Business, WhatsApp systems, content, and landing pages. Start with a free business check.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  icons: {
    icon: '/brand/sbmc-logo.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} flex min-h-screen flex-col bg-white font-sans text-charcoal`}>
        {children}
      </body>
    </html>
  );
}