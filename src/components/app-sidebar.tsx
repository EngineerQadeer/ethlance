'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Briefcase, FileText, PlusCircle, Search, Building, ShieldCheck, Menu, X, LogIn, UserPlus, Shield, Info, Mail, FileText as PrivacyIcon } from 'lucide-react';
import { Separator } from './ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useState } from 'react';
import { StorageStatus } from './storage-status';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

const navItems = [
  { href: '/jobs', icon: Search, label: 'Browse Jobs', roles: ['Guest', 'Candidate', 'Employer', 'Admin'] },
  { href: '/applications', icon: FileText, label: 'My Applications', roles: ['Candidate'] },
  { href: '/employer', icon: Building, label: 'Employer Dashboard', roles: ['Employer'] },
];

const footerItems = [
  { href: '/login', icon: LogIn, label: 'Login', roles: ['Guest'] },
  { href: '/signup', icon: UserPlus, label: 'Sign Up', roles: ['Guest'] },
  { href: '/about', icon: Info, label: 'About Us', roles: ['Guest', 'Candidate', 'Employer', 'Admin'] },
  { href: '/contact', icon: Mail, label: 'Contact Us', roles: ['Guest', 'Candidate', 'Employer', 'Admin'] },
  { href: '/privacy', icon: PrivacyIcon, label: 'Privacy Policy', roles: ['Guest', 'Candidate', 'Employer', 'Admin'] },
];

interface AppSidebarProps {
  onLinkClick?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function AppSidebar({ onLinkClick, isCollapsed = false, onToggleCollapse }: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const { isConnected } = useAccount();
  const userRole = user ? user.role : 'Guest';

  const handleLinkClick = () => {
    if (onLinkClick) {
      onLinkClick();
    }
  };

  const handlePostJob = () => {
    if (!isConnected) {
      // Show wallet connection requirement
      return;
    }
    router.push('/jobs/new');
    handleLinkClick();
  };

  const filteredNavItems = navItems.filter(item => item.roles.includes(userRole));
  const filteredFooterItems = footerItems.filter(item => item.roles.includes(userRole));

  return (
    <TooltipProvider>
      <div className="flex h-full flex-col">
        {/* Header with only toggle button */}
        <div className="flex h-16 items-center justify-center border-b px-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleCollapse}
                className="shrink-0"
              >
                <Menu className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}</p>
            </TooltipContent>
          </Tooltip>
        </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        <nav className="grid items-start gap-1 px-4 py-4 text-sm font-medium">
          {filteredNavItems.map((item) => (
            <Tooltip key={item.href}>
              <TooltipTrigger asChild>
                <Button 
                  asChild 
                  variant={pathname.startsWith(item.href) ? 'default' : 'ghost'} 
                  className={`w-full justify-start ${isCollapsed ? 'px-2' : ''}`}
                >
                  <Link href={item.href} onClick={handleLinkClick}>
                    <item.icon className={`h-4 w-4 ${isCollapsed ? '' : 'mr-2'}`} />
                    {!isCollapsed && item.label}
                  </Link>
                </Button>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent side="right">
                  <p>{item.label}</p>
                </TooltipContent>
              )}
            </Tooltip>
          ))}

          {/* Post New Job Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handlePostJob}
                variant="default"
                className={`w-full justify-start ${isCollapsed ? 'px-2' : ''}`}
                disabled={!isConnected}
              >
                <PlusCircle className={`h-4 w-4 ${isCollapsed ? '' : 'mr-2'}`} />
                {!isCollapsed && 'Post New Job'}
              </Button>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right">
                <p>Post New Job</p>
              </TooltipContent>
            )}
          </Tooltip>
        </nav>
      </div>

      {/* Footer */}
      <div className="mt-auto flex flex-col items-center gap-4 p-4">
        <Separator />
        
        {/* Wallet Connection */}
        {!isConnected && (
          <div className="w-full">
            <ConnectButton />
          </div>
        )}

        {/* Footer Links */}
        {!isCollapsed && (
          <div className="grid w-full gap-1">
            {filteredFooterItems.map((item) => (
              <Button 
                key={item.href} 
                asChild 
                variant="ghost" 
                size="sm"
                className="w-full justify-start text-xs"
              >
                <Link href={item.href} onClick={handleLinkClick}>
                  <item.icon className="mr-2 h-3 w-3" />
                  {item.label}
                </Link>
              </Button>
            ))}
          </div>
        )}

        {/* Admin Panel */}
        {user?.role === 'Admin' && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/admin" onClick={handleLinkClick}>
                <Button 
                  variant="outline" 
                  size={isCollapsed ? "icon" : "default"}
                >
                  <ShieldCheck className="h-4 w-4" />
                  {!isCollapsed && <span className="ml-2">Admin Panel</span>}
                </Button>
              </Link>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right">
                <p>Admin Panel</p>
              </TooltipContent>
            )}
          </Tooltip>
        )}

        {/* Version and Storage Status */}
        {!isCollapsed && (
          <div className="flex items-center justify-between w-full">
            <span className='text-xs text-muted-foreground'>v0.1.0</span>
            <StorageStatus />
          </div>
        )}
        
        {/* Collapsed version info */}
        {isCollapsed && (
          <div className="text-center">
            <span className='text-xs text-muted-foreground'>v0.1.0</span>
          </div>
        )}
      </div>
    </div>
    </TooltipProvider>
  );
}
