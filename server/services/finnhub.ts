const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;
const BASE_URL = 'https://finnhub.io/api/v1';

export interface StockSymbol {
    description: string;
    displaySymbol: string;
    symbol: string;
    type: string;
}

export interface QuoteData {
    c: number; // Current price
    d: number; // Change
    dp: number; // Percent change
    h: number; // High price of the day
    l: number; // Low price of the day
    o: number; // Open price of the day
    pc: number; // Previous close price
}

export interface CompanyProfile {
    country: string;
    currency: string;
    estimateCurrency: string;
    exchange: string;
    finnhubIndustry: string;
    ipo: string;
    logo: string;
    marketCapitalization: number;
    name: string;
    phone: string;
    shareOutstanding: number;
    ticker: string;
    weburl: string;
}

export async function searchSymbols(query: string): Promise<StockSymbol[]> {
    if (!query) return [];
    const res = await fetch(`${BASE_URL}/search?q=${query}&token=${FINNHUB_API_KEY}`);
    if (!res.ok) throw new Error('Failed to fetch symbols');
    const data = await res.json();
    return data.result || [];
}

export async function getQuote(symbol: string): Promise<QuoteData> {
    const res = await fetch(`${BASE_URL}/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`, {
        next: { revalidate: 30 } // Cache for 30 seconds
    });
    if (!res.ok) throw new Error('Failed to fetch quote');
    return res.json();
}

export async function getCompanyProfile(symbol: string): Promise<CompanyProfile> {
    const res = await fetch(`${BASE_URL}/stock/profile2?symbol=${symbol}&token=${FINNHUB_API_KEY}`, {
        next: { revalidate: 86400 } // Cache for 24 hours
    });
    if (!res.ok) throw new Error('Failed to fetch profile');
    return res.json();
}

export async function getMarketNews(category: string = 'general'): Promise<any[]> {
    const res = await fetch(`${BASE_URL}/news?category=${category}&token=${FINNHUB_API_KEY}`, {
        next: { revalidate: 3600 } // Cache for 1 hour
    });
    if (!res.ok) throw new Error('Failed to fetch news');
    return res.json();
}
