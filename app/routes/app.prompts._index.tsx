import { useOutletContext } from "@remix-run/react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { PromptCard } from "@/components/PromptCard";
import { Toaster } from "@/components/ui/sonner";
import type { AppOutletContext } from "./app";
import type { Prompt } from "@/lib/types";

import { useTheme } from "@/hooks/useTheme";

export async function action() {
  // TODO: wire Supabase mutations
  return null;
}

export default function PromptsIndexRoute() {
  const { prompts: initialPrompts } = useOutletContext<AppOutletContext>();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [promptState, setPromptState] = useState<Prompt[]>(initialPrompts);
  const [searchQuery, setSearchQuery] = useState("");
  const [modelFilter, setModelFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredPrompts = useMemo(() => {
    return promptState.filter((prompt) => {
      const matchesQuery = prompt.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesModel =
        modelFilter === "all" || prompt.model === modelFilter;
      const matchesType = typeFilter === "all" || prompt.type === typeFilter;
      return matchesQuery && matchesModel && matchesType;
    });
  }, [modelFilter, promptState, searchQuery, typeFilter]);

  const toggleLike = (id: string) => {
    setPromptState((prev) =>
      prev.map((prompt) =>
        prompt.id === id
          ? {
              ...prompt,
              isLiked: !prompt.isLiked,
              likes: prompt.isLiked ? prompt.likes - 1 : prompt.likes + 1,
            }
          : prompt,
      ),
    );
  };

  const toggleSave = (id: string) => {
    setPromptState((prev) =>
      prev.map((prompt) =>
        prompt.id === id
          ? {
              ...prompt,
              isSaved: !prompt.isSaved,
            }
          : prompt,
      ),
    );
  };

  const toggleVisibility = (id: string) => {
    setPromptState((prev) =>
      prev.map((prompt) =>
        prompt.id === id
          ? {
              ...prompt,
              isPublic: !prompt.isPublic,
            }
          : prompt,
      ),
    );
  };

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "grain-bg-dark" : "grain-bg-light"
      }`}
    >
      <div className="grain-content">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10">
          <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1
                className={`text-3xl font-semibold ${
                  isDarkMode ? "text-[#fafafa]" : "text-[#333333]"
                }`}
              >
                Prompt Library
              </h1>
              <p className={isDarkMode ? "text-[#a1a1aa]" : "text-[#868686]"}>
                Browse, filter, and manage your prompt collection.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={toggleDarkMode}
                className={`rounded-md border px-3 py-2 text-sm ${
                  isDarkMode
                    ? "border-[#27272a] text-[#fafafa] hover:bg-[#18181b]"
                    : "border-[#d4d4d4] text-[#333333] hover:bg-[#f5f5f5]"
                }`}
              >
                Toggle {isDarkMode ? "Light" : "Dark"} Mode
              </button>
              <button
                type="button"
                onClick={() => setViewMode((mode) => (mode === "grid" ? "list" : "grid"))}
                className={`rounded-md border px-3 py-2 text-sm ${
                  isDarkMode
                    ? "border-[#27272a] text-[#fafafa] hover:bg-[#18181b]"
                    : "border-[#d4d4d4] text-[#333333] hover:bg-[#f5f5f5]"
                }`}
              >
                View: {viewMode === "grid" ? "Grid" : "List"}
              </button>
            </div>
          </header>

          <section className="grid gap-4 rounded-xl border bg-white/70 p-4 backdrop-blur-sm transition dark:border-[#27272a] dark:bg-[#0f0f11]/80">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <input
                type="search"
                placeholder="Search prompts..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 dark:border-[#27272a] dark:bg-[#18181b] dark:text-[#fafafa]"
              />
              <div className="flex gap-3">
                <select
                  value={modelFilter}
                  onChange={(event) => setModelFilter(event.target.value)}
                  className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 dark:border-[#27272a] dark:bg-[#18181b] dark:text-[#fafafa]"
                >
                  <option value="all">All models</option>
                  {[...new Set(initialPrompts.map((prompt) => prompt.model))].map((model) => (
                    <option key={model} value={model}>
                      {model}
                    </option>
                  ))}
                </select>
                <select
                  value={typeFilter}
                  onChange={(event) => setTypeFilter(event.target.value)}
                  className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 dark:border-[#27272a] dark:bg-[#18181b] dark:text-[#fafafa]"
                >
                  <option value="all">All types</option>
                  <option value="text">Text</option>
                  <option value="video">Video</option>
                  <option value="audio">Audio</option>
                  <option value="image">Image</option>
                </select>
              </div>
            </div>

            <div
              className={
                viewMode === "grid"
                  ? "grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
                  : "flex flex-col gap-4"
              }
            >
              {filteredPrompts.map((prompt) => (
                <PromptCard
                  key={prompt.id}
                  {...prompt}
                  viewMode={viewMode}
                  isDarkMode={isDarkMode}
                  onLike={(id) => toggleLike(id)}
                  onSave={(id) => toggleSave(id)}
                  onToggleVisibility={(id) => {
                    toggleVisibility(id);
                    toast.success("Prompt visibility updated");
                  }}
                  onShare={() => toast.info("Share coming soon")}
                  onCopy={() => toast.success("Prompt copied to clipboard")}
                  onDelete={() => toast.info("Delete flow coming soon")}
                  onEdit={() => toast.info("Edit flow coming soon")}
                  onAddToCollection={() => toast.info("Add to collection coming soon")}
                />
              ))}
              {filteredPrompts.length === 0 ? (
                <div
                  className={`rounded-xl border p-6 text-center ${
                    isDarkMode
                      ? "border-[#27272a] bg-[#0f0f11] text-[#a1a1aa]"
                      : "border-[#d4d4d4] bg-white text-[#868686]"
                  }`}
                >
                  <p className="text-sm">No prompts match your search criteria.</p>
                </div>
              ) : null}
            </div>
          </section>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
