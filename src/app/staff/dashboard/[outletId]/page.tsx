import { getOutletById } from '@/lib/firestore'; // Import getOutletById

// app/staff/dashboard/[outletId]/page.js

// --- Type Definitions (informational only) ---
// outletId is a dynamic route param (folder name: [outletId])

/**
 * OutletPage (server component)
 * - fetches outlet details using a validated API base
 * - renders fallback UI when data is missing
 */
export default async function OutletPage({
  params,
}: {
  params: any;
}) {
  const { outletId } = params || {};

  if (!outletId) {
    return (
      <main>
        <h1>Invalid Request</h1>
        <p>No outletId provided in route params.</p>
      </main>
    );
  }

  const outletData = await getOutletById(outletId);

  if (!outletData) {
    return (
      <main>
        <h1>Outlet Data Not Found</h1>
        <p>Could not load details for Outlet ID: {outletId}</p>
      </main>
    );
  }

  return (
    <main>
      <h1>Dashboard for Outlet: {outletData.name} (ID: {outletId})</h1>
      <p>Welcome to the dashboard.</p>

      <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(outletData, null, 2)}</pre>
    </main>
  );
}
