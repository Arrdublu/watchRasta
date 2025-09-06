'use server';
/**
 * @fileOverview AI style guide adaptation flow.
 *
 * - analyzeStyleCompatibility - A function that analyzes the style compatibility of two watch images.
 * - AnalyzeStyleCompatibilityInput - The input type for the analyzeStyleCompatibility function.
 * - AnalyzeStyleCompatibilityOutput - The return type for the analyzeStyleCompatibility function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeStyleCompatibilityInputSchema = z.object({
  image1DataUri: z
    .string()
    .describe(
      "The first watch image, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  image2DataUri: z
    .string()
    .describe(
      "The second watch image, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeStyleCompatibilityInput = z.infer<typeof AnalyzeStyleCompatibilityInputSchema>;

const AnalyzeStyleCompatibilityOutputSchema = z.object({
  isCompatible: z.boolean().describe('Whether the two watch styles are compatible.'),
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
  prompt: `You are a style guide expert, skilled at determining visual consistencies.

You will receive two images of watches. Your task is to analyze them and determine if their styles are compatible.
Consider the watch band material, the watch face design, the color scheme, and the overall aesthetic.

Based on your analysis, you will set the isCompatible field to true if the styles complement each other and false if they clash.

Provide a detailed reason for your assessment in the reason field.

Image 1: {{media url=image1DataUri}}
Image 2: {{media url=image2DataUri}}`,
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
