
'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { signOut }from 'firebase/auth';
import { useAuth } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { ArrowRight, BookUser, Heart, Library, LogOut, PlusCircle, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const handleSignOut = async () => {
    try {
        await signOut(auth);
        toast({ title: "Signed out successfully." });
        router.push('/');
    } catch (error) {
        toast({ title: "Error signing out", description: (error as Error).message, variant: "destructive" });
    }
  }

  if (isUserLoading || !user) {
    return <div className="container flex items-center justify-center min-h-[60vh]">Loading profile...</div>;
  }

  return (
    <div className="container py-16 md:py-24">
       <div className="mb-12 text-center">
         <h1 className="text-4xl md:text-5xl font-headline font-bold">My Dashboard</h1>
        <p className="mt-4 text-lg text-muted-foreground">Your personal space to create, collect, and explore.</p>
       </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary">
              <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
              <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl font-headline">{user.displayName || 'Welcome!'}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Button onClick={handleSignOut} variant="destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Log Out
            </Button>
          </CardContent>
        </Card>

        {/* My Submissions */}
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BookUser /> My Submissions</CardTitle>
            <CardDescription>View and manage your articles and products.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline">
              <Link href="/my-submissions">Manage Submissions <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </CardContent>
        </Card>

        {/* My Library */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Library /> My Library</CardTitle>
            <CardDescription>Access your purchased digital goods.</CardDescription>
          </CardHeader>
           <CardContent>
            <Button asChild variant="outline">
              <Link href="/my-library">Go to Library <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </CardContent>
        </Card>

        {/* Favorites */}
         <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Heart /> My Favorites</CardTitle>
            <CardDescription>Your collection of saved articles and stories.</CardDescription>
          </CardHeader>
           <CardContent>
            <Button asChild variant="outline">
              <Link href="/my-favorites">View Favorites <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </CardContent>
        </Card>

        {/* Create */}
        <Card>
          <CardHeader>
            <CardTitle>Create Something New</CardTitle>
            <CardDescription>Share your voice with the community.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
             <Button asChild>
                <Link href="/articles/create"><PlusCircle className="mr-2 h-4 w-4" />Create Article</Link>
            </Button>
             <Button asChild>
                <Link href="/products/create"><ShoppingBag className="mr-2 h-4 w-4" />Create Product</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
