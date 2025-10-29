import { createCookieSessionStorage } from "@remix-run/node";

import { getServerEnv } from "@/lib/env.server";

const { SESSION_SECRET } = getServerEnv();

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__promptvault_session",
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    secrets: [SESSION_SECRET],
  },
});

export const { getSession, commitSession, destroySession } = sessionStorage;
