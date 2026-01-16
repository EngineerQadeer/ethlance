import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import Link from 'next/link';

export default function AdminJobApplicationsPage() {
  return (
    <div className="space-y-8">
       <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Job Applications</h1>
                <p className="text-muted-foreground">Review and manage applications.</p>
            </div>
            <Button>View All Applications</Button>
       </div>
      <Card className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border py-24 text-center">
          <CardHeader>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
            <CardTitle className="mt-4">No Job Selected</CardTitle>
            <CardDescription>
              Please select a job from the jobs list to view its applications.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <Link href="/admin/jobs">
                <Button>Go to Jobs List</Button>
            </Link>
          </CardContent>
        </Card>
    </div>
  );
}
