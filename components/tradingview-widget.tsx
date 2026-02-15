"use client"

import { useEffect, useRef, useState, memo } from 'react';

function TradingViewWidget({ symbol }: { symbol: string }) {
    const container = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(
        () => {
            if (!mounted) return;
            if (!container.current) return;

            // Clear previous widget
            container.current.innerHTML = '';

            const script = document.createElement("script");
            script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
            script.type = "text/javascript";
            script.async = true;
            script.innerHTML = `
        {
          "autosize": true,
          "symbol": "${symbol}",
          "interval": "D",
          "timezone": "Etc/UTC",
          "theme": "light",
          "style": "1",
          "locale": "en",
          "enable_publishing": false,
          "allow_symbol_change": true,
          "calendar": false,
          "support_host": "https://www.tradingview.com"
        }`;
            container.current.appendChild(script);
        },
        [symbol, mounted]
    );

    return (
        <div className="h-[500px] w-full" ref={container} />
    );
}

export default memo(TradingViewWidget);
