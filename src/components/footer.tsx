import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="container py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center space-x-2">
            <Image src="https://firebasestorage.googleapis.com/v0/b/watchrasta.firebasestorage.app/o/branding%2Fapple-touch-icon.png?alt=media&token=c66e806e-c06e-4aaa-be19-6df162b79d64" alt="watchRasta logo" width={24} height={24} className="h-6 w-6" />
            <span className="font-bold font-headline text-lg text-foreground">watchRasta</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} watchRasta. All rights reserved.
          </p>
          <nav className="flex gap-4 text-sm text-muted-foreground">
            <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
            <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
