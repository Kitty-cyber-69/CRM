import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

// This layout doesn't use the custom Layout directly since Next.js
// layouts apply to all routes. We'll use Layout in a more targeted way.

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'CustomerCompass CRM',
  description: 'Manage your customer relationships effectively',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
