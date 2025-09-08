
'use server';

import { z } from 'zod';
import { getArticleById, updateArticle } from '@/lib/articles';
import { articleCategories } from '@/lib/article-categories';
import { v4 as uuidv4 } from 'uuid';
import { getAuth } from 'firebase-admin/auth';
import { getStorage } from '@/lib/firebase-admin';
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

        const adminStorage = await getStorage();
        const bucket = adminStorage.bucket();
        const getPublicUrl = (fileName: string) => `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileName)}?alt=media`;

        let finalImageUrl = existingImageUrl;
        if (image) {
            const imageFileName = `articles/${uuidv4()}-${image.name}`;
            const imageFile = bucket.file(imageFileName);
            const imageBuffer = Buffer.from(await image.arrayBuffer());
            await imageFile.save(imageBuffer, { metadata: { contentType: image.type } });
            finalImageUrl = getPublicUrl(imageFileName);
        }

        const contentFileName = `articles/${uuidv4()}.txt`;
        const contentFile = bucket.file(contentFileName);
        const contentBuffer = Buffer.from(content, 'utf8');
        await contentFile.save(contentBuffer, { metadata: { contentType: 'text/plain' } });
        const contentUrl = getPublicUrl(contentFileName);
        
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
