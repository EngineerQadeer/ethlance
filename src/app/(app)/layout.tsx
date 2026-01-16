
'use client';

import { AppHeader } from '@/components/app-header';
import { AppSidebar } from '@/components/app-sidebar';
import * as React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';


export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // This is a simple guard. For more complex scenarios, consider middleware.
  React.useEffect(() => {
    // Certain pages inside (app) layout might be public, like /jobs and /jobs/[id]
    // We only want to guard pages that require authentication.
    const protectedPaths = ['/applications', '/employer', '/jobs/new'];
    const currentPath = window.location.pathname;

    if (!user && protectedPaths.includes(currentPath)) {
      router.push('/login');
    }
  }, [user, router]);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
      <div className="flex min-h-screen w-full">
        {/* Sidebar */}
        <div className={`hidden border-r bg-card md:block transition-all duration-300 ${
          isSidebarCollapsed ? 'w-16' : 'w-64'
        }`}>
          <AppSidebar 
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={toggleSidebar}
          />
        </div>
        
        {/* Main Content */}
        <div className="flex flex-1 flex-col">
          <AppHeader />
          <main className="flex-1 bg-background p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
  );
}
