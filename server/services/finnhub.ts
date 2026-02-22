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

/**
 * Helper to handle Finnhub API requests with consistent error handling
 */
async function finnhubFetch(endpoint: string, options: RequestInit = {}) {
    const url = `${BASE_URL}${endpoint}${endpoint.includes('?') ? '&' : '?'}token=${FINNHUB_API_KEY}`;

    try {
        const res = await fetch(url, options);

        if (res.status === 429) {
            console.warn(`Finnhub Rate Limit exceeded for endpoint: ${endpoint}`);
            throw new Error('Finnhub API: Rate limit exceeded (429). Please try again in a minute.');
        }

        if (!res.ok) {
            const errorBody = await res.text().catch(() => 'Unknown error');
            console.error(`Finnhub API Error (${res.status}) for ${endpoint}:`, errorBody);
            throw new Error(`Finnhub API: ${res.statusText} (${res.status})`);
        }

        return await res.json();
    } catch (error: any) {
        console.error(`Finnhub Fetch Exception for ${endpoint}:`, error.message);
        throw error;
    }
}

export async function searchSymbols(query: string): Promise<StockSymbol[]> {
    if (!query) return [];
    const data = await finnhubFetch(`/search?q=${query}`);
    return data.result || [];
}

export async function getQuote(symbol: string): Promise<QuoteData> {
    return finnhubFetch(`/quote?symbol=${symbol}`, {
        next: { revalidate: 30 }
    });
}

export async function getCompanyProfile(symbol: string): Promise<CompanyProfile | null> {
    const data = await finnhubFetch(`/stock/profile2?symbol=${symbol}`, {
        next: { revalidate: 86400 }
    });

    // Finnhub returns an empty object {} if no profile is found for the symbol
    if (!data || Object.keys(data).length === 0) {
        return null;
    }

    return data;
}

export async function getMarketNews(category: string = 'general'): Promise<any[]> {
    return finnhubFetch(`/news?category=${category}`, {
        next: { revalidate: 3600 }
    });
}
