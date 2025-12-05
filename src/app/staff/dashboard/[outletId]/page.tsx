// app/staff/dashboard/[outletId]/page.js

// --- Type Definitions (informational only) ---
// outletId is a dynamic route param (folder name: [outletId])

/**
 * generateStaticParams
 * - validates API_URL
 * - optionally skips network fetch when SKIP_STATIC_FETCH=true (useful for CI)
 * - returns [{ outletId: '1' }, ...]
 */
// export async function generateStaticParams() {
//   const API_BASE = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
//   const SKIP_STATIC_FETCH = process.env.SKIP_STATIC_FETCH === 'true';

//   if (!API_BASE) {
//     throw new Error(
//       'Missing API_URL environment variable required for static generation. ' +
//         'Set API_URL (e.g. "https://api.example.com") in your environment or CI secrets.'
//     );
//   }

//   // validate API_BASE is a proper absolute URL
//   let outletsUrl;
//   try {
//     outletsUrl = new URL('/outlets', API_BASE).toString();
//   } catch (err) {
//     throw new Error(
//       `Invalid API_URL value (${API_BASE}). It must be an absolute URL including protocol (e.g. "https://api.example.com").\nCaused by: ${err}`
//     );
//   }

//   if (SKIP_STATIC_FETCH) {
//     // Skip network fetch in CI or when API is not reachable.
//     // Returning [] will skip generating outlet pages at build time.
//     // Change to a small fallback array if you need some pages generated.
//     console.warn('SKIP_STATIC_FETCH=true: skipping network fetch for generateStaticParams');
//     return [];
//   }

//   const res = await fetch(outletsUrl, { cache: 'no-store' });
//   if (!res.ok) {
//     throw new Error(`Failed to fetch outlets from ${outletsUrl}: ${res.status} ${res.statusText}`);
//   }

//   const outlets = await res.json();
//   if (!Array.isArray(outlets)) {
//     throw new Error(`Unexpected response shape from ${outletsUrl}: expected an array of outlets`);
//   }

//   return outlets.map((o) => ({ outletId: String(o.id) }));
// }

/**
 * OutletPage (server component)
 * - fetches outlet details using a validated API base
 * - renders fallback UI when data is missing
 */
export default async function OutletPage({
  params,
  // searchParams optional
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

  const outletData = await getOutletData(outletId);

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

/**
 * getOutletData
 * - constructs absolute URL via new URL()
 * - validates API_BASE
 * - returns data object or null on error
 */
async function getOutletData(outletId: string) {
  const API_BASE = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
  if (!API_BASE) {
    // Avoid throwing here so page can show friendly fallback; build-time will fail earlier in generateStaticParams
    console.error('getOutletData: missing API_URL; set process.env.API_URL');
    return null;
  }

  let endpoint;
  try {
    endpoint = new URL(`/outlets/${encodeURIComponent(outletId)}`, API_BASE).toString();
  } catch (err) {
    console.error('getOutletData: invalid API_URL:', API_BASE, err);
    return null;
  }

  try {
    const res = await fetch(endpoint, { next: { revalidate: 3600 } });
    if (!res.ok) {
      console.error(`getOutletData: fetch failed ${res.status} ${res.statusText} for ${endpoint}`);
      return null;
    }

    const data = await res.json();
    // simple validation
    if (!data || typeof data !== 'object') {
      console.error('getOutletData: unexpected response shape', data);
      return null;
    }

    // ensure a name exists; otherwise provide a fallback structure
    if (!data.name) data.name = `Outlet ${outletId}`;
    return data;
  } catch (err) {
    console.error('getOutletData: network/error', err);
    return null;
  }
}
