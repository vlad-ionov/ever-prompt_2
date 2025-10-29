import { createClient } from "@supabase/supabase-js";

import { getServerEnv } from "@/lib/env.server";

export function getServiceSupabaseClient() {
  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE } = getServerEnv();
  if (!SUPABASE_SERVICE_ROLE) {
    throw new Error("SUPABASE_SERVICE_ROLE is not set. Add it to your environment to enable server mutations.");
  }
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
