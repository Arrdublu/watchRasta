import { ArticleCard } from '@/components/article-card';
import { articles } from '@/lib/articles';

export default function LifestylePage() {
  const lifestyleArticles = articles.filter(a => a.category === 'Lifestyle');

  return (
    <div className="container py-16 md:py-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-bold">Watch Lifestyle</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore how timepieces intersect with fashion, adventure, and the art of living well.
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
          <h2 className="text-2xl font-headline">No articles yet.</h2>
          <p className="mt-2 text-muted-foreground">Check back soon for articles on watch lifestyle.</p>
        </div>
      )}
    </div>
  );
}
