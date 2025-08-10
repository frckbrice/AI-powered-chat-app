import { internalMutation, query, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";
import type { QueryCtx, MutationCtx } from "./_generated/server";

// =======================
// Constants
// =======================
const DEFAULT_GUEST = {
  email: "unknown@example.com",
  name: "Guest",
  image: "https://picsum.photos/64",
  isOnline: true,
};

// =======================
// Helper: find user by tokenIdentifier
// =======================
async function findUserByToken(ctx: QueryCtx | MutationCtx, tokenIdentifier: string) {
  return ctx.db
    .query("users")
    .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", tokenIdentifier))
    .unique();
}

// =======================
// Mutations
// =======================
export const createUser = internalMutation({
  args: {
    tokenIdentifier: v.string(),
    email: v.string(),
    name: v.string(),
    image: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const existing = await findUserByToken(ctx, args.tokenIdentifier);

      if (existing) {
        await ctx.db.patch(existing._id, {
          email: args.email,
          name: args.name,
          image: args.image,
          isOnline: true,
        });
        console.log("[users:createUser] Upserted (patched) user:", existing._id);
        return existing._id;
      }

      const userId = await ctx.db.insert("users", {
        ...args,
        isOnline: true,
      });

      console.log("[users:createUser] Created user:", userId);
      return userId;
    } catch (error) {
      console.error("[users:createUser] Error:", error);
      throw new ConvexError("Failed to create or update user");
    }
  },
});

export const updateUser = internalMutation({
  args: {
    tokenIdentifier: v.string(),
    image: v.string(),
  },
  async handler(ctx, args) {
    try {
      const user = await findUserByToken(ctx, args.tokenIdentifier);
      if (!user) throw new ConvexError("User not found");

      await ctx.db.patch(user._id, { image: args.image });
      console.log("[users:updateUser] Updated image for:", user._id);
    } catch (error) {
      console.error("[users:updateUser] Error:", error);
      throw new ConvexError("Failed to update user");
    }
  },
});

export const setUserOnline = internalMutation({
  args: { tokenIdentifier: v.string() },
  handler: async (ctx, args) => {
    try {
      const user = await findUserByToken(ctx, args.tokenIdentifier);
      if (!user) {
        const id = await ctx.db.insert("users", {
          tokenIdentifier: args.tokenIdentifier,
          ...DEFAULT_GUEST,
        });
        console.log("[users:setUserOnline] Created guest user:", id);
        return;
      }

      await ctx.db.patch(user._id, { isOnline: true });
      console.log("[users:setUserOnline] Marked online:", user._id);
    } catch (error) {
      console.error("[users:setUserOnline] Error:", error);
    }
  },
});

export const setUserOffline = internalMutation({
  args: { tokenIdentifier: v.string() },
  handler: async (ctx, args) => {
    try {
      const user = await findUserByToken(ctx, args.tokenIdentifier);
      if (!user) {
        console.warn("[users:setUserOffline] User not found:", args.tokenIdentifier);
        return;
      }

      await ctx.db.patch(user._id, { isOnline: false });
      console.log("[users:setUserOffline] Marked offline:", user._id);
    } catch (error) {
      console.error("[users:setUserOffline] Error:", error);
    }
  },
});

// =======================
// Queries
// =======================
export const getUsers = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    console.log("identity: ", await ctx.auth.getUserIdentity());
    if (!identity) return null;

    // Prefer filtering at DB level instead of in JS
    const users = await ctx.db
      .query("users")
      .filter((q) => q.neq(q.field("tokenIdentifier"), identity.tokenIdentifier))
      .collect();

    return users;
  },
});

export const getMe = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await findUserByToken(ctx, identity.tokenIdentifier);
    if (!user) throw new ConvexError("User not found");

    return user;
  },
});
