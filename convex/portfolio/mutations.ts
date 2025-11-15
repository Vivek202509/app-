import { v } from "convex/values";
import { mutation } from "../_generated/server.js";

export const addHolding = mutation({
  args: {
    userId: v.id("users"),
    symbol: v.string(),
    companyName: v.string(),
    quantity: v.number(),
    avgBuyPrice: v.number(),
    currentPrice: v.number(),
    sector: v.string(),
    type: v.union(v.literal("Equity"), v.literal("ETF"), v.literal("Mutual Fund")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("holdings", args);
  },
});

export const updateHolding = mutation({
  args: {
    holdingId: v.id("holdings"),
    quantity: v.optional(v.number()),
    avgBuyPrice: v.optional(v.number()),
    currentPrice: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { holdingId, ...updates } = args;
    await ctx.db.patch(holdingId, updates);
  },
});

export const deleteHolding = mutation({
  args: { holdingId: v.id("holdings") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.holdingId);
  },
});

export const updateHoldingPrices = mutation({
  args: {
    holdings: v.array(
      v.object({
        holdingId: v.id("holdings"),
        currentPrice: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    for (const { holdingId, currentPrice } of args.holdings) {
      await ctx.db.patch(holdingId, { currentPrice });
    }
  },
});
