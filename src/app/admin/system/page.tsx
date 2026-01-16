import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

export default function AdminSystemSettingsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>Manage platform security settings and job approval workflows.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <Label htmlFor="require-verification" className="text-base font-medium">Require User Verification</Label>
              <p className="text-sm text-muted-foreground">
                If enabled, users must be verified before they can post jobs.
              </p>
            </div>
            <Switch id="require-verification" />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <Label htmlFor="auto-approve-jobs" className="text-base font-medium">Auto-Approve Jobs</Label>
              <p className="text-sm text-muted-foreground">
                If enabled, new job postings will be approved automatically.
              </p>
            </div>
            <Switch id="auto-approve-jobs" defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>System</CardTitle>
          <CardDescription>Configure core system parameters and platform status.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="max-job-duration">Maximum Job Duration (days)</Label>
            <Input id="max-job-duration" type="number" defaultValue="30" className="max-w-xs" />
            <p className="text-sm text-muted-foreground">
                The maximum number of days a job can be active before expiring.
            </p>
          </div>
          <Separator />
           <div className="flex items-center justify-between rounded-lg border border-destructive/50 bg-destructive/10 p-4">
            <div>
              <Label htmlFor="maintenance-mode" className="text-base font-medium text-destructive">Maintenance Mode</Label>
              <p className="text-sm text-muted-foreground">
                Temporarily disable the entire platform for users. Admins will still have access.
              </p>
            </div>
            <Switch id="maintenance-mode" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Manage system-wide notification settings.</CardDescription>
        </CardHeader>
        <CardContent>
           <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <Label htmlFor="system-notifications" className="text-base font-medium">System Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Enable or disable all system-wide email notifications.
              </p>
            </div>
            <Switch id="system-notifications" defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
