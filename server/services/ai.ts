import { GoogleGenerativeAI } from "@google/generative-ai";

// Support both naming conventions for the API key
const apiKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.warn("AI Warning: GOOGLE_GEMINI_API_KEY or GEMINI_API_KEY is not set in environment variables.");
}

const genAI = new GoogleGenerativeAI(apiKey || "");

const FINANCE_AI_SYSTEM_PROMPT = `
You are a professional financial analyst AI assistant for FinanceAI. 
Your goal is to provide concise, accurate, and insightful stock market analysis.
- Use professional yet accessible language.
- Always include a disclaimer that this is not financial advice.
- Focus on key metrics provided (price, change, industry).
- Be objective and data-driven.
- Keep responses concise (3 sentences maximum for summaries).
`;

export async function generateStockSummary(symbol: string, price: number, change: number, profile: any) {
    try {
        if (!apiKey) throw new Error("Missing Gemini API Key");

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction: FINANCE_AI_SYSTEM_PROMPT
        });

        const prompt = `
        Analyze the stock ${symbol} (${profile.name}).
        Current Price: $${price}
        Change: ${change}
        Industry: ${profile.finnhubIndustry}
        
        Provide a concise 3-sentence summary of its current standing and whether it might be a good time to buy, hold, or sell based on general market principles.
      `;

        const result = await model.generateContent(prompt);
        if (!result || !result.response) throw new Error("Invalid AI response");

        const response = await result.response;
        return response.text();
    } catch (error: any) {
        // Log the full error to help identify the root cause (e.g., Auth, Quota, etc.)
        console.error("AI Generation Error [Full Object]:", error);

        return "AI market analysis is currently unavailable for this symbol. Please ensure your Gemini API key is correctly configured in .env.local.";
    }
}

export async function generateDailyReport(stocks: any[]) {
    try {
        if (!apiKey) throw new Error("Missing Gemini API Key");

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction: FINANCE_AI_SYSTEM_PROMPT
        });

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
        console.error("AI Report Error:", error);
        return "Your daily performance summary is being prepared and will be available soon.";
    }
}

