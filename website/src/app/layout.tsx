import Footer from '@/components/Footer';
import './globals.css';
import { Inter } from 'next/font/google';
import { Metadata } from 'next/types';
import type React from 'react';
import Header from '@/components/Header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Checked - Todos and notes. Never miss a thing',
  description:
    'Checked is an open-source project designed to streamline project tracking through intuitive checklists. With Checked, you can effortlessly organize your to-dos and ensure nothing slips through the cracks.',
  keywords: ['Checked', 'Checklist App', 'Todo App', 'Expo React Native'],

  openGraph: {
    title: 'Checked - Todos and notes. Never miss a thing',
    description:
      'Checked is an open-source project designed to streamline project tracking through intuitive checklists. With Checked, you can effortlessly organize your to-dos and ensure nothing slips through the cracks.',
    type: 'website',
    url: 'https://checked.kriteshtimsina.com.np',
    images: [
      {
        url: 'https://checked.kriteshtimsina.com.np/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Photos Cloud ',
      },
    ],
  },
  twitter: {
    title: 'Checked - Todos and notes. Never miss a thing',
    description:
      'Checked is an open-source project designed to streamline project tracking through intuitive checklists. With Checked, you can effortlessly organize your to-dos and ensure nothing slips through the cracks.',
    images: ['https://checked.kriteshtimsina.com.np/og-image.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <div className="h-screen bg-gradient-to-br from-emerald-400 to-green-400 text-white overflow-y-hidden">
          <Header />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
