import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./supabase-types";

// Renamed to avoid conflict if used elsewhere, though typically you export the function call directly.
// In a real implementation, you would use environment variables for the URL and key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// TMP LOG: Verify client-side env vars
console.log("[Supabase Client] URL:", supabaseUrl ? "Loaded" : "MISSING!");
console.log("[Supabase Client] Key:", supabaseAnonKey ? "Loaded" : "MISSING!");

// Create a singleton supabase client for client components
// NOTE: We use process.env directly here. Ensure these vars are available client-side (prefixed with NEXT_PUBLIC_)
export const supabase = createBrowserClient<Database>(
  supabaseUrl,
  supabaseAnonKey
);
