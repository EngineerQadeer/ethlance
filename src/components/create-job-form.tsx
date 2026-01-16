
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Info, PlusCircle, Trash2, UploadCloud, Sparkles, Wand2, Loader2, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Slider } from './ui/slider';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAccount, useWriteContract } from 'wagmi';
import { parseEther } from 'viem';
import JobContract from '@/lib/JobContract.json';
import { suggestJobDetails, SuggestJobDetailsOutput } from '@/ai/flows/suggest-job-details';
import { JobStorage } from '@/lib/job-storage';
import React from 'react';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

const formSchema = z.object({
  organizationName: z.string().min(2, 'Organization name is required.'),
  jobTitle: z.string().min(5, 'Job title must be at least 5 characters long.'),
  jobDescription: z.string().min(20, 'Description must be at least 20 characters long.'),
  jobType: z.enum(['FullTime', 'PartTime', 'Contract', 'Freelance', 'Internship']),
  workMode: z.enum(['Remote', 'OnSite', 'Hybrid']),
  budget: z.coerce.number().positive('Budget must be a positive number.'),
  categories: z.array(z.string()).min(1, "Please select at least one category."),
  deadline: z.string().refine((val) => !isNaN(Date.parse(val)), {message: "Invalid date"}),
  logoIpfsCid: z.string().optional(), // For now, we'll make this optional
});

type FormValues = z.infer<typeof formSchema>;

