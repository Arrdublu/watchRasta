
'use client';

import { useState, useEffect } from 'react';
import { Twitter, Facebook, Linkedin, Link as LinkIcon, Share2, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { cn } from '@/lib/utils';
import { Input } from './ui/input';

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99 0-3.903-.52-5.586-1.457l-6.354 1.654zm.789-21.217c2.169-2.168 5.064-3.344 8.161-3.344 6.162 0 11.156 4.994 11.157 11.157.001 3.055-1.168 5.949-3.288 8.118-2.12 2.17-5.063 3.345-8.16 3.345-1.983 0-3.88-.521-5.548-1.458l.001-.001-5.815 1.514 1.57-5.633c-1.024-1.748-1.566-3.756-1.565-5.823.001-6.162 4.994-11.156 11.157-11.157zm4.453 6.244c-.225-.454-.486-.462-.681-.466-.193-.004-1.12 0-1.12.727s1.12 2.138 1.12 2.254c0 .116-1.12-1.51-1.12-1.51s-2.053-3.486-2.053-3.486c-1.085-1.848-1.085-3.397 0-3.397s2.053 3.486 2.053 3.486l1.12 1.51c.21.282.468.58.681.466s.486-.454 1.12-.454-2.138-1.12-2.254-1.12c-.116 0 1.51 1.12 1.51 1.12s3.486 2.053 3.486 2.053c1.848 1.085 3.397 1.085 3.397 0s-3.486-2.053-3.486-2.053l-1.51-1.12z"/>
    </svg>
)

const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-2.43.03-4.83-.96-6.46-2.99-1.63-2.02-2.06-4.87-1.34-7.44.88-3.09 3.83-5.34 6.92-5.45.02-.45.01-.89.02-1.34.02-2.64-.01-5.28-.01-7.92-.01-1.51.53-3.01 1.62-4.08C7.34 1.16 8.9 0 10.5.02c.67.01 1.34-.01 2.02.02z"/>
    </svg>
)

interface SocialShareProps {
  title: string;
  className?: string;
}

export function SocialShare({ title, className }: SocialShareProps) {
  const [url, setUrl] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  if (!url) {
    return null;
  }

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const socialLinks = [
    {
      name: 'Twitter',
      icon: <Twitter className="h-5 w-5" />,
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      name: 'Facebook',
      icon: <Facebook className="h-5 w-5" />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      name: 'LinkedIn',
      icon: <Linkedin className="h-5 w-5" />,
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
    },
     {
      name: 'WhatsApp',
      icon: <WhatsAppIcon className="h-5 w-5" />,
      url: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
    },
     {
      name: 'Instagram',
      icon: <Instagram className="h-5 w-5" />,
      url: `https://www.instagram.com/watchrasta/`,
    },
     {
      name: 'TikTok',
      icon: <TikTokIcon className="h-5 w-5" />,
      url: `https://www.tiktok.com/@watchrasta`,
    },
  ];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    toast({
      title: 'Link Copied!',
      description: 'The article link has been copied to your clipboard.',
    });
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
        {socialLinks.map((social) => (
            <Button
                key={social.name}
                variant="outline"
                size="icon"
                asChild
            >
                <a href={social.url} target="_blank" rel="noopener noreferrer" aria-label={`Share on ${social.name}`}>
                {social.icon}
                </a>
            </Button>
        ))}
        <Button variant="outline" size="icon" onClick={handleCopyLink} className="h-10 w-10 shrink-0">
            <LinkIcon className="h-5 w-5" />
            <span className="sr-only">Copy Link</span>
        </Button>
    </div>
  );
}
