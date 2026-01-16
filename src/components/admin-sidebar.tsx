'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
    LayoutDashboard, 
    Briefcase, 
    FileText, 
    Users, 
    LineChart, 
    DollarSign, 
    Settings,
    ShieldCheck,
    ScrollText,
    PlusCircle,
    Building,
    FileCheck
} from 'lucide-react';
import { Separator } from './ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

const mainNav = [{ href: '/admin', icon: LayoutDashboard, label: 'Dashboard' }];

const jobNav = [
  { href: '/admin/jobs', icon: Briefcase, label: 'All Jobs' },
  { href: '/admin/jobs/new', icon: PlusCircle, label: 'Create Job' },
  { href: '/admin/applications', icon: FileText, label: 'Job Applications' },
];

const userNav = [
  { href: '/admin/users', icon: Users, label: 'All Users' },
  { href: '/admin/users/employers', icon: Building, label: 'Employers' },
];

const analyticsNav = [
  { href: '/admin/analytics', icon: LineChart, label: 'Platform Stats' },
  { href: '/admin/analytics/transactions', icon: DollarSign, label: 'Transactions' },
];

const platformNav = [
  { href: '/admin/system', icon: Settings, label: 'Settings' },
  { href: '/admin/analytics/fees', icon: DollarSign, label: 'Service Fees' },
  { href: '/admin/system/contract-status', icon: FileCheck, label: 'Contract Status' },
  { href: '/admin/system/logs', icon: ScrollText, label: 'System Logs' },
];

export function AdminSidebar() {
  const pathname = usePathname();

  const renderNavLinks = (items: { href: string; icon: React.ElementType; label: string }[]) => {
    return items.map((item) => (
      <Link key={item.href} href={item.href}>
        <Button
          variant={pathname === item.href ? 'default' : 'ghost'}
          className="w-full justify-start pl-8"
        >
          <item.icon className="mr-2 h-4 w-4" />
          {item.label}
        </Button>
      </Link>
    ));
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/admin" className="flex items-center gap-2 font-semibold">
          <ShieldCheck className="h-6 w-6 text-primary" />
          <span>Admin Panel</span>
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto">
        <nav className="grid items-start gap-1 px-4 py-4 text-sm font-medium">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Main</h2>
          {renderNavLinks(mainNav)}
          
          <Accordion type="multiple" className="w-full" defaultValue={['item-1', 'item-2', 'item-3']}>
            <AccordionItem value="item-1" className="border-b-0">
                <AccordionTrigger className="px-4 text-lg font-semibold tracking-tight hover:no-underline">Content & Users</AccordionTrigger>
                <AccordionContent className="space-y-1">
                     {renderNavLinks(jobNav)}
                     {renderNavLinks(userNav)}
                </AccordionContent>
            </AccordionItem>
            
             <AccordionItem value="item-2" className="border-b-0">
                <AccordionTrigger className="px-4 text-lg font-semibold tracking-tight hover:no-underline">Finance & Analytics</AccordionTrigger>
                <AccordionContent className="space-y-1">
                     {renderNavLinks(analyticsNav)}
                </AccordionContent>
            </AccordionItem>

             <AccordionItem value="item-3" className="border-b-0">
                <AccordionTrigger className="px-4 text-lg font-semibold tracking-tight hover:no-underline">Platform</AccordionTrigger>
                <AccordionContent className="space-y-1">
                     {renderNavLinks(platformNav)}
                </AccordionContent>
            </AccordionItem>
          </Accordion>
        </nav>
      </div>
       <div className="mt-auto flex flex-col items-center gap-4 p-4">
        <Separator />
         <Link href="/jobs">
            <Button variant="outline">Back to App</Button>
        </Link>
        <span className='text-sm text-muted-foreground'>v0.1.0-admin</span>
      </div>
    </div>
  );
}
