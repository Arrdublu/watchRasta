
'use client';

import Link from 'next/link';
import { Menu, X, User, LogIn, PlusCircle, ShoppingBag, List, Library } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { useUser } from '@/firebase';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { ThemeToggle } from '@/components/theme-toggle';

const allNavLinks = [
  { href: '/news', label: 'News' },
  { href: '/being', label: 'Being' },
  { href: '/brands', label: 'Brands' },
  { href: '/music', label: 'Music' },
  { href: '/my-favorites', label: 'My Favorites' },
  { href: '/admin', label: 'Admin' },
];

const ADMIN_EMAIL = 'watchrasta@gmail.com';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useUser();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
        if (auth) {
            await signOut(auth);
            toast({ title: "Signed out successfully." });
        }
    } catch (error) {
        toast({ title: "Error signing out", description: (error as Error).message, variant: "destructive" });
    }
  }
  
  const navLinks = allNavLinks.filter(link => {
      if (link.href === '/admin') {
          return user?.email === ADMIN_EMAIL;
      }
      // Hide My Favorites if not logged in
      if (link.href === '/my-favorites') {
          return !!user;
      }
      return true;
  });

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-black/20 backdrop-blur-lg">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Image src="https://firebasestorage.googleapis.com/v0/b/watchrasta.firebasestorage.app/o/watchRasta_2024_logo-10.png?alt=media&token=ff529403-c4ab-4828-81c4-a44f712ca138" alt="watchRasta logo" width={64} height={64} className="h-16 w-16" />
        </Link>
        <div className="flex flex-1 items-center justify-end">
          <nav className="hidden md:flex md:items-center md:space-x-6 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn("transition-colors hover:text-primary", pathname.startsWith(link.href) ? "text-primary" : "text-muted-foreground")}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center ml-4">
            <ThemeToggle />
            {user ? (
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                           <User />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">My Account</p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    {user.email}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href="/my-library"><Library className="mr-2 h-4 w-4" />My Library</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/profile">Profile</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/my-submissions"><List className="mr-2 h-4 w-4" />My Submissions</Link>
                        </DropdownMenuItem>
                         <DropdownMenuItem asChild>
                            <Link href="/articles/create"><PlusCircle className="mr-2 h-4 w-4" />Create Article</Link>
                        </DropdownMenuItem>
                         <DropdownMenuItem asChild>
                            <Link href="/products/create"><ShoppingBag className="mr-2 h-4 w-4" />Create Product</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleSignOut}>
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <Button asChild variant="ghost" size="sm">
                    <Link href="/login">
                        <LogIn className="mr-2 h-4 w-4" />
                        Login
                    </Link>
                </Button>
            )}
          </div>

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
                  className={cn("flex w-full items-center rounded-md p-2 text-base font-medium hover:underline", pathname.startsWith(link.href) ? "text-primary" : "")}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
               <div className="border-t mt-4 pt-4">
                 {user ? (
                    <>
                        <Link href="/my-library" className="flex w-full items-center rounded-md p-2 text-base font-medium hover:underline" onClick={() => setIsOpen(false)}>My Library</Link>
                        <Link href="/profile" className="flex w-full items-center rounded-md p-2 text-base font-medium hover:underline" onClick={() => setIsOpen(false)}>Profile</Link>
                        <Link href="/my-submissions" className="flex w-full items-center rounded-md p-2 text-base font-medium hover:underline" onClick={() => setIsOpen(false)}>My Submissions</Link>
                        <Link href="/articles/create" className="flex w-full items-center rounded-md p-2 text-base font-medium hover:underline" onClick={() => setIsOpen(false)}>Create Article</Link>
                        <Link href="/products/create" className="flex w-full items-center rounded-md p-2 text-base font-medium hover:underline" onClick={() => setIsOpen(false)}>Create Product</Link>
                        <button onClick={() => { handleSignOut(); setIsOpen(false); }} className="flex w-full items-center rounded-md p-2 text-base font-medium hover:underline text-left">Log Out</button>
                    </>
                 ) : (
                    <div className="flex items-center justify-between">
                      <Link href="/login" className="flex w-full items-center rounded-md p-2 text-base font-medium hover:underline" onClick={() => setIsOpen(false)}>Login</Link>
                      <ThemeToggle />
                    </div>
                 )}
                </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
