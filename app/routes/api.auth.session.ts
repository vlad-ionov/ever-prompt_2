import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

import { commitSession, destroySession, getSession } from "@/lib/session.server";
import {
  SupabaseVerificationError,
  verifySupabaseAccessToken,
} from "@/lib/supabase.session.server";

const METHOD_NOT_ALLOWED = json({ error: "Method not allowed" }, { status: 405 });

export async function action({ request }: ActionFunctionArgs) {
  const method = request.method.toUpperCase();

  if (method === "POST") {
    const session = await getSession(request.headers.get("Cookie"));
    const body = await request
      .json()
      .catch(() => ({ accessToken: "" })) as { accessToken?: string | null };

    const accessToken = body.accessToken?.trim();
    if (!accessToken) {
      return json({ error: "accessToken is required" }, { status: 400 });
    }

    let user;
    try {
      user = await verifySupabaseAccessToken(accessToken);
    } catch (error) {
      if (error instanceof SupabaseVerificationError) {
        return json({ error: error.message }, { status: error.status });
      }
      console.error("Unexpected Supabase verification error", error);
      return json({ error: "Failed to verify Supabase session" }, { status: 500 });
    }

    session.set("userId", user.id);
    session.set("email", user.email ?? "");

    return json(
      { ok: true },
      {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      },
    );
  }

  if (method === "DELETE") {
    const session = await getSession(request.headers.get("Cookie"));
    return json(
      { ok: true },
      {
        headers: {
          "Set-Cookie": await destroySession(session),
        },
      },
    );
  }

  return METHOD_NOT_ALLOWED;
}

export const loader = () => METHOD_NOT_ALLOWED;
