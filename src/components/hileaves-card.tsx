
import Image from 'next/image';
import Link from 'next/link';
import type { Collection } from '@/lib/collections';
import { Card, CardTitle } from '@/components/ui/card';

interface HileavesCardProps {
  collection: Collection
}

export function HileavesCard({ collection }: HileavesCardProps) {
  return (
    <Link href={collection.href} className="block group break-inside-avoid overflow-hidden">
      <Card className="border-none shadow-none bg-transparent rounded-lg">
        <div className="relative w-full overflow-hidden rounded-lg">
          <Image
              src={collection.imageUrl}
              alt={collection.title}
              data-ai-hint={collection.dataAiHint}
              width={400}
              height={500}
              className="w-full h-full object-cover transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10" />
          <div className="absolute bottom-0 left-0 p-6">
              <CardTitle className="font-headline text-2xl mb-2 text-white/90 drop-shadow-md">{collection.title}</CardTitle>
              <p className="text-white/80 line-clamp-3 text-sm">{collection.description}</p>
          </div>
        </div>
      </Card>
    </Link>
  );
}
