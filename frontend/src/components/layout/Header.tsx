'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ThemeSwitcher } from '@/components/ui/theme-switcher';
import { ConnectButton } from '@/components/wallet';
import { Menu } from 'lucide-react';

interface HeaderProps {
  onOpenSidebar?: () => void;
}

export function Header({ onOpenSidebar }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Mobile hamburger menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={onOpenSidebar}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <Link href="/" className="font-bold text-xl">
            Narval
          </Link>
          <nav className="hidden md:flex items-center gap-4">
            <Link href="/lend" className="text-sm font-medium hover:underline underline-offset-4">
              Lend
            </Link>
            <Link href="/borrow" className="text-sm font-medium hover:underline underline-offset-4">
              Borrow
            </Link>
            <Link href="/swap" className="text-sm font-medium hover:underline underline-offset-4">
              Swap
            </Link>
            <Link
              href="/refinance"
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              Refinance
            </Link>
            <Link href="/stats" className="text-sm font-medium hover:underline underline-offset-4">
              Stats
            </Link>
            <Link
              href="/multiply"
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              Multiply
            </Link>
            <Link
              href="/smart-lending"
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              Smart Lending
            </Link>
            <Link href="/gov" className="text-sm font-medium hover:underline underline-offset-4">
              Gov
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <ThemeSwitcher />
          <ConnectButton />
        </div>
      </div>
    </header>
  );
}
