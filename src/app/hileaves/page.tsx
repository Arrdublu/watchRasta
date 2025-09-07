
import { HileavesCard } from '@/components/hileaves-card';
import { getCollections } from '@/lib/collections';

export default async function HileavesPage() {
  const publishedCollections = await getCollections({ status: 'Published' });
  
  return (
    <div className="container py-16 md:py-24">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-headline font-bold text-accent tracking-tight">HiLeaves</h1>
        <p className="mt-4 text-lg text-foreground/80 max-w-2xl mx-auto">
          Discover a curated collection of natural products and services, each with a unique origin story.
        </p>
      </div>
      
      <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
        {publishedCollections.map((collection) => (
          <HileavesCard key={collection.id} collection={collection} />
        ))}
      </div>
    </div>
  );
}
