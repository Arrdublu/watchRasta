
export type Collection = {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  dataAiHint: string;
  href: string;
  status: 'Published' | 'Draft' | 'Archived';
};

export const collections: Collection[] = [
  {
    id: 1,
    title: 'Natural Foods',
    description: 'Sourced from the earth, our food collection brings you organic and wholesome products with a rich history.',
    imageUrl: 'https://picsum.photos/800/600',
    dataAiHint: 'natural food',
    href: '/hileaves/1',
    status: 'Published',
  },
  {
    id: 2,
    title: 'Artisanal Merch',
    description: 'Handcrafted merchandise that tells a story. Each piece is unique, reflecting a blend of culture and artistry.',
    imageUrl: 'https://picsum.photos/800/601',
    dataAiHint: 'artisanal merch',
    href: '/hileaves/2',
    status: 'Published',
  },
  {
    id: 3,
    title: 'Wellness Services',
    description: 'Holistic services designed to rejuvenate your mind, body, and soul, rooted in ancient traditions.',
    imageUrl: 'https://picsum.photos/800/602',
    dataAiHint: 'wellness spa',
    href: '/hileaves/3',
    status: 'Published',
  },
  {
    id: 4,
    title: 'Herbal Teas',
    description: 'A curated selection of herbal teas, each with a unique origin story and natural healing properties.',
    imageUrl: 'https://picsum.photos/800/603',
    dataAiHint: 'herbal tea',
    href: '/hileaves/4',
    status: 'Published',
  },
  {
    id: 5,
    title: 'Handmade Crafts',
    description: 'Discover unique crafts handmade by artisans from around the world, preserving traditional techniques.',
    imageUrl: 'https://picsum.photos/800/604',
    dataAiHint: 'handmade craft',
    href: '/hileaves/5',
    status: 'Draft',
  },
  {
    id: 6,
    title: 'Cultural Workshops',
    description: 'Immerse yourself in new experiences with our collection of cultural and artistic workshops.',
    imageUrl: 'https://picsum.photos/800/605',
    dataAiHint: 'art workshop',
    href: '/hileaves/6',
    status: 'Archived',
  },
];

export async function getCollectionById(id: number) {
  // In a real app, this would be a database call.
  return collections.find((collection) => collection.id === id);
}
