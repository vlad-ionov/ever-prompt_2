import { z } from "zod";

function decodeJwtProjectRef(key: string | undefined): string | null {
  if (!key) return null;
  const parts = key.split(".");
  if (parts.length < 2) return null;

  try {
    const payload = parts[1];
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
    const json = Buffer.from(padded, "base64").toString("utf8");
    const data = JSON.parse(json) as { ref?: unknown };
    const ref = typeof data.ref === "string" ? data.ref : null;
    if (ref) {
      return ref;
    }
  } catch (_error) {
    // ignore invalid tokens
  }
  return null;
}

function normaliseSupabaseUrl(
  input: string,
  fallbackProjectRef: string | null,
): string {
  if (!input && fallbackProjectRef) {
    return `https://${fallbackProjectRef}.supabase.co`;
  }

  if (!input) {
    return input;
  }

  try {
    const parsed = new URL(input);
    const host = parsed.hostname.toLowerCase();
    const base = `${parsed.protocol}//${parsed.host}`.replace(/\/+$/, "");

    // Already pointing at a project domain (or self-hosted/custom).
    const isProjectDomain =
      /\.supabase\.(co|in|net)$/i.test(host) ||
      host.endsWith(".supabase.red") ||
      host === "localhost";

    if (isProjectDomain) {
      return base;
    }

    const isSupabaseDashboardHost =
      host === "supabase.com" || host.endsWith(".supabase.com");

    if (isSupabaseDashboardHost) {
      const match = parsed.pathname.match(/\/project\/([a-z0-9]+)(?:[/?#]|$)/i);
      const projectRef = match?.[1] ?? fallbackProjectRef;
      if (projectRef) {
        const normalised = `${parsed.protocol}//${projectRef}.supabase.co`;
        console.warn(
          `Normalised SUPABASE_URL to project API domain: ${normalised}`,
        );
        return normalised;
      }
    }

    if (!isSupabaseDashboardHost && fallbackProjectRef) {
      return base;
    }

    return base;
  } catch {
    if (fallbackProjectRef) {
      const normalised = `https://${fallbackProjectRef}.supabase.co`;
      console.warn(
        `Falling back to inferred Supabase project URL: ${normalised}`,
      );
      return normalised;
    }
    return input;
  }
}

const envSchema = z.object({
  SUPABASE_URL: z.string().url({ message: "SUPABASE_URL must be a valid URL" }),
  SUPABASE_ANON_KEY: z.string().min(1, "SUPABASE_ANON_KEY is required"),
  SUPABASE_SERVICE_ROLE: z
    .string()
    .optional()
    .describe("Service role key used only on the server"),
  SESSION_SECRET: z
    .string()
    .min(32, "SESSION_SECRET should be at least 32 characters"),
});

type ServerEnv = z.infer<typeof envSchema>;

let _env: ServerEnv | null = null;

export function getServerEnv(): ServerEnv {
  if (!_env) {
    if (!process.env.SESSION_SECRET) {
      console.warn(
        "SESSION_SECRET is not set. Falling back to an insecure development secret."
      );
    }

    const rawSupabaseUrl = (
      process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL ?? ""
    ).trim();
    const rawAnonKey = (
      process.env.SUPABASE_ANON_KEY ?? process.env.VITE_SUPABASE_ANON_KEY ?? ""
    ).trim();
    const rawServiceRole =
      process.env.SUPABASE_SERVICE_ROLE ??
      process.env.VITE_SUPABASE_SERVICE_ROLE ??
      "";

    const fallbackProjectRef =
      decodeJwtProjectRef(rawAnonKey) ?? decodeJwtProjectRef(rawServiceRole);

    let supabaseUrl: string;
    try {
      supabaseUrl = normaliseSupabaseUrl(rawSupabaseUrl, fallbackProjectRef);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : String(error ?? "unknown error");
      throw new Error(`Invalid SUPABASE_URL: ${message}`);
    }

    const withDefaults = {
      ...process.env,
      SUPABASE_URL: supabaseUrl,
      SUPABASE_ANON_KEY: rawAnonKey,
      SESSION_SECRET:
        process.env.SESSION_SECRET ??
        "dev-secret-dev-secret-dev-secret-dev-secret",
    };

    const parsed = envSchema.safeParse(withDefaults);
    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      const messages = Object.entries(errors)
        .map(([key, value]) => `${key}: ${value?.join(", ") ?? "unknown"}`)
        .join("\n");
      throw new Error(`Invalid environment variables:\n${messages}`);
    }
    _env = {
      ...parsed.data,
      SUPABASE_SERVICE_ROLE: parsed.data.SUPABASE_SERVICE_ROLE ?? "",
    };
  }
  return _env;
}

export function getClientEnv() {
  const { SUPABASE_URL, SUPABASE_ANON_KEY } = getServerEnv();
  return {
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
  } as const;
}
