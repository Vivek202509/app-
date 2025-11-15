"use node";

import { v } from "convex/values";
import { action } from "../_generated/server.js";
import { api } from "../_generated/api.js";
import OpenAI from "openai";

// Mock stock data for Indian market stocks
const indianStocks: Record<
  string,
  {
    name: string;
    price: number;
    change: number;
    changePercent: number;
    volume: string;
    marketCap: string;
    pe: number;
    eps: number;
    divYield?: number;
  }
> = {
  RELIANCE: {
    name: "Reliance Industries Ltd",
    price: 2456.3,
    change: 84.75,
    changePercent: 3.45,
    volume: "12.5M",
    marketCap: "₹16.6L Cr",
    pe: 28.5,
    eps: 86.2,
    divYield: 0.35,
  },
  TCS: {
    name: "Tata Consultancy Services Ltd",
    price: 3892.15,
    change: 108.95,
    changePercent: 2.87,
    volume: "8.3M",
    marketCap: "₹14.2L Cr",
    pe: 32.1,
    eps: 121.3,
    divYield: 1.2,
  },
  INFY: {
    name: "Infosys Ltd",
    price: 1654.8,
    change: 37.85,
    changePercent: 2.34,
    volume: "15.7M",
    marketCap: "₹6.9L Cr",
    pe: 29.4,
    eps: 56.3,
    divYield: 2.1,
  },
  HDFC: {
    name: "HDFC Bank Ltd",
    price: 1523.4,
    change: -29.75,
    changePercent: -1.92,
    volume: "18.2M",
    marketCap: "₹11.5L Cr",
    pe: 19.8,
    eps: 76.9,
    divYield: 1.5,
  },
  ICICI: {
    name: "ICICI Bank Ltd",
    price: 892.75,
    change: -13.15,
    changePercent: -1.45,
    volume: "22.1M",
    marketCap: "₹6.3L Cr",
    pe: 18.2,
    eps: 49.1,
    divYield: 1.8,
  },
  SBIN: {
    name: "State Bank of India",
    price: 612.2,
    change: -6.95,
    changePercent: -1.12,
    volume: "28.5M",
    marketCap: "₹5.5L Cr",
    pe: 12.3,
    eps: 49.8,
    divYield: 2.5,
  },
  TATASTEEL: {
    name: "Tata Steel Ltd",
    price: 145.3,
    change: 8.45,
    changePercent: 6.17,
    volume: "45.2M",
    marketCap: "₹1.8L Cr",
    pe: 15.7,
    eps: 9.3,
    divYield: 3.2,
  },
  WIPRO: {
    name: "Wipro Ltd",
    price: 456.8,
    change: -12.35,
    changePercent: -2.63,
    volume: "11.8M",
    marketCap: "₹2.5L Cr",
    pe: 24.1,
    eps: 18.9,
    divYield: 1.9,
  },
  AXISBANK: {
    name: "Axis Bank Ltd",
    price: 1023.5,
    change: 34.25,
    changePercent: 3.46,
    volume: "16.4M",
    marketCap: "₹3.2L Cr",
    pe: 14.8,
    eps: 69.2,
    divYield: 0.8,
  },
  BHARTIARTL: {
    name: "Bharti Airtel Ltd",
    price: 1245.6,
    change: 18.75,
    changePercent: 1.53,
    volume: "9.8M",
    marketCap: "₹7.1L Cr",
    pe: 45.2,
    eps: 27.6,
    divYield: 0.5,
  },
  ITC: {
    name: "ITC Ltd",
    price: 412.3,
    change: 5.65,
    changePercent: 1.39,
    volume: "32.5M",
    marketCap: "₹5.1L Cr",
    pe: 28.9,
    eps: 14.3,
    divYield: 4.2,
  },
  HCLTECH: {
    name: "HCL Technologies Ltd",
    price: 1567.9,
    change: 45.3,
    changePercent: 2.97,
    volume: "7.2M",
    marketCap: "₹4.3L Cr",
    pe: 26.7,
    eps: 58.7,
    divYield: 3.1,
  },
  ASIANPAINT: {
    name: "Asian Paints Ltd",
    price: 2834.5,
    change: -38.2,
    changePercent: -1.33,
    volume: "4.5M",
    marketCap: "₹2.7L Cr",
    pe: 52.3,
    eps: 54.2,
    divYield: 0.9,
  },
  MARUTI: {
    name: "Maruti Suzuki India Ltd",
    price: 10245.7,
    change: 195.4,
    changePercent: 1.94,
    volume: "1.2M",
    marketCap: "₹3.1L Cr",
    pe: 28.4,
    eps: 360.8,
    divYield: 1.3,
  },
  ADANIENT: {
    name: "Adani Enterprises Ltd",
    price: 2156.8,
    change: 78.9,
    changePercent: 3.8,
    volume: "8.9M",
    marketCap: "₹2.5L Cr",
    pe: 89.5,
    eps: 24.1,
    divYield: 0.2,
  },
};

