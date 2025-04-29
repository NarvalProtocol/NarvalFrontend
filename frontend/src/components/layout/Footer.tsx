import * as React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold">Narval</h3>
            <p className="text-sm text-muted-foreground">
              Modern solution for DeFi liquidity and recursive lending management
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-base font-medium">Products</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/vaults" className="text-sm text-muted-foreground hover:text-foreground">
                Vaults
              </Link>
              <Link href="/lend" className="text-sm text-muted-foreground hover:text-foreground">
                Lend
              </Link>
              <Link href="/borrow" className="text-sm text-muted-foreground hover:text-foreground">
                Borrow
              </Link>
            </nav>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-base font-medium">Resources</h3>
            <nav className="flex flex-col gap-2">
              <Link
                href="/documentation"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Documentation
              </Link>
              <Link href="/faq" className="text-sm text-muted-foreground hover:text-foreground">
                FAQ
              </Link>
              <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground">
                Blog
              </Link>
            </nav>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-base font-medium">Community</h3>
            <nav className="flex flex-col gap-2">
              <Link
                href="https://twitter.com"
                className="text-sm text-muted-foreground hover:text-foreground"
                target="_blank"
                rel="noopener noreferrer"
              >
                Twitter
              </Link>
              <Link
                href="https://discord.com"
                className="text-sm text-muted-foreground hover:text-foreground"
                target="_blank"
                rel="noopener noreferrer"
              >
                Discord
              </Link>
              <Link
                href="https://github.com"
                className="text-sm text-muted-foreground hover:text-foreground"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </Link>
            </nav>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Narval. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
