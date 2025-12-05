'use client';

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import { menuItems as allMenuItems } from '@/lib/data'; // Keep mockMenuItems for now
import MenuItemCard from '@/components/menu-item-card';
import { useCart } from '@/context/cart-context';
import CartWidget from '@/components/cart-widget';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import BackButton from '@/components/back-button';
import { getOutletById } from '@/lib/firestore'; // Import getOutletById
import type { Outlet } from '@/lib/types'; // Import Outlet type


export default function MenuPage({ params }: { params: any }) {
  const { setOutletId } = useCart();
  const [outlet, setOutlet] = useState<Outlet | null>(null);
  const [loadingOutlet, setLoadingOutlet] = useState(true);
  const [errorOutlet, setErrorOutlet] = useState<string | null>(null);

  useEffect(() => {
    const fetchOutlet = async () => {
      try {
        const fetchedOutlet = await getOutletById(params.outletId);
        setOutlet(fetchedOutlet);
        if (fetchedOutlet) {
            setOutletId(fetchedOutlet.id);
        }
      } catch (err: any) {
        console.error("Error fetching outlet:", err);
        setErrorOutlet("Failed to load outlet details.");
      } finally {
        setLoadingOutlet(false);
      }
    };
    fetchOutlet();
  }, [params.outletId, setOutletId]);


  if (loadingOutlet) {
    return (
        <div className="container py-12 text-center">
            <h1 className="text-4xl font-bold font-headline tracking-tight text-foreground sm:text-5xl">
            Loading Outlet...
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
            Please wait while we fetch the cafeteria details.
            </p>
        </div>
    );
  }

  if (errorOutlet) {
    return (
        <div className="container py-12 text-center">
            <h1 className="text-4xl font-bold font-headline tracking-tight text-destructive sm:text-5xl">
            Error
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
            {errorOutlet} Please try again later.
            </p>
        </div>
    );
  }

  if (!outlet) {
    notFound();
  }
  
  const outletImage = PlaceHolderImages.find(img => img.id === outlet.imageId);

  const menuItems = allMenuItems.filter(item => item.outletId === outlet.id);
  const categories = [...new Set(menuItems.map(item => item.category))];

  return (
    <>
      <div className="relative h-64 md:h-80 w-full">
        {outletImage && (
          <Image
            src={outletImage.imageUrl}
            alt={outletImage.description}
            fill
            className="object-cover"
            data-ai-hint={outletImage.imageHint}
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
        <div className="absolute top-20 left-4 md:left-8">
            <BackButton />
        </div>
        <div className="absolute bottom-0 left-0 w-full p-4 md:p-8">
            <div className="container">
                <h1 className="text-4xl md:text-6xl font-bold font-headline text-foreground">{outlet.name}</h1>
                <p className="mt-2 text-lg text-muted-foreground">{outlet.description}</p>
            </div>
        </div>
      </div>
      <div className="container py-12">
        {categories.map(category => (
          <div key={category} className="mb-12">
            <h2 className="text-3xl font-bold font-headline mb-6">{category}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {menuItems
                .filter(item => item.category === category)
                .map(item => (
                  <MenuItemCard key={item.id} item={item} />
                ))}
            </div>
          </div>
        ))}
      </div>
      <CartWidget />
    </>
  );
}
