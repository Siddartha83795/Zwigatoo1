// src/app/menu/[outletId]/layout.tsx
import { getOutlets } from '@/lib/firestore';
import type { Outlet } from '@/lib/types';

export async function generateStaticParams() {
  const outlets = await getOutlets();
  return outlets.map((outlet: Outlet) => ({
    outletId: outlet.id,
  }));
}

export default function OutletMenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
