import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Youtube, Twitter, Music, Mail } from 'lucide-react';

const legalLinks = [
  { href: '/privacy-policy', label: 'Privacy Policy' },
  { href: '/terms-of-service', label: 'Terms of Service' },
  { href: '/cookie-policy', label: 'Cookie Policy' },
  { href: '/modern-slavery-act', label: 'Modern Slavery Act' },
];

const supportLinks = [
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Support' },
  { href: '/career', label: 'Career' },
];

const socialLinks = [
    { href: 'mailto:hi@watchrasta.com', icon: Mail, label: 'Email' },
    { href: 'https://www.instagram.com/watchrasta/', icon: Instagram, label: 'Instagram' },
    { href: 'https://www.youtube.com/@watchrastavevo', icon: Youtube, label: 'YouTube' },
    { href: 'https://x.com/watchrasta', icon: Twitter, label: 'Twitter' },
    { href: 'https://music.apple.com/us/artist/watchrasta/1668401118', icon: Music, label: 'Apple Music' },
];

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="container py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1 flex items-start flex-col">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Image src="https://firebasestorage.googleapis.com/v0/b/watchrasta.firebasestorage.app/o/branding%2Fapple-touch-icon.png?alt=media&token=c66e806e-c06e-4aaa-be19-6df162b79d64" alt="watchRasta logo" width={24} height={24} className="h-6 w-6" />
              <span className="font-bold font-headline text-lg text-foreground">watchRasta</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} watchRasta. All rights reserved.
            </p>
          </div>

          <div className="md:justify-self-center">
            <h3 className="font-semibold mb-4 text-foreground">Legal</h3>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:justify-self-center">
            <h3 className="font-semibold mb-4 text-foreground">Support</h3>
            <ul className="space-y-2">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="col-span-2 md:col-span-2 md:justify-self-end">
             <h3 className="font-semibold mb-4 text-foreground">Follow Us [@watchRasta]</h3>
             <div className="flex gap-4">
                {socialLinks.map((link) => (
                    <Link key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary" aria-label={link.label}>
                        <link.icon className="h-6 w-6" />
                    </Link>
                ))}
                <Link href="https://open.spotify.com/artist/27jAav0wogMYRHzeyGLoKs" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary" aria-label="Spotify">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                        <path d="M9 18v-5l5-2.5V6" /><path d="M18 6v1" /><path d="M21.17 8.83a11.72 11.72 0 0 0-11.83-2.31 11.72 11.72 0 0 0-5.83 5.34 12.02 12.02 0 0 0 4.1 8.35 11.72 11.72 0 0 0 8.35 4.1 11.72 11.72 0 0 0 5.34-5.83 11.93 11.93 0 0 0-2.3-10.45Z" />
                    </svg>
                </Link>
             </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
