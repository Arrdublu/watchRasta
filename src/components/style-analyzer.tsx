'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { analyzeStyleCompatibility, type AnalyzeStyleCompatibilityOutput } from '@/ai/flows/ai-style-guide-adaptation';
import { UploadCloud, CheckCircle2, XCircle, Wand2 } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

export function StyleAnalyzer() {
  const [image1, setImage1] = useState<{ file: File | null; preview: string | null }>({ file: null, preview: null });
  const [image2, setImage2] = useState<{ file: File | null; preview: string | null }>({ file: null, preview: null });
  const [result, setResult] = useState<AnalyzeStyleCompatibilityOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setImageState: React.Dispatch<React.SetStateAction<{ file: File | null; preview: string | null }>>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageState({ file, preview: URL.createObjectURL(file) });
      setResult(null);
      setError(null);
    }
  };

  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handleAnalyze = async () => {
    if (!image1.file || !image2.file) {
      setError('Please upload two images to compare.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const [image1DataUri, image2DataUri] = await Promise.all([
        toBase64(image1.file),
        toBase64(image2.file),
      ]);
      
      const analysisResult = await analyzeStyleCompatibility({ image1DataUri, image2DataUri });
      setResult(analysisResult);
    } catch (err) {
      console.error(err);
      setError('An error occurred during analysis. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const ImageUploadBox = ({ image, onChange }: { image: { preview: string | null }, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
    <div className="relative w-full aspect-square border-2 border-dashed border-border rounded-lg flex items-center justify-center bg-background/50 hover:border-primary transition-colors">
      {image.preview ? (
        <Image src={image.preview} alt="Watch preview" fill className="object-contain rounded-lg p-2" />
      ) : (
        <div className="text-center text-muted-foreground">
          <UploadCloud className="mx-auto h-12 w-12" />
          <p>Click or drag to upload</p>
        </div>
      )}
      <Input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={onChange} />
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
            <h3 className="font-headline text-2xl">Watch Style 1</h3>
            <ImageUploadBox image={image1} onChange={(e) => handleFileChange(e, setImage1)} />
        </div>
        <div className="space-y-4">
            <h3 className="font-headline text-2xl">Watch Style 2</h3>
            <ImageUploadBox image={image2} onChange={(e) => handleFileChange(e, setImage2)} />
        </div>
      </div>

      <div className="text-center">
        <Button size="lg" onClick={handleAnalyze} disabled={isLoading || !image1.file || !image2.file}>
          {isLoading ? (
            <>
              <Wand2 className="mr-2 h-5 w-5 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-5 w-5" />
              Analyze Compatibility
            </>
          )}
        </Button>
      </div>
      
      {error && <p className="text-destructive text-center">{error}</p>}

      {isLoading && (
         <Card className="bg-secondary/50">
            <CardHeader className="flex flex-row items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                </div>
            </CardHeader>
        </Card>
      )}

      {result && (
        <Card className={`border-2 ${result.isCompatible ? 'border-primary' : 'border-destructive'}`}>
          <CardHeader>
            <CardTitle className="flex items-center">
              {result.isCompatible ? <CheckCircle2 className="mr-2 h-6 w-6 text-primary" /> : <XCircle className="mr-2 h-6 w-6 text-destructive" />}
              Style Analysis Result
            </CardTitle>
            <CardDescription>{result.isCompatible ? "These styles are compatible!" : "These styles might clash."}</CardDescription>
          </CardHeader>
          <CardContent>
            <h4 className="font-bold text-lg mb-2 text-foreground">Reasoning:</h4>
            <p className="text-muted-foreground">{result.reason}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
