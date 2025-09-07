
// scripts/migrate-data.ts
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const collectionsData = [
  {
    numericId: 1,
    title: 'Natural Foods',
    description: 'Sourced from the earth, our food collection brings you organic and wholesome products with a rich history.',
    imageUrl: 'https://picsum.photos/800/600',
    dataAiHint: 'natural food',
    href: '/hileaves/1',
    status: 'Published',
  },
  {
    numericId: 2,
    title: 'Artisanal Merch',
    description: 'Handcrafted merchandise that tells a story. Each piece is unique, reflecting a blend of culture and artistry.',
    imageUrl: 'https://picsum.photos/800/601',
    dataAiHint: 'artisanal merch',
    href: '/hileaves/2',
    status: 'Published',
  },
  {
    numericId: 3,
    title: 'Wellness Services',
    description: 'Holistic services designed to rejuvenate your mind, body, and soul, rooted in ancient traditions.',
    imageUrl: 'https://picsum.photos/800/602',
    dataAiHint: 'wellness spa',
    href: '/hileaves/3',
    status: 'Published',
  },
  {
    numericId: 4,
    title: 'Herbal Teas',
    description: 'A curated selection of herbal teas, each with a unique origin story and natural healing properties.',
    imageUrl: 'https://picsum.photos/800/603',
    dataAiHint: 'herbal tea',
    href: '/hileaves/4',
    status: 'Published',
  },
  {
    numericId: 5,
    title: 'Handmade Crafts',
    description: 'Discover unique crafts handmade by artisans from around the world, preserving traditional techniques.',
    imageUrl: 'https://picsum.photos/800/604',
    dataAiHint: 'handmade craft',
    href: '/hileaves/5',
    status: 'Draft',
  },
  {
    numericId: 6,
    title: 'Cultural Workshops',
    description: 'Immerse yourself in new experiences with our collection of cultural and artistic workshops.',
    imageUrl: 'https://picsum.photos/800/605',
    dataAiHint: 'art workshop',
    href: '/hileaves/6',
    status: 'Archived',
  },
];


const productsData = [
  {
    collectionId: 1,
    title: 'Organic Honey',
    description: 'Pure, raw honey from wildflower fields.',
    price: '12.99',
    imageUrl: 'https://picsum.photos/400/400',
    dataAiHint: 'organic honey',
    status: 'Published',
    author: 'admin@watchrasta.com',
    authorId: 'admin-uid',
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

async function migrateData() {
  // Migrate Collections
  const collectionsCollection = collection(db, 'collections');
  console.log('Starting collection migration...');
  for (const collectionData of collectionsData) {
    try {
      await addDoc(collectionsCollection, {
          ...collectionData,
          createdAt: serverTimestamp()
      });
      console.log(`Added collection: ${collectionData.title}`);
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`Error adding collection ${collectionData.title}:`, error);
    }
  }
  console.log('Collection migration completed.');

  // Migrate Products
  const productsCollection = collection(db, 'products');
  console.log('Starting product migration...');
  for (const product of productsData) {
    try {
      await addDoc(productsCollection, {
          ...product,
          createdAt: serverTimestamp(),
      });
      console.log(`Added product: ${product.title}`);
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`Error adding product ${product.title}:`, error);
    }
  }
  console.log('Product migration completed.');
}

migrateData();
