'use server';

import { searchSymbols, getQuote, getCompanyProfile, getMarketNews } from '@/server/services/finnhub';

export async function searchStocksAction(query: string) {
    try {
        const results = await searchSymbols(query);
        // Filter for common stock types to reduce noise if needed, e.g., only Common Stock
        return results.filter(item => item.type === 'Common Stock').slice(0, 10);
    } catch (error) {
        console.error('Search error:', error);
        return [];
    }
}

export async function getStockDataAction(symbol: string) {
    try {
        const [quote, profile] = await Promise.all([
            getQuote(symbol),
            getCompanyProfile(symbol)
        ]);
        return { symbol, quote, profile };
    } catch (error) {
        console.error('Stock data error:', error);
        return null; // Handle error gracefully
    }
}

export async function getMarketNewsAction() {
    try {
        const news = await getMarketNews();
        return news.slice(0, 5); // Return top 5 news
    } catch (error) {
        console.error('News error:', error);
        return [];
    }
}