// Generate technical indicators (mock but realistic)
function generateTechnicalIndicators(price: number, changePercent: number) {
  const rsi = changePercent > 0 ? 55 + Math.random() * 20 : 30 + Math.random() * 20;
  const ema50 = price * (0.95 + Math.random() * 0.1);
  const ema200 = price * (0.85 + Math.random() * 0.2);

  let macd = "Bullish";
  if (changePercent < -2) macd = "Bearish";
  else if (changePercent < 0) macd = "Neutral";

  return {
    rsi: Math.round(rsi * 100) / 100,
    macd,
    ema50: Math.round(ema50 * 100) / 100,
    ema200: Math.round(ema200 * 100) / 100,
  };
}

export const analyzeStock = action({
  args: { symbol: v.string() },
  handler: async (ctx, { symbol }): Promise<{
    analysisId: unknown;
    recommendation: string;
    analysis: string;
    targetPrice: number;
    stopLoss: number;
    confidence: number;
  }> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("User not authenticated");
    }

    const user = await ctx.runQuery(api.users.getCurrentUser);
    if (!user) {
      throw new Error("User not found");
    }

    // Get stock data (uppercase symbol)
    const symbolUpper = symbol.toUpperCase();
    const stockData = indianStocks[symbolUpper];

    if (!stockData) {
      throw new Error(
        "Stock not found. Try: RELIANCE, TCS, INFY, HDFC, ICICI, SBIN, TATASTEEL, WIPRO, AXISBANK, BHARTIARTL, ITC, HCLTECH, ASIANPAINT, MARUTI, ADANIENT"
      );
    }

    // Generate technical indicators
    const technicals = generateTechnicalIndicators(
      stockData.price,
      stockData.changePercent
    );

    // Generate AI analysis using OpenAI
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const prompt = `As a SEBI-certified financial analyst, provide a concise stock analysis for ${stockData.name} (${symbolUpper}).

Current Data:
- Price: ₹${stockData.price} (${stockData.changePercent > 0 ? "+" : ""}${stockData.changePercent}%)
- Market Cap: ${stockData.marketCap}
- P/E Ratio: ${stockData.pe}
- EPS: ${stockData.eps}
- Dividend Yield: ${stockData.divYield || 0}%
- Volume: ${stockData.volume}

Technical Indicators:
- RSI: ${technicals.rsi}
- MACD: ${technicals.macd}
- EMA 50: ₹${technicals.ema50}
- EMA 200: ₹${technicals.ema200}

Provide:
1. Overall recommendation (BUY/HOLD/SELL)
2. 2-3 sentence analysis covering technical and fundamental view
3. Target price (realistic, within 5-15% of current)
4. Stop loss (realistic, within 3-8% below current)
5. Confidence level (0-100)

Format your response as JSON:
{
  "recommendation": "BUY/HOLD/SELL",
  "analysis": "your analysis here",
  "targetPrice": number,
  "stopLoss": number,
  "confidence": number
}`;

    const response = await openai.responses.create({
      model: "gpt-5-mini",
      input: prompt,
    });

    let aiResult;
    try {
      const jsonMatch = response.output_text?.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        aiResult = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch {
      // Fallback if JSON parsing fails
      aiResult = {
        recommendation:
          stockData.changePercent > 2 ? "BUY" : stockData.changePercent < -2 ? "SELL" : "HOLD",
        analysis: response.output_text || "Analysis unavailable",
        targetPrice: stockData.price * (1 + Math.random() * 0.1),
        stopLoss: stockData.price * (1 - Math.random() * 0.05),
        confidence: 75,
      };
    }

    // Save analysis to database
    const analysisId: unknown = await ctx.runMutation(api.stocks.mutations.saveAnalysis, {
      userId: user._id,
      symbol: symbolUpper,
      companyName: stockData.name,
      currentPrice: stockData.price,
      priceChange: stockData.change,
      priceChangePercent: stockData.changePercent,
      recommendation: aiResult.recommendation,
      aiAnalysis: aiResult.analysis,
      confidence: aiResult.confidence,
      targetPrice: aiResult.targetPrice,
      stopLoss: aiResult.stopLoss,
      technicalIndicators: {
        rsi: technicals.rsi,
        macd: technicals.macd,
        ema50: technicals.ema50,
        ema200: technicals.ema200,
        volume: stockData.volume,
      },
      fundamentals: {
        marketCap: stockData.marketCap,
        pe: stockData.pe,
        eps: stockData.eps,
        divYield: stockData.divYield,
      },
    });

    return { analysisId, ...aiResult };
  },
});
