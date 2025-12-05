import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { UtensilsCrossed } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-10rem)] flex-col items-center justify-center text-center">
      <UtensilsCrossed className="mb-4 h-16 w-16 text-primary" />
      <h1 className="text-4xl font-bold font-headline tracking-tight text-foreground sm:text-5xl">
        404 - Page Not Found
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Oops! The page you are looking for does not exist.
      </p>
      <p className="mt-2 text-muted-foreground">
        Maybe you took a wrong turn at the buffet.
      </p>
      <Button asChild className="mt-8">
        <Link href="/">Return to Homepage</Link>
      </Button>
    </div>
  );
}
