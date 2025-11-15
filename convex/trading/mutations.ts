import { v } from "convex/values";
import { mutation } from "../_generated/server.js";

export const addTradeIdea = mutation({
  args: {
    symbol: v.string(),
    companyName: v.string(),
    analystName: v.string(),
    type: v.union(
      v.literal("Equity"),
      v.literal("Futures"),
      v.literal("Options"),
      v.literal("Commodity")
    ),
    action: v.union(v.literal("BUY"), v.literal("SELL")),
    entryPrice: v.number(),
    targetPrice: v.number(),
    stopLoss: v.number(),
    duration: v.string(),
    reason: v.string(),
    riskRewardRatio: v.string(),
    confidence: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("tradeIdeas", args);
  },
});

export const addSignal = mutation({
  args: {
    symbol: v.string(),
    companyName: v.string(),
    type: v.union(v.literal("BUY"), v.literal("SELL")),
    price: v.number(),
    reason: v.string(),
    indicators: v.object({
      rsi: v.optional(v.number()),
      macd: v.optional(v.string()),
      ema: v.optional(v.string()),
      supertrend: v.optional(v.string()),
      volume: v.optional(v.string()),
    }),
    strength: v.union(v.literal("Strong"), v.literal("Moderate"), v.literal("Weak")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("signals", args);
  },
});
