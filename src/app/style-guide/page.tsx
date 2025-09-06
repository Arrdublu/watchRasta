import { StyleAnalyzer } from '@/components/style-analyzer';

export default function StyleGuidePage() {
  return (
    <div className="container py-16 md:py-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-bold">AI Style Guide</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Upload two watch images and let our AI determine if their styles are compatible. Perfect for curating collections or finding your next pair.
        </p>
      </div>
      <StyleAnalyzer />
    </div>
  );
}
