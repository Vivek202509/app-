import { v } from "convex/values";
import { query } from "../_generated/server.js";

export const getUserHoldings = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const holdings = await ctx.db
      .query("holdings")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    return holdings;
  },
});
