export type Article = {
  id: number;
  slug: string;
  title: string;
  category: 'News' | 'Tour Life' | 'Behind the Music';
  image: string;
  dataAiHint: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  status: 'Published' | 'Draft' | 'Pending Review';
};

export const articles: Article[] = [
  {
    id: 1,
    slug: 'new-album-celestial-echoes-out-now',
    title: 'New Album "Celestial Echoes" Out Now',
    category: 'News',
    image: 'https://picsum.photos/600/400',
    dataAiHint: 'album cover',
    excerpt: 'The long-awaited new album from watchRasta, "Celestial Echoes," is available on all streaming platforms.',
    content: '<p>The moment is finally here. "Celestial Echoes" has arrived. This album is a journey through sound, a project years in the making. Thank you to everyone who supported this vision. Go listen, share, and let the music speak.</p><p>Crafted in studios from Kingston to London, the album blends genres and pushes boundaries. It\'s a reflection of my personal journey and the sounds that inspire me. I hope it connects with you.</p>',
    author: 'watchRasta',
    date: '2024-05-15',
    status: 'Published',
  },
  {
    id: 2,
    slug: 'on-the-road-tokyo-diaries',
    title: 'On the Road: Tokyo Diaries',
    category: 'Tour Life',
    image: 'https://picsum.photos/600/401',
    dataAiHint: 'tokyo neon',
    excerpt: 'First stop, Tokyo. The energy, the people, the inspiration. A look inside the first leg of the world tour.',
    content: '<p>Tokyo is a city of beautiful contradictions. The serene temples and the bustling energy of Shibuya. The food, the fashion, the art - it all seeps into the music. The shows have been electric. Feeling the energy from the crowd is something I\'ll never take for granted.</p><p>Between soundchecks and shows, I explored the city\'s hidden gems. Found some incredible vinyl shops and tasted the best ramen of my life. Japan has my heart.</p>',
    author: 'watchRasta',
    date: '2024-05-20',
    status: 'Published',
  },
  {
    id: 3,
    slug: 'the-making-of-rebel-sound',
    title: 'The Making of "Rebel Sound"',
    category: 'Behind the Music',
    image: 'https://picsum.photos/600/402',
    dataAiHint: 'music studio',
    excerpt: 'A look back at the creative process behind the breakout single, "Rebel Sound".',
    content: '<p>"Rebel Sound" started with a simple bassline in a small studio in Kingston. It was raw, it was real. This article breaks down the layers, the lyrics, and the collaboration that brought the track to life.</p><p>We wanted to capture a feeling of defiance and hope. The track features legendary percussionist "Sly" Dunbar, whose contribution was a dream come true. It\'s more than a song; it\'s an anthem.</p>',
    author: 'The Team',
    date: '2024-05-25',
    status: 'Pending Review',
  },
  {
    id: 4,
    slug: 'new-merch-line-released',
    title: 'New Merch Line Released',
    category: 'News',
    image: 'https://picsum.photos/600/403',
    dataAiHint: 't-shirt design',
    excerpt: 'Fresh designs inspired by the new album are now available in the official store.',
    content: '<p>You asked, and we delivered. The new "Celestial Echoes" merch line is here. We worked with some incredible designers to create pieces that reflect the album\'s aesthetic. Hoodies, tees, vinyl, and more.</p><p>Every item is high-quality and ethically sourced. We hope you love it as much as we do. Wear it proud and represent the movement.</p>',
    author: 'The Team',
    date: '2024-06-01',
    status: 'Draft',
  },
  {
    id: 5,
    slug: 'berlin-nights-and-studio-sessions',
    title: 'Berlin Nights and Studio Sessions',
    category: 'Tour Life',
    image: 'https://picsum.photos/600/404',
    dataAiHint: 'berlin graffiti',
    excerpt: 'The European leg of the tour continues. A recap of an unforgettable week in Berlin.',
    content: '<p>Berlin\'s creative energy is unmatched. The history, the art scene, it\'s all so inspiring. We played a sold-out show at Astra Kulturhaus and the vibe was incredible. The love was real.</p><p>I also hit the studio with some amazing local producers to work on new ideas. The city has a sound, and I tried to capture a piece of it. More to come on that soon.</p>',
    author: 'watchRasta',
    date: '2024-06-05',
    status: 'Published',
  },
  {
    id: 6,
    slug: 'lyrical-breakdown-starlight',
    title: 'Lyrical Breakdown: "Starlight"',
    category: 'Behind the Music',
    image: 'https://picsum.photos/600/405',
    dataAiHint: 'starlight sky',
    excerpt: 'Diving deep into the lyrics and meaning of the fan-favorite track, "Starlight".',
    content: '<p>"Starlight" is a song about finding hope in the darkness. It\'s about connection, and the idea that we are all under the same sky, guided by the same stars. This piece explores the inspiration and the double meanings behind the words.</p><p>It was written on a quiet night in the Jamaican countryside, just looking up at the sky. It\'s a reminder to look up, to connect with something bigger than ourselves. It\'s one of the most personal songs on the album.</p>',
    author: 'watchRasta',
    date: '2024-06-10',
    status: 'Published',
  },
];

export function getArticleBySlug(slug: string) {
  return articles.find((article) => article.slug === slug);
}
