// app/staff/dashboard/[outletId]/page.tsx

type OutletParams = { outletId: string };

/**
 * 1. generateStaticParams
 * Required for `output: "export"` with dynamic routes.
 * It pre-renders all possible pages at build time.
 * MUST successfully fetch the list of all outlet IDs.
 */
export async function generateStaticParams(): Promise<OutletParams[]> {
    // ⚠️ IMPORTANT: Ensure process.env.API_URL is correctly defined
    // and accessible in your build environment/CI/CD pipeline.
    const apiUrl = `${process.env.API_URL}/outlets`;

    console.log(`[generateStaticParams] Attempting to fetch outlets from: ${apiUrl}`);

    try {
        const res = await fetch(apiUrl, {
            // Add a short timeout to prevent the build from hanging indefinitely
            signal: AbortSignal.timeout(5000) 
        });

        if (!res.ok) {
            // Throw a clear error if the API responds but with a non-200 status.
            const errorText = await res.text();
            throw new Error(`API failed with status ${res.status} when fetching outlets. Response: ${errorText}`);
        }

        const outlets = await res.json();
        
        if (!Array.isArray(outlets)) {
             throw new Error("API response is not an array of outlets.");
        }

        const staticParams = outlets.map((o: { id: number | string }) => ({
            outletId: String(o.id),
        }));
        
        console.log(`[generateStaticParams] Successfully generated ${staticParams.length} static paths.`);
        
        return staticParams;
        
    } catch (error) {
        // Log the network/fetch error (e.g., DNS failure, timeout, or missing env var)
        console.error(`--- BUILD ERROR: Failed to generate static params for /staff/dashboard/[outletId] ---`);
        console.error("Reason:", error instanceof Error ? error.message : "An unknown error occurred during fetch.");
        console.error(`Check 1: Is process.env.API_URL correctly set in your build environment? (Current value: ${process.env.API_URL})`);
        console.error("Check 2: Is your API reachable from the machine running the 'next build' command?");
        console.error(`-----------------------------------------------------------------------------------`);
        
        // Throwing the error is the correct action here. If you are using `output: "export"`, 
        // a build failure is required if the required static data cannot be fetched.
        throw new Error('Required static paths could not be generated. See console for details.');
    }
}

/**
 * 2. OutletPage Component
 * This component handles the rendering for a specific outlet.
 */
export default async function OutletPage({ params }: { params: OutletParams }) {
    const { outletId } = params;
    
    // NOTE: This fetch runs for every pre-rendered page at build time (and again on client-side navigation if needed).
    const outletData = await getOutletData(outletId);

    // If data is null (meaning the page likely shouldn't exist based on static params), 
    // you might render a 404-like component or handle it based on your app's logic.
    if (!outletData) {
        return (
            <div style={{ padding: '20px', color: 'red' }}>
                <p>Error: Could not load data for Outlet ID: {outletId}</p>
            </div>
        );
    }

    return (
        <main>
            <h1>Outlet Dashboard: {outletData.name || `ID ${outletId}`}</h1>
            <p>Welcome to the dashboard for outlet ID: **{outletId}**</p>
            {/* Add your dashboard content here */}
        </main>
    );
}


// Optional: Helper function for fetching individual outlet data
// This keeps the main component clean.
async function getOutletData(outletId: string): Promise<any | null> {
    const apiUrl = `${process.env.API_URL}/outlets/${outletId}`;
    try {
        const res = await fetch(apiUrl, { next: { revalidate: 3600 } }); // Revalidate after 1 hour
        if (!res.ok) return null;
        return res.json();
    } catch (e) {
        console.error(`Failed to fetch data for outlet ${outletId}:`, e);
        return null;
    }
}
