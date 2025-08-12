"use node";

import type { WebhookEvent } from "@clerk/backend";
import { v } from "convex/values";

import { Webhook } from "svix";

import { internalAction } from "./_generated/server";

const WEB_HOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET as string;

export const fulfill = internalAction({
  args: {
    headers: v.any(),
    payload: v.string(),
  },
  handler: async (ctx, args) => {
    if (!WEB_HOOK_SECRET) {
      throw new Error("Missing CLERK_WEBHOOK_SECRET in your .env file");
    }
    try {
      const wh = new Webhook(WEB_HOOK_SECRET);
      const payload = wh.verify(args.payload, args.headers) as WebhookEvent;

      console.log("Webhook verified:", payload.type);

      return payload;
    } catch (error) {
      console.error("Webhook Error🔥🔥", error);
      throw error;
    }
  },
});

// https://docs.convex.dev/functions/internal-functions
