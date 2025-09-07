
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { getArticles, deleteArticle, type Article } from '@/lib/articles';
import { getProductsByAuthorId, deleteProduct, type Product } from '@/lib/products';
import { getCollections, type Collection } from '@/lib/collections';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreVertical, Edit, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from '@/hooks/use-toast';

export default function MySubmissionsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [myArticles, setMyArticles] = useState<Article[]>([]);
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }
    if (user?.uid) {
      const fetchSubmissions = async () => {
        setIsFetching(true);
        const [userArticles, userProducts, allCollections] = await Promise.all([
            getArticles({ authorId: user.uid }),
            getProductsByAuthorId(user.uid),
            getCollections(),
        ]);
        setMyArticles(userArticles);
        setMyProducts(userProducts);
        setCollections(allCollections);
        setIsFetching(false);
      }
      fetchSubmissions();
    }
  }, [user, loading, router]);
  
  const getStatusVariant = (status: Article['status'] | Product['status']) => {
    switch (status) {
      case 'Published':
        return 'default';
      case 'Draft':
        return 'secondary';
      case 'Pending Review':
        return 'outline';
      default:
        return 'default';
    }
  };

  const getCollectionName = (collectionId: number) => {
    return collections.find(c => c.numericId === collectionId)?.title || 'Unknown';
  }

  const handleEdit = (type: 'article' | 'product', id: string) => {
    toast({ title: "Edit Action", description: `Editing ${type} with ID: ${id}.` });
    // router.push(`/${type}s/edit/${id}`);
  };

  const handleDelete = async (type: 'article' | 'product', id: string) => {
    try {
        if (type === 'article') {
            await deleteArticle(id);
            setMyArticles(myArticles.filter(a => a.id !== id));
        } else {
            await deleteProduct(id);
            setMyProducts(myProducts.filter(p => p.id !== id));
        }
        toast({ title: `${type.charAt(0).toUpperCase() + type.slice(1)} Deleted`, description: "The item has been removed.", variant: 'destructive' });
    } catch (error) {
         toast({ title: `Error deleting ${type}`, description: "There was a problem removing the item.", variant: 'destructive' });
    }
  };


  if (loading || !user) {
    return <div className="container flex items-center justify-center min-h-[60vh]">Loading...</div>;
  }
  
  if (isFetching) {
    return <div className="container flex items-center justify-center min-h-[60vh]">Loading your submissions...</div>;
  }

  return (
    <div className="container py-16 md:py-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-bold">My Submissions</h1>
        <p className="mt-4 text-lg text-muted-foreground">Track and manage your created articles and products.</p>
      </div>
      <div className="space-y-12">
        <Card>
            <CardHeader>
                <CardTitle>My Articles</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {myArticles.length > 0 ? myArticles.map((article) => (
                            <TableRow key={article.id}>
                                <TableCell className="font-medium">{article.title}</TableCell>
                                <TableCell>{article.category}</TableCell>
                                <TableCell>
                                    <Badge variant={getStatusVariant(article.status)}>{article.status}</Badge>
                                </TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent>
                                        <DropdownMenuItem onClick={() => handleEdit('article', article.id)}><Edit className="mr-2 h-4 w-4"/>Edit</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleDelete('article', article.id)} className="text-destructive"><Trash2 className="mr-2 h-4 w-4"/>Delete</DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow><TableCell colSpan={4} className="text-center h-24">You haven't submitted any articles yet.</TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>My Products</CardTitle>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Collection</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {myProducts.length > 0 ? myProducts.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell className="font-medium">{product.title}</TableCell>
                                <TableCell>{getCollectionName(product.collectionId)}</TableCell>
                                <TableCell>${product.price}</TableCell>
                                <TableCell>
                                    <Badge variant={getStatusVariant(product.status)}>{product.status}</Badge>
                                </TableCell>
                                <TableCell>
                                     <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent>
                                        <DropdownMenuItem onClick={() => handleEdit('product', product.id)}><Edit className="mr-2 h-4 w-4"/>Edit</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleDelete('product', product.id)} className="text-destructive"><Trash2 className="mr-2 h-4 w-4"/>Delete</DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow><TableCell colSpan={5} className="text-center h-24">You haven't submitted any products yet.</TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
