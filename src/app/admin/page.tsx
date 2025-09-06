
'use client';

import { useState, useEffect } from 'react';
import { articles as initialArticles, type Article } from '@/lib/articles';
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

const ADMIN_EMAIL = 'watchrasta@gmail.com';

export default function AdminDashboardPage() {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const { toast } = useToast();
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user?.email !== ADMIN_EMAIL) {
      router.push('/');
    }
  }, [user, loading, router]);


  const handleStatusChange = (id: number, status: Article['status']) => {
    setArticles(articles.map(article => 
      article.id === id ? { ...article, status } : article
    ));
    toast({ title: "Article Updated", description: `Article status changed to ${status}.` });
  };

  const handleDelete = (id: number) => {
    setArticles(articles.filter(article => article.id !== id));
    toast({ title: "Article Deleted", description: "The article has been successfully deleted.", variant: 'destructive' });
  };

  const handleEdit = (id: number) => {
    toast({ title: "Edit Action", description: `Triggered edit for article ID: ${id}.` });
    // In a real app, this would navigate to an edit page e.g. router.push(`/admin/edit/${id}`)
  }

  const getStatusVariant = (status: Article['status']) => {
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
  
  if (loading || user?.email !== ADMIN_EMAIL) {
    return <div className="container flex items-center justify-center min-h-[60vh]">Checking authorization...</div>;
  }

  return (
    <div className="container py-16 md:py-24">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Article Management</CardTitle>
          <Button asChild variant="outline">
            <Link href="/admin/hileaves">Manage HiLeaves</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {articles.map((article) => (
                <TableRow key={article.id} className={article.status === 'Pending Review' ? 'bg-amber-100/10' : ''}>
                  <TableCell className="font-medium">{article.title}</TableCell>
                  <TableCell>{article.category}</TableCell>
                  <TableCell>{article.author}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(article.status)}>
                      {article.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {article.status === 'Pending Review' ? (
                        <div className="flex gap-2">
                           <Button variant="outline" size="sm" onClick={() => handleStatusChange(article.id, 'Published')}>
                               <Check className="h-4 w-4 mr-1" /> Approve
                           </Button>
                           <Button variant="destructive" size="sm" onClick={() => handleDelete(article.id)}>
                               <X className="h-4 w-4 mr-1" /> Reject
                           </Button>
                           <Button variant="ghost" size="icon" asChild>
                               <Link href={`/articles/${article.slug}`} target="_blank"><Eye className="h-4 w-4" /></Link>
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
                        <DropdownMenuItem onClick={() => handleEdit(article.id)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleStatusChange(article.id, 'Published')}
                          disabled={article.status === 'Published'}
                        >
                          Publish
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleStatusChange(article.id, 'Draft')}
                          disabled={article.status === 'Draft'}
                        >
                          Move to Draft
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleDelete(article.id)}
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
