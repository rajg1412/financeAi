import { StockSearch } from "@/components/stock-search"
import { getMarketNewsAction } from "@/server/actions/stock"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, TrendingUp, ShieldCheck, Zap, LogOut, Brain } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export default async function Home() {
  const news = await getMarketNewsAction()
  const cookieStore = await cookies()

  const supabase = createServerClient(
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

  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="px-6 lg:px-8 h-16 flex items-center border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <Link className="flex items-center justify-center font-bold text-xl tracking-tight" href="/">
          <TrendingUp className="mr-2 h-6 w-6 text-primary" />
          FinanceAI
        </Link>
        <nav className="ml-auto flex items-center gap-6 sm:gap-8">
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="/watchlist">
            Watchlist
          </Link>
          {user ? (
            <form action="/auth/signout" method="post">
              <Button variant="ghost" size="sm" type="submit" className="text-sm font-medium p-0 h-auto hover:bg-transparent hover:text-primary transition-colors">
                Logout
              </Button>
            </form>
          ) : (
            <Link className="text-sm font-medium hover:text-primary transition-colors" href="/login">
              Login
            </Link>
          )}
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-20 md:py-32 lg:py-40 overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background"></div>
          <div className="container px-4 md:px-6 mx-auto relative z-10">
            <div className="flex flex-col items-center space-y-8 text-center">
              <div className="space-y-4 max-w-3xl">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                  Master the Market with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400">AI Precision</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl leading-relaxed">
                  Real-time tracking, intelligent insights, and automated daily reports. The smartest way to manage your portfolio.
                </p>
              </div>
              <div className="w-full max-w-md space-y-4">
                <StockSearch />
                <div className="flex justify-center gap-4 pt-4 relative z-20">
                  <Button size="lg" className="rounded-full px-8" asChild>
                    <Link href="/signup">
                      Get Started <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" className="rounded-full px-8 ring-1 ring-primary/20" asChild>
                    <Link href="/stock/TSLA">
                      View Demo
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="w-full py-20 bg-background border-y border-border/40">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How Our AI Platform <span className="text-primary tracking-tighter">Empowers You</span></h2>
                <div className="space-y-4">
                  <div className="flex gap-4 p-4 rounded-xl hover:bg-muted/50 transition-colors">
                    <div className="flex-none w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">1</div>
                    <div>
                      <h4 className="font-bold">Search & Track</h4>
                      <p className="text-sm text-muted-foreground">Search for any public company and add them to your personalized watchlist with one click.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 p-4 rounded-xl hover:bg-muted/50 transition-colors">
                    <div className="flex-none w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center font-bold text-blue-500">2</div>
                    <div>
                      <h4 className="font-bold">Get AI-Powered Analysis</h4>
                      <p className="text-sm text-muted-foreground">Our AI instantly analyzes market data to provide you with concise, actionable summaries for every stock.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 p-4 rounded-xl hover:bg-muted/50 transition-colors">
                    <div className="flex-none w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center font-bold text-teal-500">3</div>
                    <div>
                      <h4 className="font-bold">Automated Daily Reports</h4>
                      <p className="text-sm text-muted-foreground">Receive a daily performance summary directly in your inbox, ensuring you never miss a market move.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-border/50 shadow-2xl bg-muted group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent"></div>
                <div className="absolute inset-0 flex items-center justify-center flex-col p-8 text-center space-y-4">
                  <Brain className="h-16 w-16 text-primary animate-pulse" />
                  <h3 className="text-2xl font-bold">Smart Insights Engine</h3>
                  <p className="text-muted-foreground max-w-sm">Powered by Google Gemini to analyze millions of data points every second.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="w-full py-20 bg-muted/30">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-12 md:grid-cols-3">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-4 rounded-full bg-primary/10">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Real-Time Data</h3>
                <p className="text-muted-foreground">Live quotes and advanced charts powered by TradingView and Finnhub.</p>
              </div>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-4 rounded-full bg-blue-500/10">
                  <ShieldCheck className="h-8 w-8 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold">Market Intelligence</h3>
                <p className="text-muted-foreground">Sentiment analysis and buy/sell indicators generated by advanced AI models.</p>
              </div>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-4 rounded-full bg-teal-500/10">
                  <TrendingUp className="h-8 w-8 text-teal-500" />
                </div>
                <h3 className="text-xl font-bold">Smart Portfolio</h3>
                <p className="text-muted-foreground">Track your favorites and get automated email reports every morning.</p>
              </div>
            </div>
          </div>
        </section>

        {/* News Section */}
        <section className="w-full py-20">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-bold mb-10 text-center">Latest Market News</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {news.map((item, i) => (
                <Card key={i} className="hover:shadow-lg transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg leading-tight line-clamp-2 hover:text-primary transition-colors">
                      <a href={item.url} target="_blank" rel="noopener noreferrer">{item.headline}</a>
                    </CardTitle>
                    <CardDescription>{new Date(item.datetime * 1000).toLocaleDateString()}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                      {item.summary}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 border-t border-border/40 text-center text-sm text-muted-foreground">
        <p>© 2024 FinanceAI. All rights reserved.</p>
      </footer>
    </div>
  )
}
