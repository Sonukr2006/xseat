import './globals.css';
import type { Metadata } from 'next';
import { Space_Grotesk, IBM_Plex_Sans } from 'next/font/google';

const space = Space_Grotesk({ subsets: ['latin'], variable: '--font-display' });
const plex = IBM_Plex_Sans({ subsets: ['latin'], weight: ['300', '400', '500', '600'], variable: '--font-body' });

export const metadata: Metadata = {
  title: 'XSEAT - Intelligent Train Seat Exchange',
  description: 'Predict waitlist, exchange seats, and get smart assistance for Indian Railways.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${space.variable} ${plex.variable}`}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
