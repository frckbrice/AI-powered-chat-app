"use node";

import type { WebhookEvent } from "@clerk/backend";
import { v } from "convex/values";

import { Webhook } from "svix";

import { internalAction } from "./_generated/server";

const WEB_HOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET as string;

if (!WEB_HOOK_SECRET) {
  throw new Error("Missing CLERK_WEBHOOK_SECRET in your .env file");
}

export const fulfill = internalAction({
  args: {
    headers: v.any(),
    payload: v.string(),
  },
  handler: async (ctx, args) => {
    const wh = new Webhook(WEB_HOOK_SECRET);
    const payload = wh.verify(args.payload, args.headers) as WebhookEvent;
    return payload;
  },
});

// https://docs.convex.dev/functions/internal-functions
