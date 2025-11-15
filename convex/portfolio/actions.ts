"use node";

import { v } from "convex/values";
import { action } from "../_generated/server.js";
import { api } from "../_generated/api.js";
import OpenAI from "openai";

export const generatePortfolioInsights = action({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }): Promise<{
    overallHealth: string;
    diversificationScore: number;
    riskLevel: string;
    suggestions: string[];
    rebalancingAdvice: string;
  }> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("User not authenticated");
    }

    const holdings = await ctx.runQuery(api.portfolio.queries.getUserHoldings, {
      userId,
    });

    if (holdings.length === 0) {
      return {
        overallHealth: "No holdings",
        diversificationScore: 0,
        riskLevel: "Unknown",
        suggestions: ["Add holdings to get portfolio insights"],
        rebalancingAdvice: "Start by adding your first holding",
      };
    }

    // Calculate portfolio metrics
    let totalValue = 0;
    let totalGain = 0;
    const sectorAllocation: Record<string, number> = {};

    for (const holding of holdings) {
      const invested = holding.quantity * holding.avgBuyPrice;
      const current = holding.quantity * holding.currentPrice;
      totalValue += current;
      totalGain += current - invested;

      sectorAllocation[holding.sector] =
        (sectorAllocation[holding.sector] || 0) + current;
    }

    const returnPercent = ((totalGain / (totalValue - totalGain)) * 100).toFixed(
      2
    );

    // Prepare portfolio summary
    const portfolioSummary = `
Portfolio Overview:
- Total Holdings: ${holdings.length}
- Total Value: ₹${totalValue.toLocaleString("en-IN")}
- Total Gain/Loss: ₹${totalGain.toLocaleString("en-IN")} (${returnPercent}%)

Sector Allocation:
${Object.entries(sectorAllocation)
  .map(
    ([sector, value]) =>
      `- ${sector}: ${((value / totalValue) * 100).toFixed(1)}%`
  )
  .join("\n")}

Holdings:
${holdings.map((h) => `- ${h.symbol}: ${h.quantity} shares @ ₹${h.avgBuyPrice} (Current: ₹${h.currentPrice})`).join("\n")}
`;

    // Generate AI insights
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const response = await openai.responses.create({
      model: "gpt-5-mini",
      input: `As a SEBI-certified portfolio analyst, analyze this Indian stock portfolio and provide insights:

${portfolioSummary}

Provide:
1. Overall portfolio health assessment (1-2 sentences)
2. Diversification score (0-100)
3. Risk level (Low/Medium/High)
4. 3-4 specific actionable suggestions
5. Rebalancing advice (2-3 sentences)

Format as JSON:
{
  "overallHealth": "brief assessment",
  "diversificationScore": number,
  "riskLevel": "Low/Medium/High",
  "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"],
  "rebalancingAdvice": "advice here"
}`,
    });

    let aiResult;
    try {
      const jsonMatch = response.output_text?.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        aiResult = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found");
      }
    } catch {
      // Fallback
      const numSectors = Object.keys(sectorAllocation).length;
      aiResult = {
        overallHealth:
          totalGain > 0
            ? "Your portfolio is performing well with positive returns."
            : "Your portfolio needs attention with current losses.",
        diversificationScore: Math.min(numSectors * 20, 100),
        riskLevel: numSectors >= 4 ? "Medium" : "High",
        suggestions: [
          "Consider diversifying across more sectors",
          "Review high-risk positions regularly",
          "Set stop-loss orders for downside protection",
        ],
        rebalancingAdvice:
          "Consider rebalancing to maintain target sector allocations.",
      };
    }

    return aiResult;
  },
});
