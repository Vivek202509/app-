import { mutation } from "../_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";

export const addToWatchlist = mutation({
  args: {
    symbol: v.string(),
    companyName: v.string(),
    currentPrice: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({
        message: "User not logged in",
        code: "UNAUTHENTICATED",
      });
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();

    if (!user) {
      throw new ConvexError({
        message: "User not found",
        code: "NOT_FOUND",
      });
    }

    // Check if already in watchlist
    const existing = await ctx.db
      .query("watchlist")
      .withIndex("by_user_and_symbol", (q) =>
        q.eq("userId", user._id).eq("symbol", args.symbol),
      )
      .unique();

    if (existing) {
      throw new ConvexError({
        message: "Stock already in watchlist",
        code: "CONFLICT",
      });
    }

    const watchlistId = await ctx.db.insert("watchlist", {
      userId: user._id,
      symbol: args.symbol,
      companyName: args.companyName,
      addedPrice: args.currentPrice,
    });

    return watchlistId;
  },
});

export const removeFromWatchlist = mutation({
  args: { watchlistId: v.id("watchlist") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({
        message: "User not logged in",
        code: "UNAUTHENTICATED",
      });
    }

    await ctx.db.delete(args.watchlistId);
  },
});

export const addScalperSignal = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({
        message: "User not logged in",
        code: "UNAUTHENTICATED",
      });
    }

    const signalId = await ctx.db.insert("scalperSignals", {
      symbol: args.symbol,
      companyName: args.companyName,
      type: args.type,
      price: args.price,
      signal: args.signal,
      timeframe: args.timeframe,
      indicators: args.indicators,
    });

    return signalId;
  },
});
