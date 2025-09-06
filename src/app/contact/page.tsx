'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Mail, Send } from 'lucide-react';
import { useState } from 'react';
import { submitContactForm } from './actions';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
});

export default function ContactPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    const result = await submitContactForm(values);
    if(result.success) {
        toast({
            title: 'Message Sent!',
            description: result.message,
        });
        form.reset();
    } else {
        toast({
            title: 'Error',
            description: result.message || 'Something went wrong. Please try again.',
            variant: 'destructive',
        });
    }
    setIsSubmitting(false);
  }

  return (
    <div className="container py-16 md:py-24">
        <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
                <Mail className="mx-auto h-12 w-12 text-primary mb-4" />
                <h1 className="text-4xl md:text-5xl font-headline font-bold">Get In Touch</h1>
                <p className="mt-4 text-lg text-muted-foreground">
                Have a question or a story to share? We'd love to hear from you.
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                        <Input placeholder="Your Name" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                        <Input type="email" placeholder="your@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                        <Textarea placeholder="Tell us what's on your mind..." className="min-h-[150px]" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <div className="text-center">
                    <Button type="submit" size="lg" disabled={isSubmitting}>
                        <Send className="mr-2 h-5 w-5" />
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>
                </div>
                </form>
            </Form>
        </div>
    </div>
  );
}
