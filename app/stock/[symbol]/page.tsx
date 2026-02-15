import { getStockDataAction } from "@/server/actions/stock"
import { getWatchlistStatusAction } from "@/server/actions/watchlist"
import TradingViewWidget from "@/components/tradingview-widget"
import { WatchlistButton } from "@/components/watchlist-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { generateStockSummary } from "@/server/services/ai"
import { ArrowUpRight, ArrowDownRight, Brain, Globe, Phone, MapPin } from "lucide-react"

export default async function StockPage({ params }: { params: Promise<{ symbol: string }> }) {
    const { symbol } = await params
    const stockData = await getStockDataAction(symbol)
    const isWatched = await getWatchlistStatusAction(symbol)

    if (!stockData || !stockData.quote || !stockData.profile) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
                <h1 className="text-2xl font-bold">Stock Data Unavailable</h1>
                <p className="text-muted-foreground">We couldn't fetch live data for {symbol} at this time.</p>
                <Link href="/">
                    <Button variant="outline">Return Home</Button>
                </Link>
            </div>
        )
    }

    const { quote, profile } = stockData
    const isPositive = (quote?.d ?? 0) >= 0

    // Fetch AI summary with safe defaults
    const aiSummary = await generateStockSummary(symbol, quote?.c ?? 0, quote?.d ?? 0, profile)

    return (
        <div className="container mx-auto py-10 px-4 md:px-6 space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card/30 backdrop-blur-md p-6 rounded-2xl border border-white/5 shadow-sm">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-4xl font-extrabold tracking-tighter">{symbol}</h1>
                        <Badge variant="outline" className="text-xs font-bold px-2 py-0.5 border-primary/20 bg-primary/5 text-primary">
                            {profile.finnhubIndustry}
                        </Badge>
                    </div>
                    <p className="text-xl text-muted-foreground font-medium">{profile.name}</p>
                </div>
                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <div className="text-4xl font-bold tracking-tighter">${(quote?.c ?? 0).toFixed(2)}</div>
                        <div className={`flex items-center justify-end font-bold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                            {isPositive ? <ArrowUpRight className="mr-1 h-4 w-4" /> : <ArrowDownRight className="mr-1 h-4 w-4" />}
                            {(quote?.d ?? 0).toFixed(2)} ({(quote?.dp ?? 0).toFixed(2)}%)
                        </div>
                    </div>
                    <WatchlistButton symbol={symbol} initialIsWatched={isWatched} />
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Main Chart Area */}
                <div className="lg:col-span-2 space-y-8">
                    <Card className="border-0 shadow-xl overflow-hidden bg-card/50 backdrop-blur-sm ring-1 ring-white/10">
                        <CardHeader className="border-b border-border/50 pb-4">
                            <CardTitle className="flex items-center gap-2">
                                Live Chart
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 h-[500px]">
                            <TradingViewWidget symbol={symbol} />
                        </CardContent>
                    </Card>

                    {/* AI Insights Card */}
                    <Card className="bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border-indigo-500/20 shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-indigo-500">
                                <Brain className="h-5 w-5" />
                                AI Market Analysis
                            </CardTitle>
                            <CardDescription>Generated insights based on current market data</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm md:text-base leading-relaxed text-foreground/90 font-medium">
                                {aiSummary}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <Card className="bg-card/50 backdrop-blur-sm shadow-md">
                        <CardHeader>
                            <CardTitle>Company Profile</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div className="flex items-start gap-3">
                                <Globe className="h-4 w-4 text-muted-foreground mt-0.5" />
                                <div>
                                    <span className="font-semibold block text-foreground">Website</span>
                                    <a href={profile.weburl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                        {profile.weburl}
                                    </a>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                                <div>
                                    <span className="font-semibold block text-foreground">Phone</span>
                                    <span className="text-muted-foreground">{profile.phone}</span>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                                <div>
                                    <span className="font-semibold block text-foreground">Headquarters</span>
                                    <span className="text-muted-foreground">{profile.country}</span>
                                </div>
                            </div>
                            <div className="pt-4 mt-4 border-t border-border/50 grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-xs text-muted-foreground uppercase">Market Cap</span>
                                    <div className="font-semibold text-foreground">{(profile.marketCapitalization / 1000).toFixed(2)}B</div>
                                </div>
                                <div>
                                    <span className="text-xs text-muted-foreground uppercase">Shares Outstanding</span>
                                    <div className="font-semibold text-foreground">{profile.shareOutstanding.toFixed(2)}M</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
