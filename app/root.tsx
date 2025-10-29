import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { getClientEnv } from "@/lib/env.server";
import { AuthProvider } from "@/contexts/AuthContext";
import "./root.scss";
import "./tailwind.css";

export async function loader(_args: LoaderFunctionArgs) {
  try {
    return json({ env: getClientEnv() });
  } catch (error) {
    console.warn("Missing client env; falling back to empty object", error);
    return json({ env: {} });
  }
}

export const links: LinksFunction = () => {
  return [];
};

export function Layout({ children }: { children: React.ReactNode }) {
  const data = useLoaderData<typeof loader>();
  const env = data?.env ?? {};

  return (
    <html lang="en" data-theme="light">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(env)};`,
          }}
        />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}
