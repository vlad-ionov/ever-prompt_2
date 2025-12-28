import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getServerEnv } from "@/lib/env.server";
import {
  SupabaseVerificationError,
  verifySupabaseAccessToken,
} from "@/lib/supabase.session.server";

const METHOD_NOT_ALLOWED = json({ error: "Method not allowed" }, { status: 405 });

function extractAccessToken(request: Request) {
  const header = request.headers.get("Authorization");
  if (!header?.toLowerCase().startsWith("bearer ")) {
    return null;
  }
  return header.slice(7).trim();
}

export async function loader() { return METHOD_NOT_ALLOWED; }

export async function action({ request }: ActionFunctionArgs) {
  const method = request.method.toUpperCase();
  if (method === "POST") {
    let payload: unknown = null;
    try {
      payload = await request.json();
    } catch {
      return json({ error: "Invalid request body" }, { status: 400 });
    }
    const accessToken = (payload as { accessToken?: string | null })?.accessToken?.trim();
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
      console.error("Unexpected Supabase verification error while loading profile", error);
      return json({ error: "Failed to load profile" }, { status: 500 });
    }

    const profile = {
      id: user.id,
      email: user.email ?? "",
      name: user.user_metadata?.name ?? "",
      avatar_url: user.user_metadata?.avatar_url ?? undefined,
      bio: user.user_metadata?.bio ?? "",
      is_public: user.user_metadata?.is_public ?? false,
      created_at: user.created_at ?? new Date().toISOString(),
    };
    return json(profile);
  }

  if (method !== "PUT") {
    return METHOD_NOT_ALLOWED;
  }

  const env = getServerEnv();
  const accessToken = extractAccessToken(request);

  if (!accessToken) {
    return json({ error: "Missing or invalid Authorization header" }, { status: 401 });
  }

  let user;
  try {
    user = await verifySupabaseAccessToken(accessToken);
  } catch (error) {
    if (error instanceof SupabaseVerificationError) {
      return json({ error: error.message }, { status: error.status });
    }
    console.error("Unexpected Supabase verification error while updating profile", error);
    return json({ error: "Failed to update profile" }, { status: 500 });
  }

  const body = await request.json() as { name?: string; avatar_url?: string; bio?: string; is_public?: boolean };

  // Use Admin API to update user metadata
  const serviceRoleKey = env.SUPABASE_SERVICE_ROLE;
  if (!serviceRoleKey) {
    return json({ error: "Supabase service role key is not configured on the server" }, { status: 500 });
  }

  const updateResponse = await fetch(`${env.SUPABASE_URL}/auth/v1/admin/users/${user.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${serviceRoleKey}`,
      "apikey": serviceRoleKey,
    },
    body: JSON.stringify({
      user_metadata: {
        name: body.name ?? user.user_metadata?.name,
        avatar_url: body.avatar_url ?? user.user_metadata?.avatar_url,
        bio: body.bio ?? user.user_metadata?.bio,
        is_public: body.is_public ?? user.user_metadata?.is_public,
      },
    })
  });

  if (!updateResponse.ok) {
    const errorData = await updateResponse.json().catch(() => ({}));
    return json({ error: errorData?.message ?? "Failed to update user" }, { status: 400 });
  }

  // Fetch updated user
  const getUserResponse = await fetch(`${env.SUPABASE_URL}/auth/v1/admin/users/${user.id}`, {
    headers: {
      "Authorization": `Bearer ${serviceRoleKey}`,
      "apikey": serviceRoleKey,
    }
  });

  if (!getUserResponse.ok) {
    return json({ error: "Failed to fetch updated user" }, { status: 500 });
  }

  const updatedUserData = await getUserResponse.json();

  const updatedUser = updatedUserData;

  const profile = {
    id: updatedUser.id,
    email: updatedUser.email ?? "",
    name: updatedUser.user_metadata?.name ?? "",
    avatar_url: updatedUser.user_metadata?.avatar_url ?? undefined,
    bio: updatedUser.user_metadata?.bio ?? "",
    is_public: updatedUser.user_metadata?.is_public ?? false,
    created_at: updatedUser.created_at ?? new Date().toISOString(),
  };

  return json(profile);
}
