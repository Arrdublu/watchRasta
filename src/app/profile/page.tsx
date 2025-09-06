
'use client';

import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    try {
        await signOut(auth);
        toast({ title: "Signed out successfully." });
        router.push('/');
    } catch (error) {
        toast({ title: "Error signing out", description: (error as Error).message, variant: "destructive" });
    }
  }

  if (loading || !user) {
    return <div className="container flex items-center justify-center min-h-[60vh]">Loading profile...</div>;
  }

  return (
    <div className="container py-16 md:py-24">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <Avatar className="mx-auto h-24 w-24 mb-4 border-2 border-primary">
              <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
              <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-3xl font-headline">{user.displayName || 'Welcome!'}</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <p className="text-muted-foreground">{user.email}</p>
            
            <p>This is your profile page. More features like updating your profile details will be added soon!</p>
            
            <Button onClick={handleSignOut} variant="destructive">
              Log Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
