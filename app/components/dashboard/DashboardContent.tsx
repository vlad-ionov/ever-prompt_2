import { FolderSimplePlus, MagnifyingGlass, SquaresFour, Heart, Flame, BookmarkSimple, GlobeHemisphereEast, ChartLineUp, List, Table, DotsThreeVertical } from "@phosphor-icons/react";
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
  viewMode: "grid" | "list" | "table";
  onViewModeChange: (mode: "grid" | "list" | "table") => void;
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
      <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : viewMode === "list" ? "space-y-3" : "border rounded-xl overflow-hidden"}>
        {Array.from({ length: 8 }).map((_, i) => (
          viewMode === "table" ? (
            <div key={i} className={`h-12 w-full animate-pulse border-b ${isDarkMode ? "bg-white/5 border-white/5" : "bg-slate-50 border-slate-100"}`} />
          ) : (
            <PromptCardSkeleton key={i} isDarkMode={isDarkMode} viewMode={viewMode} />
          )
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
    if (viewMode === "table") {
      return (
        <div className={`overflow-x-auto rounded-xl border ${isDarkMode ? "bg-[#0f0f12] border-white/5 shadow-2xl" : "bg-white border-slate-200 shadow-sm"}`}>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`border-b ${isDarkMode ? "border-white/5 bg-white/[0.02]" : "border-slate-100 bg-slate-50/50"}`}>
                <th className={`px-6 py-4 text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? "text-zinc-500" : "text-slate-400"}`}>Name</th>
                <th className={`px-6 py-4 text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? "text-zinc-500" : "text-slate-400"}`}>Prompts</th>
                <th className={`px-6 py-4 text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? "text-zinc-500" : "text-slate-400"}`}>Created</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-solid">
              {collections.map((collection) => (
                <tr 
                  key={collection.id} 
                  onClick={() => onCollectionClick(collection.id)}
                  className={`group cursor-pointer transition-colors ${isDarkMode ? "hover:bg-white/[0.02] border-white/5" : "hover:bg-slate-50 border-slate-100"}`}
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className={`text-sm font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>{collection.name}</span>
                      <span className={`text-[12px] opacity-60 line-clamp-1 ${isDarkMode ? "text-zinc-400" : "text-slate-500"}`}>{collection.description || "No description"}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium opacity-70">
                    {collection.promptIds.length} items
                  </td>
                  <td className="px-6 py-4 text-xs opacity-60">
                    {collection.createdAt}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => { e.stopPropagation(); onCollectionEdit(collection.id); }}>Edit</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

  if (viewMode === "table") {
    return (
      <div className={`overflow-hidden rounded-xl border animate-in fade-in duration-500 ${isDarkMode ? "bg-[#0f0f12] border-white/5 shadow-2xl" : "bg-white border-slate-200 shadow-sm"}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className={`border-b ${isDarkMode ? "border-white/5 bg-white/[0.02]" : "border-slate-100 bg-slate-50/50"}`}>
                <th className={`px-6 py-4 text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? "text-zinc-500" : "text-slate-400"}`}>Prompt</th>
                <th className={`px-6 py-4 text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? "text-zinc-500" : "text-slate-400"}`}>Type</th>
                <th className={`px-6 py-4 text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? "text-zinc-500" : "text-slate-400"}`}>Model</th>
                <th className={`px-6 py-4 text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? "text-zinc-500" : "text-slate-400"}`}>Status</th>
                <th className={`px-6 py-4 text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? "text-zinc-500" : "text-slate-400"}`}>Created</th>
                <th className="px-6 py-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-solid">
              {filteredPrompts.map((prompt) => (
                <tr 
                  key={prompt.id} 
                  onClick={() => onPromptClick(prompt.id)}
                  className={`group cursor-pointer transition-colors ${isDarkMode ? "hover:bg-white/[0.03] border-white/5" : "hover:bg-slate-50 border-slate-100"}`}
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col max-w-[300px]">
                      <span className={`text-sm font-bold truncate ${isDarkMode ? "text-white" : "text-slate-900"}`}>{prompt.title}</span>
                      <span className={`text-[12px] opacity-60 line-clamp-1 ${isDarkMode ? "text-zinc-500" : "text-slate-500"}`}>{prompt.description}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                      isDarkMode ? "bg-white/5 text-zinc-400" : "bg-slate-100 text-slate-600"
                    }`}>
                      {prompt.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-medium ${isDarkMode ? "text-zinc-400" : "text-slate-600"}`}>{prompt.model}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[11px] font-bold flex items-center gap-1.5 ${
                      prompt.isPublic ? "text-emerald-500" : "text-zinc-500"
                    }`}>
                      <div className={`h-1 w-1 rounded-full ${prompt.isPublic ? "bg-emerald-500 shadow-[0_0_8px_#10b981]" : "bg-zinc-500"}`} />
                      {prompt.isPublic ? "Public" : "Private"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs opacity-60">
                    {prompt.createdAt}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={`h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-all ${isDarkMode ? "hover:bg-violet-500/10 hover:text-violet-400" : "hover:bg-slate-100"}`}
                      onClick={(e) => { e.stopPropagation(); onPromptEdit(prompt.id); }}
                    >
                      <DotsThreeVertical className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : viewMode === "list" ? "space-y-3" : "space-y-4"}>
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
