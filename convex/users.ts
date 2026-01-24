import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Query to get user profile
export const getUserProfile = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("user_profiles")
      .withIndex("by_user_id", (q) => q.eq("user_id", args.userId))
      .first();
    return profile;
  },
});

// Mutation to update user profile
export const updateUserProfile = mutation({
  args: {
    userId: v.optional(v.string()),
    full_name: v.optional(v.string()),
    email: v.optional(v.string()),
    avatar_url: v.optional(v.string()),
    subscription_status: v.optional(v.union(v.literal("free"), v.literal("premium"), v.literal("enterprise"))),
  },
  handler: async (ctx, args) => {
    let userId = args.userId;
    
    // If no userId provided, get from current authenticated user
    if (!userId) {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) {
        throw new Error("Not authenticated");
      }
      userId = identity.subject;
    }

    const { userId: _, ...updates } = args;
    const existing = await ctx.db
      .query("user_profiles")
      .withIndex("by_user_id", (q) => q.eq("user_id", userId))
      .first();

    if (!existing) {
      // Create new profile
      return await ctx.db.insert("user_profiles", {
        user_id: userId,
        full_name: updates.full_name,
        avatar_url: updates.avatar_url,
        subscription_status: updates.subscription_status || "free",
        created_at: Date.now(),
        updated_at: Date.now(),
      });
    } else {
      // Update existing
      await ctx.db.patch(existing._id, {
        ...updates,
        updated_at: Date.now(),
      });
      return await ctx.db.get(existing._id);
    }
  },
});

// Mutation to create user profile (called when user first signs in)
export const createUserProfile = mutation({
  args: {
    full_name: v.optional(v.string()),
    email: v.optional(v.string()),
    avatar_url: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const existing = await ctx.db
      .query("user_profiles")
      .withIndex("by_user_id", (q) => q.eq("user_id", identity.subject))
      .first();

    if (existing) {
      return existing;
    }

    return await ctx.db.insert("user_profiles", {
      user_id: identity.subject,
      full_name: args.full_name || identity.name || "User",
      email: args.email || identity.email,
      avatar_url: args.avatar_url || identity.picture,
      subscription_status: "free",
      created_at: Date.now(),
      updated_at: Date.now(),
    });
  },
});