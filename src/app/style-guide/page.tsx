import { StyleAnalyzer } from '@/components/style-analyzer';

export default function StyleGuidePage() {
  return (
    <div className="container py-16 md:py-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-bold">AI Track Analyzer</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Upload two tracks and let our AI determine if their styles are compatible. Perfect for creating playlists or finding your next collab.
        </p>
      </div>
      <StyleAnalyzer />
    </div>
  );
}
