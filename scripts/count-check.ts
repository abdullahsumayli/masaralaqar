// Simple count check
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCount() {
  console.log("🔍 Checking properties count...\n");

  // Just count - no schema needed
  const { count, error } = await supabase
    .from("properties")
    .select("*", { count: "exact", head: true });

  if (error) {
    console.log("❌ Error:", error.message);
  } else {
    console.log(`✅ Total properties: ${count}`);
  }

  // Try getting just id and title
  const { data, error: dataError } = await supabase
    .from("properties")
    .select("id, title, city, price")
    .limit(5);

  if (dataError) {
    console.log("❌ Data error:", dataError.message);
  } else {
    console.log("\n📋 Sample properties:");
    data?.forEach((p, i) => {
      console.log(
        `${i + 1}. ${p.title} - ${p.city} - ${p.price?.toLocaleString()} ريال`,
      );
    });
  }
}

checkCount();
