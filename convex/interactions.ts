import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Mutation to log interaction
export const logInteraction = mutation({
  args: {
    userId: v.string(),
    modelName: v.string(),
    prompt: v.string(),
    response: v.string(),
    tokensUsed: v.number(),
    responseTimeMs: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("interaction_logs", {
      user_id: args.userId,
      model_name: args.modelName,
      prompt: args.prompt,
      response: args.response,
      tokens_used: args.tokensUsed,
      response_time_ms: args.responseTimeMs,
      created_at: Date.now(),
    });
  },
});