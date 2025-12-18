'use server';

import { getDb, getStorage, getCurrentUser } from '@/lib/firebase-admin';
import type { Product } from '@/lib/products';

/**
 * MOCK: In a real scenario, this would query a user's payment records.
 * For this demo, we'll assume a user has purchased a few items if they are logged in.
 */
async function getPurchasedProductIds(userId: string): Promise<string[]> {
  const db = await getDb();

  // In a real app using the Stripe extension, this would look like:
  // const paymentsRef = db.collection('customers').doc(userId).collection('payments');
  // const paymentsSnap = await paymentsRef.where('status', '==', 'succeeded').get();
  // const productIds = new Set<string>();
  // for (const doc of paymentsSnap.docs) {
  //   const payment = doc.data();
  //   for (const item of payment.items) {
  //     const price = await item.price.get();
  //     const product = await price.data()?.product.get();
  //     if (product?.id) {
  //       productIds.add(product.id);
  //     }
  //   }
  // }
  // return Array.from(productIds);

  // For demonstration, we'll return a few product IDs.
  // In a real app, you'd replace this with the logic above.
  console.log(`MOCK: Returning sample purchases for user ${userId}`);
  const productsSnap = await db.collection('products').limit(2).get();
  return productsSnap.docs.map(doc => doc.id);
}

export async function getPurchasedProducts(): Promise<Product[]> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('You must be logged in to view your library.');
  }

  const productIds = await getPurchasedProductIds(user.uid);
  if (productIds.length === 0) {
    return [];
  }

  const db = await getDb();
  const productsRef = db.collection('products');
  const productsQuery = await productsRef.where(
    require('firebase-admin').firestore.FieldPath.documentId(),
    'in',
    productIds
  ).get();

  const products: Product[] = productsQuery.docs.map(doc => {
      const data = doc.data();
      return {
          id: doc.id,
          ...data
      } as Product
  });
  
  return products;
}

export async function generateDownloadLink(
  productId: string
): Promise<{ success: boolean; url?: string; message?: string }> {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, message: 'Unauthorized' };
  }

  try {
    const purchasedProductIds = await getPurchasedProductIds(user.uid);
    if (!purchasedProductIds.includes(productId)) {
      return { success: false, message: 'You have not purchased this item.' };
    }
    
    const db = await getDb();
    const productDoc = await db.collection('products').doc(productId).get();
    if (!productDoc.exists) {
        return { success: false, message: 'Product not found.' };
    }
    const productData = productDoc.data() as Product;
    
    // This assumes the product's imageUrl is a gs:// link or a path in the default bucket.
    // Let's create a placeholder path for the secure file.
    const secureFilePath = `protected-media/${productId}.zip`;
    
    const storage = await getStorage();
    const bucket = storage.bucket();

    // Check if the placeholder file exists, if not, create it for the demo.
    const file = bucket.file(secureFilePath);
    const [fileExists] = await file.exists();
    if (!fileExists) {
        console.log(`MOCK: Creating placeholder file for ${secureFilePath}`);
        await file.save(`This is a placeholder for the purchased content of ${productData.title}.`);
    }

    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + 60 * 60 * 1000, // 60 minutes
    });

    return { success: true, url };
  } catch (error) {
    console.error('Error generating download link:', error);
    return { success: false, message: 'Could not generate download link.' };
  }
}
