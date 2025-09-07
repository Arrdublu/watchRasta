
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getAllProducts, type Product } from '@/lib/products';
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
import { collections } from '@/lib/collections';

const ADMIN_EMAIL = 'watchrasta@gmail.com';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const { toast } = useToast();
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user?.email !== ADMIN_EMAIL) {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchProducts = async () => {
      const allProducts = await getAllProducts();
      setProducts(allProducts);
    };
    fetchProducts();
  }, []);


  const handleStatusChange = (id: string, status: Product['status']) => {
    setProducts(products.map(product => 
      product.id === id ? { ...product, status } : product
    ));
    toast({ title: "Product Updated", description: `Product status changed to ${status}.` });
  };

  const handleDelete = (id: string) => {
    setProducts(products.filter(product => product.id !== id));
    toast({ title: "Product Deleted", description: "The product has been successfully deleted.", variant: 'destructive' });
  };

  const handleEdit = (id: string) => {
    toast({ title: "Edit Action", description: `Triggered edit for product ID: ${id}.` });
  }

  const getStatusVariant = (status: Product['status']) => {
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

  if (loading || user?.email !== ADMIN_EMAIL) {
    return <div className="container flex items-center justify-center min-h-[60vh]">Checking authorization...</div>;
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
                           <Button variant="destructive" size="sm" onClick={() => handleDelete(product.id)}>
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
