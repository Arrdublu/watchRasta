import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { Collection } from '@/lib/collections';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';

interface HileavesCardProps {
  collection: Collection
}

export function HileavesCard({ collection }: HileavesCardProps) {
  return (
    <div className="break-inside-avoid group relative">
        <Card className="overflow-hidden transition-all duration-300 ease-in-out group-hover:shadow-2xl">
            <Link href={collection.href} className="block">
                <CardHeader className="p-0">
                <Image
                    src={collection.imageUrl}
                    alt={collection.title}
                    data-ai-hint={collection.dataAiHint}
                    width={800}
                    height={600}
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                />
                </CardHeader>
                <CardContent className="p-6">
                    <CardTitle className="font-headline text-2xl mb-2 text-accent">{collection.title}</CardTitle>
                    <p className="text-muted-foreground line-clamp-3">{collection.description}</p>
                </CardContent>
            </Link>
        </Card>
        <div className="absolute bottom-6 right-6 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
             <Link href={collection.href}>
                <Button>
                    View Collection
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </Link>
        </div>
    </div>
  );
}
