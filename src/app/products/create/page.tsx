
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Upload } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { addProduct } from '@/lib/products';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getCollections, type Collection } from '@/lib/collections';

const formSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters.' }),
  collectionId: z.coerce.number(),
  description: z.string().min(20, { message: 'Description must be at least 20 characters.' }),
  price: z.coerce.number().positive({ message: 'Price must be a positive number.' }),
  image: z.any().optional(),
});

export default function CreateProductPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { user, loading } = useAuth();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [collections, setCollections] = useState<Collection[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
    
    async function fetchCollections() {
        const publishedCollections = await getCollections({ status: 'Published' });
        setCollections(publishedCollections);
    }
    fetchCollections();
  }, [user, loading, router]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });
  
  useEffect(() => {
    if (collections.length > 0 && !form.getValues('collectionId')) {
        form.setValue('collectionId', collections[0].numericId);
    }
  }, [collections, form]);

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
    if (!user || !user.email) {
        toast({ title: "Authentication Error", description: "You must be logged in to create a product.", variant: "destructive" });
        return;
    }
    
    setIsSubmitting(true);
    
    const imageUrl = imagePreview || 'https://picsum.photos/400/400';

    try {
        await addProduct({
            title: values.title,
            collectionId: values.collectionId,
            description: values.description,
            price: String(values.price),
            imageUrl: imageUrl,
            dataAiHint: 'user submitted product',
            status: 'Pending Review',
            author: user.email,
            authorId: user.uid,
        });
      
        toast({
            title: 'Product Submitted!',
            description: 'Your product has been submitted for review. Thank you!',
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
                <h1 className="text-4xl md:text-5xl font-headline font-bold">Create a New Product</h1>
                <p className="mt-4 text-lg text-muted-foreground">
                    Share your creation with the HiLeaves community.
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Product Name</FormLabel>
                            <FormControl>
                            <Input placeholder="Your product name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="collectionId"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Collection</FormLabel>
                             <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={String(field.value)}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a collection" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {collections.map(collection => (
                                        <SelectItem key={collection.numericId} value={String(collection.numericId)}>{collection.title}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                        )}
                    />

                    <FormItem>
                        <FormLabel>Product Image</FormLabel>
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
                        name="description"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                            <Textarea placeholder="Describe your product..." className="min-h-[200px]" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Price ($)</FormLabel>
                            <FormControl>
                            <Input type="number" step="0.01" placeholder="9.99" {...field} />
                            </FormControl>
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
