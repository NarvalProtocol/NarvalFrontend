'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  
  // Navigation link configuration
  const navLinks = [
    { href: '/lend', label: 'Lend' },
    { href: '/borrow', label: 'Borrow' },
    { href: '/swap', label: 'Swap' },
    { href: '/refinance', label: 'Refinance' },
    { href: '/stats', label: 'Stats' },
    { href: '/multiply', label: 'Multiply' },
    { href: '/smart-lending', label: 'Smart Lending' },
    { href: '/gov', label: 'Gov' },
  ];

  return (
    <>
      {/* Background overlay, only shown on mobile devices */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden" 
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar container */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform border-r border-border bg-background transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          "md:relative md:z-0"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          <Link href="/" className="font-bold text-xl" onClick={() => onClose()}>
            Narval
          </Link>
          <Button 
            variant="ghost" 
            size="sm" 
            className="md:hidden" 
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <nav className="flex flex-col gap-1 p-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => onClose()}
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                pathname === link.href
                  ? "bg-secondary text-secondary-foreground"
                  : "hover:bg-secondary/80 hover:text-secondary-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        
        <div className="absolute bottom-4 left-0 w-full px-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Narval
          </p>
        </div>
      </aside>
    </>
  );
} 