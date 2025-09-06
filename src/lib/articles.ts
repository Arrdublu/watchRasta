export type Article = {
  id: number;
  slug: string;
  title: string;
  category: 'Collections' | 'Lifestyle' | 'Brand Spotlights';
  image: string;
  dataAiHint: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
};

export const articles: Article[] = [
  {
    id: 1,
    slug: 'the-timeless-elegance-of-vintage-chronographs',
    title: 'The Timeless Elegance of Vintage Chronographs',
    category: 'Collections',
    image: 'https://picsum.photos/600/400',
    dataAiHint: 'vintage watch',
    excerpt: 'Explore the history and appeal of vintage chronographs, a staple for any serious collector.',
    content: '<p>Delve deep into the world of vintage chronographs. From their military origins to their status as luxury icons, we cover the key models and what makes them tick. We will explore brands like Patek Philippe, Rolex, and Omega...</p><p>The craftsmanship of these timepieces is unparalleled. Each piece tells a story of a bygone era, of precision engineering without the aid of modern technology. The patina on the dial, the wear on the case, all contribute to the unique character of each watch.</p>',
    author: 'John Doe',
    date: '2024-05-15',
  },
  {
    id: 2,
    slug: 'how-to-pair-your-watch-with-any-outfit',
    title: 'How to Pair Your Watch with Any Outfit',
    category: 'Lifestyle',
    image: 'https://picsum.photos/600/401',
    dataAiHint: 'watch outfit',
    excerpt: 'A gentleman\'s guide to watch-pairing. Learn how to match your timepiece with casual, business, and formal wear.',
    content: '<p>A watch is more than a time-telling device; it\'s a statement piece. This guide will help you understand the nuances of watch styles - from divers to dress watches - and how to pair them effectively. We\'ll discuss strap materials, case sizes, and dial colors to ensure you always look your best.</p><p>For business attire, a classic leather strap watch is a safe bet. For a weekend getaway, a rugged field watch or a diver might be more appropriate. And for black-tie events, nothing beats the elegance of a simple, thin dress watch.</p>',
    author: 'Jane Smith',
    date: '2024-05-20',
  },
  {
    id: 3,
    slug: 'a-spotlight-on-audemars-piguet',
    title: 'A Spotlight on Audemars Piguet',
    category: 'Brand Spotlights',
    image: 'https://picsum.photos/600/402',
    dataAiHint: 'luxury watch',
    excerpt: 'Discover the heritage and innovation of Audemars Piguet, one of the holy trinity of Swiss watchmaking.',
    content: '<p>From the iconic Royal Oak to their grand complications, Audemars Piguet has consistently pushed the boundaries of horology. This article explores the brand\'s rich history, its most important models, and its commitment to "breaking the rules".</p><p>We will take a close look at the revolutionary design of the Royal Oak, conceived by Gérald Genta, and how it changed the landscape of luxury sports watches forever. We also examine their modern masterpieces and what the future holds for this legendary manufacture.</p>',
    author: 'Alex Johnson',
    date: '2024-05-25',
  },
  {
    id: 4,
    slug: 'the-art-of-the-dial-a-deep-dive',
    title: 'The Art of the Dial: A Deep Dive',
    category: 'Collections',
    image: 'https://picsum.photos/600/403',
    dataAiHint: 'watch dial',
    excerpt: 'The dial is the face of a watch. We explore various techniques like guilloché, enamel, and meteorite dials.',
    content: '<p>The dial is where artistry meets functionality. This piece celebrates the incredible craftsmanship that goes into creating a watch dial. We explore techniques like hand-turned guilloché, the delicate art of grand feu enamel, and the use of exotic materials like meteorite and mother-of-pearl.</p><p>Understanding these techniques gives a new appreciation for the timepiece on your wrist. It is a miniature canvas that showcases the pinnacle of human skill and creativity.</p>',
    author: 'Chris Lee',
    date: '2024-06-01',
  },
  {
    id: 5,
    slug: 'adventure-ready-the-best-field-watches',
    title: 'Adventure-Ready: The Best Field Watches',
    category: 'Lifestyle',
    image: 'https://picsum.photos/600/404',
    dataAiHint: 'field watch',
    excerpt: 'Looking for a tough, reliable companion for your next adventure? Here are our top picks for field watches.',
    content: '<p>Field watches are born from military history, designed for legibility and durability. This guide reviews the best options on the market, from affordable classics to high-end luxury models. We test them for readability, toughness, and of course, style.</p><p>A good field watch should be simple, robust, and easy to read at a glance. We look at offerings from Hamilton, Tudor, and IWC to see which ones stand up to the test of the great outdoors.</p>',
    author: 'Samantha Bee',
    date: '2024-06-05',
  },
  {
    id: 6,
    slug: 'rolex-submariner-an-icon-revisited',
    title: 'Rolex Submariner: An Icon Revisited',
    category: 'Brand Spotlights',
    image: 'https://picsum.photos/600/405',
    dataAiHint: 'dive watch',
    excerpt: 'The Rolex Submariner is arguably the most famous watch in the world. We look back at its history and enduring legacy.',
    content: '<p>Launched in 1953, the Rolex Submariner set the standard for diver\'s watches. This article traces its evolution from a professional tool to a global status symbol. We cover key reference numbers, design changes, and what makes it so desirable.</p><p>Whether on the wrist of James Bond or a deep-sea explorer, the Submariner has proven its mettle time and time again. Its timeless design and robust construction make it a true icon of the watch world.</p>',
    author: 'Mark O\'Connell',
    date: '2024-06-10',
  },
];

export function getArticleBySlug(slug: string) {
  return articles.find((article) => article.slug === slug);
}
