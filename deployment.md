# Deployment Guide (Vercel)

This application is optimized for deployment on Vercel.

## Prerequisites

- A GitHub repository with your code.
- A Vercel account.
- A Supabase project.

## Steps

1. **Push to GitHub**
   Commit your changes and push them to a new GitHub repository.

2. **Import to Vercel**
   - Go to your Vercel Dashboard.
   - Click **Add New** > **Project**.
   - Import your GitHub repository.

3. **Configure Environment Variables**
   In the Vercel deployment settings, add all the environment variables from your \`.env.local\` file.
   
   *Tip: You can copy-paste the entire content of \`.env.local\` into Vercel's bulk env editor.*

4. **Deploy**
   Click **Deploy**. Vercel will build and deploy your application.

## Post-Deployment

1. **Supabase Auth Configuration**
   - Go to your Supabase Dashboard > Authentication > URL Configuration.
   - Add your Vercel production URL (e.g., `https://your-app.vercel.app`) to **Site URL** and **Redirect URLs**.

2. **Inngest Configuration**
   - Go to Cloud Inngest dashboard.
   - Connect your Vercel project to automatically sync environment variables and deploy functions.
   - Alternatively, manually set the `INNGEST_SIGNING_KEY` and `INNGEST_EVENT_KEY` in Vercel.

3. **Cron Jobs**
   The Inngest function is configured to run at 8 AM UTC on weekdays. You can verify this in the Inngest dashboard after deployment.
