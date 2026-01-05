import { FolderSimplePlus, MagnifyingGlass, SquaresFour, Heart, Flame, BookmarkSimple, GlobeHemisphereEast, ChartLineUp } from "@phosphor-icons/react";
import { Button } from "../ui/button";
import { CollectionCard } from "../CollectionCard";
import { PromptCard } from "../PromptCard";
import { CollectionView } from "../CollectionView";
import { PromptCardSkeleton } from "../PromptCardSkeleton";
import { AnalyticsDashboard } from "./AnalyticsDashboard";
import type { Prompt, Collection } from "@/lib/types";

interface DashboardContentProps {
  isDarkMode: boolean;
  activeView: string;
  viewingCollection: boolean;
  selectedCollection: Collection | null;
  prompts: Prompt[];
  collections: Collection[];
  filteredPrompts: Prompt[];
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  onBackFromCollection: () => void;
  onRemovePromptFromCollection: (pid: string) => void;
  onAddPromptsToCollection: (pids: string[]) => void;
  onPromptClick: (id: string) => void;
  onPromptEdit: (id: string) => void;
  onPromptDelete: (id: string) => void;
  onPromptShare: (id: string) => void;
  onPromptCopy: (id: string) => void;
  onPromptLike: (id: string) => void;
  onPromptSave: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onAddToCollection: (id: string) => void;
  onCollectionClick: (id: string) => void;
  onCollectionEdit: (id: string) => void;
  onCollectionDelete: (id: string) => void;
  onAddCollection: () => void;
  isLoading?: boolean;
}

export function DashboardContent({
  isDarkMode,
  activeView,
  viewingCollection,
  selectedCollection,
  prompts,
  collections,
  filteredPrompts,
  viewMode,
  onViewModeChange,
  onBackFromCollection,
  onRemovePromptFromCollection,
  onAddPromptsToCollection,
  onPromptClick,
  onPromptEdit,
  onPromptDelete,
  onPromptShare,
  onPromptCopy,
  onPromptLike,
  onPromptSave,
  onToggleVisibility,
  onAddToCollection,
  onCollectionClick,
  onCollectionEdit,
  onCollectionDelete,
  onAddCollection,
  isLoading = false,
}: DashboardContentProps) {
  if (isLoading) {
    return (
      <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-3"}>
        {Array.from({ length: 8 }).map((_, i) => (
          <PromptCardSkeleton key={i} isDarkMode={isDarkMode} viewMode={viewMode} />
        ))}
      </div>
    );
  }

  if (viewingCollection && selectedCollection) {
    return (
      <CollectionView
        collection={selectedCollection}
        prompts={prompts.filter((p) => selectedCollection.promptIds.includes(p.id))}
        allPrompts={prompts}
        isDarkMode={isDarkMode}
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
        onBack={onBackFromCollection}
        onRemovePrompt={onRemovePromptFromCollection}
        onAddPrompts={onAddPromptsToCollection}
        onPromptClick={onPromptClick}
        onPromptEdit={onPromptEdit}
        onPromptDelete={onPromptDelete}
        onPromptShare={onPromptShare}
        onPromptCopy={onPromptCopy}
        onPromptLike={onPromptLike}
        onPromptSave={onPromptSave}
        onPromptToggleVisibility={onToggleVisibility}
        onPromptAddToCollection={onAddToCollection}
      />
    );
  }

  if (activeView === "analytics") {
    return <AnalyticsDashboard prompts={prompts} isDarkMode={isDarkMode} />;
  }

  if (activeView === "collections") {
    if (collections.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in-95 duration-500">
          <div className={`p-4 rounded-full mb-4 ${isDarkMode ? 'bg-[#18181b]' : 'bg-slate-50'}`}>
              <FolderSimplePlus className={`h-8 w-8 ${isDarkMode ? "text-zinc-400" : "text-slate-400"}`} weight="light" />
          </div>
          <h3 className={`text-lg font-bold mb-1 ${isDarkMode ? "text-white" : "text-slate-900"}`}>No collections yet</h3>
          <p className={`text-sm mb-6 max-w-sm ${isDarkMode ? "text-zinc-400" : "text-slate-500"}`}>Create collections to organize your prompts into varied groups for easier access.</p>
          <Button
              onClick={onAddCollection}
              className={`rounded-xl px-5 h-10 ${isDarkMode ? "bg-[#8b5cf6] text-white hover:bg-[#7c3aed]" : "bg-[#8b5cf6] text-white hover:bg-[#7c3aed]"}`}
          >
              <FolderSimplePlus className="h-4 w-4 mr-2" weight="bold" />
              Create Collection
          </Button>
        </div>
      );
    }
    return (
      <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-3"}>
        {collections.map((collection) => (
          <CollectionCard
            key={collection.id}
            {...collection}
            promptCount={collection.promptIds.length}
            isDarkMode={isDarkMode}
            viewMode={viewMode}
            onClick={onCollectionClick}
            onEdit={onCollectionEdit}
            onDelete={onCollectionDelete}
          />
        ))}
      </div>
    );
  }

  if (filteredPrompts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center animate-in fade-in zoom-in-95 duration-500">
          <div className={`p-4 rounded-full mb-4 ${isDarkMode ? 'bg-[#18181b]' : 'bg-slate-50'}`}>
              <MagnifyingGlass className={`h-8 w-8 ${isDarkMode ? "text-zinc-500" : "text-slate-400"}`} weight="light" />
          </div>
          <h3 className={`text-lg font-bold mb-1 ${isDarkMode ? "text-white" : "text-slate-900"}`}>No prompts found</h3>
          <p className={`text-sm ${isDarkMode ? "text-zinc-400" : "text-slate-500"}`}>We couldn't find any prompts matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-3"}>
      {filteredPrompts.map((prompt) => (
        <PromptCard
          key={prompt.id}
          {...prompt}
          isDarkMode={isDarkMode}
          viewMode={viewMode}
          onClick={onPromptClick}
          onEdit={onPromptEdit}
          onDelete={onPromptDelete}
          onShare={onPromptShare}
          onCopy={onPromptCopy}
          onLike={onPromptLike}
          onSave={onPromptSave}
          onToggleVisibility={onToggleVisibility}
          onAddToCollection={onAddToCollection}
        />
      ))}
    </div>
  );
}
