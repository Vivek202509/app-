import { v } from "convex/values";
import { mutation } from "../_generated/server.js";
import type { Id } from "../_generated/dataModel.d.ts";

export const saveAnalysis = mutation({
  args: {
    userId: v.id("users"),
    symbol: v.string(),
    companyName: v.string(),
    currentPrice: v.number(),
    priceChange: v.number(),
    priceChangePercent: v.number(),
    recommendation: v.union(v.literal("BUY"), v.literal("HOLD"), v.literal("SELL")),
    aiAnalysis: v.string(),
    confidence: v.number(),
    targetPrice: v.number(),
    stopLoss: v.number(),
    technicalIndicators: v.object({
      rsi: v.number(),
      macd: v.string(),
      ema50: v.number(),
      ema200: v.number(),
      volume: v.string(),
    }),
    fundamentals: v.object({
      marketCap: v.string(),
      pe: v.number(),
      eps: v.number(),
      divYield: v.optional(v.number()),
    }),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("stockAnalyses", args);
  },
});
