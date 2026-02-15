import { Inngest } from "inngest";

// Validate Inngest signing key to ensure we don't proceed without it in production logic if needed, 
// but for the client init, it's just the ID.
export const inngest = new Inngest({ id: "finance-ai-app" });
