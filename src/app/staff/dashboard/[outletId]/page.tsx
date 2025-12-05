// src/app/staff/dashboard/[outletId]/page.tsx

// --- Type Definitions ---
type OutletParams = {
  // This must match the folder name: [outletId]
  outletId: string;
};

interface OutletPageProps {
    // The params object is required for dynamic routes
    params: OutletParams;
    // searchParams are optional and available in the App Router pattern
    searchParams?: { [key: string]: string | string[] | undefined };
}


// --- 1. generateStaticParams (Fixes the build error when using output: "export") ---

/**
 * Required for `output: "export"` with dynamic routes.
 * It tells Next.js which pages to pre-render at build time.
 */
export async function generateStaticParams(): Promise<OutletParams[]> {
    // ⚠️ IMPORTANT: Ensure process.env.API_URL is correctly defined 
    // and accessible in your build environment.
    const apiUrl = `${process.env.API_URL}/outlets`;

    console.log(`[generateStaticParams] Fetching outlets from: ${apiUrl}`);

    try {
        const res = await fetch(apiUrl, {
            // Set a timeout to prevent the build from hanging
            signal: AbortSignal.timeout(5000) 
        });

        if (!res.ok) {
            const errorText = await res.text();
            // THROWING an error is essential here to make the build failure visible and debuggable.
            throw new Error(`API failed with status ${res.status} when fetching outlets. Response: ${errorText}`);
        }

        const outlets: { id: number | string }[] = await res.json();
        
        if (!Array.isArray(outlets)) {
             throw new Error("API response is not a valid array of outlets.");
        }

        const staticParams = outlets.map(o => ({
            outletId: String(o.id),
        }));
        
        console.log(`[generateStaticParams] Generated ${staticParams.length} static paths.`);
        
        return staticParams;
        
    } catch (error) {
        console.error(`--- BUILD ERROR: Failed to generate static params ---`);
        console.error("Reason:", error instanceof Error ? error.message : "An unknown error occurred.");
        // Re-throw the error to ensure the Next.js build fails as intended for static export issues
        throw new Error('Required static paths could not be generated. Check your network and env vars.');
    }
}


// --- 2. OutletPage Component (Fixes the TypeScript error) ---

/**
 * This is an Async Server Component that renders the dashboard for a specific outlet.
 * Using the explicit interface 'OutletPageProps' resolves the TypeScript conflict.
 */
export default async function OutletPage({ params }: OutletPageProps) {
    const { outletId } = params;
    
    // In a real application, you would fetch the specific data needed for this outlet.
    const outletData = await getOutletData(outletId);

    if (!outletData) {
        // Handle case where data wasn't found (though this shouldn't happen 
        // if generateStaticParams worked correctly)
        return (
            <div style={{ padding: '20px', color: 'gray' }}>
                <h1>404 - Outlet Dashboard</h1>
                <p>Could not load data for Outlet ID: {outletId}</p>
            </div>
        );
    }

    return (
        <main style={{ padding: '20px' }}>
            <h2>Outlet Dashboard: {outletData.name || `ID ${outletId}`}</h2>
            <p>You are viewing the dashboard for **{outletData.location}**.</p>
            {/* Add your actual dashboard layout and components here */}
            
            <section>
                <h3>Example Outlet Data:</h3>
                <pre style={{ backgroundColor: '#f4f4f4', padding: '10px', borderRadius: '4px' }}>
                    {JSON.stringify(outletData, null, 2)}
                </pre>
            </section>
        </main>
    );
}


// --- Helper Function ---

/**
 * Fetches detailed data for a single outlet.
 */
async function getOutletData(outletId: string): Promise<{ name: string, location: string } | null> {
    // This fetch runs when accessing the specific page.
    const apiUrl = `${process.env.API_URL}/outlets/${outletId}`;
    try {
        const res = await fetch(apiUrl, { 
            // Optional: configure Next.js caching behavior (e.g., revalidate every hour)
            next: { revalidate: 3600 } 
        }); 
        
        if (!res.ok) {
            console.error(`Failed to fetch data for outlet ${outletId}: Status ${res.status}`);
            return null;
        }

        const data = await res.json();
        
        // Mocking structure if the real API isn't running
        if (!data.name || !data.location) {
             return { name: `Outlet ${outletId}`, location: `Location ${outletId}` };
        }
        
        return data;

    } catch (e) {
        console.error(`Network error fetching data for outlet ${outletId}:`, e);
        return null;
    }
}
