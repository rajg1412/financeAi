import { getWatchlistAction } from "@/server/actions/watchlist"
import { getStockDataAction } from "@/server/actions/stock"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { WatchlistButton } from "@/components/watchlist-button"
import Link from "next/link"
import { ArrowUpRight, ArrowDownRight, Frown, TrendingUp } from "lucide-react"

export default async function WatchlistPage() {
    const watchlistSymbols = await getWatchlistAction()

    if (watchlistSymbols.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4 text-center space-y-4">
                <Frown className="h-16 w-16 text-muted-foreground mb-4" />
                <h2 className="text-2xl font-bold tracking-tight">Your watchlist is empty</h2>
                <p className="text-muted-foreground max-w-sm">
                    Start adding stocks to your watchlist to track their performance and get AI insights.
                </p>
                <Link href="/" className="text-primary hover:underline font-medium">
                    Search for stocks
                </Link>
            </div>
        )
    }

    const stockDataPromises = watchlistSymbols.map((symbol: string) => getStockDataAction(symbol))
    const stocks = await Promise.all(stockDataPromises)

    return (
        <div className="container mx-auto py-10 px-4 md:px-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight">My Watchlist</h1>
                    <p className="text-muted-foreground mt-1">Real-time tracking of your favorite assets.</p>
                </div>
                <Link href="/" className="text-sm font-medium text-primary hover:underline">
                    + Add Symbol
                </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {stocks.map((stock) => {
                    if (!stock) return null
                    const isPositive = stock.quote.d >= 0
                    return (
                        <Card key={stock.symbol} className="overflow-hidden bg-card/50 backdrop-blur-sm border-white/10 hover:shadow-xl transition-all duration-300 group">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <div className="space-y-1">
                                    <CardTitle className="text-2xl font-bold group-hover:text-primary transition-colors">
                                        <Link href={`/stock/${stock.symbol}`} className="hover:underline">
                                            {stock.symbol}
                                        </Link>
                                    </CardTitle>
                                    <CardDescription className="text-xs font-medium uppercase tracking-wider">{stock.profile.name}</CardDescription>
                                </div>
                                <WatchlistButton symbol={stock.symbol} initialIsWatched={true} />
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-baseline justify-between mt-4">
                                    <div className="text-3xl font-bold tracking-tighter">
                                        ${stock.quote.c.toFixed(2)}
                                    </div>
                                    <div className={`flex items-center px-2 py-1 rounded-full text-sm font-bold ${isPositive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                        {isPositive ? <ArrowUpRight className="mr-1 h-3 w-3" /> : <ArrowDownRight className="mr-1 h-3 w-3" />}
                                        {stock.quote.dp.toFixed(2)}%
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-border/50 flex justify-between text-xs text-muted-foreground">
                                    <div className="flex items-center">
                                        <TrendingUp className="h-3 w-3 mr-1" />
                                        High: ${stock.quote.h.toFixed(2)}
                                    </div>
                                    <div>
                                        Low: ${stock.quote.l.toFixed(2)}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}
