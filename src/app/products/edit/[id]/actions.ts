
'use server';

import { z } from 'zod';
import { getProductById, updateProduct } from '@/lib/products';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { getAuth } from 'firebase-admin/auth';
import admin from 'firebase-admin';

const formSchema = z.object({
    productId: z.string(),
    title: z.string().min(5),
    collectionId: z.coerce.number(),
    description: z.string().min(20),
    price: z.coerce.number().positive(),
    image: z.instanceof(File).optional(),
    existingImageUrl: z.string().optional(),
});

export async function updateProductAction(formData: FormData) {
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
            productId: formData.get('productId'),
            title: formData.get('title'),
            collectionId: formData.get('collectionId'),
            description: formData.get('description'),
            price: formData.get('price'),
            image: formData.get('image') || undefined,
            existingImageUrl: formData.get('existingImageUrl') || undefined,
        };

        const parsedData = formSchema.safeParse(rawData);

        if (!parsedData.success) {
            console.error(parsedData.error);
            return { success: false, message: 'Invalid form data.' };
        }
        
        const { productId, title, collectionId, description, price, image, existingImageUrl } = parsedData.data;

        const productToUpdate = await getProductById(productId);
        if (!productToUpdate || productToUpdate.authorId !== user.uid) {
            return { success: false, message: 'Unauthorized or product not found.' };
        }

        let finalImageUrl = existingImageUrl;
        if (image) {
            const imageRef = ref(storage, `products/${uuidv4()}`);
            await uploadBytes(imageRef, image);
            finalImageUrl = await getDownloadURL(imageRef);
        }

        await updateProduct(productId, {
            ...productToUpdate,
            title,
            collectionId,
            description,
            price: String(price),
            imageUrl: finalImageUrl || '',
            status: 'Pending Review',
        });

        return { success: true, message: 'Product updated successfully!' };

    } catch (error) {
        console.error('Error updating product:', error);
        return { success: false, message: (error as Error).message || 'Failed to update product.' };
    }
}
