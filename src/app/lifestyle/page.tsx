
import { ArticleCard } from '@/components/article-card';
import { getArticles } from '@/lib/articles';

export default async function LifestylePage() {
  const lifestyleArticles = await getArticles({ category: 'Lifestyle' });

  return (
    <div className="container py-16 md:py-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-bold">Being</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Stories from the road, city spotlights, and life beyond the stage.
        </p>
      </div>
      
      {lifestyleArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {lifestyleArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border-2 border-dashed border-border/60 rounded-lg">
          <h2 className="text-2xl font-headline">No stories yet.</h2>
          <p className="mt-2 text-muted-foreground">Check back soon for tales from the road.</p>
        </div>
      )}
    </div>
  );
}
