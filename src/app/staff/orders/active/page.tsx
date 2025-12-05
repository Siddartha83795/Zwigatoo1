'use client';

import { notFound } from 'next/navigation';
import { orders as mockOrdersData } from '@/lib/data'; // Keep mockOrdersData for now
import OrderCard from '@/components/order-card';
import type { Order, OrderStatus, Outlet } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useState, useMemo, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getOutlets } from '@/lib/firestore'; // Import getOutlets

type StatusColumn = {
    title: string;
    statuses: OrderStatus[];
};

const columns: StatusColumn[] = [
    { title: "New Orders", statuses: ['pending', 'accepted'] },
    { title: "In Preparation", statuses: ['preparing'] },
    { title: "Ready for Pickup", statuses: ['ready'] }
];

export default function ActiveOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(mockOrdersData); // Still using mock data for orders
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [selectedOutletId, setSelectedOutletId] = useState<string>('all');
  const [loadingOutlets, setLoadingOutlets] = useState(true);
  const [errorOutlets, setErrorOutlets] = useState<string | null>(null);

  useEffect(() => {
    const fetchOutlets = async () => {
      try {
        const fetchedOutlets = await getOutlets();
        setOutlets(fetchedOutlets);
      } catch (err: any) {
        console.error("Error fetching outlets:", err);
        setErrorOutlets("Failed to load outlets.");
      } finally {
        setLoadingOutlets(false);
      }
    };
    fetchOutlets();
  }, []);

  const filteredOrders = useMemo(() => {
    if (selectedOutletId === 'all') {
        return orders.filter(o => ['pending', 'accepted', 'preparing', 'ready'].includes(o.status));
    }
    return orders.filter(o => o.outletId === selectedOutletId && ['pending', 'accepted', 'preparing', 'ready'].includes(o.status));
  }, [orders, selectedOutletId]);
  
  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prevOrders => prevOrders.map(o => o.id === orderId ? {...o, status: newStatus} : o));
  };
  
  const getOrdersForColumn = (statuses: OrderStatus[]) => {
      return filteredOrders.filter(o => statuses.includes(o.status));
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
        <div className="container py-6 border-b">
           <div className="flex justify-between items-center">
             <div>
                <h1 className="text-3xl font-bold font-headline">Active Orders</h1>
                <p className="text-muted-foreground">Live view of all ongoing orders.</p>
             </div>
             <div className="w-full max-w-xs">
                <Select value={selectedOutletId} onValueChange={setSelectedOutletId} disabled={loadingOutlets || !!errorOutlets}>
                    <SelectTrigger>
                        {loadingOutlets ? (
                            <SelectValue placeholder="Loading outlets..." />
                        ) : errorOutlets ? (
                            <SelectValue placeholder={errorOutlets} />
                        ) : (
                            <SelectValue placeholder="Filter by outlet" />
                        )}
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Outlets</SelectItem>
                        {outlets.map(outlet => (
                            <SelectItem key={outlet.id} value={outlet.id}>{outlet.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
             </div>
           </div>
        </div>
        <div className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-6 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
                {columns.map(col => {
                    const columnOrders = getOrdersForColumn(col.statuses);
                    return (
                        <div key={col.title} className="bg-card rounded-lg flex flex-col h-full overflow-hidden">
                            <h2 className="text-lg font-semibold p-4 border-b font-headline">{col.title} ({columnOrders.length})</h2>
                            <ScrollArea className="flex-grow p-4">
                               <div className="space-y-4">
                                 {columnOrders.length > 0 ? (
                                    columnOrders
                                        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                                        .map(order => (
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
                    )
                })}
            </div>
        </div>
    </div>
  );
}
