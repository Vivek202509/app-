import { query } from "../_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";

// Mock real-time stock data for scalper mode
const SCALPER_STOCKS = [
  { symbol: "RELIANCE", companyName: "Reliance Industries", price: 2456.30, change: 1.8, rsi: 58, macd: "Bullish", supertrend: "Buy", volume: "High" },
  { symbol: "TCS", companyName: "Tata Consultancy Services", price: 3678.50, change: 0.9, rsi: 62, macd: "Bullish", supertrend: "Buy", volume: "Normal" },
  { symbol: "HDFCBANK", companyName: "HDFC Bank", price: 1687.20, change: -0.5, rsi: 54, macd: "Neutral", supertrend: "Neutral", volume: "Normal" },
  { symbol: "INFY", companyName: "Infosys", price: 1456.80, change: 2.3, rsi: 59, macd: "Bullish", supertrend: "Buy", volume: "High" },
  { symbol: "ICICIBANK", companyName: "ICICI Bank", price: 1145.60, change: 1.1, rsi: 56, macd: "Bullish", supertrend: "Buy", volume: "Normal" },
  { symbol: "SBIN", companyName: "State Bank of India", price: 789.60, change: 2.8, rsi: 61, macd: "Bullish", supertrend: "Buy", volume: "High" },
  { symbol: "BHARTIARTL", companyName: "Bharti Airtel", price: 1523.80, change: 3.2, rsi: 65, macd: "Bullish", supertrend: "Buy", volume: "Very High" },
  { symbol: "ASIANPAINT", companyName: "Asian Paints", price: 2789.60, change: -1.2, rsi: 45, macd: "Bearish", supertrend: "Sell", volume: "Low" },
  { symbol: "MARUTI", companyName: "Maruti Suzuki", price: 12456.30, change: 2.1, rsi: 63, macd: "Bullish", supertrend: "Buy", volume: "High" },
  { symbol: "TITAN", companyName: "Titan Company", price: 3234.80, change: 4.8, rsi: 72, macd: "Bullish", supertrend: "Buy", volume: "Very High" },
];

export const getWatchlist = query({
  args: {},
  handler: async (ctx) => {
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

    const watchlistItems = await ctx.db
      .query("watchlist")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    // Simulate real-time price updates by adding small random variations
    const variation = Math.random() * 0.4 - 0.2; // -0.2% to +0.2%

    return watchlistItems.map((item) => {
      const stockData = SCALPER_STOCKS.find((s) => s.symbol === item.symbol);
      if (!stockData) {
        return {
          ...item,
          currentPrice: item.addedPrice,
          change: 0,
          rsi: 50,
          macd: "Neutral",
          supertrend: "Neutral",
          volume: "Normal",
        };
      }

      const simulatedPrice = stockData.price * (1 + variation / 100);
      const priceChange =
        ((simulatedPrice - item.addedPrice) / item.addedPrice) * 100;

      return {
        ...item,
        currentPrice: simulatedPrice,
        change: stockData.change + variation,
        priceChange,
        rsi: stockData.rsi,
        macd: stockData.macd,
        supertrend: stockData.supertrend,
        volume: stockData.volume,
      };
    });
  },
});

export const getScalperSignals = query({
  args: { symbol: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({
        message: "User not logged in",
        code: "UNAUTHENTICATED",
      });
    }

    // Get recent signals (last 20)
    let signals = await ctx.db
      .query("scalperSignals")
      .order("desc")
      .take(20);

    // Filter by symbol if provided
    if (args.symbol) {
      signals = signals.filter((s) => s.symbol === args.symbol);
    }

    return signals;
  },
});

export const getAvailableStocks = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({
        message: "User not logged in",
        code: "UNAUTHENTICATED",
      });
    }

    // Add small random variations to simulate real-time updates
    const variation = Math.random() * 0.3 - 0.15;

    return SCALPER_STOCKS.map((stock) => ({
      ...stock,
      price: stock.price * (1 + variation / 100),
      change: stock.change + variation,
    }));
  },
});
