// app/layout.tsx
import './globals.css';
import { IBM_Plex_Mono } from 'next/font/google';

const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '600'],
});

export const metadata = {
  title: 'Tarawih Setlist Generator',
  description: 'Generate beautiful Tarawih setlists in receipt style',
  openGraph: {
    title: 'Tarawih Setlist Generator',
    description: 'Generate beautiful Tarawih setlists in receipt style',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tarawih Setlist Generator',
    description: 'Generate beautiful Tarawih setlists in receipt style',
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
