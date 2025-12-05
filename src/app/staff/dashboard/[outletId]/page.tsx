// src/app/staff/dashboard/[outletId]/page.tsx

// --- Type Definitions ---
type OutletParams = {
  // This key must match the folder name: [outletId]
  outletId: string;
};

// Define the precise structure of the props passed to the Page component
interface OutletPageProps {
    params: OutletParams;
    // App Router pages may also receive searchParams
    searchParams?: { [key: string]: string | string[] | undefined };
}


// --- 1. generateStaticParams (Addresses the initial build error for static export) ---

/**
 * Required for `output: "export"`. Must provide a list of all possible 'outletId' values 
 * for static pre-rendering at build time.
 */
export async function generateStaticParams(): Promise<OutletParams[]> {
    // ⚠️ IMPORTANT: Verify that process.env.API_URL is correctly set up as a BUILD-TIME variable.
    const apiUrl = `${process.env.API_URL}/outlets`;
    
    try {
        const res = await fetch(apiUrl, {
             // Added timeout for robust build process
            signal: AbortSignal.timeout(5000) 
        });

        if (!res.ok) {
            const errorText = await res.text();
            // Throw a descriptive error to halt the build and indicate the API failure
            throw new Error(`API fetch failed (Status ${res.status}) for ${apiUrl}. Response: ${errorText}`);
        }

        const outlets: { id: number | string }[] = await res.json();
        
        return outlets.map(o => ({
            outletId: String(o.id),
        }));
        
    } catch (error) {
        console.error(`--- BUILD FAILURE: generateStaticParams failed ---`);
        console.error("Details:", error);
        // Re-throw to ensure the build fails if static data cannot be retrieved
        throw new Error('Static paths generation failed. Check API_URL and network access.');
    }
}


// --- 2. OutletPage Component (Addresses the "Type error" by using correct typing) ---

/**
 * The main Page component for the dynamic route.
 * It is an Async Server Component.
 */
export default async function OutletPage({ params }: OutletPageProps) {
    // TypeScript now correctly validates 'params' against OutletPageProps interface.
    const { outletId } = params;
    
    // --- Page-specific data fetching (Runs at build time for pre-rendered pages) ---
    // In a real app, you'd fetch the specific data for this outletId here.
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
            
            {/* Display data for confirmation */}
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

        // Mocking the expected return shape for the component to function
        const data = await res.json();
        return data.name ? data : { name: `Fallback Outlet Name ${outletId}` };

    } catch (e) {
        return null;
    }
}
