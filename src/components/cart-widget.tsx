'use client';

import { useCart } from '@/context/cart-context';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function CartWidget() {
  const { itemCount, cartTotal } = useCart();

  return (
    <AnimatePresence>
      {itemCount > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 30 }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 w-full max-w-sm z-50 px-4"
        >
          <div className="rounded-lg bg-card border shadow-lg p-4">
              <Link href="/cart">
                <div className="flex items-center justify-between">
                    <div className='flex items-center gap-3'>
                        <ShoppingCart className="h-6 w-6 text-primary"/>
                        <div>
                            <p className="font-bold">{itemCount} {itemCount > 1 ? 'items' : 'item'}</p>
                            <p className="text-sm text-muted-foreground">₹{cartTotal.toFixed(2)}</p>
                        </div>
                    </div>
                    <Button>View Cart</Button>
                </div>
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
