
import { HeroBanner } from '@/components/hero-banner';
import { ArticleCard } from '@/components/article-card';
import { articles, articleCategories } from '@/lib/articles';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

export default function Home() {
  const mainArticle = articles[0];
  const sideArticles = articles.slice(1, 3);
  const lowerArticles = articles.slice(3, 6);

  // Exclude categories that might not be primary navigation items
  const navCategories = articleCategories.filter(c => !['Album Reviews', 'Interviews', 'Tour Diaries', 'Gear'].includes(c));


  return (
    <div className="flex flex-col min-h-screen">
      <HeroBanner />
      
      <section className="container py-16 md:py-24">
        <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-headline font-bold">
              Explore Our Stories
            </h2>
            <p className="mt-2 text-lg text-muted-foreground">Discover articles across all our categories.</p>
             <ScrollArea className="w-full whitespace-nowrap rounded-lg mt-6">
                <div className="flex w-max space-x-4 p-4 justify-center mx-auto">
                    {articleCategories.map(category => (
                        <Button asChild variant="outline" key={category}>
                            <Link href={`/${category.toLowerCase().replace(' & ', '-').replace(/\s+/g, '-')}`}>
                                {category}
                            </Link>
                        </Button>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </div>

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
