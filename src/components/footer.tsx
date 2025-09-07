
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

const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-2.43.03-4.83-.96-6.46-2.99-1.63-2.02-2.06-4.87-1.34-7.44.88-3.09 3.83-5.34 6.92-5.45.02-.45.01-.89.02-1.34.02-2.64-.01-5.28-.01-7.92-.01-1.51.53-3.01 1.62-4.08C7.34 1.16 8.9 0 10.5.02c.67.01 1.34-.01 2.02.02z"/>
    </svg>
)

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="container py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1 flex items-start flex-col">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Image src="https://firebasestorage.googleapis.com/v0/b/watchrasta.firebasestorage.app/o/watchRasta_2024_logo-10.png?alt=media&token=5c16b454-c804-4aa8-8e8f-78115837cc14" alt="watchRasta logo" width={24} height={24} className="h-6 w-6" />
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
                <Link href="https://www.tiktok.com/@watchrasta" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary" aria-label="TikTok">
                   <TikTokIcon className="h-6 w-6" />
                </Link>
             </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
