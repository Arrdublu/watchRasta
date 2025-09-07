
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit, Upload } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { getArticleById, updateArticle, articleCategories, Article } from '@/lib/articles';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { Skeleton } from '@/components/ui/skeleton';

const formSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters.' }),
  category: z.enum(articleCategories),
  excerpt: z.string().min(10, { message: 'Excerpt must be at least 10 characters.' }).max(200, { message: 'Excerpt must be less than 200 characters.'}),
  content: z.string().min(50, { message: 'Content must be at least 50 characters.' }),
  image: z.any().optional(),
});

export default function EditArticlePage({ params }: { params: { id: string }}) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [currentArticle, setCurrentArticle] = useState<Article | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      category: 'News',
      excerpt: '',
      content: '',
    },
  });
  
  useEffect(() => {
    async function fetchArticle() {
      if (!params.id) return;
      setIsFetching(true);
      try {
        const article = await getArticleById(params.id);
        if (!article) {
          toast({ title: "Error", description: "Article not found.", variant: 'destructive'});
          router.push('/my-submissions');
          return;
        }

        if (user && article.authorId !== user.uid) {
           toast({ title: "Unauthorized", description: "You don't have permission to edit this article.", variant: 'destructive'});
           router.push('/my-submissions');
           return;
        }
        
        setCurrentArticle(article);

        let content = article.content;
        if (content.startsWith('http')) {
            try {
                const response = await fetch(content, { cache: 'no-store' });
                if (response.ok) {
                    content = await response.text();
                } else {
                     throw new Error('Failed to fetch article content from URL');
                }
            } catch (fetchError) {
                console.error("Error fetching content from URL: ", fetchError);
                content = "Error loading content. Please edit and save to fix.";
            }
        }

        form.reset({
            title: article.title,
            category: article.category,
            excerpt: article.excerpt,
            content: content,
        });

        setImagePreview(article.image);

      } catch (error) {
        console.error(error);
        toast({ title: "Error", description: "Failed to load article data.", variant: 'destructive'});
      } finally {
        setIsFetching(false);
      }
    }
    
    if (user) {
        fetchArticle();
    }
  }, [params.id, user, form, toast, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user || !currentArticle) return;
    
    setIsSubmitting(true);
    
    try {
      let imageUrl = imagePreview; // Keep old image if not changed
      if (imageFile) {
        const imageRef = ref(storage, `articles/${uuidv4()}`);
        await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(imageRef);
      }
      
      const contentBlob = new Blob([values.content], { type: 'text/plain' });
      const contentRef = ref(storage, `articles/${uuidv4()}.txt`);
      await uploadBytes(contentRef, contentBlob);
      const contentUrl = await getDownloadURL(contentRef);

      await updateArticle(params.id, {
        title: values.title,
        category: values.category,
        content: contentUrl,
        image: imageUrl || '',
        opengraphImage: (imageUrl || '').replace('600/400', '1200/630'),
        excerpt: values.excerpt,
        status: 'Pending Review', // Always reset to pending review on edit
      });
      
      toast({
        title: 'Article Updated!',
        description: 'Your changes have been submitted for review.',
      });
      router.push('/my-submissions');
    } catch (error) {
        console.error(error);
        toast({
            title: 'Error',
            description: (error as Error).message || 'Something went wrong. Please try again.',
            variant: 'destructive',
        });
    } finally {
        setIsSubmitting(false);
    }
  }

  if (authLoading || isFetching || !user) {
    return (
        <div className="container py-16 md:py-24">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                    <Skeleton className="h-12 w-12 mx-auto rounded-full" />
                    <Skeleton className="h-10 w-3/4 mx-auto mt-4" />
                    <Skeleton className="h-6 w-1/2 mx-auto mt-4" />
                </div>
                <div className="space-y-8">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-96 w-full" />
                    <div className="text-center">
                        <Skeleton className="h-12 w-40 mx-auto" />
                    </div>
                </div>
            </div>
        </div>
    )
  }

  return (
    <div className="container py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
                <Edit className="mx-auto h-12 w-12 text-primary mb-4" />
                <h1 className="text-4xl md:text-5xl font-headline font-bold">Edit Article</h1>
                <p className="mt-4 text-lg text-muted-foreground">
                    Refine your story and resubmit for review.
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

                    <FormField
                        control={form.control}
                        name="image"
                        render={({ field }) => (
                          <FormItem>
                              <FormLabel>Featured Image</FormLabel>
                              <FormControl>
                                  <div className="relative w-full aspect-video border-2 border-dashed border-border rounded-lg flex items-center justify-center bg-background/50 hover:border-primary transition-colors">
                                      {imagePreview ? (
                                          <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-md"/>
                                      ) : (
                                          <div className="text-center text-muted-foreground">
                                          <Upload className="mx-auto h-12 w-12" />
                                          <p>Click or drag to upload a new image</p>
                                          </div>
                                      )}
                                      <Input id="image" type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => {field.onChange(e.target.files); handleImageChange(e)}} />
                                  </div>
                              </FormControl>
                              <FormMessage />
                          </FormItem>
                        )}
                    />

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
                            {isSubmitting ? 'Resubmitting...' : 'Resubmit for Review'}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    </div>
  );
}

    