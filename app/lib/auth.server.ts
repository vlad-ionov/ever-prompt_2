import { redirect } from "@remix-run/node";

import { getSession } from "@/lib/session.server";

type SessionUser = {
  id: string;
  email?: string;
};

export async function getOptionalUser(request: Request): Promise<SessionUser | null> {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");
  const email = session.get("email");

  if (!userId) {
    return null;
  }

  return { id: userId, email };
}

export async function requireUser(request: Request): Promise<SessionUser> {
  const user = await getOptionalUser(request);

  if (!user) {
    const url = new URL(request.url);
    const redirectTo = url.pathname + url.search;
    const search = new URLSearchParams({ redirectTo, login: "1" });
    throw redirect(`/?${search.toString()}`);
  }

  return user;
}
