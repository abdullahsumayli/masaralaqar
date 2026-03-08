// Fix properties: add tenant_id and status
export { };

const SUPABASE_URL = "https://jtwlyexgptntdubxnnaw.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0d2x5ZXhncHRudGR1YnhubmF3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTM4NDcxNCwiZXhwIjoyMDg2OTYwNzE0fQ.7N2XRif1EChlm1gbrB-ayf11Cp-9zrOR3JTREeORoSI";

const TENANT_ID = "85bf4ac1-41a5-44c3-be61-42547aaeebde";

async function fixProperties() {
  console.log("🔧 Fixing properties: adding tenant_id and status...\n");

  // Update all properties to add tenant_id and status
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/properties?tenant_id=is.null`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        tenant_id: TENANT_ID,
        status: "available",
      }),
    },
  );

  if (!response.ok) {
    const error = await response.text();
    console.log("❌ Update failed:", error);

    // If column doesn't exist, check schema
    console.log("\n🔍 Checking properties schema...");
    const schemaRes = await fetch(
      `${SUPABASE_URL}/rest/v1/properties?select=*&limit=1`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      },
    );
    const sample = await schemaRes.json();
    console.log("Sample property:", JSON.stringify(sample, null, 2));
    return;
  }

  const updated = await response.json();
  console.log(
    `✅ Updated ${Array.isArray(updated) ? updated.length : 0} properties`,
  );

  // Verify
  const verifyRes = await fetch(
    `${SUPABASE_URL}/rest/v1/properties?select=id,title,tenant_id,status&limit=5`,
    {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    },
  );
  const verifyData = await verifyRes.json();
  console.log("\n📊 Sample after update:");
  console.log(JSON.stringify(verifyData, null, 2));
}

fixProperties();
