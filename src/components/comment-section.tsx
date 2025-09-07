
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Send } from 'lucide-react';
import { useState } from 'react';
import { submitComment } from '@/app/articles/[slug]/actions';
import { useAuth } from '@/contexts/auth-context';
import type { Comment as CommentType } from '@/lib/comments';
import { Comment } from './comment';
import Link from 'next/link';

const formSchema = z.object({
  content: z.string().min(1, { message: "Comment cannot be empty." }),
});

interface CommentSectionProps {
    articleId: string;
    articleSlug: string;
    comments: CommentType[];
}

export function CommentSection({ articleId, articleSlug, comments }: CommentSectionProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    const result = await submitComment({ ...values, articleId, slug: articleSlug }, user);
    if(result.success) {
        toast({
            title: 'Comment Posted!',
            description: result.message,
        });
        form.reset();
    } else {
        toast({
            title: 'Error',
            description: result.message || 'Something went wrong.',
            variant: 'destructive',
        });
    }
    setIsSubmitting(false);
  }

  return (
    <div className="space-y-8">
        <h3 className="text-2xl font-bold font-headline">Leave a Comment</h3>
        { user ? (
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Textarea placeholder="Share your thoughts..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <div className="flex justify-end">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Posting...' : <><Send className="mr-2 h-4 w-4" />Post Comment</>}
                        </Button>
                    </div>
                </form>
            </Form>
        ) : (
            <div className="text-center p-8 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">You must be logged in to leave a comment.</p>
                <Button asChild variant="link" className="mt-2">
                    <Link href="/login">Login or Sign Up</Link>
                </Button>
            </div>
        )}
        <div className="space-y-8">
            <h3 className="text-2xl font-bold font-headline">{comments.length} {comments.length === 1 ? "Comment" : "Comments"}</h3>
            {comments.length > 0 ? (
                comments.map(comment => <Comment key={comment.id} comment={comment} />)
            ) : (
                <p className="text-muted-foreground">Be the first to comment.</p>
            )}
        </div>
    </div>
  );
}
