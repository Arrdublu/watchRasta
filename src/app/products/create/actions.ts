
'use server';

import { z } from 'zod';
import { addProduct } from '@/lib/products';
import { v4 as uuidv4 } from 'uuid';
import { getAuth } from 'firebase-admin/auth';
import { getDb, getStorage } from '@/lib/firebase-admin';
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
    
    const adminDb = await getDb();
    if (!adminDb) throw new Error("Database not available");

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

        const productsCollection = adminDb.collection('products');
        const existingProduct = await productsCollection
            .where('title', '==', title)
            .where('collectionId', '==', collectionId)
            .get();
        
        if (!existingProduct.empty) {
            return { success: false, message: 'A product with this name already exists in this collection.' };
        }

        const adminStorage = await getStorage();
        const bucket = adminStorage.bucket();
        
        const imageFileName = `products/${uuidv4()}-${image.name}`;
        const imageFile = bucket.file(imageFileName);
        const imageBuffer = Buffer.from(await image.arrayBuffer());

        await imageFile.save(imageBuffer, { metadata: { contentType: image.type } });

        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(imageFileName)}?alt=media`;

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
