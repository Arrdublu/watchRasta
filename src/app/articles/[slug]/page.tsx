
import { getArticleBySlug, articles } from '@/lib/articles';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { ArticleCard } from '@/components/article-card';
import { Clock, User } from 'lucide-react';
import parse, { domToReact, Element } from 'html-react-parser';
import { Embed } from '@/components/embed';
import { Metadata } from 'next';


export function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = getArticleBySlug(params.slug);

  if (!article) {
    return {
      title: 'Article Not Found',
    };
  }

  const url = `/articles/${article.slug}`;

  return {
    title: `${article.title} | watchRasta`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url,
      siteName: 'watchRasta',
      images: [
        {
          url: article.opengraphImage,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
      locale: 'en_US',
      type: 'article',
      authors: [article.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      images: [article.opengraphImage],
    },
  };
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = getArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }
  
  const relatedArticles = articles.filter(a => a.category === article.category && a.id !== article.id).slice(0, 3);
  const options = {
    replace: (domNode: any) => {
        if (domNode instanceof Element && domNode.name === 'iframe') {
            return <Embed iframe={domNode.toString()} />;
        }
        if(domNode instanceof Element) {
            return domToReact(domNode.children, options)
        }
    },
  };

  return (
    <>
      <article className="container max-w-5xl py-12 md:py-20">
        <header className="mb-12 text-center">
          <Badge variant="default" className="mb-4 bg-primary/20 text-primary border-primary/50">{article.category}</Badge>
          <h1 className="text-4xl md:text-6xl font-headline font-bold text-accent leading-tight">
            {article.title}
          </h1>
          <div className="mt-6 flex justify-center items-center gap-6 text-muted-foreground">
              <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{article.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <time dateTime={article.date}>
                    {new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </time>
              </div>
          </div>
        </header>

        <div className="relative w-full h-[40vh] md:h-[70vh] mb-12 rounded-lg overflow-hidden shadow-2xl">
          <Image
            src={article.image.replace('600/400', '1600/900')}
            alt={article.title}
            data-ai-hint={article.dataAiHint}
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="max-w-3xl mx-auto">
            <div 
            className="space-y-6 text-lg text-foreground/90 [&_p]:leading-relaxed [&_h2]:font-headline [&_h2]:text-3xl [&_h2]:mt-12 [&_h2]:mb-4 [&_a]:text-primary hover:[&_a]:underline"
            >
                {parse(article.content, options)}
            </div>
        </div>
      </article>
      
      {relatedArticles.length > 0 && (
        <section className="mt-12 py-20 bg-secondary/30">
            <div className="container">
                <h2 className="text-3xl font-headline font-bold mb-8 text-center">
                    More Stories
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {relatedArticles.map(related => (
                        <ArticleCard key={related.id} article={related} />
                    ))}
                </div>
            </div>
        </section>
      )}
    </>
  );
}
