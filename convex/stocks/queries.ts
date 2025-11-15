import { v } from "convex/values";
import { query } from "../_generated/server.js";

export const getUserAnalyses = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const analyses = await ctx.db
      .query("stockAnalyses")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(20);
    return analyses;
  },
});

export const getAnalysisBySymbol = query({
  args: { userId: v.id("users"), symbol: v.string() },
  handler: async (ctx, { userId, symbol }) => {
    const analysis = await ctx.db
      .query("stockAnalyses")
      .withIndex("by_user_and_symbol", (q) =>
        q.eq("userId", userId).eq("symbol", symbol)
      )
      .order("desc")
      .first();
    return analysis;
  },
});
