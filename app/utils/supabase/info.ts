function readEnv(name: "SUPABASE_URL" | "SUPABASE_ANON_KEY"): string | undefined {
  if (typeof window !== "undefined" && window.ENV?.[name]) {
    return window.ENV[name];
  }

  if (typeof import.meta !== "undefined" && import.meta.env?.[`VITE_${name}`]) {
    return import.meta.env[`VITE_${name}`];
  }

  if (typeof process !== "undefined" && process.env?.[name]) {
    return process.env[name];
  }

  if (typeof process !== "undefined" && process.env?.[`VITE_${name}`]) {
    return process.env[`VITE_${name}`];
  }

  return undefined;
}

const resolvedSupabaseUrl = (() => {
  const value = readEnv("SUPABASE_URL");
  if (!value) {
    throw new Error("SUPABASE_URL is not defined");
  }
  return value;
})();

const resolvedAnonKey = (() => {
  const value = readEnv("SUPABASE_ANON_KEY");
  if (!value) {
    throw new Error("SUPABASE_ANON_KEY is not defined");
  }
  return value;
})();
const host = (() => {
  try {
    return new URL(resolvedSupabaseUrl).hostname.split(".")[0];
  } catch (_error) {
    return "";
  }
})();

export const projectId = host;
export const publicAnonKey = resolvedAnonKey;
export const supabaseUrl = resolvedSupabaseUrl;
