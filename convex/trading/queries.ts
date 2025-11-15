import { v } from "convex/values";
import { query } from "../_generated/server.js";

export const getTradeIdeas = query({
  args: {
    type: v.optional(
      v.union(
        v.literal("Equity"),
        v.literal("Futures"),
        v.literal("Options"),
        v.literal("Commodity")
      )
    ),
  },
  handler: async (ctx, { type }) => {
    if (type) {
      return await ctx.db
        .query("tradeIdeas")
        .withIndex("by_type", (q) => q.eq("type", type))
        .order("desc")
        .take(50);
    }
    return await ctx.db.query("tradeIdeas").order("desc").take(50);
  },
});

export const getSignals = query({
  args: {
    type: v.optional(v.union(v.literal("BUY"), v.literal("SELL"))),
  },
  handler: async (ctx, { type }) => {
    if (type) {
      return await ctx.db
        .query("signals")
        .withIndex("by_type", (q) => q.eq("type", type))
        .order("desc")
        .take(30);
    }
    return await ctx.db.query("signals").order("desc").take(30);
  },
});
