import type { LinksFunction } from "@remix-run/node";
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
import tailwindStylesheet from "./tailwind.css?url";
import rootStylesheet from "./root.scss?url";

export async function loader() {
  try {
    return json({ env: getClientEnv() });
  } catch (error) {
    console.warn("Missing client env; falling back to empty object", error);
    return json({ env: {} });
  }
}

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700;800;900&display=swap",
  },
  { rel: "stylesheet", href: tailwindStylesheet },
  { rel: "stylesheet", href: rootStylesheet },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const data = useLoaderData<typeof loader>();
  const env = data?.env ?? {};
  const serializedEnv = JSON.stringify(env).replace(/</g, "\\u003c");

  return (
    <html lang="en" data-theme="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${serializedEnv};`,
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
