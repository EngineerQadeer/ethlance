'use client';

import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Briefcase, Wallet, Check, UserCheck, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { useApplications } from '@/contexts/ApplicationsContext';
import { useJobs } from '@/contexts/JobsContext';
import { useAccount } from 'wagmi';

export default function JobDetailPage() {
  const params = useParams();
  const id = params.id as string;
  
  const { jobs: allJobs, loading, refetch } = useJobs();
  const job = allJobs.find((j) => j.id === id);
  
  const { address } = useAccount();
  const { appliedJobIds, applyForJob, isApplying } = useApplications();

  if (loading) {
    // Optionally return a loading skeleton here
    return <div>Loading...</div>;
  }

  // If the job isn't found yet, try a refetch and render a lightweight placeholder instead of a hard 404
  if (!job) {
    // Fire-and-forget refetch to populate latest jobs
    refetch();
    return (
      <div className="p-6">
        <Button asChild variant="ghost" size="sm">
          <Link href="/jobs" className="inline-flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Jobs
          </Link>
        </Button>
        <div className="mt-6 text-muted-foreground">Loading job details...</div>
      </div>
    );
  }
  
  const deadlineDate = format(new Date(job.deadline), 'MMMM d, yyyy');
  const hasApplied = appliedJobIds.has(job.id);
  const isOwner = job.userId === address;

  const handleApply = () => {
    if(hasApplied || isOwner || isApplying) return;
    applyForJob(job.id);
  };

  return (
    <div className="space-y-8">
      <div>
        <Link href="/jobs">
            <Button variant="ghost" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to all jobs
            </Button>
        </Link>
        <div className="flex items-start gap-6">
            <div className={`flex h-20 w-20 items-center justify-center rounded-lg ${job.company.logoBg} flex-shrink-0`}>
                <Image
                    src={job.company.logoUrl}
                    alt={`${job.company.name} logo`}
                    width={60}
                    height={60}
                    className="rounded-md"
                    data-ai-hint="company logo"
                />
            </div>
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{job.title}</h1>
                <p className="text-xl text-muted-foreground">{job.company.name}</p>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-invert max-w-none text-foreground">
              <p>{job.description}</p>
              
              <h3 className="text-foreground">Responsibilities</h3>
              <ul>
                <li>Develop and maintain smart contracts for our DeFi platform.</li>
                <li>Write comprehensive tests to ensure code quality and security.</li>
                <li>Collaborate with the frontend team for dApp integration.</li>
                <li>Participate in code reviews and security audits.</li>
              </ul>
              
              <h3 className="text-foreground">Requirements</h3>
              <ul>
                <li>3+ years of experience with Solidity and the EVM.</li>
                <li>Strong understanding of DeFi principles and smart contract security best practices.</li>
                <li>Proficient with Hardhat or Foundry.</li>
                <li>Experience with deploying contracts to mainnet.</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
                <CardTitle>Job Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                    <Wallet className="h-5 w-5 text-muted-foreground" />
                    <div>
                        <p className="text-sm text-muted-foreground">Budget</p>
                        <p className="font-semibold">{job.budget} {job.currency}</p>
                    </div>
                </div>
                 <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                        <p className="text-sm text-muted-foreground">Deadline</p>
                        <p className="font-semibold">{deadlineDate}</p>
                    </div>
                </div>
                 <div className="flex items-center gap-3">
                    <Briefcase className="h-5 w-5 text-muted-foreground" />
                    <div>
                        <p className="text-sm text-muted-foreground">Location</p>
                        <p className="font-semibold">{job.location}</p>
                    </div>
                </div>
                <Separator />
                <div className="space-y-2">
                    <h4 className="text-sm font-semibold">Categories</h4>
                    <div className="flex flex-wrap gap-2">
                        {job.tags.map((tag) => (
                            <Badge key={tag} variant="secondary">{tag}</Badge>
                        ))}
                    </div>
                </div>
            </CardContent>
          </Card>
          
          <Button size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" onClick={handleApply} disabled={hasApplied || isOwner || isApplying}>
             {isApplying ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Applying...
                </>
             ) : isOwner ? (
                <>
                    <UserCheck className="mr-2 h-4 w-4" />
                    You posted this job
                </>
            ) : hasApplied ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Applied
              </>
            ) : (
              'Apply Now'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
