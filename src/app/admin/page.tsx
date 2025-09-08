
'use client';

import { useState, useEffect } from 'react';
import { getArticles, updateArticleStatus, deleteArticle, type Article } from '@/lib/articles';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreVertical, Check, X, Eye, Trash2 } from 'lucide-react';
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
import { ADMIN_EMAIL } from '@/lib/config';
import { DeleteConfirmationDialog } from '@/components/delete-confirmation-dialog';

export default function AdminDashboardPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const { toast } = useToast();
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user?.email !== ADMIN_EMAIL) {
      router.push('/');
    } else if (user?.email === ADMIN_EMAIL) {
      const fetchArticles = async () => {
        setIsFetching(true);
        try {
            const articlesFromDb = await getArticles({});
            setArticles(articlesFromDb);
        } catch (error) {
            toast({ title: "Error fetching articles", description: "Could not load article data.", variant: "destructive" });
        } finally {
            setIsFetching(false);
        }
      }
      fetchArticles();
    }
  }, [user, loading, router, toast]);


  const handleStatusChange = async (id: string, status: Article['status']) => {
    try {
      await updateArticleStatus(id, status);
      setArticles(articles.map(article => 
        article.id === id ? { ...article, status } : article
      ));
      toast({ title: "Article Updated", description: `Article status changed to ${status}.` });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update article status.", variant: 'destructive'});
    }
  };

  const handleDelete = async (id: string) => {
    const result = await deleteArticle(id);
    if (result.success) {
      setArticles(articles.filter(article => article.id !== id));
      toast({ title: "Article Deleted", description: result.message, variant: 'destructive' });
    } else {
       toast({ title: "Error", description: result.message, variant: 'destructive'});
    }
  };

  const handleEdit = (id: string) => {
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
      case 'Rejected':
        return 'destructive';
      default:
        return 'default';
    }
  };
  
  if (loading || user?.email !== ADMIN_EMAIL) {
    return <div className="container flex items-center justify-center min-h-[60vh]">Checking authorization...</div>;
  }
  
  if (isFetching) {
      return <div className="container flex items-center justify-center min-h-[60vh]">Loading articles...</div>;
  }

  return (
    <div className="container py-16 md:py-24">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Article Management</CardTitle>
           <div className="flex gap-2">
             <Button asChild variant="outline">
                <Link href="/admin/hileaves">Manage Collections</Link>
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
                           <Button variant="secondary" size="sm" onClick={() => handleStatusChange(article.id, 'Rejected')}>
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
                        <DropdownMenuSeparator />
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
                        <DropdownMenuItem 
                          onClick={() => handleStatusChange(article.id, 'Rejected')}
                          disabled={article.status === 'Rejected'}
                        >
                          Reject
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DeleteConfirmationDialog 
                          onConfirm={() => handleDelete(article.id)}
                          itemType="article"
                        >
                          <DropdownMenuItem 
                              className="text-destructive"
                              onSelect={(e) => e.preventDefault()}
                          >
                              <Trash2 className="mr-2 h-4 w-4"/>Delete
                          </DropdownMenuItem>
                        </DeleteConfirmationDialog>
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
