'use server';
/**
 * @fileOverview An AI flow to help employers create better job postings.
 *
 * - suggestJobDetails - A function that generates job description and category suggestions.
 * - SuggestJobDetailsInput - The input type for the suggestJobDetails function.
 * - SuggestJobDetailsOutput - The return type for the suggestJobDetails function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestJobDetailsInputSchema = z.object({
  jobTitle: z.string().describe('The title of the job.'),
  initialDescription: z
    .string()
    .describe('A short, user-provided description of the job (10+ words).'),
});
export type SuggestJobDetailsInput = z.infer<typeof SuggestJobDetailsInputSchema>;

const SuggestJobDetailsOutputSchema = z.object({
  suggestedDescriptions: z
    .array(z.string())
    .length(2)
    .describe(
      'An array of two distinct, professionally written job descriptions.'
    ),
  suggestedCategories: z
    .array(z.string())
    .max(5)
    .describe('An array of up to 5 relevant skill or category tags for the job.'),
});
export type SuggestJobDetailsOutput = z.infer<
  typeof SuggestJobDetailsOutputSchema
>;

export async function suggestJobDetails(
  input: SuggestJobDetailsInput
): Promise<SuggestJobDetailsOutput> {
  return suggestJobDetailsFlow(input);
}

const suggestJobDetailsPrompt = ai.definePrompt({
  name: 'suggestJobDetailsPrompt',
  input: {schema: SuggestJobDetailsInputSchema},
  output: {schema: SuggestJobDetailsOutputSchema},
  prompt: `You are an expert tech recruiter creating a job post for a web3 company.
Based on the user's job title and initial description, expand it into two distinct, professional job descriptions.
- The first description should be formal and corporate.
- The second description should be more casual and have a startup-like tone.
- Both descriptions must include sections for "Responsibilities" and "Requirements".
- Also, provide a list of 3-5 relevant, single-word technical or skill categories for this job posting.

Job Title: {{{jobTitle}}}
Initial Description: {{{initialDescription}}}`,
});

const suggestJobDetailsFlow = ai.defineFlow(
  {
    name: 'suggestJobDetailsFlow',
    inputSchema: SuggestJobDetailsInputSchema,
    outputSchema: SuggestJobDetailsOutputSchema,
  },
  async input => {
    const {output} = await suggestJobDetailsPrompt(input);
    return output!;
  }
);
