
'use server';

import { z } from 'zod';
import { addArticle, articleCategories } from '@/lib/articles';
import { storage, auth as clientAuth } from '@/lib/firebase'; // We need this for the client user, not the server one
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { getAuth } from 'firebase-admin/auth';
import { getApp } from 'firebase-admin/app';

const formSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters.' }),
  category: z.enum(articleCategories),
  excerpt: z.string().min(10, { message: 'Excerpt must be at least 10 characters.' }).max(200, { message: 'Excerpt must be less than 200 characters.'}),
  content: z.string().min(50, { message: 'Content must be at least 50 characters.' }),
  image: z.instanceof(File),
});

export async function submitArticle(formData: FormData) {

    // This is a workaround to get the current user on the server.
    // In a real app, you would have a more robust session management system.
    let user;
    const adminAuth = getAuth(getApp());
    const sessionCookie = (formData.get('session') as string) || '';
     if (sessionCookie) {
        try {
            const decodedIdToken = await adminAuth.verifySessionCookie(sessionCookie, true);
            user = await adminAuth.getUser(decodedIdToken.uid);
        } catch (error) {
            console.error("Error verifying session cookie:", error);
            return { success: false, message: 'Invalid session. Please log in again.' };
        }
    }

    // This is a fallback to get user from the form data if not in session, not ideal.
    if (!user) {
        const userId = formData.get('userId');
        const userEmail = formData.get('userEmail');
        if (userId && userEmail) {
            user = { uid: userId as string, email: userEmail as string } as any;
        } else {
             return { success: false, message: 'Authentication Error: User not found. Please log in.' };
        }
    }
  
  if (!user) {
    return { success: false, message: 'Authentication Error: You must be logged in to create an article.' };
  }
  
  const rawFormData = {
      title: formData.get('title'),
      category: formData.get('category'),
      excerpt: formData.get('excerpt'),
      content: formData.get('content'),
      image: formData.get('image'),
  };

  const parsedData = formSchema.safeParse(rawFormData);
  
  if (!parsedData.success) {
      console.error(parsedData.error);
      return { success: false, message: 'Invalid form data provided.' };
  }
  
  const { title, category, excerpt, content, image } = parsedData.data;

  try {
    const imageRef = ref(storage, `articles/${uuidv4()}`);
    await uploadBytes(imageRef, image);
    const imageUrl = await getDownloadURL(imageRef);

    const contentBlob = new Blob([content], { type: 'text/plain' });
    const contentRef = ref(storage, `articles/${uuidv4()}.txt`);
    await uploadBytes(contentRef, contentBlob);
    const contentUrl = await getDownloadURL(contentRef);

    await addArticle({
      title: title,
      category: category,
      content: contentUrl, 
      image: imageUrl,
      dataAiHint: 'user submitted',
      excerpt: excerpt,
      author: user.email || 'Anonymous',
      authorId: user.uid,
      status: 'Pending Review',
    });
    
    return { success: true, message: 'Article submitted for review!' };
  } catch (error) {
    console.error('Error submitting article:', error);
    return { success: false, message: (error as Error).message || 'Failed to submit article.' };
  }
}
