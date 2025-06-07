 'use server';

/**
 * @fileOverview Summarizes the content of an existing report using AI.
 *
 * - summarizeReportContent - A function that summarizes report content.
 * - SummarizeReportContentInput - The input type for the summarizeReportContent function.
 * - SummarizeReportContentOutput - The return type for the summarizeReportContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeReportContentInputSchema = z.object({
  reportContent: z.string().describe('The content of the report to summarize.'),
});
export type SummarizeReportContentInput = z.infer<typeof SummarizeReportContentInputSchema>;

const SummarizeReportContentOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the report content.'),
});
export type SummarizeReportContentOutput = z.infer<typeof SummarizeReportContentOutputSchema>;

export async function summarizeReportContent(input: SummarizeReportContentInput): Promise<SummarizeReportContentOutput> {
  return summarizeReportContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeReportContentPrompt',
  input: {schema: SummarizeReportContentInputSchema},
  output: {schema: SummarizeReportContentOutputSchema},
  prompt: `Summarize the following report content in a concise manner:\n\n{{{reportContent}}}`, // Changed from content to reportContent
});

const summarizeReportContentFlow = ai.defineFlow(
  {
    name: 'summarizeReportContentFlow',
    inputSchema: SummarizeReportContentInputSchema,
    outputSchema: SummarizeReportContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
