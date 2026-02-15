"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toggleWatchlistAction } from "@/server/actions/watchlist"
import { Star, StarOff } from "lucide-react"
import { useRouter } from "next/navigation"

interface WatchlistButtonProps {
    symbol: string
    initialIsWatched: boolean
}

export function WatchlistButton({ symbol, initialIsWatched }: WatchlistButtonProps) {
    const [isWatched, setIsWatched] = useState(initialIsWatched)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleToggle = async () => {
        setLoading(true)
        try {
            const newState = await toggleWatchlistAction(symbol, isWatched)
            setIsWatched(newState)
            router.refresh() // Refresh to update any other state if needed
        } catch (error) {
            console.error("Failed to toggle watchlist", error)
            // If error (likely auth), redirect to login could be an option, or show toast
            // For now, simple alert or just console
            // alert("Please login to use watchlist") 
        } finally {
            setLoading(false)
        }
    }

    return (
        <Button
            variant={isWatched ? "secondary" : "outline"}
            onClick={handleToggle}
            disabled={loading}
            className="gap-2"
        >
            {isWatched ? (
                <>
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    Following
                </>
            ) : (
                <>
                    <Star className="h-4 w-4" />
                    Follow
                </>
            )}
        </Button>
    )
}
