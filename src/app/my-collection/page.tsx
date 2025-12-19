'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getPurchasedProducts, generateDownloadLink } from './actions';
import type { Product } from '@/lib/products';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';

export default function MyCollectionPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  const [purchasedItems, setPurchasedItems] = useState<Product[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
      return;
    }
    if (user) {
      const fetchPurchases = async () => {
        setIsFetching(true);
        try {
          const items = await getPurchasedProducts();
          setPurchasedItems(items);
        } catch (error) {
          toast({
            title: 'Error fetching library',
            description: (error as Error).message,
            variant: 'destructive',
          });
        } finally {
          setIsFetching(false);
        }
      };
      fetchPurchases();
    }
  }, [user, isUserLoading, router, toast]);

  const handleDownload = async (productId: string) => {
    if (!user) return;
    setIsDownloading(productId);
    try {
      const result = await generateDownloadLink(productId);
      if (result.success && result.url) {
        // Open the URL in a new tab to trigger download
        window.open(result.url, '_blank');
        toast({
          title: 'Download starting!',
          description: 'Your download should begin shortly.',
        });
      } else {
        throw new Error(result.message || 'Could not generate download link.');
      }
    } catch (error) {
      toast({
        title: 'Download Failed',
        description: (error as Error).message,
        variant: 'destructive',
      });
    } finally {
      setIsDownloading(null);
    }
  };

  if (isUserLoading || !user) {
    return <div className="container flex items-center justify-center min-h-[60vh]">Loading...</div>;
  }

  return (
    <div className="container py-16 md:py-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-bold">My Collection</h1>
        <p className="mt-4 text-lg text-muted-foreground">Your collection of purchased digital goods.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>My Purchases</CardTitle>
        </CardHeader>
        <CardContent>
          {isFetching ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-16 w-16 rounded-md" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : purchasedItems.length > 0 ? (
            <div className="space-y-4">
              {purchasedItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-4">
                     <Image src={item.imageUrl} alt={item.title} width={64} height={64} className="rounded-md object-cover h-16 w-16" />
                     <div>
                        <h3 className="font-semibold">{item.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">{item.description}</p>
                     </div>
                  </div>
                  <Button
                    onClick={() => handleDownload(item.id)}
                    disabled={isDownloading === item.id}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    {isDownloading === item.id ? 'Generating...' : 'Download'}
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 border-2 border-dashed rounded-lg">
                <h2 className="text-xl font-semibold">Your library is empty.</h2>
                <p className="mt-2 text-muted-foreground">Purchased items will appear here.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
