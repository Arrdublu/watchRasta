
'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { type Product } from '@/lib/products';
import { getDb, getAuth } from '@/lib/firebase-admin';

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
});

export async function createProduct(formData: FormData) {
  const idToken = formData.get('idToken') as string;
  if (!idToken) return { success: false, message: 'Unauthorized' };

  try {
    const adminAuth = await getAuth();
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const user = await adminAuth.getUser(decodedToken.uid);

    if (!user.customClaims?.admin) {
        return { success: false, message: 'Unauthorized' };
    }

    const validatedFields = productSchema.safeParse({
        name: formData.get('name'),
        description: formData.get('description'),
    });

    if (!validatedFields.success) {
        return {
        success: false,
        message: validatedFields.error.flatten().fieldErrors,
        };
    }

    const db = await getDb();
    const docRef = await db.collection('products').add({
      ...validatedFields.data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    revalidatePath('/admin/products');
    return { success: true, message: 'Product created successfully', id: docRef.id };
  } catch (error) {
    return { success: false, message: 'Failed to create product' };
  }
}

export async function updateProduct(id: string, formData: FormData) {
  const idToken = formData.get('idToken') as string;
  if (!idToken) return { success: false, message: 'Unauthorized' };

  try {
    const adminAuth = await getAuth();
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const user = await adminAuth.getUser(decodedToken.uid);

    if (!user.customClaims?.admin) {
        return { success: false, message: 'Unauthorized' };
    }

    const validatedFields = productSchema.safeParse({
        name: formData.get('name'),
        description: formData.get('description'),
    });

    if (!validatedFields.success) {
        return {
        success: false,
        message: validatedFields.error.flatten().fieldErrors,
        };
    }

    const db = await getDb();
    await db.collection('products').doc(id).update({
      ...validatedFields.data,
      updatedAt: new Date(),
    });
    revalidatePath('/admin/products');
    return { success: true, message: 'Product updated successfully' };
  } catch (error) {
    return { success: false, message: 'Failed to update product' };
  }
}

export async function deleteProduct(id: string, idToken: string) {
  if (!idToken) return { success: false, message: 'Unauthorized' };
  
  try {
    const adminAuth = await getAuth();
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const user = await adminAuth.getUser(decodedToken.uid);

    // Optional: Check if user is an admin or the owner of the product
    // This logic depends on your specific authorization requirements.
    // For now, we'll just check if the user is authenticated.
    if (!user) {
        return { success: false, message: 'Unauthorized' };
    }

    const db = await getDb();
    await db.collection('products').doc(id).delete();
    revalidatePath('/admin/products');
    revalidatePath('/my-submissions');
    return { success: true, message: 'Product deleted successfully' };
  } catch (error) {
    return { success: false, message: 'Failed to delete product' };
  }
}

export async function updateProductStatus(id: string, status: Product['status'], idToken: string) {
  if (!idToken) return { success: false, message: 'Unauthorized' };

  try {
    const adminAuth = await getAuth();
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const user = await adminAuth.getUser(decodedToken.uid);

     if (!user.customClaims?.admin) {
      return { success: false, message: 'Unauthorized' };
    }

    const db = await getDb();
    await db.collection('products').doc(id).update({ status });
    revalidatePath('/admin/products');
    return { success: true, message: `Product status updated to ${status}` };
  } catch (error) {
    return { success: false, message: 'Failed to update product status' };
  }
}
