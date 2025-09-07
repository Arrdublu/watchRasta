'use server';
/**
 * @fileOverview AI style guide adaptation flow.
 *
 * - analyzeStyleCompatibility - A function that analyzes the style compatibility of two music tracks.
 * - AnalyzeStyleCompatibilityInput - The input type for the analyzeStyleCompatibility function.
 * - AnalyzeStyleCompatibilityOutput - The return type for the analyzeStyleCompatibility function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeStyleCompatibilityInputSchema = z.object({
  track1DataUri: z
    .string()
    .describe(
      "The first track's audio data, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  track2DataUri: z
    .string()
    .describe(
      "The second track's audio data, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeStyleCompatibilityInput = z.infer<typeof AnalyzeStyleCompatibilityInputSchema>;

const AnalyzeStyleCompatibilityOutputSchema = z.object({
  isCompatible: z.boolean().describe('Whether the two track styles are compatible for a playlist or collaboration.'),
  reason: z.string().describe('The reasoning behind the compatibility assessment.'),
});
export type AnalyzeStyleCompatibilityOutput = z.infer<typeof AnalyzeStyleCompatibilityOutputSchema>;

export async function analyzeStyleCompatibility(
  input: AnalyzeStyleCompatibilityInput
): Promise<AnalyzeStyleCompatibilityOutput> {
  return analyzeStyleCompatibilityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeStyleCompatibilityPrompt',
  input: {schema: AnalyzeStyleCompatibilityInputSchema},
  output: {schema: AnalyzeStyleCompatibilityOutputSchema},
  prompt: `You are a music A&R and style expert, skilled at determining sonic and stylistic consistencies.

You will receive two audio files of music tracks. Your task is to analyze them and determine if their styles are compatible.
Consider the genre, tempo, instrumentation, mood, and overall aesthetic.

Based on your analysis, you will set the isCompatible field to true if the styles complement each other for a playlist or collaboration, and false if they clash.

Provide a detailed reason for your assessment in the reason field.

Track 1: {{media url=track1DataUri}}
Track 2: {{media url=track2DataUri}}`,
});

const analyzeStyleCompatibilityFlow = ai.defineFlow(
  {
    name: 'analyzeStyleCompatibilityFlow',
    inputSchema: AnalyzeStyleCompatibilityInputSchema,
    outputSchema: AnalyzeStyleCompatibilityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
