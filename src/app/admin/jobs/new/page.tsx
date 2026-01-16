
'use client';
import { CreateJobForm } from '@/components/create-job-form';
import { WalletGuard } from '@/components/wallet-guard';

export default function AdminNewJobPage() {
  return (
    <WalletGuard>
      <div className="space-y-8">
        <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Create New Job Posting (Admin)</h1>
            <p className="text-muted-foreground">
            Fill in the details below to create a new job opportunity as an administrator.
            </p>
        </div>
        <CreateJobForm />
      </div>
    </WalletGuard>
  );
}
