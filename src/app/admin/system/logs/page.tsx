import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2 } from 'lucide-react';


export default function AdminLogsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">System Logs</h1>
       <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-4">
            <CardTitle>Event Logs</CardTitle>
            <Select defaultValue="contract">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter logs" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="contract">Contract Logs</SelectItem>
                <SelectItem value="dashboard">Dashboard Logs</SelectItem>
                <SelectItem value="jobs">Jobs Logs</SelectItem>
                <SelectItem value="security">Security Logs</SelectItem>
              </SelectContent>
            </Select>
          </div>
           <Button variant="destructive" size="sm">
            <Trash2 className="mr-2 h-4 w-4" />
            Clear All Logs
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  No logs to display.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