export function CreateJobForm() {
  const { toast } = useToast();
  const router = useRouter();
  const { address } = useAccount();
  const { writeContract, isPending, error } = useWriteContract();

  const [isAiLoading, setIsAiLoading] = React.useState(false);
  const [aiSuggestions, setAiSuggestions] = React.useState<SuggestJobDetailsOutput | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      organizationName: '',
      jobTitle: '',
      jobDescription: '',
      jobType: 'FullTime',
      workMode: 'Remote',
      budget: '' as any,
      categories: [],
      deadline: '',
      logoIpfsCid: '',
    },
  });

  const jobTitle = form.watch('jobTitle');
  const jobDescription = form.watch('jobDescription');

  const canSuggest = jobTitle.length >= 5 && jobDescription.split(' ').length >= 10;

  const handleGenerateSuggestions = async () => {
    setIsAiLoading(true);
    setAiSuggestions(null);
    try {
      const suggestions = await suggestJobDetails({
        jobTitle: form.getValues('jobTitle'),
        initialDescription: form.getValues('jobDescription'),
      });
      setAiSuggestions(suggestions);
    } catch (error) {
      console.error('AI suggestion failed:', error);
      toast({
        variant: 'destructive',
        title: 'AI Suggestion Failed',
        description: 'Could not generate suggestions. Please try again.',
      });
    } finally {
      setIsAiLoading(false);
    }
  };

  const onSubmit = async (values: FormValues) => {
    const jobTypeEnum = ['FullTime', 'PartTime', 'Internship', 'Freelance', 'Contract'];
    const workModeEnum = ['Remote', 'OnSite', 'Hybrid'];
    const mockLogoCid = "QmXo2D8dsgt19A1d5W4f29kAmH2t2s5a5d8e3f4g6h7i8j"; // Placeholder

    // Create a temporary job object for immediate storage
    const tempJob = {
      id: `temp_${Date.now()}`,
      title: values.jobTitle,
      company: {
        name: values.organizationName,
        logoUrl: `https://picsum.photos/seed/${values.organizationName}/100/100`,
        logoBg: 'bg-indigo-500',
        logoIpfsCid: values.logoIpfsCid || mockLogoCid,
      },
      description: values.jobDescription,
      budget: values.budget,
      currency: 'ETH' as const,
      deadline: new Date(values.deadline).toISOString(),
      tags: values.categories,
      postedAt: new Date().toISOString(),
      location: values.workMode,
      status: 'Open' as const,
      userId: address || '',
      applicants: 0,
    };

    // Store job in Firebase immediately for persistence
    try {
      await JobStorage.storeJob(tempJob);
    } catch (error) {
      console.error('Failed to store job in Firebase:', error);
      // Continue with contract creation even if Firebase fails
    }

    writeContract({
        abi: JobContract.abi,
        address: CONTRACT_ADDRESS,
        functionName: 'createJob',
        args: [
            values.organizationName,
            values.jobTitle,
            values.jobDescription,
            parseEther(values.budget.toString()),
            jobTypeEnum.indexOf(values.jobType),
            workModeEnum.indexOf(values.workMode),
            BigInt(new Date(values.deadline).getTime() / 1000),
            values.categories,
            values.logoIpfsCid || mockLogoCid
        ]
    }, {
        onSuccess: (txHash) => {
            toast({
                title: 'Transaction Submitted',
                description: `Your job has been submitted to the blockchain. Transaction: ${txHash}`,
            });
            router.push('/jobs');
        },
        onError: (err) => {
            toast({
                variant: 'destructive',
                title: 'Transaction Failed',
                description: err.message,
            });
        }
    })
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Service Fee: 0%</AlertTitle>
          <AlertDescription>
            There is currently no service fee to post a job. This may change in the future.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle>Company & Job Details</CardTitle>
            <CardDescription>Start with the basics about your organization and the role.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
             <FormField control={form.control} name="organizationName" render={({ field }) => (
                <FormItem>
                <FormLabel>Organization Name*</FormLabel>
                <FormControl><Input placeholder="e.g., ChainSecure" {...field} /></FormControl>
                <FormMessage />
                </FormItem>
            )} />
             <FormField control={form.control} name="jobTitle" render={({ field }) => (
                <FormItem>
                <FormLabel>Job Title*</FormLabel>
                <FormControl><Input placeholder="e.g., Senior Solidity Developer" {...field} /></FormControl>
                <FormMessage />
                </FormItem>
            )} />
             <FormField control={form.control} name="jobDescription" render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Job Description*</FormLabel>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleGenerateSuggestions}
                      disabled={!canSuggest || isAiLoading}
                    >
                      {isAiLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Sparkles className="mr-2 h-4 w-4" />
                      )}
                      AI Suggestions
                    </Button>
                  </div>
                  <FormControl>
                      <Textarea placeholder="Describe the role, responsibilities, and requirements... (min. 10 words for AI suggestions)" {...field} rows={8} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
            )} />

            {isAiLoading && <div className="text-center">Generating suggestions...</div>}
            
            {aiSuggestions && (
              <Card className="bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-lg">AI Suggestions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Choose a Description:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {aiSuggestions.suggestedDescriptions.map((desc, i) => (
                        <Card key={i} className="hover:bg-background cursor-pointer" onClick={() => form.setValue('jobDescription', desc)}>
                          <CardContent className="p-4 text-sm line-clamp-3">
                            {desc}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Suggested Categories:</h4>
                    <div className="flex flex-wrap gap-2">
                      {aiSuggestions.suggestedCategories.map(cat => (
                        <Badge key={cat} variant="secondary" className="cursor-pointer" onClick={() => {
                          const currentCategories = form.getValues('categories');
                          if (!currentCategories.includes(cat)) {
                            form.setValue('categories', [...currentCategories, cat]);
                          }
                        }}>
                          {cat}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

             <FormItem>
                <FormLabel>Company Logo</FormLabel>
                <FormControl>
                    <div className="flex items-center gap-4">
                        <Input type="file" className="flex-1" disabled />
                        <Button type="button" variant="outline" disabled><UploadCloud className="mr-2"/> Upload</Button>
                    </div>
                </FormControl>
                <FormDescription>IPFS integration for file uploads is coming soon.</FormDescription>
            </FormItem>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Role Configuration</CardTitle>
                <CardDescription>Define the terms and conditions for this position.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                 <FormField control={form.control} name="deadline" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Application Deadline</FormLabel>
                    <FormControl>
                        <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField control={form.control} name="jobType" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Job Type</FormLabel>
                             <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select job type" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="FullTime">Full-Time</SelectItem>
                                    <SelectItem value="PartTime">Part-Time</SelectItem>
                                    <SelectItem value="Contract">Contract</SelectItem>
                                    <SelectItem value="Freelance">Freelance</SelectItem>
                                    <SelectItem value="Internship">Internship</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="workMode" render={({ field }) => (
                         <FormItem>
                            <FormLabel>Work Mode</FormLabel>
                             <Select onValuechange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select work arrangement" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="Remote">Remote</SelectItem>
                                    <SelectItem value="OnSite">On-Site</SelectItem>
                                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                                </SelectContent>
                            </Select>
                             <FormDescription>Select the preferred working arrangement</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )} />
                </div>
                 <FormField control={form.control} name="budget" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Budget (ETH)</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g. 10.5" {...field} step="0.01" /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Job Categorization</CardTitle>
                <CardDescription>Select up to 5 categories that best describe this job. You can also add suggested categories from the AI.</CardDescription>
            </CardHeader>
            <CardContent>
                <FormField
                    control={form.control}
                    name="categories"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input 
                                    placeholder='Enter categories, comma separated'
                                    value={field.value.join(', ')}
                                    onChange={(e) => {
                                        const categories = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                                        field.onChange(categories);
                                    }} 
                                />
                            </FormControl>
                             <FormDescription>e.g. Solidity, Frontend, DeFi</FormDescription>
                            <div className="flex flex-wrap gap-2 pt-2">
                                {field.value.map((category) => (
                                    <Badge variant="secondary" key={category} className="flex items-center gap-1">
                                        {category}
                                        <button type="button" onClick={() => field.onChange(field.value.filter(c => c !== category))} className="text-muted-foreground hover:text-foreground">
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
            <Button type="button" variant="ghost" onClick={() => router.back()} disabled={isPending}>Cancel</Button>
            <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Post Job
            </Button>
        </div>
      </form>
    </Form>
  );
}

function X(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}
