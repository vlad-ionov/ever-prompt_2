import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";

import { requireUser } from "../lib/auth.server";
import { listCollections, listPrompts } from "../lib/mock.server";
import type { Collection, Prompt } from "../lib/types";

export type AuthenticatedUser = {
  id: string;
  email?: string;
};

export type AppOutletContext = {
  user: AuthenticatedUser;
  prompts: Prompt[];
  collections: Collection[];
};

type LoaderData = {
  user: AuthenticatedUser;
  prompts: Prompt[];
  collections: Collection[];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const isDemo = url.searchParams.get("demo") === "1";

  const user = isDemo
    ? { id: "demo-user", email: "demo@example.com" }
    : await requireUser(request);
  const [prompts, collections] = await Promise.all([listPrompts(user.id), listCollections(user.id)]);

  return json<LoaderData>({ user, prompts, collections });
}

export default function AppLayout() {
  const { user, prompts, collections } = useLoaderData<LoaderData>();
  const context: AppOutletContext = { user, prompts, collections };

  return <Outlet context={context} />;
}
