
import { CreateJobForm } from '@/components/create-job-form';
import { WalletGuard } from '@/components/wallet-guard';

export default function NewJobPage() {
  return (
    <WalletGuard>
        <div className="space-y-8">
        <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Create New Job Posting</h1>
            <p className="text-muted-foreground">
            Fill in the details below to create a new job opportunity.
            </p>
        </div>
        <CreateJobForm />
        </div>
    </WalletGuard>
  );
}
