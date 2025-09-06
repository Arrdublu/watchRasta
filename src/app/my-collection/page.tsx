
'use client';

import { useCollection } from '@/hooks/use-collection';
import { ArticleCard } from '@/components/article-card';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function MyFavoritesPage() {
  const { collection, isLoaded } = useCollection();

  return (
    <div className="container py-16 md:py-24 min-h-[60vh]">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-bold">My Favorites</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Your saved articles, news, and stories.
        </p>
      </div>
      
      {!isLoaded ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-96 w-full" />
          ))}
        </div>
      ) : collection.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {collection.map((article) => (
                <ArticleCard key={article.id} article={article} />
            ))}
        </div>
      ) : (
        <div className="text-center py-20 border-2 border-dashed border-border/60 rounded-lg">
          <h2 className="text-2xl font-headline">Your favorites list is empty.</h2>
          <p className="mt-2 text-muted-foreground">Start exploring and save what you love.</p>
          <Button asChild variant="link" className="mt-6 text-primary text-lg">
            <Link href="/news">
                Browse News
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
