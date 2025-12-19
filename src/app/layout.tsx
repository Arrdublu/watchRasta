
import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import MiniPlayer from '@/components/MiniPlayer';
import { AudioProvider } from '@/contexts/AudioContext';

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@400;700&family=Space+Grotesk:wght@400;700&display=swap" rel="stylesheet" />
        <link rel="icon" href="https://firebasestorage.googleapis.com/v0/b/watchrasta.firebasestorage.app/o/watchRasta_2024_logo-10.png?alt=media&token=ff529403-c4ab-4828-81c4-a44f712ca138" sizes="any" />
        <link rel="apple-touch-icon" href="https://firebasestorage.googleapis.com/v0/b/watchrasta.firebasestorage.app/o/branding%2Fapple-touch-icon.png?alt=media&token=c66e806e-c06e-4aaa-be19-6df162b79d64" />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-body text-foreground antialiased'
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <FirebaseClientProvider>
            <AudioProvider>
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
              <Toaster />
              <MiniPlayer />
            </AudioProvider>
          </FirebaseClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
