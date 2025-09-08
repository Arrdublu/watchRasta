
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getAllProducts, type Product } from '@/lib/products';
import { getCollections, type Collection } from '@/lib/collections';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreVertical, Check, X, Eye } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { updateProductStatus, deleteProduct } from './actions';
import { ADMIN_EMAIL } from '@/lib/config';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const { toast } = useToast();
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user?.email !== ADMIN_EMAIL) {
      router.push('/');
    } else if (user?.email === ADMIN_EMAIL) {
      const fetchAllData = async () => {
        setIsFetching(true);
        try {
            const [allProducts, allCollections] = await Promise.all([
            getAllProducts(),
            getCollections(),
            ]);
            setProducts(allProducts);
            setCollections(allCollections);
        } catch (error) {
            toast({ title: "Error fetching data", description: "Could not load product and collection data.", variant: "destructive" });
        } finally {
            setIsFetching(false);
        }
      };
      fetchAllData();
    }
  }, [user, loading, router, toast]);


  const handleStatusChange = async (id: string, status: Product['status']) => {
    try {
      await updateProductStatus(id, status);
      setProducts(products.map(product => 
        product.id === id ? { ...product, status } : product
      ));
      toast({ title: "Product Updated", description: `Product status changed to ${status}.` });
    } catch (error) {
       toast({ title: "Error", description: "Failed to update product status.", variant: 'destructive'});
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product? This action is permanent.')) return;
     const result = await deleteProduct(id);
     if (result.success) {
      setProducts(products.filter(product => product.id !== id));
      toast({ title: "Product Deleted", description: result.message, variant: 'destructive' });
    } else {
       toast({ title: "Error", description: result.message, variant: 'destructive'});
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/products/edit/${id}`);
  }

  const getStatusVariant = (status: Product['status']) => {
    switch (status) {
      case 'Published':
        return 'default';
      case 'Draft':
        return 'secondary';
      case 'Pending Review':
        return 'outline';
      case 'Rejected':
        return 'destructive';
      default:
        return 'default';
    }
  };
  
  const getCollectionName = (collectionId: number) => {
    return collections.find(c => c.numericId === collectionId)?.title || 'Unknown';
  }

  if (loading || user?.email !== ADMIN_EMAIL) {
    return <div className="container flex items-center justify-center min-h-[60vh]">Checking authorization...</div>;
  }
  
  if (isFetching) {
      return <div className="container flex items-center justify-center min-h-[60vh]">Loading products...</div>;
  }

  return (
    <div className="container py-16 md:py-24">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Product Management</CardTitle>
          <div className="flex gap-2">
             <Button asChild variant="outline">
                <Link href="/admin">Manage Articles</Link>
             </Button>
              <Button asChild variant="outline">
                <Link href="/admin/hileaves">Manage Collections</Link>
             </Button>
           </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Collection</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id} className={product.status === 'Pending Review' ? 'bg-amber-100/10' : ''}>
                  <TableCell>
                    <Image 
                      src={product.imageUrl} 
                      alt={product.title}
                      width={64}
                      height={64}
                      className="rounded-md object-cover h-16 w-16"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{product.title}</TableCell>
                  <TableCell>{product.author}</TableCell>
                  <TableCell>{getCollectionName(product.collectionId)}</TableCell>
                  <TableCell>${product.price}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(product.status)}>
                      {product.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {product.status === 'Pending Review' ? (
                        <div className="flex gap-2">
                           <Button variant="outline" size="sm" onClick={() => handleStatusChange(product.id, 'Published')}>
                               <Check className="h-4 w-4 mr-1" /> Approve
                           </Button>
                           <Button variant="secondary" size="sm" onClick={() => handleStatusChange(product.id, 'Rejected')}>
                               <X className="h-4 w-4 mr-1" /> Reject
                           </Button>
                           <Button variant="ghost" size="icon" asChild>
                               <Link href={`/products/${product.id}`} target="_blank"><Eye className="h-4 w-4" /></Link>
                           </Button>
                        </div>
                    ) : (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEdit(product.id)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleStatusChange(product.id, 'Published')}
                          disabled={product.status === 'Published'}
                        >
                          Publish
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleStatusChange(product.id, 'Draft')}
                          disabled={product.status === 'Draft'}
                        >
                          Move to Draft
                        </DropdownMenuItem>
                         <DropdownMenuItem 
                          onClick={() => handleStatusChange(product.id, 'Rejected')}
                          disabled={product.status === 'Rejected'}
                        >
                          Reject
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleDelete(product.id)}
                        >
                            Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
