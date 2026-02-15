import { inngest } from "@/server/inngest/client";
import { createClient } from "@supabase/supabase-js";
import { getStockDataAction } from "@/server/actions/stock";
import { generateDailyReport } from "@/server/services/ai";
import { sendEmail } from "@/server/services/email";

// Initialize Supabase Admin client for background jobs
// Initialize Supabase Admin client for background jobs
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    }
);

export const dailySummaryJob = inngest.createFunction(
    { id: "daily-stock-summary" },
    { cron: "0 8 * * 1-5" }, // Every weekday at 8 AM
    async ({ step }: { step: any }) => {

        // 1. Fetch all users
        const users = await step.run("fetch-users", async () => {
            if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
                console.warn("Missing SUPABASE_SERVICE_ROLE_KEY, skipping job");
                return [];
            }
            const { data: users, error } = await supabaseAdmin.auth.admin.listUsers();
            if (error) throw error;
            return users.users;
        });

        // 2. Process each user
        for (const user of users) {
            if (!user.email) continue;

            await step.run(`process-user-${user.id}`, async () => {
                // Get watchlist
                const { data: watchlist } = await supabaseAdmin
                    .from('watchlist')
                    .select('symbol')
                    .eq('user_id', user.id);

                if (!watchlist || watchlist.length === 0) return;

                // Get stock data
                const stockPromises = watchlist.map(async (item: any) => {
                    const data = await getStockDataAction(item.symbol);
                    return { symbol: item.symbol, ...data };
                });
                const stocks = await Promise.all(stockPromises);

                // Generate AI Report
                const aiReport = await generateDailyReport(stocks);

                // Send Email
                await sendEmail(
                    user.email!,
                    "Your Daily AI Stock Insight",
                    aiReport
                );
            });
        }

        return { processed: users.length };
    }
);
