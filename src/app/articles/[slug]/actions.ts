
'use server';

import { z } from 'zod';
import { addComment } from '@/lib/comments';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/firebase';
import { User } from 'firebase/auth';

const formSchema = z.object({
  content: z.string().min(1, { message: 'Comment cannot be empty.' }),
  articleId: z.string(),
  slug: z.string(),
});

export async function submitComment(values: z.infer<typeof formSchema>) {
  const user = auth.currentUser;

  if (!user) {
    return { success: false, message: 'You must be logged in to comment.' };
  }

  const parsedData = formSchema.safeParse(values);

  if (!parsedData.success) {
    return { success: false, message: 'Invalid comment data.' };
  }

  try {
    await addComment({
      articleId: parsedData.data.articleId,
      content: parsedData.data.content,
      authorId: user.uid,
      authorName: user.displayName || user.email || 'Anonymous',
      authorAvatar: user.photoURL,
    });

    revalidatePath(`/articles/${parsedData.data.slug}`);
    return { success: true, message: 'Comment posted successfully!' };
  } catch (error) {
    console.error('Error posting comment:', error);
    return { success: false, message: 'Failed to post comment.' };
  }
}
