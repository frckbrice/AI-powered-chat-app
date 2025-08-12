import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

// https://docs.convex.dev/functions/http-actions
// Internal functions can only be called by other functions and cannot be called directly from a Convex client.

const http = httpRouter();

const ISSUER =
  (process.env.CLERK_JWT_ISSUER_DOMAIN as string | undefined) ||
  (process.env.CLERK_APP_DOMAIN as string | undefined) ||
  "";

if (!ISSUER) {
  console.warn(
    "CLERK_JWT_ISSUER_DOMAIN/CLERK_APP_DOMAIN is not set; webhook user mapping may fail.",
  );
}

http.route({
  path: "/clerk",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const payloadString = await req.text();
    const headerPayload = req.headers;

    const svixId = headerPayload.get("svix-id");
    const svixSig = headerPayload.get("svix-signature");
    const svixTs = headerPayload.get("svix-timestamp");
    if (!svixId || !svixSig || !svixTs) {
      return new Response("Missing Svix headers", { status: 400 });
    }

    try {
      const result = await ctx.runAction(internal.clerk.fulfill, {
        payload: payloadString,
        headers: {
          "svix-id": headerPayload.get("svix-id")!,
          "svix-signature": headerPayload.get("svix-signature")!,
          "svix-timestamp": headerPayload.get("svix-timestamp")!,
        },
      });

      console.log("\n\n result", result.type, "\n\n");

      switch (result.type) {
        case "user.created":
          console.log("\n\n user.created", { id: result.data.id });
          await ctx.runMutation(internal.users.createUser, {
            tokenIdentifier: `${ISSUER}|${result.data.id}`,
            email: result.data.email_addresses[0]?.email_address,
            name: `${result.data.first_name ?? "Guest"} ${result.data.last_name ?? ""}`,
            image: result.data.image_url,
          });
          break;
        case "user.updated":
          console.log("\n\n user.updated", { id: result.data.id });
          await ctx.runMutation(internal.users.updateUser, {
            tokenIdentifier: `${ISSUER}|${result.data.id}`,
            image: result.data.image_url,
          });
          break;
        case "session.created":
          console.log("\n\n session.created", { userId: result.data.user_id });
          await ctx.runMutation(internal.users.setUserOnline, {
            tokenIdentifier: `${ISSUER}|${result.data.user_id}`,
          });
          break;
        case "session.ended":
        case "session.removed":
          console.log("\n\n session.ended", { userId: result.data.user_id });
          await ctx.runMutation(internal.users.setUserOffline, {
            tokenIdentifier: `${ISSUER}|${result.data.user_id}`,
          });
          break;
      }

      return new Response(null, {
        status: 200,
      });
    } catch (error) {
      console.log("Webhook Error🔥🔥", error);

      // Return more specific error responses based on the error type
      if (error instanceof Error) {
        if (error.message.includes("No matching signature found")) {
          console.error("Signature verification failed - check webhook secret and endpoint URL");
          return new Response("Signature verification failed", { status: 401 });
        }
        if (error.message.includes("Invalid signature")) {
          console.error("Invalid signature - check webhook secret");
          return new Response("Invalid signature", { status: 401 });
        }
      }

      return new Response("Webhook Error", {
        status: 500,
      });
    }
  }),
});

export default http;
