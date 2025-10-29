import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, useLocation, useNavigate, useSearchParams } from "@remix-run/react";
import { useCallback, useEffect, useState } from "react";

import { LandingPage } from "../components/LandingPage";
import { LoginDialog } from "../components/LoginDialog";
import { Toaster } from "../components/ui/sonner";
import { useAuth } from "../contexts/AuthContext";
import { getOptionalUser } from "../lib/auth.server";

export const meta: MetaFunction = () => [
  { title: "PromptVault — Organize Your Prompts" },
  {
    name: "description",
    content:
      "Manage, share, and collaborate on AI prompts. PromptVault keeps your prompt library organized and accessible.",
  },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getOptionalUser(request);
  if (user) {
    return redirect("/app");
  }
  return json({});
}

export default function Index() {
  useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const loginQuery = searchParams.get("login");
  const redirectParam = searchParams.get("redirectTo");
  const safeRedirect = redirectParam && redirectParam.startsWith("/") ? redirectParam : "/app";
  const { user, loading } = useAuth();
  const [isDarkMode, setDarkMode] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);

  useEffect(() => {
    if (loginQuery === "1") {
      setLoginDialogOpen(true);
    }
  }, [loginQuery]);

  useEffect(() => {
    document.documentElement.dataset.theme = isDarkMode ? "dark" : "light";
  }, [isDarkMode]);

  useEffect(() => {
    if (!loading && user) {
      navigate(safeRedirect);
    }
  }, [loading, navigate, safeRedirect, user]);

  const handleLoginDialogOpenChange = useCallback(
    (open: boolean) => {
      setLoginDialogOpen(open);

      if (open) {
        if (loginQuery !== "1") {
          const nextParams = new URLSearchParams(location.search || "");
          nextParams.set("login", "1");
          const nextSearch = nextParams.toString();
          navigate(`${location.pathname}${nextSearch ? `?${nextSearch}` : ""}`, {
            replace: true,
          });
        }
        return;
      }

      if (loginQuery === "1") {
        const nextParams = new URLSearchParams(location.search || "");
        nextParams.delete("login");
        const nextSearch = nextParams.toString();
        navigate(`${location.pathname}${nextSearch ? `?${nextSearch}` : ""}`, {
          replace: true,
        });
      }
    },
    [location.pathname, location.search, loginQuery, navigate],
  );

  const showLoginDialog = useCallback(() => {
    handleLoginDialogOpenChange(true);
  }, [handleLoginDialogOpenChange]);

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDarkMode ? "grain-bg-dark" : "grain-bg-light"
        }`}
      >
        <div className="grain-content">
          <p className={isDarkMode ? "text-[#f5f5f5]" : "text-[#333333]"}>
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "grain-bg-dark" : "grain-bg-light"
      }`}
    >
      <div className="grain-content">
        <LandingPage
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setDarkMode((state) => !state)}
          onGetStarted={showLoginDialog}
          onLogin={showLoginDialog}
          onDemo={() => navigate("/app?demo=1")}
        />
        <LoginDialog
          open={loginDialogOpen}
          onOpenChange={handleLoginDialogOpenChange}
          isDarkMode={isDarkMode}
        />
      </div>
      <Toaster />
    </div>
  );
}
