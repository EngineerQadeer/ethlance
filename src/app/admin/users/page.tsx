'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { useJobs } from '@/contexts/JobsContext';
import { useApplications } from '@/contexts/ApplicationsContext';
import { useMemo } from 'react';

export default function AdminUsersPage() {
  const { jobs, loading: jobsLoading } = useJobs();
  const { applications, loading: appsLoading } = useApplications();

  const allUsers = useMemo(() => {
    const userSet = new Set<string>();
    jobs.forEach(job => userSet.add(job.userId));
    applications.forEach(app => userSet.add(app.applicant));
    return Array.from(userSet);
  }, [jobs, applications]);

  const loading = jobsLoading || appsLoading;

  // Placeholder for role logic
  const getRoleForUser = (address: string) => {
    const isEmployer = jobs.some(j => j.userId === address);
    if (isEmployer) return 'Employer';
    const isApplicant = applications.some(a => a.applicant === address);
    if (isApplicant) return 'Applicant';
    return 'User';
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <p className="text-muted-foreground">Found {allUsers.length} unique users who have interacted with the platform.</p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User Address</TableHead>
                <TableHead>Detected Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    Loading users...
                  </TableCell>
                </TableRow>
              ) : allUsers.length > 0 ? (
                allUsers.map(userAddress => (
                  <TableRow key={userAddress}>
                    <TableCell className="font-mono">{userAddress}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{getRoleForUser(userAddress)}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="default">Active</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No users to display.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
