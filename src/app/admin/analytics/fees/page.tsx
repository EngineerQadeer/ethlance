
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useReadContract, useWriteContract } from 'wagmi';
import JobContract from '@/lib/JobContract.json';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { WalletGuard } from '@/components/wallet-guard';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

function ServiceFeeManager() {
  const [newFee, setNewFee] = useState('');
  const { toast } = useToast();

  const { data: currentFee, isLoading: isFeeLoading, refetch } = useReadContract({
    abi: JobContract.abi,
    address: CONTRACT_ADDRESS,
    functionName: 'serviceFeePercent',
  });

  const { writeContract, isPending } = useWriteContract();

  const handleUpdateFee = () => {
    const feeValue = parseFloat(newFee);
    if (isNaN(feeValue) || feeValue < 0 || feeValue > 100) {
      toast({
        variant: 'destructive',
        title: 'Invalid Fee Percentage',
        description: 'Please enter a number between 0 and 100.',
      });
      return;
    }
    
    // The contract expects the fee in basis points (1% = 100), so we multiply by 100
    const feeInBasisPoints = Math.round(feeValue * 100);

    writeContract({
      abi: JobContract.abi,
      address: CONTRACT_ADDRESS,
      functionName: 'setServiceFee',
      args: [BigInt(feeInBasisPoints)],
    }, {
      onSuccess: (txHash) => {
        toast({
          title: 'Transaction Submitted',
          description: `The service fee is being updated on the blockchain. Transaction: ${txHash}`,
        });
        setNewFee('');
        // We can refetch the fee after a short delay to allow the transaction to be mined
        setTimeout(() => refetch(), 5000); 
      },
      onError: (err) => {
        console.error('Service fee update error:', err);
        toast({
          variant: 'destructive',
          title: 'Update Failed',
          description: err.message || 'Failed to update service fee. Please check your wallet connection and try again.',
        });
      }
    });
  };
  
  // The contract stores fees in basis points, so we divide by 100 to display as a percentage
  const displayFee = currentFee !== undefined ? (Number(currentFee) / 100).toFixed(2) : '0.00';

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Service Fee Management</h1>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Current Service Fee</CardTitle>
          <div className="text-5xl font-bold pt-2">
            {isFeeLoading ? <Loader2 className="h-10 w-10 animate-spin" /> : `${displayFee}%`}
          </div>
        </CardHeader>
        <CardContent>
            <CardDescription>
                This is the percentage deducted from the total budget upon successful job completion. The fee is stored in basis points in the contract (e.g., 2.5% is stored as 250).
            </CardDescription>
        </CardContent>
      </Card>
       <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Update Service Fee</CardTitle>
          <CardDescription>Enter a new fee percentage below. This will affect all future transactions.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="fee">New fee percentage</Label>
                <Input 
                  id="fee" 
                  type="number" 
                  placeholder="e.g., 2.5" 
                  value={newFee}
                  onChange={(e) => setNewFee(e.target.value)}
                  disabled={isPending}
                />
            </div>
        </CardContent>
        <CardFooter>
            <Button onClick={handleUpdateFee} disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Fee
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function AdminServiceFeesPage() {
  return (
    <WalletGuard>
      <ServiceFeeManager />
    </WalletGuard>
  );
}
