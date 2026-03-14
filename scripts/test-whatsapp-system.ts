/**
 * WhatsApp System Test Script
 * Tests the full messaging flow: Webhook → Parser → Search → AI → Response
 */

const NEXT_APP_URL = process.env.TEST_URL || "http://localhost:3002";
const WEBHOOK_SECRET = "masar2024secret";
const TENANT_ID = "85bf4ac1-41a5-44c3-be61-42547aaeebde";
const TEST_PHONE = "966555555555";

// Test messages
const testMessages = [
  "ابغى شقة في الرياض ب800 الف",
  "أريد فيلا في جدة",
  "عندكم شقق في الدمام؟",
  "السلام عليكم",
];

interface TestResult {
  message: string;
  success: boolean;
  response?: any;
  error?: string;
  timing: number;
}

async function testWebhook(message: string): Promise<TestResult> {
  const start = Date.now();

  try {
    // Simulate UltraMsg webhook payload with unique ID
    const uniqueId = `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const payload = {
      event_type: "message_received",
      data: {
        id: uniqueId,
        from: TEST_PHONE,
        body: message,
        type: "chat",
        fromMe: false,
      },
    };

    const response = await fetch(
      `${NEXT_APP_URL}/api/webhook/whatsapp?secret=${WEBHOOK_SECRET}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      },
    );

    const data = await response.json();
    const timing = Date.now() - start;

    return {
      message,
      success: response.ok && data.success,
      response: data,
      timing,
    };
  } catch (error: any) {
    return {
      message,
      success: false,
      error: error.message,
      timing: Date.now() - start,
    };
  }
}

async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetch(
      `${NEXT_APP_URL}/api/webhook/whatsapp?secret=${WEBHOOK_SECRET}`,
      {
        method: "GET",
      },
    );
    return response.ok;
  } catch {
    return false;
  }
}

async function checkSupabase(): Promise<boolean> {
  try {
    const response = await fetch(
      "https://jtwlyexgptntdubxnnaw.supabase.co/rest/v1/properties?limit=1",
      {
        headers: {
          apikey:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0d2x5ZXhncHRudGR1YnhubmF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzODQ3MTQsImV4cCI6MjA4Njk2MDcxNH0.Zl_0D3QHKln3O0w0mmiMzH6mOyJVuSl97F6Z_VDS2k4",
        },
      },
    );
    return response.ok;
  } catch {
    return false;
  }
}

async function checkOpenAI(): Promise<boolean> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return false;

  try {
    const response = await fetch("https://api.openai.com/v1/models", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });
    return response.ok;
  } catch {
    return false;
  }
}

async function checkUltraMsg(): Promise<boolean> {
  const instance = process.env.ULTRAMSG_INSTANCE || "instance164031";
  const token = process.env.ULTRAMSG_TOKEN || "6eawfm9yjnjw3czn";

  try {
    const response = await fetch(
      `https://api.ultramsg.com/${instance}/instance/status?token=${token}`,
    );
    return response.ok;
  } catch {
    return false;
  }
}

async function runTests() {
  console.log("═".repeat(60));
  console.log("🔬 WhatsApp Messaging System - Diagnostic Test");
  console.log("═".repeat(60));
  console.log("");

  // Step 1: Check services
  console.log("📡 Checking Services...\n");

  const supabaseOk = await checkSupabase();
  console.log(`  Supabase:    ${supabaseOk ? "✅ Connected" : "❌ Failed"}`);

  const openaiOk = await checkOpenAI();
  console.log(
    `  OpenAI:      ${openaiOk ? "✅ Connected" : "⚠️ Not configured (fallback mode)"}`,
  );

  const ultramsgOk = await checkUltraMsg();
  console.log(
    `  UltraMsg:    ${ultramsgOk ? "✅ Connected" : "⚠️ Check credentials"}`,
  );

  const webhookOk = await checkHealth();
  console.log(
    `  Webhook:     ${webhookOk ? "✅ Verified" : "❌ Server not running"}`,
  );

  console.log("");

  if (!webhookOk) {
    console.log("⚠️  Next.js server is not running!");
    console.log("   Run: npm run dev");
    console.log("");
    console.log("═".repeat(60));
    return;
  }

  // Step 2: Test messages
  console.log("📨 Testing Message Flow...\n");

  const results: TestResult[] = [];

  for (const msg of testMessages) {
    process.stdout.write(`  Testing: "${msg.substring(0, 30)}..." `);
    const result = await testWebhook(msg);
    results.push(result);

    if (result.success) {
      console.log(`✅ (${result.timing}ms)`);
    } else {
      console.log(
        `❌ ${result.error || JSON.stringify(result.response) || "Failed"}`,
      );
    }

    // Delay between tests
    await new Promise((r) => setTimeout(r, 1000));
  }

  console.log("");

  // Step 3: Summary
  console.log("═".repeat(60));
  console.log("📊 FINAL REPORT");
  console.log("═".repeat(60));
  console.log("");

  const passed = results.filter((r) => r.success).length;
  const total = results.length;

  console.log(`  Tests Passed:      ${passed}/${total}`);
  console.log(
    `  Average Response:  ${Math.round(results.reduce((a, r) => a + r.timing, 0) / total)}ms`,
  );
  console.log("");

  console.log("  Service Status:");
  console.log(`    ├─ Webhook:      ${webhookOk ? "✅ Online" : "❌ Offline"}`);
  console.log(
    `    ├─ UltraMsg:     ${ultramsgOk ? "✅ Connected" : "⚠️ Check"}`,
  );
  console.log(
    `    ├─ Supabase:     ${supabaseOk ? "✅ Connected" : "❌ Failed"}`,
  );
  console.log(`    └─ OpenAI:       ${openaiOk ? "✅ Active" : "⚠️ Fallback"}`);
  console.log("");

  if (passed === total && webhookOk && supabaseOk) {
    console.log("  🎉 WhatsApp messaging system is FULLY OPERATIONAL!");
  } else {
    console.log("  ⚠️ Some issues detected. Check the logs above.");
  }

  console.log("");
  console.log("═".repeat(60));
  console.log("");
  console.log("📌 Webhook URL for UltraMsg:");
  console.log(
    `   ${NEXT_APP_URL}/api/webhook/whatsapp?secret=${WEBHOOK_SECRET}`,
  );
  console.log("");
}

// Load env
import "dotenv/config";

runTests();
