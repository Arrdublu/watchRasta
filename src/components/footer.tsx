import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Youtube, Twitter, Music } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="container py-12">
        <div className="grid md:grid-cols-3 gap-8 items-center text-center md:text-left">
          <div className="flex items-center space-x-2 justify-center md:justify-start">
            <Image src="https://firebasestorage.googleapis.com/v0/b/watchrasta.firebasestorage.app/o/branding%2Fapple-touch-icon.png?alt=media&token=c66e806e-c06e-4aaa-be19-6df162b79d64" alt="watchRasta logo" width={24} height={24} className="h-6 w-6" />
            <span className="font-bold font-headline text-lg text-foreground">watchRasta</span>
          </div>

          <div className="flex justify-center md:justify-start md:order-last gap-4">
            <Link href="https://www.instagram.com/watchrasta/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
              <Instagram className="h-6 w-6" />
            </Link>
            <Link href="https://www.youtube.com/@watchrastavevo" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
              <Youtube className="h-6 w-6" />
            </Link>
            <Link href="https://x.com/watchrasta" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
              <Twitter className="h-6 w-6" />
            </Link>
            <Link href="https://music.apple.com/us/artist/watchrasta/1668401118" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
              <Music className="h-6 w-6" />
            </Link>
            <Link href="https://open.spotify.com/artist/27jAav0wogMYRHzeyGLoKs" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                >
                    <path d="M9 18v-5l5-2.5V6" />
                    <path d="M18 6v1" />
                    <path d="M21.17 8.83a11.72 11.72 0 0 0-11.83-2.31 11.72 11.72 0 0 0-5.83 5.34 12.02 12.02 0 0 0 4.1 8.35 11.72 11.72 0 0 0 8.35 4.1 11.72 11.72 0 0 0 5.34-5.83 11.93 11.93 0 0 0-2.3-10.45Z" />
                </svg>
            </Link>
          </div>
          
          <p className="text-sm text-muted-foreground md:col-span-1 md:text-center">
            © {new Date().getFullYear()} watchRasta. All rights reserved.
          </p>

        </div>
      </div>
    </footer>
  );
}
