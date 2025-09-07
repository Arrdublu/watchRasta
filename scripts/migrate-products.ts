
// scripts/migrate-products.ts
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase'; // Ensure this path is correct

type Product = {
  collectionId: number;
  title: string;
  description: string;
  price: string;
  imageUrl: string;
  dataAiHint: string;
  status: 'Published' | 'Draft' | 'Pending Review';
  author: string;
  authorId: string;
};

const products: Product[] = [
  // Natural Foods
  {
    collectionId: 1,
    title: 'Organic Honey',
    description: 'Pure, raw honey from wildflower fields.',
    price: '12.99',
    imageUrl: 'https://picsum.photos/400/400',
    dataAiHint: 'organic honey',
    status: 'Published',
    author: 'admin@watchrasta.com',
    authorId: 'admin-uid', // Placeholder UID for seeded data
  },
  {
    collectionId: 1,
    title: 'Sun-Dried Tomatoes',
    description: 'Rich and flavorful tomatoes dried under the Mediterranean sun.',
    price: '8.50',
    imageUrl: 'https://picsum.photos/400/401',
    dataAiHint: 'dried tomatoes',
    status: 'Published',
    author: 'admin@watchrasta.com',
    authorId: 'admin-uid',
  },
  {
    collectionId: 1,
    title: 'Quinoa Grain',
    description: 'A versatile and nutritious ancient grain.',
    price: '15.00',
    imageUrl: 'https://picsum.photos/400/402',
    dataAiHint: 'quinoa grain',
    status: 'Published',
    author: 'admin@watchrasta.com',
    authorId: 'admin-uid',
  },
  // Artisanal Merch
  {
    collectionId: 2,
    title: 'Logo Tee (Black)',
    description: 'Comfortable and stylish, made from 100% organic cotton.',
    price: '25.00',
    imageUrl: 'https://picsum.photos/400/403',
    dataAiHint: 'black t-shirt',
    status: 'Published',
    author: 'admin@watchrasta.com',
    authorId: 'admin-uid',
  },
  {
    collectionId: 2,
    title: '"Celestial Echoes" Vinyl',
    description: 'The new album on a limited edition 180g vinyl.',
    price: '35.00',
    imageUrl: 'https://picsum.photos/400/404',
    dataAiHint: 'vinyl record',
    status: 'Published',
    author: 'admin@watchrasta.com',
    authorId: 'admin-uid',
  },
   {
    collectionId: 2,
    title: 'Embroidered Beanie',
    description: 'Keep warm with this stylish embroidered beanie.',
    price: '20.00',
    imageUrl: 'https://picsum.photos/400/405',
    dataAiHint: 'beanie hat',
    status: 'Published',
    author: 'admin@watchrasta.com',
    authorId: 'admin-uid',
  },
  // Wellness Services
  {
    collectionId: 3,
    title: 'Guided Meditation Session',
    description: 'A 60-minute virtual session to find your inner peace.',
    price: '50.00',
    imageUrl: 'https://picsum.photos/400/406',
    dataAiHint: 'meditation session',
    status: 'Published',
    author: 'admin@watchrasta.com',
    authorId: 'admin-uid',
  },
  {
    collectionId: 3,
    title: 'Yoga Class Pass',
    description: 'Access to any of our live-streamed yoga classes.',
    price: '20.00',
    imageUrl: 'https://picsum.photos/400/407',
    dataAiHint: 'yoga class',
    status: 'Published',
    author: 'admin@watchrasta.com',
    authorId: 'admin-uid',
  },
   // Herbal Teas
  {
    collectionId: 4,
    title: 'Chamomile Blend',
    description: 'A calming and soothing tea for relaxation.',
    price: '10.00',
    imageUrl: 'https://picsum.photos/400/408',
    dataAiHint: 'chamomile tea',
    status: 'Published',
    author: 'admin@watchrasta.com',
    authorId: 'admin-uid',
  },
   {
    collectionId: 4,
    title: 'Ginger Turmeric Zest',
    description: 'An energizing and anti-inflammatory tea blend.',
    price: '10.00',
    imageUrl: 'https://picsum.photos/400/409',
    dataAiHint: 'ginger tea',
    status: 'Published',
    author: 'admin@watchrasta.com',
    authorId: 'admin-uid',
  },
];

async function migrateProducts() {
  const productsCollection = collection(db, 'products');
  console.log('Starting migration...');

  for (const product of products) {
    try {
      await addDoc(productsCollection, product);
      console.log(`Added product: ${product.title}`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Error adding product ${product.title}:`, error);
    }
  }

  console.log('Migration completed.');
}

migrateProducts();
