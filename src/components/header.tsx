'use client';

import Link from 'next/link';
import { Menu, X, Watch } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/collections', label: 'Collections' },
  { href: '/lifestyle', label: 'Lifestyle' },
  { href: '/brands', label: 'Brand Spotlights' },
  { href: '/my-collection', label: 'My Collection' },
  { href: '/style-guide', label: 'Style Guide' },
  { href: '/contact', label: 'Contact' },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Watch className="h-6 w-6 text-primary" />
          <span className="font-bold font-headline text-lg">watchRasta</span>
        </Link>
        <div className="flex flex-1 items-center justify-end">
          <nav className="hidden md:flex md:items-center md:space-x-6 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn("transition-colors hover:text-primary", pathname === link.href ? "text-primary" : "text-muted-foreground")}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>
      {isOpen && (
        <div
          className={cn(
            'fixed inset-0 top-16 z-40 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-y-auto p-6 pb-32 shadow-md animate-in slide-in-from-bottom-80 md:hidden'
          )}
        >
          <div className="relative z-20 grid gap-6 rounded-md bg-popover p-4 text-popover-foreground shadow-md">
            <nav className="grid grid-flow-row auto-rows-max text-sm">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn("flex w-full items-center rounded-md p-2 text-base font-medium hover:underline", pathname === link.href ? "text-primary" : "")}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
