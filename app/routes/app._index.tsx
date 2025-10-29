import { useNavigate, useOutletContext, useSearchParams } from "@remix-run/react";
import { useEffect, useState } from "react";

import { Dashboard } from "@/components/Dashboard";
import { Toaster } from "@/components/ui/sonner";
import type { AppOutletContext } from "./app";

export default function AppHomeRoute() {
  const { prompts, collections } = useOutletContext<AppOutletContext>();
  const [searchParams] = useSearchParams();
  const demoMode = searchParams.get("demo") === "1";
  const navigate = useNavigate();
  const [isDarkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = isDarkMode ? "dark" : "light";
  }, [isDarkMode]);

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "grain-bg-dark" : "grain-bg-light"
      }`}
    >
      <div className="grain-content">
        <Dashboard
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setDarkMode((value) => !value)}
          demoMode={demoMode}
          initialPrompts={prompts}
          initialCollections={collections}
          onExitDemo={demoMode ? () => navigate("/?login=1") : undefined}
        />
      </div>
      <Toaster />
    </div>
  );
}
