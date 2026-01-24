import { convexAuth } from "@convex-dev/auth/server";
import config from "./auth.config.js";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const { auth, signIn, signOut: convexSignOut, store, isAuthenticated } = convexAuth({
  providers: config.providers,
});

// Mutation to sign out
export const signOut = mutation({
  handler: async (ctx) => {
    // Get current user
    const userId = await ctx.auth.getUserIdentity();
    if (!userId) {
      return;
    }
    
    // Implement sign out logic
    // For Convex Auth, this might involve clearing any session data
    // The actual sign out is handled by Convex Auth internally
    return;
  },
});

// Mutation to sign in (email/password)
export const signInWithPassword = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    // Note: Convex Auth uses OAuth providers primarily
    // For email/password auth, you'd need to implement your own logic
    // or use a service like Auth0, Clerk, etc.
    
    throw new Error("Email/password authentication not implemented");
  },
});

// Query to get current user identity
export const getCurrentUser = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }
    
    return {
      id: identity.subject,
      email: identity.email,
      name: identity.name,
      picture: identity.picture,
    };
  },
});