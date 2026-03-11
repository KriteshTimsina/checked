import './globals.css';
import { Metadata } from 'next/types';
import type React from 'react';
import NavDots from '@/components/Navdots';

export const metadata: Metadata = {
  title: 'Checked — Todos and notes. Never miss a thing.',
  description:
    'Checked is an open-source app designed to streamline your life through intuitive checklists and beautiful notes. Four themes. Zero clutter.',
  keywords: ['Checked', 'Checklist App', 'Todo App', 'Expo React Native', 'Notes App'],
  openGraph: {
    title: 'Checked — Todos and notes. Never miss a thing.',
    description: 'Intuitive checklists and notes with four beautiful themes.',
    type: 'website',
    url: 'https://checked.kriteshtimsina.com.np',
    images: [
      { url: 'https://checked.kriteshtimsina.com.np/og-image.png', width: 1200, height: 630 },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black">
        <NavDots />
        {children}
      </body>
    </html>
  );
}
