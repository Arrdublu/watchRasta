
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getCollections, type Collection } from '@/lib/collections';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreVertical } from 'lucide-react';
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

const ADMIN_EMAIL = 'watchrasta@gmail.com';

export default function AdminHileavesPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const { toast } = useToast();
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user?.email !== ADMIN_EMAIL) {
      router.push('/');
    } else if (user?.email === ADMIN_EMAIL) {
        const fetchCollections = async () => {
            setIsFetching(true);
            const collectionsFromDb = await getCollections({});
            setCollections(collectionsFromDb);
            setIsFetching(false);
        }
        fetchCollections();
    }
  }, [user, loading, router]);


  const handleStatusChange = (id: string, status: Collection['status']) => {
    // In a real app, you would update this in the database.
    setCollections(collections.map(item => 
      item.id === id ? { ...item, status } : item
    ));
    toast({ title: "Collection Updated", description: `Collection status changed to ${status}.` });
  };

  const handleDelete = (id: string) => {
     // In a real app, you would delete this from the database.
    setCollections(collections.filter(item => item.id !== id));
    toast({ title: "Collection Deleted", description: "The collection has been successfully deleted.", variant: 'destructive' });
  };

  const handleEdit = (id: string) => {
    toast({ title: "Edit Action", description: `Triggered edit for collection ID: ${id}.` });
  }

  const getBadgeVariant = (status: Collection['status']) => {
    switch (status) {
      case 'Published':
        return 'default';
      case 'Draft':
        return 'secondary';
      case 'Archived':
        return 'outline';
      default:
        return 'default';
    }
  }

  if (loading || user?.email !== ADMIN_EMAIL) {
    return <div className="container flex items-center justify-center min-h-[60vh]">Checking authorization...</div>;
  }
  
  if (isFetching) {
    return <div className="container flex items-center justify-center min-h-[60vh]">Loading collections...</div>;
  }

  return (
    <div className="container py-16 md:py-24">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>HiLeaves Collection Management</CardTitle>
           <div className="flex gap-2">
             <Button asChild variant="outline">
                <Link href="/admin">Manage Articles</Link>
             </Button>
              <Button asChild variant="outline">
                <Link href="/admin/products">Manage Products</Link>
             </Button>
           </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {collections.map((collection) => (
                <TableRow key={collection.id}>
                  <TableCell>
                    <Image 
                      src={collection.imageUrl} 
                      alt={collection.title}
                      width={64}
                      height={64}
                      className="rounded-md object-cover h-16 w-16"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{collection.title}</TableCell>
                  <TableCell className="max-w-xs truncate">{collection.description}</TableCell>
                  <TableCell>
                    <Badge variant={getBadgeVariant(collection.status)}>
                      {collection.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEdit(collection.id)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleStatusChange(collection.id, 'Published')}
                          disabled={collection.status === 'Published'}
                        >
                          Publish
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleStatusChange(collection.id, 'Draft')}
                          disabled={collection.status === 'Draft'}
                        >
                          Move to Drafts
                        </DropdownMenuItem>
                         <DropdownMenuItem 
                          onClick={() => handleStatusChange(collection.id, 'Archived')}
                          disabled={collection.status === 'Archived'}
                        >
                          Archive
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleDelete(collection.id)}
                        >
                            Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
