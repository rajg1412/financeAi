'use server';

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers';

async function createClient() {
    const cookieStore = await cookies();
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value
                },
            },
        }
    )
}

export async function toggleWatchlistAction(symbol: string, isWatched: boolean) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('User not authenticated');
    }

    if (isWatched) {
        // Remove
        const { error } = await supabase
            .from('watchlist')
            .delete()
            .match({ user_id: user.id, symbol });

        if (error) throw error;
        return false;
    } else {
        // Add
        const { error } = await supabase
            .from('watchlist')
            .insert({ user_id: user.id, symbol });

        if (error) throw error;
        return true;
    }
}

export async function getWatchlistStatusAction(symbol: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return false;

    const { data, error } = await supabase
        .from('watchlist')
        .select('symbol')
        .eq('user_id', user.id)
        .eq('symbol', symbol)
        .single();

    if (error && error.code !== 'PGRST116') {
        console.error('Error checking watchlist:', error);
    }

    return !!data;
}

export async function getWatchlistAction() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    const { data, error } = await supabase
        .from('watchlist')
        .select('symbol')
        .eq('user_id', user.id);

    if (error) {
        console.error("Error fetching watchlist", error);
        return [];
    }

    return data.map((item: { symbol: string }) => item.symbol);
}
