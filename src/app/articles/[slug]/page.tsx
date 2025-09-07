
import { getArticleBySlug, getArticles } from '@/lib/articles';
import { getCommentsByArticleId } from '@/lib/comments';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { ArticleCard } from '@/components/article-card';
import { CommentSection } from '@/components/comment-section';
import { Clock, User } from 'lucide-react';
import parse from 'html-react-parser';
import { Embed } from '@/components/embed';
import { Element } from 'html-react-parser';
import { SocialShare } from '@/components/social-share';

async function getArticleData(slug: string) {
    const article = await getArticleBySlug(slug);
    if (!article) return { article: null, content: null, relatedArticles: [], comments: [] };

    let content = article.content;
    if (article.content.startsWith('http')) {
        try {
            const proxyUrl = article.content.replace('https://firebasestorage.googleapis.com', '/api/gcs');
            const response = await fetch(proxyUrl, { cache: 'no-store' });
            if (response.ok) {
                content = await response.text();
            } else {
                console.error("Failed to fetch article content:", response.statusText);
                content = "<p>Error: Could not load article content.</p>";
            }
        } catch (error) {
             console.error("Error fetching article content:", error);
             content = "<p>Error: Could not load article content.</p>";
        }
    }

    const [relatedArticles, comments] = await Promise.all([
      getArticles({ category: article.category, limit: 4 }),
      getCommentsByArticleId(article.id)
    ]);
    
    const filteredRelated = relatedArticles
        .filter(a => a.id !== article.id)
        .slice(0, 3);
    
    return { article, content, relatedArticles: filteredRelated, comments };
}


export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const { article, content, relatedArticles, comments } = await getArticleData(params.slug);

  if (!article || !content) {
    notFound();
  }
  
  const options = {
    replace: (domNode: any) => {
        if (domNode instanceof Element && domNode.name === 'iframe') {
            return <Embed iframe={domNode.toString()} />;
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
          <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">{article.excerpt}</p>
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
              <SocialShare title={article.title} />
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
            className="prose dark:prose-invert prose-lg max-w-none space-y-6 text-foreground/90 [&_p]:leading-relaxed [&_h2]:font-headline [&_h2]:text-3xl [&_h2]:mt-12 [&_h2]:mb-4 [&_a]:text-primary hover:[&_a]:underline"
            >
                {parse(content, options)}
            </div>
            <hr className="my-12" />
            <CommentSection articleId={article.id} articleSlug={article.slug} comments={comments} />
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
