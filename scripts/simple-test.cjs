/**
 * Simple WhatsApp API Test
 * Run: node scripts/simple-test.cjs
 */

const NEXT_APP_URL = "http://localhost:3002";
const WEBHOOK_SECRET = "masar2024secret";

async function testWebhook() {
  console.log("Testing WhatsApp Webhook on port 3002...\n");

  // Test 1: GET verification
  try {
    const res = await fetch(
      `${NEXT_APP_URL}/api/webhook/whatsapp?secret=${WEBHOOK_SECRET}`,
    );
    const data = await res.json();
    console.log("✅ GET Verification:", data);
  } catch (err) {
    console.log("❌ GET failed:", err.message);
  }

  // Test 2: POST message
  try {
    const payload = {
      event_type: "message_received",
      data: {
        id: `test_${Date.now()}`,
        from: "966555555555",
        body: "ابغى شقة في الرياض",
        type: "chat",
        fromMe: false,
      },
    };

    const res = await fetch(
      `${NEXT_APP_URL}/api/webhook/whatsapp?secret=${WEBHOOK_SECRET}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );

    const data = await res.json();
    console.log("\n✅ POST Message Test:", data);
  } catch (err) {
    console.log("❌ POST failed:", err.message);
  }

  console.log("\n✅ Tests completed!");
}

testWebhook();
