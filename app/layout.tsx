import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Assuming standard font
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FinanceAI - Real-time Stock Insights",
  description: "Track stocks, get AI insights, and daily email summaries.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="absolute top-4 right-4 z-50">
            <ModeToggle />
          </div>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
