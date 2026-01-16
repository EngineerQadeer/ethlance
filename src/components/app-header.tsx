'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Briefcase, User, LogOut } from 'lucide-react';
import Link from 'next/link';
import { AppSidebar } from './app-sidebar';
import { ThemeSwitcher } from './theme-switcher';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';

function EthlanceLogo() {
  return (
    <Link href="/jobs" className="flex items-center gap-2">
      <Briefcase className="h-7 w-7 text-primary" />
      <span className="text-xl font-bold text-foreground">Ethlance</span>
    </Link>
  );
}

export function AppHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();
  const hasWcProjectId = Boolean(process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <div className="flex items-center gap-4">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0 md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col p-0">
             <SheetHeader className="border-b p-4">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              </SheetHeader>
            <AppSidebar onLinkClick={() => setIsMobileMenuOpen(false)} />
          </SheetContent>
        </Sheet>
        <div className="hidden md:block">
          <EthlanceLogo />
        </div>
      </div>

      <div className="md:hidden">
        <EthlanceLogo />
      </div>

      <div className="flex items-center gap-4">
        <ThemeSwitcher />
        <ConnectButton />
         {user ? (
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium">{user.username}</span>
            <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        ) : (
          <Button onClick={() => router.push('/login')}>Login</Button>
        )}
      </div>
    </header>
  );
}
