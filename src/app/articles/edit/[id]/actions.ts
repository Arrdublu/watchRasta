
'use server';

import { z } from 'zod';
import { getArticleById, updateArticle } from '@/lib/articles';
import { articleCategories } from '@/lib/article-categories';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { getAuth } from 'firebase-admin/auth';
import admin from 'firebase-admin';

const formSchema = z.object({
  articleId: z.string(),
  title: z.string().min(5),
  category: z.enum(articleCategories),
  excerpt: z.string().min(10).max(200),
  content: z.string().min(50),
  image: z.instanceof(File).optional(),
  existingImageUrl: z.string().optional(),
});

export async function updateArticleAction(formData: FormData) {
    const idToken = formData.get('idToken') as string;
    if (!idToken) {
        return { success: false, message: 'Authentication token not provided.' };
    }

    try {
        const adminAuth = getAuth(admin.apps[0]!);
        const decodedToken = await adminAuth.verifyIdToken(idToken);
        const user = await adminAuth.getUser(decodedToken.uid);

        if (!user) {
            return { success: false, message: 'Authentication Error: User not found.' };
        }

        const rawData = {
            articleId: formData.get('articleId'),
            title: formData.get('title'),
            category: formData.get('category'),
            excerpt: formData.get('excerpt'),
            content: formData.get('content'),
            image: formData.get('image') || undefined,
            existingImageUrl: formData.get('existingImageUrl') || undefined,
        };

        const parsedData = formSchema.safeParse(rawData);

        if (!parsedData.success) {
            console.error(parsedData.error);
            return { success: false, message: 'Invalid form data.' };
        }

        const { articleId, title, category, excerpt, content, image, existingImageUrl } = parsedData.data;

        const articleToUpdate = await getArticleById(articleId);
        if (!articleToUpdate || articleToUpdate.authorId !== user.uid) {
            return { success: false, message: 'Unauthorized or article not found.' };
        }

        let finalImageUrl = existingImageUrl;
        if (image) {
            const imageRef = ref(storage, `articles/${uuidv4()}`);
            await uploadBytes(imageRef, image);
            finalImageUrl = await getDownloadURL(imageRef);
        }

        const contentBlob = new Blob([content], { type: 'text/plain' });
        const contentRef = ref(storage, `articles/${uuidv4()}.txt`);
        await uploadBytes(contentRef, contentBlob);
        const contentUrl = await getDownloadURL(contentRef);
        
        await updateArticle(articleId, {
            title,
            category,
            excerpt,
            content: contentUrl,
            image: finalImageUrl || '',
            opengraphImage: (finalImageUrl || '').replace('600/400', '1200/630'),
            status: 'Pending Review',
        });

        return { success: true, message: 'Article updated successfully!' };

    } catch (error) {
        console.error('Error updating article:', error);
        return { success: false, message: (error as Error).message || 'Failed to update article.' };
    }
}
