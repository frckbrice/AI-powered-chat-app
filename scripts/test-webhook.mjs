// Minimal Clerk → Convex webhook tester.
// Usage:
//   CLERK_WEBHOOK_SECRET=svix_... CONVEX_WEBHOOK_URL=https://<your-convex>.convex.cloud/clerk node scripts/test-webhook.mjs

import { Webhook } from "svix";

const SECRET = process.env.CLERK_WEBHOOK_SECRET;
const URL = process.env.CONVEX_WEBHOOK_URL;

if (!SECRET || !URL) {
  console.error("Missing CLERK_WEBHOOK_SECRET or CONVEX_WEBHOOK_URL env vars.");
  process.exit(1);
}

async function send(payload) {
  const wh = new Webhook(SECRET);
  const body = JSON.stringify(payload);
  const headers = wh.sign(body);
  const res = await fetch(URL, { method: "POST", headers, body });
  const text = await res.text();
  console.log(payload.type, res.status, text || "ok");
}

const userId = "user_test_1";

(async () => {
  await send({
    type: "user.created",
    data: {
      id: userId,
      email_addresses: [{ email_address: "test@example.com" }],
      first_name: "Test",
      last_name: "User",
      image_url: "https://picsum.photos/100",
    },
  });

  await send({ type: "session.created", data: { user_id: userId } });
  await send({ type: "session.ended", data: { user_id: userId } });
  await send({ type: "session.revoked", data: { user_id: userId } });
})();
