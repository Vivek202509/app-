import { mutation } from "../_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";

export const followInvestor = mutation({
  args: { investorId: v.id("topInvestors") },
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

    // Check if already following
    const existing = await ctx.db
      .query("followedInvestors")
      .withIndex("by_user_and_investor", (q) =>
        q.eq("userId", user._id).eq("investorId", args.investorId),
      )
      .unique();

    if (existing) {
      throw new ConvexError({
        message: "Already following this investor",
        code: "CONFLICT",
      });
    }

    const followId = await ctx.db.insert("followedInvestors", {
      userId: user._id,
      investorId: args.investorId,
    });

    // Increment followers count
    const investor = await ctx.db.get(args.investorId);
    if (investor) {
      await ctx.db.patch(args.investorId, {
        followers: investor.followers + 1,
      });
    }

    return followId;
  },
});

export const unfollowInvestor = mutation({
  args: { investorId: v.id("topInvestors") },
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

    const existing = await ctx.db
      .query("followedInvestors")
      .withIndex("by_user_and_investor", (q) =>
        q.eq("userId", user._id).eq("investorId", args.investorId),
      )
      .unique();

    if (!existing) {
      throw new ConvexError({
        message: "Not following this investor",
        code: "NOT_FOUND",
      });
    }

    await ctx.db.delete(existing._id);

    // Decrement followers count
    const investor = await ctx.db.get(args.investorId);
    if (investor && investor.followers > 0) {
      await ctx.db.patch(args.investorId, {
        followers: investor.followers - 1,
      });
    }
  },
});
