'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { useApplications } from '@/contexts/ApplicationsContext';
import { useJobs } from '@/contexts/JobsContext';
import { JobCard } from '@/components/job-card';
import { Skeleton } from '@/components/ui/skeleton';

function ApplicationsLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  );
}

export default function ApplicationsPage() {
  const { applications, loading: applicationsLoading } = useApplications();
  const { jobs, loading: jobsLoading } = useJobs();

  const loading = applicationsLoading || jobsLoading;

  const appliedJobs = applications
    .map(app => jobs.find(job => job.id === app.jobId))
    .filter(job => job !== undefined);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">My Applications</h1>
        <p className="text-muted-foreground">
          Track the status of all your job applications here.
        </p>
      </div>

      {loading ? (
        <ApplicationsLoadingSkeleton />
      ) : appliedJobs.length > 0 ? (
         <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {appliedJobs.map((job) => (
            job ? <JobCard key={job.id} job={job} /> : null
          ))}
        </div>
      ) : (
        <Card className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border py-24 text-center">
          <CardHeader>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
            <CardTitle className="mt-4">No Applications Yet</CardTitle>
            <CardDescription>
              You haven't applied to any jobs. Start browsing to find your next gig!
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  );
}
