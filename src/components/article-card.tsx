
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Bookmark } from 'lucide-react';
import type { Article } from '@/lib/articles';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCollection } from '@/hooks/use-collection';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface ArticleCardProps {
  article: Article;
  className?: string;
}

export function ArticleCard({ article, className }: ArticleCardProps) {
  const { addToCollection, removeFromCollection, isInCollection, isLoaded } = useCollection();
  const { toast } = useToast();

  const isSaved = isInCollection(article.id);

  const handleToggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isSaved) {
      removeFromCollection(article.id);
      toast({ title: 'Removed from Favorites', description: `"${article.title}" removed.` });
    } else {
      addToCollection(article);
      toast({ title: 'Added to Favorites', description: `"${article.title}" saved.` });
    }
  };

  return (
    <div className={cn("group relative overflow-hidden rounded-lg flex flex-col", className)}>
      <Link href={`/articles/${article.slug}`} className="flex flex-col flex-grow">
        <div className="relative aspect-video">
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
          <Image
            src={article.image}
            alt={article.title}
            data-ai-hint={article.dataAiHint}
            fill
            className="object-cover transition-transform duration-500 ease-in-out"
          />
        </div>
        <div className="p-6 text-white flex-grow flex flex-col" style={{backgroundColor: '#050505'}}>
           <Badge variant="default" className="mb-2 bg-primary/80 text-primary-foreground border-primary/50 backdrop-blur-sm self-start">{article.category}</Badge>
          <h3 className="font-headline text-2xl font-bold leading-tight relative inline-block">
            {article.title}
            <span className="absolute bottom-0 left-0 h-0.5 bg-primary w-0 group-hover:w-full transition-all duration-300"></span>
          </h3>
        </div>
      </Link>
      {isLoaded && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-20 text-accent/80 hover:text-accent hover:bg-white/10 rounded-full"
          onClick={handleToggleSave}
        >
          <Bookmark className={cn('h-6 w-6 transition-colors', isSaved ? 'fill-primary text-primary' : '')} />
        </Button>
      )}
    </div>
  );
}
