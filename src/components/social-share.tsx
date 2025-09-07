
'use client';

import { useState, useEffect } from 'react';
import { Twitter, Facebook, Linkedin, Link as LinkIcon, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { cn } from '@/lib/utils';
import { Input } from './ui/input';

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
  ];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    toast({
      title: 'Link Copied!',
      description: 'The article link has been copied to your clipboard.',
    });
  };

  return (
    <div className={cn(className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Share2 className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto">
          <div className="space-y-4">
            <p className="font-semibold text-center">Share this article</p>
            <div className="flex items-center justify-center gap-2">
              {socialLinks.map((social) => (
                <Button
                  key={social.name}
                  variant="outline"
                  size="icon"
                  asChild
                >
                  <a href={social.url} target="_blank" rel="noopener noreferrer">
                    {social.icon}
                    <span className="sr-only">Share on {social.name}</span>
                  </a>
                </Button>
              ))}
            </div>
            <div className="flex space-x-2">
                <Input value={url} readOnly className="h-9"/>
                <Button variant="outline" size="icon" onClick={handleCopyLink} className="h-9 w-9 shrink-0">
                    <LinkIcon className="h-4 w-4" />
                    <span className="sr-only">Copy Link</span>
                </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
