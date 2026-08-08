import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/lib/context/LanguageContext';
import { AuthProvider } from '@/lib/context/AuthContext';
import { DataProvider } from '@/lib/context/DataContext';
import { Navbar } from '@/components/navigation/Navbar';
import { Footer } from '@/components/navigation/Footer';
import { AIChatbot } from '@/components/ai/AIChatbot';

export const metadata: Metadata = {
  title: 'Labour.com - Bangladesh Broker Labour Marketplace',
  description: 'Connect with local brokers across Bangladesh to hire verified labourers, electricians, plumbers, masons, cleaners & technical workers.'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col antialiased">
        <LanguageProvider>
          <AuthProvider>
            <DataProvider>
              <Navbar />
              <main className="flex-grow">{children}</main>
              <Footer />
              <AIChatbot />
            </DataProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
