
import { getProductById, getAllProducts } from '@/lib/products';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((product) => ({
    id: product.id,
  }));
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: `${product.title} | watchRasta`,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id);

  if (!product) {
    notFound();
  }

  return (
    <div className="container py-16 md:py-24">
      <div className="mb-8">
        <Button asChild variant="outline">
          <Link href={`/collections/${product.collectionId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Collection
          </Link>
        </Button>
      </div>
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <div className="relative aspect-square w-full rounded-lg overflow-hidden shadow-lg">
          <Image
            src={product.imageUrl.replace('400', '800')}
            alt={product.title}
            data-ai-hint={product.dataAiHint}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex flex-col h-full">
          <h1 className="text-4xl md:text-5xl font-headline font-bold mb-4">{product.title}</h1>
          <p className="text-muted-foreground text-lg mb-6">{product.description}</p>
          <div className="mt-auto">
            <div className="flex items-center justify-between mb-6">
              <p className="text-4xl font-bold text-primary">${product.price}</p>
            </div>
            <Button size="lg" className="w-full">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
