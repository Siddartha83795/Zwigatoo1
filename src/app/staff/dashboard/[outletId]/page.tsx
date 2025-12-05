// app/staff/dashboard/[outletId]/staff-dashboard-client.tsx
'use client';

import React, { useMemo, useState } from 'react';
import OrderCard from '@/components/order-card';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Order, OrderStatus } from '@/lib/types';
import { outlets } from '@/lib/data';

type Props = {
  outletId: string;
  outletName: string;
  initialOrders: Order[];
};

type StatusColumn = {
  title: string;
  statuses: OrderStatus[];
};

const columns: StatusColumn[] = [
  { title: 'New Orders', statuses: ['pending', 'accepted'] },
  { title: 'In Preparation', statuses: ['preparing'] },
  { title: 'Ready for Pickup', statuses: ['ready'] },
];

export default function StaffDashboardClient({ outletId, outletName, initialOrders }: Props) {
  // Hooks are declared unconditionally at the top-level — ESLint happy.
  const [orders, setOrders] = useState<Order[]>(() => initialOrders ?? []);

  // Optional: client-side outlet lookup (for display). Not required if you pass outletName.
  const outlet = useMemo(() => outlets.find((o) => o.id === outletId), [outletId]);

  if (!outlet) {
    // Fallback UI if somehow outlet is missing on client (server already handled notFound)
    return (
      <div className="container py-6">
        <h1 className="text-3xl font-bold">Outlet not found</h1>
        <p className="text-muted-foreground">No outlet with id: {outletId}</p>
      </div>
    );
  }

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
  };

  const getOrdersForColumn = (statuses: OrderStatus[]) => orders.filter((o) => statuses.includes(o.status));

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <div className="container py-6 border-b">
        <h1 className="text-3xl font-bold font-headline">Staff Dashboard</h1>
        <p className="text-muted-foreground">{outletName} (ID: {outletId})</p>
      </div>

      <div className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-6 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
          {columns.map((col) => {
            const columnOrders = getOrdersForColumn(col.statuses);
            return (
              <div key={col.title} className="bg-card rounded-lg flex flex-col h-full overflow-hidden">
                <h2 className="text-lg font-semibold p-4 border-b font-headline">
                  {col.title} ({columnOrders.length})
                </h2>

                <ScrollArea className="flex-grow p-4">
                  <div className="space-y-4">
                    {columnOrders.length > 0 ? (
                      columnOrders.map((order) => (
                        <OrderCard
                          key={order.id}
                          order={order}
                          isStaffView={true}
                          onStatusChange={handleStatusChange}
                        />
                      ))
                    ) : (
                      <div className="text-center text-muted-foreground py-16">
                        <p>No orders in this category.</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
