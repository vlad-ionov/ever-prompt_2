import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";
import invariant from "tiny-invariant";
import { toast } from "sonner";

import { CollectionView } from "@/components/CollectionView";
import { Toaster } from "@/components/ui/sonner";
import { findCollection, listPrompts, listPromptsForCollection } from "@/lib/mock.server";
import type { Collection, Prompt } from "@/lib/types";

type LoaderData = {
  collection: Collection;
  prompts: Prompt[];
  allPrompts: Prompt[];
};

export async function loader({ params }: LoaderFunctionArgs) {
  const { id } = params;
  invariant(id, "Collection id is required");

  const collection = await findCollection(id);
  if (!collection) {
    throw new Response("Collection not found", { status: 404 });
  }

  const [prompts, allPrompts] = await Promise.all([
    listPromptsForCollection(collection),
    listPrompts(),
  ]);

  return json<LoaderData>({
    collection,
    prompts,
    allPrompts,
  });
}

export async function action(_args: ActionFunctionArgs) {
  // TODO: wire Supabase mutations
  return json({ ok: true });
}

export default function CollectionDetailRoute() {
  const { collection, prompts, allPrompts } = useLoaderData<LoaderData>();
  const navigate = useNavigate();

  const [isDarkMode, setDarkMode] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [collectionState, setCollectionState] = useState<Collection>(
    collection,
  );
  const [collectionPrompts, setCollectionPrompts] = useState<Prompt[]>(prompts);
  const [allPromptsState, setAllPromptsState] = useState<Prompt[]>(allPrompts);

  useEffect(() => {
    document.documentElement.dataset.theme = isDarkMode ? "dark" : "light";
  }, [isDarkMode]);

  const handleAddPrompts = (promptIds: string[]) => {
    const promptsToAdd = allPromptsState.filter((prompt) =>
      promptIds.includes(prompt.id),
    );
    if (promptsToAdd.length === 0) {
      toast.info("No prompts selected");
      return;
    }

    setCollectionPrompts((prev) => [...prev, ...promptsToAdd]);
    setCollectionState((prev) => ({
      ...prev,
      promptIds: [...new Set([...prev.promptIds, ...promptIds])],
    }));
    toast.success("Prompts added to collection");
  };

  const handleRemovePrompt = (promptId: string) => {
    setCollectionPrompts((prev) => prev.filter((prompt) => prompt.id !== promptId));
    setCollectionState((prev) => ({
      ...prev,
      promptIds: prev.promptIds.filter((id) => id !== promptId),
    }));
    toast.success("Prompt removed from collection");
  };

  const togglePromptLike = (promptId: string) => {
    setCollectionPrompts((prev) =>
      prev.map((prompt) =>
        prompt.id === promptId
          ? {
              ...prompt,
              isLiked: !prompt.isLiked,
              likes: prompt.isLiked ? prompt.likes - 1 : prompt.likes + 1,
            }
          : prompt,
      ),
    );
    setAllPromptsState((prev) =>
      prev.map((prompt) =>
        prompt.id === promptId
          ? {
              ...prompt,
              isLiked: !prompt.isLiked,
              likes: prompt.isLiked ? prompt.likes - 1 : prompt.likes + 1,
            }
          : prompt,
      ),
    );
  };

  const togglePromptSave = (promptId: string) => {
    setCollectionPrompts((prev) =>
      prev.map((prompt) =>
        prompt.id === promptId
          ? { ...prompt, isSaved: !prompt.isSaved }
          : prompt,
      ),
    );
    setAllPromptsState((prev) =>
      prev.map((prompt) =>
        prompt.id === promptId
          ? { ...prompt, isSaved: !prompt.isSaved }
          : prompt,
      ),
    );
  };

  const togglePromptVisibility = (promptId: string) => {
    setCollectionPrompts((prev) =>
      prev.map((prompt) =>
        prompt.id === promptId
          ? { ...prompt, isPublic: !prompt.isPublic }
          : prompt,
      ),
    );
    setAllPromptsState((prev) =>
      prev.map((prompt) =>
        prompt.id === promptId
          ? { ...prompt, isPublic: !prompt.isPublic }
          : prompt,
      ),
    );
    toast.success("Prompt visibility updated");
  };

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
            className={`mb-5 rounded-md border px-3 py-2 text-sm ${
              isDarkMode
                ? "border-[#27272a] text-[#fafafa] hover:bg-[#18181b]"
                : "border-[#d4d4d4] text-[#333333] hover:bg-[#f5f5f5]"
            }`}
          >
            Toggle {isDarkMode ? "Light" : "Dark"} Mode
          </button>

          <CollectionView
            collection={collectionState}
            prompts={collectionPrompts}
            allPrompts={allPromptsState}
            isDarkMode={isDarkMode}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onBack={() => navigate("/app/collections" )}
            onRemovePrompt={handleRemovePrompt}
            onAddPrompts={handleAddPrompts}
            onPromptClick={(id) => navigate(`/app/prompts/${id}`)}
            onPromptEdit={(id) => toast.info(`Edit prompt ${id} coming soon`)}
            onPromptDelete={(id) => toast.info(`Delete prompt ${id} coming soon`)}
            onPromptShare={() => toast.info("Share coming soon")}
            onPromptCopy={() => toast.success("Prompt copied to clipboard")}
            onPromptLike={togglePromptLike}
            onPromptSave={togglePromptSave}
            onPromptToggleVisibility={togglePromptVisibility}
            onPromptAddToCollection={() => toast.info("Add to collection coming soon")}
          />
        </div>
      </div>
      <Toaster />
    </div>
  );
}
