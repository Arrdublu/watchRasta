
'use server';

import { z } from 'zod';
import { addProduct } from '@/lib/products';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { getAuth } from 'firebase-admin/auth';
import admin from 'firebase-admin';

const formSchema = z.object({
  title: z.string().min(5),
  collectionId: z.coerce.number(),
  description: z.string().min(20),
  price: z.coerce.number().positive(),
  image: z.instanceof(File),
});

export async function submitProduct(formData: FormData) {
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
            title: formData.get('title'),
            collectionId: formData.get('collectionId'),
            description: formData.get('description'),
            price: formData.get('price'),
            image: formData.get('image'),
        };

        const parsedData = formSchema.safeParse(rawData);

        if (!parsedData.success) {
            console.error(parsedData.error);
            return { success: false, message: 'Invalid form data.' };
        }

        const { title, collectionId, description, price, image } = parsedData.data;

        const imageRef = ref(storage, `products/${uuidv4()}`);
        await uploadBytes(imageRef, image);
        const imageUrl = await getDownloadURL(imageRef);

        await addProduct({
            title,
            collectionId,
            description,
            price: String(price),
            imageUrl,
            dataAiHint: 'user submitted product',
            status: 'Pending Review',
            author: user.email || 'Anonymous',
            authorId: user.uid,
        });

        return { success: true, message: 'Product submitted for review!' };

    } catch (error) {
        console.error('Error submitting product:', error);
        return { success: false, message: (error as Error).message || 'Failed to submit product.' };
    }
}
