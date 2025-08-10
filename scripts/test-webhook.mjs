#!/usr/bin/env node

const WEBHOOK_URL = "https://mellow-poodle-790.convex.cloud/clerk";

// Create a test webhook payload
const testPayload = {
  type: "user.created",
  data: {
    id: "test_user_123",
    email_addresses: [{ email_address: "test@example.com" }],
    first_name: "Test",
    last_name: "User",
    image_url: "https://example.com/avatar.jpg",
  },
};

async function testWebhook() {
  try {
    console.log("Testing webhook endpoint...");
    console.log("URL:", WEBHOOK_URL);
    console.log("Payload:", JSON.stringify(testPayload, null, 2));

    // Make the request with minimal headers to test if endpoint is reachable
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "svix-id": "test_svix_id",
        "svix-timestamp": new Date().toISOString(),
        "svix-signature": "test_signature",
      },
      body: JSON.stringify(testPayload),
    });

    console.log("Response status:", response.status);
    console.log("Response body:", await response.text());

    if (response.status === 401) {
      console.log("✅ Endpoint is reachable but signature verification failed (expected for test)");
    } else if (response.ok) {
      console.log("✅ Webhook test successful!");
    } else {
      console.log("❌ Webhook test failed with status:", response.status);
    }
  } catch (error) {
    console.error("Error testing webhook:", error);
  }
}

testWebhook();
