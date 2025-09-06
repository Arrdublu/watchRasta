import { HeroBanner } from '@/components/hero-banner';
import { ArticleCard } from '@/components/article-card';
import { articles } from '@/lib/articles';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  const mainArticle = articles[0];
  const sideArticles = articles.slice(1, 3);
  const lowerArticles = articles.slice(3, 6);

  return (
    <div className="flex flex-col min-h-screen">
      <HeroBanner />
      <section className="container py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-headline font-bold mb-8 text-center">
          Latest News
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {articles.slice(0,3).map((article) => (
                <ArticleCard key={article.id} article={article} />
            ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
             {articles.slice(3,5).map((article) => (
                <ArticleCard key={article.id} article={article} />
            ))}
        </div>

        <div className="text-center mt-12">
            <Link href="/news">
                <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                    View All News
                </Button>
            </Link>
        </div>
      </section>
    </div>
  );
}
