// --- Type Definitions ---
type OutletParams = {
  // This key must match the folder name: [outletId]
  outletId: string;
};

// --- 1. generateStaticParams (Addresses the initial build error for static export) ---

/**
 * Required for `output: "export"`. Must provide a list of all possible 'outletId' values 
 * for static pre-rendering at build time.
 */
// app/staff/dashboard/[outletId]/page.js (only include the function part if file already exists)
export async function generateStaticParams() {
  const API_BASE = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
  const SKIP_STATIC_FETCH = process.env.SKIP_STATIC_FETCH === 'true';

  if (!API_BASE) {
    throw new Error(
      'Missing API_URL environment variable needed for static generation. ' +
        'Set API_URL (e.g. "https://api.example.com") in your environment or CI secrets.'
    );
  }

  let outletsUrl;
  try {
    outletsUrl = new URL('/outlets', API_BASE).toString();
  } catch (err) {
    throw new Error(
      `Invalid API_URL value (${API_BASE}) — it must be an absolute URL including protocol (e.g. "https://api.example.com").\nCaused by: ${err}`
    );
  }

  if (SKIP_STATIC_FETCH) {
    console.warn('SKIP_STATIC_FETCH=true: skipping network fetch for generateStaticParams');
    return [];
  }

  const res = await fetch(outletsUrl, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Failed to fetch outlets from ${outletsUrl}: ${res.status} ${res.statusText}`);
  }

  const outlets = await res.json();

  if (!Array.isArray(outlets)) {
    throw new Error(`Unexpected response shape from ${outletsUrl}: expected an array, got ${typeof outlets}`);
  }

  return outlets.map((o) => ({ outletId: String(o.id) }));
}



// --- 2. OutletPage Component (Addresses the "Type error" by using simplified, inline typing) ---

/**
 * The main Page component for the dynamic route.
 * We use inline typing here to specifically avoid conflicts with external 'PageProps' definitions.
 */
export default async function OutletPage({ 
    params,
    // Note: TypeScript correctly infers the type of searchParams from the object literal.
}: { 
    params: OutletParams;
    searchParams?: { [key: string]: string | string[] | undefined };
}) {
    const { outletId } = params;
    
    // --- Page-specific data fetching ---
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
            
            <pre>{JSON.stringify(outletData, null, 2)}</pre>
        </main>
    );
}


// --- Helper Function ---
async function getOutletData(outletId: string): Promise<{ name: string } | null> {
    const apiUrl = `${process.env.API_URL}/outlets/${outletId}`;
    try {
        const res = await fetch(apiUrl, { 
            next: { revalidate: 3600 } 
        }); 
        
        if (!res.ok) return null;

        const data = await res.json();
        return data.name ? data : { name: `Fallback Outlet Name ${outletId}` };

    } catch (e) {
        return null;
    }
}
