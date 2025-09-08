'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { type Product } from '@/lib/products';
import { getDb, getCurrentUser } from '@/lib/firebase-admin';

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  // Add other fields as necessary
});

export async function createProduct(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || !user.customClaims?.admin) {
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

  try {
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
  const user = await getCurrentUser();
  if (!user || !user.customClaims?.admin) {
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

  try {
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

export async function deleteProduct(id: string) {
  const user = await getCurrentUser();
  if (!user || !user.customClaims?.admin) {
    return { success: false, message: 'Unauthorized' };
  }
  
  try {
    const db = await getDb();
    await db.collection('products').doc(id).delete();
    revalidatePath('/admin/products');
    return { success: true, message: 'Product deleted successfully' };
  } catch (error) {
    return { success: false, message: 'Failed to delete product' };
  }
}

export async function updateProductStatus(id: string, status: Product['status']) {
  const user = await getCurrentUser();
  if (!user || !user.customClaims?.admin) {
    return { success: false, message: 'Unauthorized' };
  }

  try {
    const db = await getDb();
    await db.collection('products').doc(id).update({ status });
    revalidatePath('/admin/products');
    return { success: true, message: `Product status updated to ${status}` };
  } catch (error) {
    return { success: false, message: 'Failed to update product status' };
  }
}
