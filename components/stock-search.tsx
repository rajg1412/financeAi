"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Search, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { searchStocksAction } from "@/server/actions/stock"
import { cn } from "@/lib/utils"

export function StockSearch() {
    const [query, setQuery] = React.useState("")
    const [results, setResults] = React.useState<any[]>([])
    const [isOpen, setIsOpen] = React.useState(false)
    const [loading, setLoading] = React.useState(false)
    const router = useRouter()
    const wrapperRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.length > 1) {
                setLoading(true)
                const data = await searchStocksAction(query)
                setResults(data)
                setLoading(false)
                setIsOpen(true)
            } else {
                setResults([])
                setIsOpen(false)
            }
        }, 400)

        return () => clearTimeout(timer)
    }, [query])

    // Close on click outside
    React.useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleSelect = (symbol: string) => {
        setQuery("")
        setIsOpen(false)
        router.push(`/stock/${symbol}`)
    }

    return (
        <div ref={wrapperRef} className="relative w-full">
            <div className="relative group">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                    placeholder="Search stocks (e.g., NVDA, AMD)..."
                    className="pl-10 h-12 text-lg rounded-full border-muted-foreground/20 bg-background/50 backdrop-blur-sm shadow-sm focus-visible:ring-primary/50 transition-all"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => { if (query.length > 1) setIsOpen(true) }}
                />
                {loading && (
                    <Loader2 className="absolute right-3 top-3 h-5 w-5 animate-spin text-muted-foreground" />
                )}
            </div>

            {isOpen && (
                <div className="absolute top-full z-50 mt-2 w-full rounded-xl border border-border/50 bg-popover/95 backdrop-blur-md text-popover-foreground shadow-xl outline-none animate-in fade-in-0 zoom-in-95 overflow-hidden">
                    <div className="p-1">
                        {results.length === 0 && !loading ? (
                            <div className="p-4 text-sm text-muted-foreground text-center">No results found.</div>
                        ) : (
                            <ul className="max-h-[300px] overflow-auto py-1">
                                {results.map((item) => (
                                    <li
                                        key={item.displaySymbol}
                                        className="relative flex cursor-pointer select-none items-center rounded-lg px-3 py-2.5 text-sm outline-none hover:bg-accent/50 hover:text-accent-foreground transition-colors"
                                        onClick={() => handleSelect(item.symbol)}
                                    >
                                        <div className="flex flex-col">
                                            <span className="font-bold">{item.displaySymbol}</span>
                                            <span className="text-xs text-muted-foreground truncate max-w-[200px]">{item.description}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
