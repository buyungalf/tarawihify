// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { IBM_Plex_Mono } from 'next/font/google';

const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '600'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://tarawihify.space'),
  title: 'Tarawihify - Generate Your Tarawih Setlist Easily',
  description:
    'Generate your Tarawih prayer surah list for 8 or 20 rakaat. Download as Instagram-ready wallpaper or printable format.',
  keywords: [
    'tarawih setlist',
    'tarawih generator',
    'ramadhan tools',
    'surah tarawih',
    'tarawih 8 rakaat',
    'tarawih 20 rakaat',
  ],
  openGraph: {
    title: 'Tarawihify - Tarawih Setlist Generator',
    description:
      'Create and download your Tarawih surah sequence for 8 or 20 rakaat.',
    url: 'https://tarawihify.space',
    siteName: 'Tarawihify',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tarawihify - Tarawih Setlist Generator',
    description:
      'Generate your Tarawih surah list and download as story-ready layout.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${mono.className} min-h-screen bg-gray-50 text-gray-900`}>
        {children}
      </body>
    </html>
  );
}
