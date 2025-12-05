// src/app/staff/dashboard/[outletId]/layout.tsx
import { getOutlets } from '@/lib/firestore';
import type { Outlet } from '@/lib/types';

export async function generateStaticParams() {
  const outlets = await getOutlets();
  return outlets.map((outlet: Outlet) => ({
    outletId: outlet.id,
  }));
}

export default function StaffDashboardOutletLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
