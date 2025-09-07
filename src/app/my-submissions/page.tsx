
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { articles as allArticles, type Article } from '@/lib/articles';
import { products as allProducts, type Product } from '@/lib/products';
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
import { collections } from '@/lib/collections';

export default function MySubmissionsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [myArticles, setMyArticles] = useState<Article[]>([]);
  const [myProducts, setMyProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
    if (user?.email) {
      setMyArticles(allArticles.filter(a => a.author === user.email));
      setMyProducts(allProducts.filter(p => p.authorEmail === user.email));
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
    return collections.find(c => c.id === collectionId)?.title || 'Unknown';
  }

  const handleEdit = (type: 'article' | 'product', id: number) => {
    // In a real app, you would navigate to an edit page
    // For now, we'll just show a toast
    toast({ title: "Edit Action", description: `Editing ${type} with ID: ${id}.` });
    // Example navigation:
    // router.push(`/${type}s/edit/${id}`);
  };

  const handleDelete = (type: 'article' | 'product', id: number) => {
    // In a real app, you would make an API call to delete the item
    if (type === 'article') {
        setMyArticles(myArticles.filter(a => a.id !== id));
    } else {
        setMyProducts(myProducts.filter(p => p.id !== id));
    }
    toast({ title: `${type.charAt(0).toUpperCase() + type.slice(1)} Deleted`, description: "The item has been removed.", variant: 'destructive' });
  };


  if (loading || !user) {
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
