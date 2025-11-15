import { query } from "../_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";

// Mock stock universe for screening
const STOCK_UNIVERSE = [
  { symbol: "RELIANCE", companyName: "Reliance Industries", price: 2456.30, marketCap: 16.63, pe: 24.5, rsi: 58, volumeChange: 12.4, priceChange: 1.8, sector: "Energy", divYield: 0.34 },
  { symbol: "TCS", companyName: "Tata Consultancy Services", price: 3678.50, marketCap: 13.42, pe: 28.7, rsi: 62, volumeChange: -5.2, priceChange: 0.9, sector: "IT", divYield: 1.42 },
  { symbol: "HDFCBANK", companyName: "HDFC Bank", price: 1687.20, marketCap: 12.84, pe: 19.3, rsi: 54, volumeChange: 8.7, priceChange: -0.5, sector: "Banking", divYield: 1.15 },
  { symbol: "INFY", companyName: "Infosys", price: 1456.80, marketCap: 6.02, pe: 26.1, rsi: 59, volumeChange: 15.3, priceChange: 2.3, sector: "IT", divYield: 2.15 },
  { symbol: "ICICIBANK", companyName: "ICICI Bank", price: 1145.60, marketCap: 8.03, pe: 18.5, rsi: 56, volumeChange: 10.2, priceChange: 1.1, sector: "Banking", divYield: 0.98 },
  { symbol: "HINDUNILVR", companyName: "Hindustan Unilever", price: 2389.40, marketCap: 5.61, pe: 58.3, rsi: 48, volumeChange: -2.1, priceChange: -0.3, sector: "FMCG", divYield: 1.85 },
  { symbol: "ITC", companyName: "ITC Ltd", price: 478.25, marketCap: 5.96, pe: 28.9, rsi: 52, volumeChange: 6.5, priceChange: 0.7, sector: "FMCG", divYield: 3.45 },
  { symbol: "SBIN", companyName: "State Bank of India", price: 789.60, marketCap: 7.04, pe: 12.8, rsi: 61, volumeChange: 18.9, priceChange: 2.8, sector: "Banking", divYield: 1.52 },
  { symbol: "BHARTIARTL", companyName: "Bharti Airtel", price: 1523.80, marketCap: 9.12, pe: 42.6, rsi: 65, volumeChange: 22.4, priceChange: 3.2, sector: "Telecom", divYield: 0.68 },
  { symbol: "KOTAKBANK", companyName: "Kotak Mahindra Bank", price: 1789.30, marketCap: 3.56, pe: 16.7, rsi: 51, volumeChange: 4.8, priceChange: -0.2, sector: "Banking", divYield: 0.45 },
  { symbol: "LT", companyName: "Larsen & Toubro", price: 3456.90, marketCap: 4.85, pe: 31.2, rsi: 68, volumeChange: 25.6, priceChange: 4.1, sector: "Infrastructure", divYield: 0.92 },
  { symbol: "AXISBANK", companyName: "Axis Bank", price: 1123.40, marketCap: 3.48, pe: 14.2, rsi: 57, volumeChange: 9.3, priceChange: 1.5, sector: "Banking", divYield: 0.78 },
  { symbol: "ASIANPAINT", companyName: "Asian Paints", price: 2789.60, marketCap: 2.67, pe: 52.4, rsi: 45, volumeChange: -8.4, priceChange: -1.2, sector: "Paints", divYield: 0.95 },
  { symbol: "MARUTI", companyName: "Maruti Suzuki", price: 12456.30, marketCap: 3.76, pe: 27.8, rsi: 63, volumeChange: 11.7, priceChange: 2.1, sector: "Automobile", divYield: 0.82 },
  { symbol: "SUNPHARMA", companyName: "Sun Pharmaceutical", price: 1678.90, marketCap: 4.02, pe: 38.5, rsi: 49, volumeChange: 3.2, priceChange: 0.4, sector: "Pharma", divYield: 0.45 },
  { symbol: "TITAN", companyName: "Titan Company", price: 3234.80, marketCap: 2.87, pe: 86.7, rsi: 72, volumeChange: 28.3, priceChange: 4.8, sector: "Consumer Durables", divYield: 0.32 },
  { symbol: "NTPC", companyName: "NTPC Ltd", price: 345.60, marketCap: 3.35, pe: 15.6, rsi: 55, volumeChange: 7.1, priceChange: 0.9, sector: "Power", divYield: 3.12 },
  { symbol: "ONGC", companyName: "Oil & Natural Gas Corp", price: 267.80, marketCap: 3.37, pe: 8.4, rsi: 58, volumeChange: 14.5, priceChange: 2.3, sector: "Energy", divYield: 4.68 },
  { symbol: "POWERGRID", companyName: "Power Grid Corp", price: 289.40, marketCap: 2.67, pe: 13.2, rsi: 53, volumeChange: 5.9, priceChange: 0.6, sector: "Power", divYield: 3.85 },
  { symbol: "ULTRACEMCO", companyName: "UltraTech Cement", price: 9876.50, marketCap: 2.85, pe: 34.5, rsi: 66, volumeChange: 16.8, priceChange: 3.4, sector: "Cement", divYield: 0.58 },
];

export const screenStocks = query({
  args: {
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
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({
        message: "User not logged in",
        code: "UNAUTHENTICATED",
      });
    }

    let results = [...STOCK_UNIVERSE];

    // Apply filters
    if (args.priceMin !== undefined) {
      results = results.filter((s) => s.price >= args.priceMin!);
    }
    if (args.priceMax !== undefined) {
      results = results.filter((s) => s.price <= args.priceMax!);
    }
    if (args.marketCapMin !== undefined) {
      results = results.filter((s) => s.marketCap >= args.marketCapMin!);
    }
    if (args.peMin !== undefined) {
      results = results.filter((s) => s.pe >= args.peMin!);
    }
    if (args.peMax !== undefined) {
      results = results.filter((s) => s.pe <= args.peMax!);
    }
    if (args.rsiMin !== undefined) {
      results = results.filter((s) => s.rsi >= args.rsiMin!);
    }
    if (args.rsiMax !== undefined) {
      results = results.filter((s) => s.rsi <= args.rsiMax!);
    }
    if (args.volumeChange === "high") {
      results = results.filter((s) => s.volumeChange > 15);
    } else if (args.volumeChange === "low") {
      results = results.filter((s) => s.volumeChange < 0);
    }
    if (args.priceChange === "gainers") {
      results = results.filter((s) => s.priceChange > 2);
    } else if (args.priceChange === "losers") {
      results = results.filter((s) => s.priceChange < -0.5);
    }
    if (args.sector) {
      results = results.filter((s) => s.sector === args.sector);
    }
    if (args.divYield !== undefined) {
      results = results.filter((s) => s.divYield >= args.divYield!);
    }

    return results;
  },
});

export const getSavedScreeners = query({
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

    return await ctx.db
      .query("screeners")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
  },
});
