import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  useLoaderData,
  useNavigate,
} from "@remix-run/react";
import { useEffect, useState } from "react";
import invariant from "tiny-invariant";
import { toast } from "sonner";

import { PromptDetailSheet } from "@/components/PromptDetailSheet";
import { Toaster } from "@/components/ui/sonner";
import { findPrompt } from "@/lib/mock.server";
import type { Prompt } from "@/lib/types";
import { requireUser } from "@/lib/auth.server";

type LoaderData = {
  prompt: Prompt;
};

export async function loader({ params, request }: LoaderFunctionArgs) {
  const user = await requireUser(request);
  const { id } = params;
  invariant(id, "Prompt id is required");

  const prompt = await findPrompt(id, user.id);
  
  if (!prompt) {
    throw new Response("Prompt not found", { status: 404 });
  }

  // Increment views in the background
  await import("@/lib/mock.server").then(({ incrementPromptViews }) => 
    incrementPromptViews(id)
  ).catch(err => console.error("Failed to increment views:", err));

  return json<LoaderData>({ prompt });
}

export async function action(_args: ActionFunctionArgs) {
  // TODO: wire Supabase mutations
  return json({ ok: true });
}

export default function PromptDetailRoute() {
  const { prompt } = useLoaderData<LoaderData>();
  const navigate = useNavigate();

  const [isDarkMode, setDarkMode] = useState(false);
  const [open, setOpen] = useState(true);
  const [promptState, setPromptState] = useState<Prompt>(prompt);

  useEffect(() => {
    document.documentElement.dataset.theme = isDarkMode ? "dark" : "light";
  }, [isDarkMode]);

  useEffect(() => {
    if (!open) {
      navigate(-1);
    }
  }, [navigate, open]);

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "grain-bg-dark" : "grain-bg-light"
      }`}
    >
      <div className="grain-content">
        <div className="px-4 py-10">
          <button
            type="button"
            onClick={() => setDarkMode((value) => !value)}
            className={`mb-4 rounded-md border px-3 py-2 text-sm ${
              isDarkMode
                ? "border-[#27272a] text-[#fafafa] hover:bg-[#18181b]"
                : "border-[#d4d4d4] text-[#333333] hover:bg-[#f5f5f5]"
            }`}
          >
            Toggle {isDarkMode ? "Light" : "Dark"} Mode
          </button>
        </div>
      </div>

      <PromptDetailSheet
        open={open}
        onOpenChange={setOpen}
        prompt={promptState}
        isDarkMode={isDarkMode}
        onLike={(id) => {
          if (promptState.id !== id) return;
          setPromptState((previous) => ({
            ...previous,
            isLiked: !previous.isLiked,
            likes: previous.isLiked
              ? Math.max(previous.likes - 1, 0)
              : previous.likes + 1,
          }));
        }}
        onSave={(id) => {
          if (promptState.id !== id) return;
          setPromptState((previous) => ({
            ...previous,
            isSaved: !previous.isSaved,
          }));
        }}
        onToggleVisibility={(id) => {
          if (promptState.id !== id) return;
          setPromptState((previous) => ({
            ...previous,
            isPublic: !previous.isPublic,
          }));
          toast.success("Prompt visibility updated");
        }}
        onEdit={() => toast.info("Edit flow coming soon")}
        onDelete={() => toast.info("Delete flow coming soon")}
        onShare={() => toast.info("Share coming soon")}
        onAddToCollection={() => toast.info("Add to collection coming soon")}
      />
      <Toaster />
    </div>
  );
}
