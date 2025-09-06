import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { Collection } from '@/lib/collections';

interface HileavesCardProps {
  collection: Collection
}

export function HileavesCard({ collection }: HileavesCardProps) {
  return (
    <div className="break-inside-avoid group">
        <Card className="overflow-hidden transition-all duration-300 ease-in-out hover:shadow-2xl hover:scale-[1.02]">
        <Link href={collection.href} className="block">
            <CardHeader className="p-0">
            <Image
                src={collection.imageUrl}
                alt={collection.title}
                data-ai-hint={collection.dataAiHint}
                width={800}
                height={600}
                className="w-full h-auto object-cover"
            />
            </CardHeader>
            <CardContent className="p-6">
                <CardTitle className="font-headline text-2xl mb-2 text-accent">{collection.title}</CardTitle>
                <p className="text-muted-foreground line-clamp-3">{collection.description}</p>
            </CardContent>
            </Link>
        </Card>
    </div>
  );
}
