# Real-Time Stock Market Web Application

A full-stack Next.js application for tracking stocks, getting AI insights, and receiving daily email summaries.

## Features

- **Real-Time Data**: Live stock prices and company profiles via Finnhub API.
- **Interactive Charts**: Advanced TradingView charts for technical analysis.
- **Watchlist**: Track your favorite stocks (requires login).
- **AI Insights**: Get AI-generated summaries and buy/sell analysis using Google Gemini.
- **Daily Reports**: Automated daily email summaries of your watchlist performance.
- **Dark Mode**: Fully supported dark/light theme.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Styling**: Tailwind CSS + shadcn/ui
- **Background Jobs**: Inngest
- **AI**: Google Gemini API
- **Email**: Nodemailer

## Setup Instructions

### 1. Clone the repository
\`\`\`bash
git clone <your-repo-url>
cd stock
\`\`\`

### 2. Install dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Environment Variables
Create a \`.env.local\` file in the root directory:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

FINNHUB_API_KEY=your_finnhub_api_key
GOOGLE_GEMINI_API_KEY=your_gemini_api_key

INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key

SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASSWORD=your_smtp_password
\`\`\`

### 4. Database Setup
Run the SQL SQL commands in \`supabase/schema.sql\` in your Supabase Dashboard's **SQL Editor** to create the tables.

### 5. Run Development Server
\`\`\`bash
npm run dev
\`\`\`
Visit [http://localhost:3000](http://localhost:3000) inside your browser.

## Background Jobs
To test background jobs locally:
1. Run Inngest dev server: \`npx inngest-cli@latest dev\`
2. Open [http://localhost:8288](http://localhost:8288)
3. Connect it to your running Next.js app.
4. Manually trigger the `daily-stock-summary` function.
