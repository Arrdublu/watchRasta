
export type Product = {
  id: number;
  collectionId: number;
  title: string;
  description: string;
  price: string;
  imageUrl: string;
  dataAiHint: string;
};

export const products: Product[] = [
  // Natural Foods
  {
    id: 1,
    collectionId: 1,
    title: 'Organic Honey',
    description: 'Pure, raw honey from wildflower fields.',
    price: '12.99',
    imageUrl: 'https://picsum.photos/400/400',
    dataAiHint: 'organic honey',
  },
  {
    id: 2,
    collectionId: 1,
    title: 'Sun-Dried Tomatoes',
    description: 'Rich and flavorful tomatoes dried under the Mediterranean sun.',
    price: '8.50',
    imageUrl: 'https://picsum.photos/400/401',
    dataAiHint: 'dried tomatoes',
  },
  {
    id: 3,
    collectionId: 1,
    title: 'Quinoa Grain',
    description: 'A versatile and nutritious ancient grain.',
    price: '15.00',
    imageUrl: 'https://picsum.photos/400/402',
    dataAiHint: 'quinoa grain',
  },
  // Artisanal Merch
  {
    id: 4,
    collectionId: 2,
    title: 'Logo Tee (Black)',
    description: 'Comfortable and stylish, made from 100% organic cotton.',
    price: '25.00',
    imageUrl: 'https://picsum.photos/400/403',
    dataAiHint: 'black t-shirt',
  },
  {
    id: 5,
    collectionId: 2,
    title: '"Celestial Echoes" Vinyl',
    description: 'The new album on a limited edition 180g vinyl.',
    price: '35.00',
    imageUrl: 'https://picsum.photos/400/404',
    dataAiHint: 'vinyl record',
  },
   {
    id: 6,
    collectionId: 2,
    title: 'Embroidered Beanie',
    description: 'Keep warm with this stylish embroidered beanie.',
    price: '20.00',
    imageUrl: 'https://picsum.photos/400/405',
    dataAiHint: 'beanie hat',
  },
  // Wellness Services
  {
    id: 7,
    collectionId: 3,
    title: 'Guided Meditation Session',
    description: 'A 60-minute virtual session to find your inner peace.',
    price: '50.00',
    imageUrl: 'https://picsum.photos/400/406',
    dataAiHint: 'meditation session',
  },
  {
    id: 8,
    collectionId: 3,
    title: 'Yoga Class Pass',
    description: 'Access to any of our live-streamed yoga classes.',
    price: '20.00',
    imageUrl: 'https://picsum.photos/400/407',
    dataAiHint: 'yoga class',
  },
   // Herbal Teas
  {
    id: 9,
    collectionId: 4,
    title: 'Chamomile Blend',
    description: 'A calming and soothing tea for relaxation.',
    price: '10.00',
    imageUrl: 'https://picsum.photos/400/408',
    dataAiHint: 'chamomile tea',
  },
   {
    id: 10,
    collectionId: 4,
    title: 'Ginger Turmeric Zest',
    description: 'An energizing and anti-inflammatory tea blend.',
    price: '10.00',
    imageUrl: 'https://picsum.photos/400/409',
    dataAiHint: 'ginger tea',
  },
];

export async function getProductsByCollectionId(collectionId: number) {
  // In a real app, this would be a database call.
  return products.filter((product) => product.collectionId === collectionId);
}

export async function getProductById(id: number) {
    // In a real app, this would be a database call.
    return products.find((product) => product.id === id);
}
