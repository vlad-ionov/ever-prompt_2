import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

import { getServerEnv } from "@/lib/env.server";

const METHOD_NOT_ALLOWED = json({ error: "Method not allowed" }, { status: 405 });

export const loader = () => METHOD_NOT_ALLOWED;

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return METHOD_NOT_ALLOWED;
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { email, password, name } = (payload ?? {}) as Record<string, string | undefined>;
  console.log("Signup request received:", { email, name, hasPassword: !!password });

  if (!email || !password || !name) {
    return json({ error: "email, password and name are required" }, { status: 400 });
  }

  const env = getServerEnv();

  if (!env.SUPABASE_SERVICE_ROLE) {
    console.error("SUPABASE_SERVICE_ROLE is required for signup");
    return json({ error: "Supabase service role key is not configured on the server" }, { status: 500 });
  }

  try {
    // Create user using Supabase Auth API directly
    const response = await fetch(`${env.SUPABASE_URL}/auth/v1/admin/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE}`,
        apikey: env.SUPABASE_SERVICE_ROLE,
      },
      body: JSON.stringify({
        email,
        password,
        email_confirm: true, // Auto-confirm email
        user_metadata: {
          name: name
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Supabase signup error:", {
        status: response.status,
        statusText: response.statusText,
        errorData
      });
      return json({
        error: errorData?.msg ?? errorData?.message ?? errorData?.error_description ?? errorData?.error ?? "Failed to create user"
      }, { status: response.status });
    }

    const userData = await response.json();
    return json({ ok: true, user: userData });
  } catch (error) {
    console.error("Error creating Supabase user", error);
    return json({ error: "Unexpected server error" }, { status: 500 });
  }
}
