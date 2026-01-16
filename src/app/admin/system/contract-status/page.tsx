import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function AdminContractStatusPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Smart Contract Status</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Contract Information</CardTitle>
          <CardDescription>Details about the deployed main contract.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Contract Address</span>
            <span className="font-mono text-sm">Not available</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Owner Address</span>
            <span className="font-mono text-sm">Not available</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Status</CardTitle>
           <CardDescription>Live status and balance of the contract.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Connection Status</span>
            <span className="text-destructive font-semibold">Disconnected</span>
          </div>
          <Separator />
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Contract Balance</span>
            <span className="font-bold text-lg">0 ETH</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
