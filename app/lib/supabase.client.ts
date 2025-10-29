import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let browserClient: SupabaseClient | null = null;

export function getSupabaseBrowserClient(): SupabaseClient {
  if (browserClient) {
    return browserClient;
  }

  if (typeof window === "undefined") {
    throw new Error("Attempted to initialise the browser Supabase client on the server");
  }

  const env = window.ENV;

  if (!env?.SUPABASE_URL || !env?.SUPABASE_ANON_KEY) {
    throw new Error("Supabase environment variables are missing in the browser");
  }

  browserClient = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });

  return browserClient;
}
