import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function HeroBanner() {
  return (
    <section className="relative h-[60vh] md:h-[80vh] w-full flex items-center justify-center text-center">
      <Image
        src="https://picsum.photos/1920/1080"
        alt="Featured watch collection"
        data-ai-hint="luxury watch"
        fill
        className="object-cover object-center brightness-50"
        priority
      />
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-white">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-headline font-bold text-accent mb-4 leading-tight animate-fade-in-up">
          The Art of Horology, Redefined.
        </h1>
        <p className="text-lg md:text-xl text-accent/90 max-w-2xl mx-auto mb-8 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          Explore curated stories, in-depth reviews, and spotlights on the world's most exquisite timepieces.
        </p>
        <Link href="/collections">
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 animate-fade-in-up" style={{ animationDelay: '600ms' }}>
            Discover Collections
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
