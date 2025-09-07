
'use server';

import { z } from 'zod';
import { addArticle } from '@/lib/articles';
import { articleCategories } from '@/lib/article-categories';
import { storage, auth as clientAuth } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { getAuth } from 'firebase-admin/auth';
import { getDb } from '@/lib/firebase-admin';

const formSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters.' }),
  category: z.enum(articleCategories),
  excerpt: z.string().min(10, { message: 'Excerpt must be at least 10 characters.' }).max(200, { message: 'Excerpt must be less than 200 characters.'}),
  content: z.string().min(50, { message: 'Content must be at least 50 characters.' }),
  image: z.instanceof(File),
});

export async function submitArticle(formData: FormData) {
    const idToken = formData.get('idToken') as string;

    if (!idToken) {
        return { success: false, message: 'Authentication token not provided.' };
    }

    let user;
    try {
        const adminDb = await getDb();
        if (!adminDb) throw new Error("Database not available");
        const adminAuth = getAuth();
        const decodedToken = await adminAuth.verifyIdToken(idToken);
        user = await adminAuth.getUser(decodedToken.uid);
    } catch (error) {
        console.error("Error verifying ID token:", error);
        return { success: false, message: 'Invalid authentication token. Please log in again.' };
    }

    if (!user) {
        return { success: false, message: 'Authentication Error: User not found. Please log in.' };
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
