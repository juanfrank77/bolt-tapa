import { convexAuth, getAuthUserId } from "@convex-dev/auth/server";
import Google from "@auth/core/providers/google";
import Postmark from "@auth/core/providers/postmark";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const { auth, signIn, signOut: convexSignOut, store, isAuthenticated } = convexAuth({
  providers: [Google, Postmark],
});

// Mutation to sign in (email/password)
export const signInWithPassword = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx) => {
    // Note: Convex Auth uses OAuth providers primarily
    // For email/password auth, you'd need to implement your own logic
    // or use a service like Auth0, Clerk, etc.
    
    throw new Error("Email/password authentication not implemented");
  },
});

//Mutation to sign in with OTP
export const signInWithOTP = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx) => {
    // Implement OTP sign in logic
    // This would typically involve sending an OTP to the user's email
    // and verifying it on the client side
    throw new Error("OTP authentication not implemented");
  },
});

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null
    }
    return await ctx.db.get(userId);
  }
})