import { mutation } from "../_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";

export const saveScreener = mutation({
  args: {
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

    const screenerId = await ctx.db.insert("screeners", {
      userId: user._id,
      name: args.name,
      criteria: args.criteria,
    });

    return screenerId;
  },
});

export const deleteScreener = mutation({
  args: { screenerId: v.id("screeners") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({
        message: "User not logged in",
        code: "UNAUTHENTICATED",
      });
    }

    await ctx.db.delete(args.screenerId);
  },
});
