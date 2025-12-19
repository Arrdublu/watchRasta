
'use client';

import { useState } from 'react';
import { subscribeToNewsletter } from '@/app/newsletter/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export function JoinTheMovement() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const result = await subscribeToNewsletter(email);
    setLoading(false);
    toast({
      title: result.success ? 'Success!' : 'Error',
      description: result.message,
    });
    if (result.success) {
      setEmail('');
    }
  };

  return (
    <div>
      <h3 className="text-lg font-bold">Join the Movement</h3>
      <p className="text-muted-foreground mt-2">Get the latest news and updates from us.</p>
      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Subscribe
        </Button>
      </form>
    </div>
  );
}
