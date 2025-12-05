'use client';

import Image from 'next/image';
import { memo } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-context';
import type { MenuItem } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Plus } from 'lucide-react';

type MenuItemCardProps = {
  item: MenuItem;
};

const MenuItemCard = memo(function MenuItemCard({ item }: MenuItemCardProps) {
  const { addToCart } = useCart();
  const image = PlaceHolderImages.find((img) => img.id === item.imageId);

  return (
    <Card className="flex flex-col h-full overflow-hidden">
      <div className="relative h-40 w-full">
        {image && (
          <Image
            src={image.imageUrl}
            alt={image.description}
            fill
            className="object-cover"
            data-ai-hint={image.imageHint}
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        )}
        {!item.isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <span className="rounded-full bg-destructive px-3 py-1 text-sm font-medium text-destructive-foreground">UNAVAILABLE</span>
          </div>
        )}
      </div>
      <CardHeader>
        <CardTitle className="font-headline text-lg">{item.name}</CardTitle>
        <CardDescription className="text-sm h-10 overflow-hidden">{item.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <p className="text-lg font-bold text-primary">₹{item.priceInr.toFixed(2)}</p>
        <Button
          size="sm"
          onClick={() => addToCart(item)}
          disabled={!item.isAvailable}
          aria-label={`Add ${item.name} to cart`}
        >
          <Plus className="mr-2 h-4 w-4" /> Add
        </Button>
      </CardFooter>
    </Card>
  );
});

export default MenuItemCard;
