
"use client";

import { useState, useEffect } from "react";
import { Twitter, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useFirebase } from "@/firebase";
import { doc, getDoc, DocumentData } from "firebase/firestore";

interface SocialFeed {
  twitter: { id: string }[];
  instagram: { permalink: string }[];
}

export function JoinTheDiscussion() {
  const [socialPosts, setSocialPosts] = useState<SocialFeed | null>(null);
  const firebase = useFirebase();

  useEffect(() => {
    if (!firebase) return;
    const { firestore: db } = firebase;
    const fetchSocialPosts = async () => {
      const docRef = doc(db, "social_feed", "latest");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setSocialPosts(docSnap.data() as SocialFeed);
      }
    };

    fetchSocialPosts();
  }, [firebase]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Join the Discussion</CardTitle>
        <CardDescription>
          Check out the latest buzz and join the conversation on our social
          media channels.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 sm:flex-row">
        {socialPosts?.twitter && (
          <Button asChild>
            <a
              href={`https://twitter.com/i/web/status/${socialPosts.twitter[0].id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Twitter className="mr-2 h-5 w-5" />
              Join on Twitter
            </a>
          </Button>
        )}
        {socialPosts?.instagram && (
          <Button asChild>
            <a
              href={socialPosts.instagram[0].permalink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram className="mr-2 h-5 w-5" />
              Join on Instagram
            </a>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
