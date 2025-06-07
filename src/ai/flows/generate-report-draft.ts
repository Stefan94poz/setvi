'use server';

/**
 * @fileOverview A flow for generating a draft report based on a user-provided prompt.
 *
 * - generateReportDraft - A function that handles the report draft generation process.
 * - GenerateReportDraftInput - The input type for the generateReportDraft function.
 * - GenerateReportDraftOutput - The return type for the generateReportDraft function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateReportDraftInputSchema = z.object({
  prompt: z
    .string()
    .describe('The prompt to use for generating the report draft.'),
});
export type GenerateReportDraftInput = z.infer<typeof GenerateReportDraftInputSchema>;

const GenerateReportDraftOutputSchema = z.object({
  reportDraft: z.string().describe('The generated report draft.'),
});
export type GenerateReportDraftOutput = z.infer<typeof GenerateReportDraftOutputSchema>;

export async function generateReportDraft(input: GenerateReportDraftInput): Promise<GenerateReportDraftOutput> {
  return generateReportDraftFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateReportDraftPrompt',
  input: {schema: GenerateReportDraftInputSchema},
  output: {schema: GenerateReportDraftOutputSchema},
  prompt: `You are an AI assistant that generates report drafts based on user prompts.  Generate a detailed report draft based on the following prompt: {{{prompt}}}`,
});

const generateReportDraftFlow = ai.defineFlow(
  {
    name: 'generateReportDraftFlow',
    inputSchema: GenerateReportDraftInputSchema,
    outputSchema: GenerateReportDraftOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
