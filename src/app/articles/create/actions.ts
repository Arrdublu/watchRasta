
'use server';

import { z } from 'zod';
import { addArticle } from '@/lib/articles';
import { articleCategories } from '@/lib/article-categories';
import { v4 as uuidv4 } from 'uuid';
import { getDb, getStorage, getAuth } from '@/lib/firebase-admin';
import admin from 'firebase-admin';

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
        const adminAuth = await getAuth();
        const decodedToken = await adminAuth.verifyIdToken(idToken);
        user = decodedToken;
    } catch (error) {
        console.error('Error verifying ID token:', error);
        return { success: false, message: 'Your session has expired. Please log in again to continue.' };
    }


    const adminDb = await getDb();
    if (!adminDb) throw new Error("Database not available");
  
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
  
  const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

  try {
    const articlesCollection = adminDb.collection('articles');
    const existingArticle = await articlesCollection.where('slug', '==', slug).get();
    if (!existingArticle.empty) {
        return { success: false, message: 'An article with this title already exists.' };
    }

    const adminStorage = await getStorage();
    const bucket = adminStorage.bucket();
    
    const imageFileName = `articles/${uuidv4()}-${image.name}`;
    const imageFile = bucket.file(imageFileName);
    const imageBuffer = Buffer.from(await image.arrayBuffer());
    
    const contentFileName = `articles/${uuidv4()}.txt`;
    const contentFile = bucket.file(contentFileName);
    const contentBuffer = Buffer.from(content, 'utf8');

    await Promise.all([
        imageFile.save(imageBuffer, { metadata: { contentType: image.type } }),
        contentFile.save(contentBuffer, { metadata: { contentType: 'text/plain' } })
    ]);

    const getPublicUrl = (fileName: string) => `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileName)}?alt=media`;

    const imageUrl = getPublicUrl(imageFileName);
    const contentUrl = getPublicUrl(contentFileName);

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
    
    console.log(`New article submitted by ${user.email}: "${title}"`);
    return { success: true, message: 'Article submitted for review!' };
  } catch (error) {
    console.error('Error submitting article:', error);
    return { success: false, message: (error as Error).message || 'Failed to submit article.' };
  }
}
