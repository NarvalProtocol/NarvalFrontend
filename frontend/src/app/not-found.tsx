import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex h-[70vh] flex-col items-center justify-center gap-6 text-center">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">404</h1>
        <h2 className="text-xl font-semibold">Page Not Found</h2>
        <p className="text-muted-foreground">
          Sorry, we couldn't find the page you're looking for.
        </p>
      </div>
      <Button asChild>
        <Link href="/">Return to Home</Link>
      </Button>
    </div>
  );
}
