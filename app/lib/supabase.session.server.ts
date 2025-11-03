import {
  AuthApiError,
  AuthError,
  createClient,
  type SupabaseClient,
  type User,
} from "@supabase/supabase-js";

import { getServerEnv } from "../lib/env.server";

export class SupabaseVerificationError extends Error {
  status: number;

  constructor(message: string, status = 401) {
    super(message);
    this.name = "SupabaseVerificationError";
    this.status = status;
  }
}

let verificationClient: SupabaseClient | null = null;

function getSupabaseVerificationClient(): SupabaseClient {
  if (verificationClient) {
    return verificationClient;
  }

  const env = getServerEnv();
  const serviceKey = env.SUPABASE_SERVICE_ROLE?.trim();
  const key = serviceKey ? serviceKey : env.SUPABASE_ANON_KEY;

  verificationClient = createClient(env.SUPABASE_URL, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return verificationClient;
}

async function fetchUserViaAuthRest(accessToken: string): Promise<User> {
  const env = getServerEnv();
  const requestUrl = new URL("/auth/v1/user", env.SUPABASE_URL).toString();

  let response: Response;
  try {
    response = await fetch(requestUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        apikey: env.SUPABASE_ANON_KEY,
        Accept: "application/json",
      },
      cache: "no-store",
    });
  } catch (_error) {
    throw new SupabaseVerificationError("Unable to reach Supabase Auth service. Check network access.", 502);
  }

  const rawBody = await response.text().catch(() => "");
  let payload: Record<string, unknown> | null = null;
  if (rawBody) {
    try {
      payload = JSON.parse(rawBody) as Record<string, unknown>;
    } catch (_error) {
      const snippet = rawBody.slice(0, 160).replace(/\s+/g, " ").trim();
      const message = [
        `Supabase Auth returned a non-JSON response (status ${response.status}).`,
        snippet ? `Received: ${snippet}` : "",
      ]
        .filter(Boolean)
        .join(" ");
      throw new SupabaseVerificationError(message, response.ok ? 500 : response.status || 502);
    }
  }

  if (!response.ok) {
    const fallbackMessage = `Supabase Auth rejected the access token (status ${response.status}).`;
    const message =
      (payload?.error as string | undefined) ??
      (payload?.message as string | undefined) ??
      (payload?.hint as string | undefined) ??
      fallbackMessage;

    const status = response.status === 401 || response.status === 403 ? 401 : response.status || 502;
    throw new SupabaseVerificationError(message, status);
  }

  const userPayload = (payload?.user ?? payload) as User | undefined;
  if (!userPayload || typeof userPayload.id !== "string") {
    throw new SupabaseVerificationError("Supabase Auth response did not include a valid user payload", 500);
  }

  return userPayload;
}

export async function verifySupabaseAccessToken(accessToken: string): Promise<User> {
  const trimmedToken = accessToken.trim();
  if (!trimmedToken) {
    throw new SupabaseVerificationError("accessToken is required");
  }

  try {
    const client = getSupabaseVerificationClient();
    const { data, error } = await client.auth.getUser(trimmedToken);

    if (error) {
      const status =
        error instanceof AuthApiError
          ? error.status
          : error instanceof AuthError
            ? 401
            : 500;
      throw new SupabaseVerificationError(error.message || "Failed to verify Supabase session", status);
    }

    const user = data?.user;
    if (!user || typeof user.id !== "string") {
      throw new SupabaseVerificationError(
        "Supabase Auth response did not include a valid user payload",
        500,
      );
    }

    return user;
  } catch (initialError) {
    const knownError = initialError instanceof SupabaseVerificationError ? initialError : null;

    try {
      return await fetchUserViaAuthRest(trimmedToken);
    } catch (fallbackError) {
      if (fallbackError instanceof SupabaseVerificationError) {
        throw fallbackError;
      }

      const status =
        knownError?.status ??
        (fallbackError && typeof fallbackError === "object" && "status" in fallbackError && typeof (fallbackError as { status: number }).status === "number"
          ? (fallbackError as { status: number }).status
          : 500);
      const message =
        fallbackError instanceof Error
          ? fallbackError.message
          : knownError?.message ?? "Failed to verify Supabase session";

      throw new SupabaseVerificationError(message, status);
    }
  }
}
