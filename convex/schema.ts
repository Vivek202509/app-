import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    tokenIdentifier: v.string(),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
  }).index("by_token", ["tokenIdentifier"]),

  stockAnalyses: defineTable({
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
  })
    .index("by_user", ["userId"])
    .index("by_user_and_symbol", ["userId", "symbol"]),

  holdings: defineTable({
    userId: v.id("users"),
    symbol: v.string(),
    companyName: v.string(),
    quantity: v.number(),
    avgBuyPrice: v.number(),
    currentPrice: v.number(),
    sector: v.string(),
    type: v.union(v.literal("Equity"), v.literal("ETF"), v.literal("Mutual Fund")),
  }).index("by_user", ["userId"]),

  tradeIdeas: defineTable({
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
  }).index("by_type", ["type"]),

  signals: defineTable({
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
  }).index("by_type", ["type"]),

  screeners: defineTable({
    userId: v.id("users"),
    name: v.string(),
    criteria: v.object({
      priceMin: v.optional(v.number()),
      priceMax: v.optional(v.number()),
      marketCapMin: v.optional(v.number()),
      peMin: v.optional(v.number()),
      peMax: v.optional(v.number()),
      rsiMin: v.optional(v.number()),
      rsiMax: v.optional(v.number()),
      volumeChange: v.optional(v.string()),
      priceChange: v.optional(v.string()),
      sector: v.optional(v.string()),
      divYield: v.optional(v.number()),
    }),
  }).index("by_user", ["userId"]),

  watchlist: defineTable({
    userId: v.id("users"),
    symbol: v.string(),
    companyName: v.string(),
    addedPrice: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_symbol", ["userId", "symbol"]),

  scalperSignals: defineTable({
    symbol: v.string(),
    companyName: v.string(),
    type: v.union(v.literal("BUY"), v.literal("SELL")),
    price: v.number(),
    signal: v.string(),
    timeframe: v.string(),
    indicators: v.object({
      rsi: v.number(),
      macd: v.string(),
      supertrend: v.string(),
      volumeSpike: v.boolean(),
    }),
  }).index("by_symbol", ["symbol"]),

  topInvestors: defineTable({
    name: v.string(),
    avatar: v.string(),
    title: v.string(),
    description: v.string(),
    totalReturn: v.number(),
    annualReturn: v.number(),
    winRate: v.number(),
    aum: v.string(),
    followers: v.number(),
    expertise: v.array(v.string()),
    strategy: v.string(),
  }),

  investorHoldings: defineTable({
    investorId: v.id("topInvestors"),
    symbol: v.string(),
    companyName: v.string(),
    quantity: v.number(),
    avgBuyPrice: v.number(),
    currentPrice: v.number(),
    sector: v.string(),
    allocation: v.number(),
  }).index("by_investor", ["investorId"]),

  investorTrades: defineTable({
    investorId: v.id("topInvestors"),
    symbol: v.string(),
    companyName: v.string(),
    action: v.union(v.literal("BUY"), v.literal("SELL")),
    quantity: v.number(),
    price: v.number(),
    reason: v.string(),
  }).index("by_investor", ["investorId"]),

  followedInvestors: defineTable({
    userId: v.id("users"),
    investorId: v.id("topInvestors"),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_investor", ["userId", "investorId"]),
});
