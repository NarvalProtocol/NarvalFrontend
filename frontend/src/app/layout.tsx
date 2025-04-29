import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import '@mysten/dapp-kit/dist/index.css';
import { AppProvider } from '@/components/providers/app-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Narval - DeFi Liquidity Management Platform',
  description: 'Modern solution for DeFi liquidity and recursive lending management',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
