import { HileavesCard } from '@/components/hileaves-card';

const collections = [
  {
    title: 'Natural Foods',
    description: 'Sourced from the earth, our food collection brings you organic and wholesome products with a rich history.',
    imageUrl: 'https://picsum.photos/800/600',
    dataAiHint: 'natural food',
    href: '#',
  },
  {
    title: 'Artisanal Merch',
    description: 'Handcrafted merchandise that tells a story. Each piece is unique, reflecting a blend of culture and artistry.',
    imageUrl: 'https://picsum.photos/800/601',
    dataAiHint: 'artisanal merch',
    href: '#',
  },
    {
    title: 'Wellness Services',
    description: 'Holistic services designed to rejuvenate your mind, body, and soul, rooted in ancient traditions.',
    imageUrl: 'https://picsum.photos/800/602',
    dataAiHint: 'wellness spa',
    href: '#',
  },
   {
    title: 'Herbal Teas',
    description: 'A curated selection of herbal teas, each with a unique origin story and natural healing properties.',
    imageUrl: 'https://picsum.photos/800/603',
    dataAiHint: 'herbal tea',
    href: '#',
  },
  {
    title: 'Handmade Crafts',
    description: 'Discover unique crafts handmade by artisans from around the world, preserving traditional techniques.',
    imageUrl: 'https://picsum.photos/800/604',
    dataAiHint: 'handmade craft',
    href: '#',
  },
   {
    title: 'Cultural Workshops',
    description: 'Immerse yourself in new experiences with our collection of cultural and artistic workshops.',
    imageUrl: 'https://picsum.photos/800/605',
    dataAiHint: 'art workshop',
    href: '#',
  },
];

export default function HileavesPage() {
  return (
    <div className="container py-16 md:py-24">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-headline font-bold text-accent tracking-tight">HiLeaves</h1>
        <p className="mt-4 text-lg text-foreground/80 max-w-2xl mx-auto">
          Discover a curated collection of natural products and services, each with a unique origin story.
        </p>
      </div>
      
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {collections.map((collection) => (
          <HileavesCard key={collection.title} collection={collection} />
        ))}
      </div>
    </div>
  );
}
