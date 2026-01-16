'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Briefcase, CircleDollarSign, Users, PlusCircle } from 'lucide-react';
import { useJobs } from '@/contexts/JobsContext';
import { useAccount } from 'wagmi';
import { useMemo } from 'react';
import type { Job } from '@/lib/types';
import { WalletGuard } from '@/components/wallet-guard';

function EmployerDashboard() {
  const { jobs: allJobs, loading } = useJobs();
  const { address } = useAccount();

  const myJobs = useMemo(() => {
    if (!address || !allJobs) return [];
    return allJobs.filter(job => job.userId === address);
  }, [allJobs, address]);
  
  const getStatusVariant = (status: Job['status']) => {
    switch (status) {
      case 'Open': return 'default';
      case 'InProgress': return 'secondary';
      default: return 'outline';
    }
  };

  const activeListings = myJobs.filter(job => job.status === 'Open' || job.status === 'InProgress').length;
  // Placeholder values for total applicants and spent, as this data is not yet fully available
  const totalApplicants = myJobs.reduce((acc, job) => acc + (job.applicants || 0), 0);
  const totalSpent = myJobs.filter(job => job.status === 'Completed').reduce((acc, job) => acc + job.budget, 0);


  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Employer Dashboard</h1>
            <p className="text-muted-foreground">
            Manage your job postings and review applicants.
            </p>
        </div>
        <Link href="/jobs/new">
            <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Post New Job
            </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeListings}</div>
            <p className="text-xs text-muted-foreground">{myJobs.filter(j => j.status === 'Open').length} open, {myJobs.filter(j => j.status === 'InProgress').length} in progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applicants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalApplicants}</div>
            <p className="text-xs text-muted-foreground">(Coming soon)</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSpent.toFixed(2)} ETH</div>
            <p className="text-xs text-muted-foreground">Across {myJobs.filter(job => job.status === 'Completed').length} completed jobs</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Job Postings</CardTitle>
          <CardDescription>
            An overview of all the jobs you have posted.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applicants</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">Loading your jobs...</TableCell>
                </TableRow>
              ) : myJobs.length > 0 ? (
                myJobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">{job.title}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(job.status)}>
                        {job.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{job.applicants || 0}</TableCell>
                    <TableCell>{job.budget} {job.currency}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">View Applicants</Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                 <TableRow>
                  <TableCell colSpan={5} className="text-center">You have not posted any jobs yet.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}


export default function EmployerDashboardPage() {
  return (
    <WalletGuard>
      <EmployerDashboard />
    </WalletGuard>
  );
}
