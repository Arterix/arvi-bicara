import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'BiCARA - Arvi AI English Learning Partner',
  description:
    'Asisten Cerdas Pembelajaran Bahasa Inggris Ramah Anak (PAUD & SD) dengan Sistem Interaktif Offline-First',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="h-full">
      <body className="min-h-full flex flex-col bg-gradient-to-br from-indigo-50/70 via-sky-50/50 to-teal-50/50 text-slate-900 selection:bg-indigo-500 selection:text-white font-sans">
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
      </body>
    </html>
  );
}
