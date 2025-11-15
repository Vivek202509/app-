import { query } from "../_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";

export const getTopInvestors = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({
        message: "User not logged in",
        code: "UNAUTHENTICATED",
      });
    }

    const investors = await ctx.db.query("topInvestors").collect();

    // Get user's followed investors
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

    const followedInvestors = await ctx.db
      .query("followedInvestors")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const followedIds = new Set(followedInvestors.map((f) => f.investorId));

    return investors.map((investor) => ({
      ...investor,
      isFollowing: followedIds.has(investor._id),
    }));
  },
});

export const getInvestorDetails = query({
  args: { investorId: v.id("topInvestors") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({
        message: "User not logged in",
        code: "UNAUTHENTICATED",
      });
    }

    const investor = await ctx.db.get(args.investorId);
    if (!investor) {
      throw new ConvexError({
        message: "Investor not found",
        code: "NOT_FOUND",
      });
    }

    // Get holdings
    const holdings = await ctx.db
      .query("investorHoldings")
      .withIndex("by_investor", (q) => q.eq("investorId", args.investorId))
      .collect();

    // Get recent trades
    const trades = await ctx.db
      .query("investorTrades")
      .withIndex("by_investor", (q) => q.eq("investorId", args.investorId))
      .order("desc")
      .take(10);

    // Check if user is following
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

    const following = await ctx.db
      .query("followedInvestors")
      .withIndex("by_user_and_investor", (q) =>
        q.eq("userId", user._id).eq("investorId", args.investorId),
      )
      .unique();

    return {
      investor,
      holdings,
      trades,
      isFollowing: !!following,
    };
  },
});

export const getFollowedInvestors = query({
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

    const followedInvestors = await ctx.db
      .query("followedInvestors")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const investors = await Promise.all(
      followedInvestors.map(async (f) => {
        const investor = await ctx.db.get(f.investorId);
        return investor;
      }),
    );

    return investors.filter((inv) => inv !== null);
  },
});
