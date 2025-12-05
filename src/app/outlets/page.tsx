'use client';

import OutletCard from '@/components/outlet-card';
import { useState, useEffect } from 'react';
import { getOutlets } from '@/lib/firestore'; // Import getOutlets
import type { Outlet } from '@/lib/types'; // Import Outlet type

export default function OutletsPage() {
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOutlets = async () => {
      try {
        const fetchedOutlets = await getOutlets();
        setOutlets(fetchedOutlets);
      } catch (err: any) {
        console.error("Error fetching outlets:", err);
        setError("Failed to load outlets.");
      } finally {
        setLoading(false);
      }
    };
    fetchOutlets();
  }, []);

  if (loading) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-4xl font-bold font-headline tracking-tight text-foreground sm:text-5xl">
          Loading Outlets...
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Please wait while we fetch the available cafeterias.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-4xl font-bold font-headline tracking-tight text-destructive sm:text-5xl">
          Error
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          {error} Please try again later.
        </p>
      </div>
    );
  }

  if (outlets.length === 0) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-4xl font-bold font-headline tracking-tight text-foreground sm:text-5xl">
          No Outlets Found
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          It seems there are no cafeterias available at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold font-headline tracking-tight text-foreground sm:text-5xl">
          Choose an Outlet
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Select a cafeteria to view the menu and place your order.
        </p>
      </div>
      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {outlets.map((outlet) => (
          <OutletCard key={outlet.id} outlet={outlet} />
        ))}
      </div>
    </div>
  );
}
