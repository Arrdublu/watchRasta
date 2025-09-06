
import { getCollectionById, collections } from '@/lib/collections';
import { getProductsByCollectionId } from '@/lib/products';
import { notFound } from 'next/navigation';
import { ProductCard } from '@/components/product-card';

export async function generateStaticParams() {
  const publishedCollections = collections.filter(c => c.status === 'Published');
  return publishedCollections.map((collection) => ({
    id: String(collection.id),
  }));
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const collection = await getCollectionById(Number(params.id));

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

export default async function CollectionPage({ params }: { params: { id: string } }) {
  const collection = await getCollectionById(Number(params.id));
  
  if (!collection) {
    notFound();
  }

  const productsInCollection = await getProductsByCollectionId(collection.id);

  return (
    <div className="container py-16 md:py-24">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-accent">
          {collection.title}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          {collection.description}
        </p>
      </header>

      {productsInCollection.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {productsInCollection.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border-2 border-dashed border-border/60 rounded-lg">
          <h2 className="text-2xl font-headline">No products in this collection yet.</h2>
          <p className="mt-2 text-muted-foreground">Check back soon for new arrivals.</p>
        </div>
      )}
    </div>
  );
}
