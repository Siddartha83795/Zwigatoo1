import { orders as mockOrders, mockUserProfile } from '@/lib/data';
import OrderCard from '@/components/order-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function OrdersPage() {
  // Simulate filtering orders for the logged-in user
  const loggedInClientId = mockUserProfile.id;
  const clientOrders = mockOrders.filter(o => o.clientId === loggedInClientId);

  const activeOrders = clientOrders.filter(o => ['pending', 'accepted', 'preparing', 'ready'].includes(o.status));
  const pastOrders = clientOrders.filter(o => ['completed', 'cancelled'].includes(o.status));

  if (clientOrders.length === 0) {
    return (
       <div className="container py-12 text-center">
        <h1 className="text-3xl font-bold font-headline">You have no orders yet</h1>
        <p className="mt-4 text-muted-foreground">Looks like you have not placed an order.</p>
        <Button asChild className="mt-8">
          <Link href="/outlets">
            Order Now
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container py-12">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold font-headline tracking-tight text-foreground sm:text-5xl">
          Your Orders
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Track your current orders and view your order history.
        </p>
      </div>

       <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active">Active Orders</TabsTrigger>
          <TabsTrigger value="past">Past Orders</TabsTrigger>
        </TabsList>
        <TabsContent value="active">
            {activeOrders.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    {activeOrders.map(order => (
                        <OrderCard key={order.id} order={order} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <p className="text-muted-foreground">You have no active orders.</p>
                </div>
            )}
        </TabsContent>
        <TabsContent value="past">
            {pastOrders.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    {pastOrders.map(order => (
                        <OrderCard key={order.id} order={order} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <p className="text-muted-foreground">You have no past orders.</p>
                </div>
            )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
