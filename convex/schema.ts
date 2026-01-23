import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,
  user_profiles: defineTable({
    user_id: v.string(),
    full_name: v.optional(v.string()),
    avatar_url: v.optional(v.string()),
    subscription_status: v.union(v.literal("free"), v.literal("premium"), v.literal("enterprise")),
    created_at: v.number(),
    updated_at: v.number(),
  })
    .index("by_user_id", ["user_id"])
    .index("by_subscription_status", ["subscription_status"]),

  interaction_logs: defineTable({
    user_id: v.string(),
    model_name: v.string(),
    prompt: v.string(),
    response: v.string(),
    tokens_used: v.number(),
    response_time_ms: v.optional(v.number()),
    created_at: v.number(),
  })
    .index("by_user_id", ["user_id"])
    .index("by_model_name", ["model_name"]),

  model_access: defineTable({
    user_id: v.string(),
    model_name: v.string(),
    has_access: v.boolean(),
    created_at: v.number(),
    updated_at: v.number(),
  })
    .index("by_user_id", ["user_id"])
    .index("by_model_name", ["model_name"]),

  usage_analytics: defineTable({
    user_id: v.string(),
    date: v.string(), // YYYY-MM-DD
    total_tokens: v.number(),
    total_requests: v.number(),
    created_at: v.number(),
    updated_at: v.number(),
  })
    .index("by_user_id", ["user_id"])
    .index("by_date", ["date"]),
});