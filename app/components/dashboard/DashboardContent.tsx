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
        <div className={`overflow-hidden rounded-2xl border transition-all duration-500 animate-in fade-in slide-in-from-bottom-4 ${
          isDarkMode 
            ? "bg-[#0f0f12]/60 backdrop-blur-2xl border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]" 
            : "bg-white/80 backdrop-blur-xl border-slate-200 shadow-xl"
        }`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`${isDarkMode ? "bg-white/[0.03] border-b border-white/10" : "bg-slate-50/80 border-b border-slate-100"}`}>
                  <th className={`px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] ${isDarkMode ? "text-zinc-500" : "text-slate-500"}`}>Collection Name</th>
                  <th className={`px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] ${isDarkMode ? "text-zinc-500" : "text-slate-500"}`}>Count</th>
                  <th className={`px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] ${isDarkMode ? "text-zinc-500" : "text-slate-500"}`}>Modified</th>
                  <th className="px-6 py-5"></th>
                </tr>
              </thead>
              <tbody className={isDarkMode ? "divide-y divide-white/5" : "divide-y divide-slate-100"}>
                {collections.map((collection) => (
                  <tr 
                    key={collection.id} 
                    onClick={() => onCollectionClick(collection.id)}
                    className={`group cursor-pointer transition-all duration-300 relative overflow-hidden ${
                      isDarkMode 
                        ? "hover:bg-violet-500/[0.05] hover:shadow-[inset_0_0_20px_rgba(139,92,246,0.05)]" 
                        : "hover:bg-slate-50/50"
                    }`}
                  >
                    <td className="px-6 py-5 relative z-10">
                      <div className="flex flex-col gap-1">
                        <span className={`text-[15px] font-bold tracking-tight transition-colors ${
                          isDarkMode ? "text-white group-hover:text-violet-400" : "text-slate-900 group-hover:text-violet-600"
                        }`}>
                          {collection.name}
                        </span>
                        <span className={`text-xs opacity-60 line-clamp-1 font-medium ${isDarkMode ? "text-zinc-400" : "text-slate-500"}`}>
                          {collection.description || "Organized prompt collection"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 relative z-10">
                      <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        isDarkMode ? "bg-white/5 text-zinc-300 border border-white/5 shadow-[0_0_15px_rgba(255,255,255,0.02)]" : "bg-slate-100 text-slate-700 border border-slate-200"
                      }`}>
                        {collection.promptIds.length} Prompts
                      </div>
                    </td>
                    <td className="px-6 py-5 relative z-10">
                      <span className={`text-xs font-semibold ${isDarkMode ? "text-zinc-500" : "text-slate-400"}`}>
                        {collection.createdAt}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right relative z-10">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className={`opacity-0 group-hover:opacity-100 transition-all rounded-lg h-8 border shadow-sm ${
                          isDarkMode ? "bg-white/5 border-white/10 text-white hover:bg-white/10" : "bg-white border-slate-200 text-slate-900 hover:bg-slate-50"
                        }`} 
                        onClick={(e) => { e.stopPropagation(); onCollectionEdit(collection.id); }}
                      >
                        Settings
                      </Button>
                    </td>
                    {/* Liquid Highlight Effect */}
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
      <div className={`overflow-hidden rounded-2xl border transition-all duration-500 animate-in fade-in slide-in-from-bottom-4 ${
        isDarkMode 
          ? "bg-[#0f0f12]/60 backdrop-blur-2xl border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]" 
          : "bg-white/80 backdrop-blur-xl border-slate-200 shadow-xl"
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className={`${isDarkMode ? "bg-white/[0.03] border-b border-white/10" : "bg-slate-50/80 border-b border-slate-100"}`}>
                <th className={`px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] ${isDarkMode ? "text-zinc-500" : "text-slate-500"}`}>Prompt</th>
                <th className={`px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] ${isDarkMode ? "text-zinc-500" : "text-slate-500"}`}>Type</th>
                <th className={`px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] ${isDarkMode ? "text-zinc-500" : "text-slate-500"}`}>Model</th>
                <th className={`px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] ${isDarkMode ? "text-zinc-500" : "text-slate-500"}`}>Status</th>
                <th className={`px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] ${isDarkMode ? "text-zinc-500" : "text-slate-500"}`}>Created</th>
                <th className="px-6 py-5"></th>
              </tr>
            </thead>
            <tbody className={isDarkMode ? "divide-y divide-white/5" : "divide-y divide-slate-100"}>
              {filteredPrompts.map((prompt) => (
                <tr 
                  key={prompt.id} 
                  onClick={() => onPromptClick(prompt.id)}
                  className={`group cursor-pointer transition-all duration-300 relative overflow-hidden ${
                    isDarkMode 
                      ? "hover:bg-violet-500/[0.05] hover:shadow-[inset_0_0_25px_rgba(139,92,246,0.06)]" 
                      : "hover:bg-slate-50/50"
                  }`}
                >
                  <td className="px-6 py-5 relative z-10">
                    <div className="flex flex-col gap-1 max-w-[320px]">
                      <span className={`text-[15px] font-bold tracking-tight transition-colors ${
                        isDarkMode ? "text-white group-hover:text-violet-400" : "text-slate-900 group-hover:text-violet-600"
                      }`}>
                        {prompt.title}
                      </span>
                      <span className={`text-xs opacity-60 line-clamp-1 font-medium ${isDarkMode ? "text-zinc-400" : "text-slate-500"}`}>
                        {prompt.description}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 relative z-10">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      isDarkMode 
                        ? "bg-violet-500/10 text-violet-400 border border-violet-500/20" 
                        : "bg-slate-100 text-slate-600 border border-slate-200 shadow-sm"
                    }`}>
                      {prompt.type}
                    </span>
                  </td>
                  <td className="px-6 py-5 relative z-10">
                    <div className="flex items-center gap-2.5">
                      <span className={`text-xs font-bold ${isDarkMode ? "text-zinc-300" : "text-slate-700"}`}>
                        {prompt.model}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 relative z-10">
                    <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                      prompt.isPublic 
                        ? (isDarkMode ? "text-emerald-400 bg-emerald-400/10 border border-emerald-400/20" : "text-emerald-600 bg-emerald-50 border border-emerald-100")
                        : (isDarkMode ? "text-zinc-400 bg-white/5 border border-white/5" : "text-slate-500 bg-slate-50 border border-slate-100")
                    }`}>
                      <div className={`h-1.5 w-1.5 rounded-full animate-pulse ${
                        prompt.isPublic ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-zinc-500"
                      }`} />
                      {prompt.isPublic ? "Public" : "Private"}
                    </div>
                  </td>
                  <td className="px-6 py-5 relative z-10">
                    <span className={`text-xs font-semibold ${isDarkMode ? "text-zinc-500" : "text-slate-400"}`}>
                      {prompt.createdAt}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right relative z-10">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={`h-9 w-9 p-0 opacity-0 group-hover:opacity-100 transition-all rounded-xl border shadow-lg ${
                        isDarkMode 
                          ? "bg-white/5 border-white/10 text-white hover:bg-violet-500/30 hover:border-violet-500/40 hover:text-white hover:shadow-violet-500/20" 
                          : "bg-white border-slate-200 text-slate-900 hover:bg-slate-50"
                      }`}
                      onClick={(e) => { e.stopPropagation(); onPromptEdit(prompt.id); }}
                    >
                      <DotsThreeVertical className="h-5 w-5" weight="bold" />
                    </Button>
                  </td>
                  {/* Liquid Highlight Effect Overlay */}
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  {isDarkMode && (
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-500/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  )}
                  {/* Glowing Edge */}
                  <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-violet-500 shadow-[0_0_15px_rgba(139,92,246,0.5)] scale-y-0 group-hover:scale-y-100 transition-transform duration-300" />
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
