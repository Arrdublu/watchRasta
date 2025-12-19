
'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit, Upload } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { getProductById, type Product } from '@/lib/products';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getCollections, type Collection } from '@/lib/collections';
import { Skeleton } from '@/components/ui/skeleton';
import { updateProductAction } from './actions';

const formSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters.' }),
  collectionId: z.coerce.number(),
  description: z.string().min(20, { message: 'Description must be at least 20 characters.' }),
  price: z.coerce.number().positive({ message: 'Price must be a positive number.' }),
  image: z.any().optional(),
});

export default function EditProductPage({ params }: { params: { id: string }}) {
  const { id } = React.use(params);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [collections, setCollections] = useState<Collection[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });
  
  useEffect(() => {
    async function fetchProduct() {
      if (!id) return;
      setIsFetching(true);
      try {
        const [product, availableCollections] = await Promise.all([
            getProductById(id),
            getCollections({ status: 'Published' })
        ]);
        
        setCollections(availableCollections);

        if (!product) {
          toast({ title: "Error", description: "Product not found.", variant: 'destructive'});
          router.push('/my-submissions');
          return;
        }

        if (user && product.authorId !== user.uid) {
           toast({ title: "Unauthorized", description: "You don't have permission to edit this product.", variant: 'destructive'});
           router.push('/my-submissions');
           return;
        }
        
        setCurrentProduct(product);

        form.reset({
            title: product.title,
            collectionId: product.collectionId,
            description: product.description,
            price: Number(product.price),
        });

        setImagePreview(product.imageUrl);

      } catch (error) {
        console.error(error);
        toast({ title: "Error", description: "Failed to load product data.", variant: 'destructive'});
      } finally {
        setIsFetching(false);
      }
    }
    
    if (user) {
        fetchProduct();
    }
  }, [id, user, form, toast, router]);

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
    if (!user || !currentProduct) {
         toast({ title: "Authentication Error", description: "You must be logged in to update a product.", variant: "destructive" });
        return;
    }
    
    setIsSubmitting(true);
    
    try {
        const idToken = await user.getIdToken();
        const formData = new FormData();
        formData.append('idToken', idToken);
        formData.append('productId', currentProduct.id);
        formData.append('title', values.title);
        formData.append('collectionId', String(values.collectionId));
        formData.append('description', values.description);
        formData.append('price', String(values.price));
        if (imageFile) {
            formData.append('image', imageFile);
        } else if (imagePreview) {
            formData.append('existingImageUrl', imagePreview);
        }

        const result = await updateProductAction(formData);
      
        if (result.success) {
            toast({
                title: 'Product Updated!',
                description: 'Your changes have been submitted for review.',
            });
            router.push('/my-submissions');
        } else {
            throw new Error(result.message);
        }
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

  if (isUserLoading || isFetching || !user) {
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
                <h1 className="text-4xl md:text-5xl font-headline font-bold">Edit Product</h1>
                <p className="mt-4 text-lg text-muted-foreground">
                    Refine your product details and resubmit for review.
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
                             <Select onValueChange={(value) => field.onChange(Number(value))} value={String(field.value)}>
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

                    <FormField
                        control={form.control}
                        name="image"
                        render={({ field }) => (
                          <FormItem>
                              <FormLabel>Product Image</FormLabel>
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
                            {isSubmitting ? 'Resubmitting...' : 'Resubmit for Review'}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    </div>
  );
}
