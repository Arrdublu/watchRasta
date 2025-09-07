
import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/auth-context';

export const metadata: Metadata = {
  metadataBase: new URL('https://watchrasta.com'),
  title: 'watchRasta | Official Website',
  description: 'The official website for the artist watchRasta. Get the latest music, tour dates, and news.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
        <link rel="icon" href="https://firebasestorage.googleapis.com/v0/b/watchrasta.appspot.com/o/images%2F3wR-logo.png?alt=media&token=8d272378-752e-40f4-8848-036125b29267" sizes="any" />
        <link rel="apple-touch-icon" href="https://firebasestorage.googleapis.com/v0/b/watchrasta.firebasestorage.app/o/branding%2Fapple-touch-icon.png?alt=media&token=c66e806e-c06e-4aaa-be19-6df162b79d64" />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-body text-foreground antialiased'
        )}
      >
        <AuthProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
