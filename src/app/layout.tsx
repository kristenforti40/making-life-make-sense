import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { StoreProvider } from '@/lib/store';
import Sidebar from '@/components/layout/Sidebar';
import CaptureBar from '@/components/capture/CaptureBar';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Life OS',
  description: 'Your personal command center',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="h-full antialiased">
        <StoreProvider>
          <div className="flex h-full bg-[#0e0c0a] overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
              <CaptureBar />
              <main className="flex-1 overflow-y-auto">{children}</main>
            </div>
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
