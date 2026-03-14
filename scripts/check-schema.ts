// Quick test to check properties table structure
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  console.log("🔍 Checking properties table...\n");

  // Try to select from properties
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .limit(1);

  if (error) {
    console.log("❌ Error:", error.message);

    // Check if table exists
    if (error.message.includes("does not exist")) {
      console.log("\n⚠️ Table 'properties' does not exist!");
      console.log(
        "Please run supabase/complete-setup.sql in your Supabase SQL Editor",
      );
    }
  } else {
    console.log("✅ Table exists!");
    console.log("📋 Sample data:", data);
  }

  // Try inserting a simple property without bathrooms
  console.log("\n🧪 Testing insert without bathrooms...");
  const { data: insertData, error: insertError } = await supabase
    .from("properties")
    .insert({
      tenant_id: "00000000-0000-0000-0000-000000000001",
      title: "Test Property",
      description: "Test",
      price: 500000,
      city: "الرياض",
      location: "حي الياسمين",
      type: "apartment",
      bedrooms: 2,
      area: 100,
      images: ["https://example.com/img.jpg"],
      status: "available",
      featured: false,
    })
    .select();

  if (insertError) {
    console.log("❌ Insert error:", insertError.message);
    console.log("\n💡 Missing column? Run this in SQL Editor:");
    console.log(
      "ALTER TABLE properties ADD COLUMN IF NOT EXISTS bathrooms INTEGER;",
    );
    console.log(
      "ALTER TABLE properties ADD COLUMN IF NOT EXISTS city VARCHAR(100);",
    );
    console.log(
      "ALTER TABLE properties ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;",
    );
    console.log(
      "ALTER TABLE properties ADD COLUMN IF NOT EXISTS tenant_id UUID;",
    );
  } else {
    console.log("✅ Insert successful!", insertData);

    // Clean up test
    if (insertData && insertData[0]) {
      await supabase.from("properties").delete().eq("id", insertData[0].id);
      console.log("🧹 Cleaned up test property");
    }
  }
}

checkSchema();
