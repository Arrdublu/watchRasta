
import { getCollectionById, collections } from '@/lib/collections';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

export function generateStaticParams() {
  return collections.map((collection) => ({
    id: String(collection.id),
  }));
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const collection = getCollectionById(Number(params.id));

  if (!collection) {
    return {
      title: 'Collection Not Found',
    };
  }

  return {
    title: `${collection.title} | HiLeaves`,
    description: collection.description,
  };
}

export default function CollectionPage({ params }: { params: { id: string } }) {
  const collection = getCollectionById(Number(params.id));

  if (!collection) {
    notFound();
  }

  return (
    <div className="container py-16 md:py-24">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="relative w-full aspect-square rounded-lg overflow-hidden shadow-2xl">
          <Image
            src={collection.imageUrl}
            alt={collection.title}
            data-ai-hint={collection.dataAiHint}
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-accent">
            {collection.title}
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {collection.description}
          </p>
          <div className="text-3xl font-bold text-primary">
            $49.99
          </div>
          <Button size="lg" className="w-full md:w-auto">
            <ShoppingCart className="mr-2" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
