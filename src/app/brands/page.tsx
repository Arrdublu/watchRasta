
import { ArticleCard } from '@/components/article-card';
import { getArticles } from '@/lib/articles';

export default async function BrandsPage() {
  const brandArticles = await getArticles({ category: 'Brands' });

  return (
    <div className="container py-16 md:py-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-bold">Behind the Music</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Deep dives into the stories, inspiration, and creative process behind the songs.
        </p>
      </div>
      
      {brandArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {brandArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border-2 border-dashed border-border/60 rounded-lg">
          <h2 className="text-2xl font-headline">No stories yet.</h2>
          <p className="mt-2 text-muted-foreground">Check back soon for a look behind the curtain.</p>
        </div>
      )}
    </div>
  );
}
