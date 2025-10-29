import { useNavigate, useOutletContext } from "@remix-run/react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { CollectionCard } from "@/components/CollectionCard";
import { Toaster } from "@/components/ui/sonner";
import type { AppOutletContext } from "./app";
import type { Collection } from "@/lib/types";

export async function action() {
  // TODO: wire Supabase mutations
  return null;
}

export default function CollectionsIndexRoute() {
  const { collections: initialCollections } = useOutletContext<AppOutletContext>();
  const navigate = useNavigate();
  const [isDarkMode, setDarkMode] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [collectionState, setCollectionState] = useState<Collection[]>(initialCollections);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    document.documentElement.dataset.theme = isDarkMode ? "dark" : "light";
  }, [isDarkMode]);

  const filteredCollections = useMemo(() => {
    return collectionState.filter((collection) =>
      collection.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [collectionState, searchQuery]);

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "grain-bg-dark" : "grain-bg-light"
      }`}
    >
      <div className="grain-content">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-10">
          <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1
                className={`text-3xl font-semibold ${
                  isDarkMode ? "text-[#fafafa]" : "text-[#333333]"
                }`}
              >
                Collections
              </h1>
              <p className={isDarkMode ? "text-[#a1a1aa]" : "text-[#868686]"}>
                Organize related prompts into reusable groups.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDarkMode((value) => !value)}
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
                placeholder="Search collections..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 dark:border-[#27272a] dark:bg-[#18181b] dark:text-[#fafafa]"
              />
            </div>

            <div
              className={
                viewMode === "grid"
                  ? "grid gap-4 sm:grid-cols-2"
                  : "flex flex-col gap-4"
              }
            >
              {filteredCollections.map((collection) => (
                <CollectionCard
                  key={collection.id}
                  {...collection}
                  promptCount={collection.promptIds.length}
                  createdAt={collection.createdAt}
                  updatedAt={collection.updatedAt}
                  isDarkMode={isDarkMode}
                  viewMode={viewMode}
                  onClick={(id) => navigate(`/app/collections/${id}`)}
                  onEdit={(id) => toast.info(`Edit collection ${id} coming soon`)}
                  onDelete={(id) => toast.info(`Delete collection ${id} coming soon`)}
                />
              ))}
              {filteredCollections.length === 0 ? (
                <div
                  className={`rounded-xl border p-6 text-center ${
                    isDarkMode
                      ? "border-[#27272a] bg-[#0f0f11] text-[#a1a1aa]"
                      : "border-[#d4d4d4] bg-white text-[#868686]"
                  }`}
                >
                  <p className="text-sm">No collections match your search criteria.</p>
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
