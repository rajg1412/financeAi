import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

export async function generateStockSummary(symbol: string, price: number, change: number, profile: any) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
        Analyze the stock ${symbol} (${profile.name}).
        Current Price: $${price}
        Change: ${change}
        Industry: ${profile.finnhubIndustry}
        
        Provide a concise 3-sentence summary of its current standing and whether it might be a good time to buy, hold, or sell based on general market principles (disclaimer: not financial advice).
      `;

        const result = await model.generateContent(prompt);
        if (!result || !result.response) throw new Error("Invalid AI response");

        const response = await result.response;
        return response.text();
    } catch (error) {
        // Use console.warn to avoid triggering the Next.js dev error overlay
        console.warn("AI Generation Warning (Non-fatal):", error);
        return "AI market analysis is currently unavailable for this symbol. Please check back later.";
    }
}

export async function generateDailyReport(stocks: any[]) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const stockList = stocks.map(s => `${s.symbol}: $${s.quote.c} (${s.quote.dp}%)`).join('\n');

        const prompt = `
          Here is a user's stock watchlist performance for today:
          ${stockList}

          Write a short, encouraging daily email summary (max 150 words). Highlight the top performer and the worst performer.
          Format it as a friendly email body.
        `;

        const result = await model.generateContent(prompt);
        if (!result || !result.response) throw new Error("Invalid AI response");

        const response = await result.response;
        return response.text();
    } catch (error) {
        console.warn("AI Report Warning (Non-fatal):", error);
        return "Your daily performance summary is being prepared and will be available soon.";
    }
}
