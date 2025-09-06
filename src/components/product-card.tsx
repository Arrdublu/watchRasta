
'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { Product } from '@/lib/products';
import { ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';


interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
    const { toast } = useToast();

    const handleAddToCart = () => {
        // In a real app, this would add the item to a cart state/context
        toast({
            title: "Added to Cart",
            description: `${product.title} has been added to your cart.`
        });
    }

  return (
    <Card className="overflow-hidden flex flex-col">
        <CardHeader className="p-0">
            <div className="relative aspect-square w-full">
                <Image
                    src={product.imageUrl}
                    alt={product.title}
                    data-ai-hint={product.dataAiHint}
                    fill
                    className="object-cover"
                />
            </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg font-headline mb-1">{product.title}</CardTitle>
        <CardDescription className="text-sm line-clamp-2">{product.description}</CardDescription>
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center">
        <p className="text-lg font-bold text-primary">${product.price}</p>
        <Button variant="outline" size="sm" onClick={handleAddToCart}>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
