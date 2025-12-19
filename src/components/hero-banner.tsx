
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function HeroBanner() {
  return (
    <section className="relative h-screen w-full flex items-center justify-center text-center">
      <Image
        src="https://firebasestorage.googleapis.com/v0/b/watchrasta.firebasestorage.app/o/gallery%2Fjuly_13_2025%2FDSC01412.jpg?alt=media&token=46a84051-ae4a-4f73-abcd-505b3021c490"
        alt="watchRasta hero background"
        fill
        className="object-cover object-center brightness-50"
        priority
      />
      <div className="relative z-10 max-w-4xl mx-auto px-4">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-headline font-bold text-white mb-4 leading-tight animate-fade-in-up">
          Epic STORIES. Rooted STARS. A culture OF ENTERTAINMENT.
        </h1>
        <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-8 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          Explore the music, stories, and latest updates from watchRasta.
        </p>
        <Link href="/news">
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 animate-fade-in-up" style={{ animationDelay: '600ms' }}>
            Explore The Music
          </Button>
        </Link>
      </div>
    </section>
  );
}
