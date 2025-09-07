
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Upload } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { addArticle, articleCategories } from '@/lib/articles';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters.' }),
  category: z.enum(articleCategories),
  excerpt: z.string().min(10, { message: 'Excerpt must be at least 10 characters.' }).max(200, { message: 'Excerpt must be less than 200 characters.'}),
  content: z.string().min(50, { message: 'Content must be at least 50 characters.' }),
  image: z.any().optional(),
});

export default function CreateArticlePage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { user, loading } = useAuth();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      category: 'News',
      excerpt: '',
      content: '',
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
        toast({ title: "Authentication Error", description: "You must be logged in to create an article.", variant: "destructive" });
        return;
    }
    
    setIsSubmitting(true);
    
    const imageUrl = imagePreview || 'https://picsum.photos/600/400';

    try {
        await addArticle({
            title: values.title,
            category: values.category,
            content: values.content, 
            image: imageUrl,
            dataAiHint: 'user submitted',
            excerpt: values.excerpt,
            author: user.email || 'Anonymous',
            authorId: user.uid,
            status: 'Pending Review',
        });
      
        toast({
            title: 'Article Submitted!',
            description: 'Your article has been submitted for review. Thank you!',
        });
        router.push('/my-submissions');
    } catch (error) {
        toast({
            title: 'Error',
            description: (error as Error).message || 'Something went wrong. Please try again.',
            variant: 'destructive',
        });
    } finally {
        setIsSubmitting(false);
    }
  }

  if (loading || !user) {
    return <div className="container flex items-center justify-center min-h-[60vh]">Loading...</div>;
  }

  return (
    <div className="container py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
                <PlusCircle className="mx-auto h-12 w-12 text-primary mb-4" />
                <h1 className="text-4xl md:text-5xl font-headline font-bold">Create a New Article</h1>
                <p className="mt-4 text-lg text-muted-foreground">
                    Share your story with the community.
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                            <Input placeholder="Your article title" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Category</FormLabel>
                             <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {articleCategories.map(category => (
                                        <SelectItem key={category} value={category}>{category}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                        )}
                    />

                    <FormItem>
                        <FormLabel>Featured Image</FormLabel>
                        <FormControl>
                            <div className="relative w-full aspect-video border-2 border-dashed border-border rounded-lg flex items-center justify-center bg-background/50 hover:border-primary transition-colors">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-md"/>
                                ) : (
                                    <div className="text-center text-muted-foreground">
                                    <Upload className="mx-auto h-12 w-12" />
                                    <p>Click or drag to upload an image</p>
                                    </div>
                                )}
                                <Input id="image" type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleImageChange} />
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>

                     <FormField
                        control={form.control}
                        name="excerpt"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Excerpt / Subheading</FormLabel>
                            <FormControl>
                            <Textarea placeholder="A short summary for social media and previews..." {...field} />
                            </FormControl>
                             <FormDescription>
                                A brief description of your article (under 200 characters).
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Content</FormLabel>
                            <FormControl>
                            <Textarea placeholder="Write your article here..." className="min-h-[300px]" {...field} />
                            </FormControl>
                            <FormDescription>
                                To embed content (e.g., YouTube, Spotify), paste the full &lt;iframe&gt; embed code directly into the text area.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <div className="text-center">
                        <Button type="submit" size="lg" disabled={isSubmitting}>
                            {isSubmitting ? 'Submitting...' : 'Submit for Review'}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    </div>
  );
}
