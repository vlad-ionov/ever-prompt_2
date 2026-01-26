import { useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { PromptCard } from "./PromptCard";
import { FolderOpen, ArrowLeft, Plus, Search, Grid3x3, List, Lock } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";

import type { Collection, Prompt } from "@/lib/types";

interface CollectionViewProps {
  collection: Collection;
  prompts: Prompt[];
  allPrompts: Prompt[];
  isDarkMode?: boolean;
  viewMode?: "grid" | "list" | "table";
  onViewModeChange?: (mode: "grid" | "list" | "table") => void;
  onBack?: () => void;
  onRemovePrompt?: (promptId: string) => void;
  onAddPrompts?: (promptIds: string[]) => void;
  onPromptClick?: (id: string) => void;
  onPromptEdit?: (id: string) => void;
  onPromptDelete?: (id: string) => void;
  onPromptShare?: (id: string) => void;
  onPromptCopy?: (id: string) => void;
  onPromptLike?: (id: string) => void;
  onPromptSave?: (id: string) => void;
  onPromptToggleVisibility?: (id: string) => void;
  onPromptAddToCollection?: (id: string) => void;
}

export function CollectionView({
  collection,
  prompts,
  allPrompts,
  isDarkMode = false,
  viewMode = "grid",
  onViewModeChange,
  onBack,
  onRemovePrompt,
  onAddPrompts,
  onPromptClick,
  onPromptEdit,
  onPromptDelete,
  onPromptShare,
  onPromptCopy,
  onPromptLike,
  onPromptSave,
  onPromptToggleVisibility,
  onPromptAddToCollection,
}: CollectionViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedPrompts, setSelectedPrompts] = useState<string[]>([]);

  // Filter available prompts (not already in collection and private only)
  const availablePrompts = allPrompts.filter(
    (p) => !collection.promptIds.includes(p.id) && !p.isPublic
  );

  const filteredAvailablePrompts = availablePrompts.filter((prompt) =>
    prompt.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddPrompts = () => {
    if (selectedPrompts.length > 0) {
      onAddPrompts?.(selectedPrompts);
      setSelectedPrompts([]);
      setShowAddDialog(false);
      setSearchQuery("");
    }
  };

  const togglePromptSelection = (promptId: string) => {
    setSelectedPrompts((prev) =>
      prev.includes(promptId)
        ? prev.filter((id) => id !== promptId)
        : [...prev, promptId]
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div
        className={`border-b ${
          isDarkMode ? "border-[#27272a] bg-[#0f0f11]" : "border-[#e5e5e5] bg-white"
        } px-4 md:px-6 py-4`}
      >
        <div className="flex items-start gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className={
              isDarkMode
                ? "text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#18181b]"
                : "text-[#868686] hover:text-[#333333] hover:bg-[#f1f5f9]"
            }
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div
            className={`p-3 rounded-xl ${
              isDarkMode
                ? "bg-gradient-to-br from-[#8b5cf6]/10 to-[#a78bfa]/5 border-[#8b5cf6]/20"
                : "bg-zinc-100/50 border-zinc-200"
            } border`}
          >
            <FolderOpen
              className={`h-6 w-6 ${
                isDarkMode ? "text-[#8b5cf6]" : "text-[#111111]"
              }`}
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h2
                className={`text-xl ${
                  isDarkMode ? "text-[#fafafa]" : "text-[#333333]"
                }`}
              >
                {collection.name}
              </h2>
              <Badge
                variant="secondary"
                className={
                  isDarkMode
                    ? "bg-[#18181b] text-[#a1a1aa] border-[#27272a]"
                    : "bg-[#f1f5f9] text-[#868686] border-[#e5e5e5]"
                }
              >
                <Lock className="h-3 w-3 mr-1" />
                Private
              </Badge>
              <Badge
                variant="secondary"
                className={
                  isDarkMode
                    ? "bg-[#18181b] text-[#a1a1aa] border-[#27272a]"
                    : "bg-[#f1f5f9] text-[#868686] border-[#e5e5e5]"
                }
              >
                {prompts.length}
              </Badge>
            </div>
            <p
              className={`text-sm ${
                isDarkMode ? "text-[#a1a1aa]" : "text-[#868686]"
              }`}
            >
              {collection.description || "No description provided"}
            </p>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div
        className={`border-b ${
          isDarkMode ? "border-[#27272a] bg-[#0f0f11]" : "border-[#e5e5e5] bg-white"
        } px-4 md:px-6 py-4`}
      >
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => setShowAddDialog(true)}
            className={
              isDarkMode
                ? "bg-[#8b5cf6] text-white hover:bg-[#7c3aed]"
                : "bg-[#111111] text-white hover:bg-zinc-800"
            }
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Prompts
          </Button>

          <div className="flex-1" />

          {/* View Mode Toggle */}
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onViewModeChange?.("grid")}
              className={`${
                viewMode === "grid"
                  ? isDarkMode
                    ? "bg-[#18181b] text-[#8b5cf6]"
                    : "bg-[#f1f5f9] text-[#111111]"
                  : isDarkMode
                  ? "text-[#a1a1aa] hover:bg-[#18181b]"
                  : "text-[#868686] hover:bg-[#f1f5f9]"
              }`}
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onViewModeChange?.("list")}
              className={`${
                viewMode === "list"
                  ? isDarkMode
                    ? "bg-[#18181b] text-[#8b5cf6]"
                    : "bg-[#f1f5f9] text-[#111111]"
                  : isDarkMode
                  ? "text-[#a1a1aa] hover:bg-[#18181b]"
                  : "text-[#868686] hover:bg-[#f1f5f9]"
              }`}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className={`flex-1 px-4 md:px-6 py-4 md:py-8 overflow-auto ${isDarkMode ? "bg-[#09090b]" : "bg-[#fafafa]"}`}>
        {prompts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 md:py-16 text-center">
            <FolderOpen
              className={`h-16 w-16 mb-4 ${
                isDarkMode ? "text-[#27272a]" : "text-[#d4d4d4]"
              }`}
            />
            <h3
              className={`text-lg mb-2 ${
                isDarkMode ? "text-[#fafafa]" : "text-[#333333]"
              }`}
            >
              No prompts yet
            </h3>
            <p
              className={`text-sm mb-4 ${
                isDarkMode ? "text-[#a1a1aa]" : "text-[#868686]"
              }`}
            >
              Add private prompts to this collection to get started
            </p>
            <Button
              onClick={() => setShowAddDialog(true)}
              className={
                isDarkMode
                  ? "bg-[#8b5cf6] text-white hover:bg-[#7c3aed]"
                  : "bg-[#111111] text-white hover:bg-zinc-800"
              }
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Prompts
            </Button>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4"
                : "space-y-3 md:space-y-4"
            }
          >
            {prompts.map((prompt) => (
              <PromptCard
                key={prompt.id}
                {...prompt}
                isDarkMode={isDarkMode}
                viewMode={viewMode}
                onClick={onPromptClick}
                onEdit={onPromptEdit}
                onDelete={() => {
                  onRemovePrompt?.(prompt.id);
                }}
                onShare={onPromptShare}
                onCopy={onPromptCopy}
                onLike={onPromptLike}
                onSave={onPromptSave}
                onToggleVisibility={onPromptToggleVisibility}
                onAddToCollection={onPromptAddToCollection}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Prompts Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent
          className={`sm:max-w-3xl max-h-[90vh] overflow-y-auto ${
            isDarkMode
              ? "bg-[#0f0f11] border-[#27272a]"
              : "bg-white border-[#d4d4d4]"
          }`}
        >
          <DialogHeader>
            <DialogTitle
              className={isDarkMode ? "text-[#fafafa]" : "text-[#333333]"}
            >
              Add Prompts to Collection
            </DialogTitle>
            <DialogDescription
              className={isDarkMode ? "text-[#a1a1aa]" : "text-[#868686]"}
            >
              Select private prompts to add to "{collection.name}"
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search
                className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${
                  isDarkMode ? "text-[#71717a]" : "text-[#868686]"
                }`}
              />
              <Input
                placeholder="Search prompts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-10 ${
                  isDarkMode
                    ? "bg-[#18181b] border-[#27272a] text-[#fafafa] placeholder:text-[#52525b]"
                    : "bg-white border-[#d4d4d4] text-[#333333] placeholder:text-[#868686]"
                }`}
              />
            </div>

            {/* Available Prompts */}
            <ScrollArea className="h-[400px]">
              {filteredAvailablePrompts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-[#a1a1aa]" : "text-[#868686]"
                    }`}
                  >
                    {availablePrompts.length === 0
                      ? "No private prompts available to add"
                      : "No prompts found"}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredAvailablePrompts.map((prompt) => (
                    <div
                      key={prompt.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedPrompts.includes(prompt.id)
                          ? isDarkMode
                            ? "bg-[#8b5cf6]/10 border-[#8b5cf6]"
                            : "bg-zinc-100 border-zinc-300"
                          : isDarkMode
                          ? "bg-[#18181b] border-[#27272a] hover:border-[#8b5cf6]/50"
                          : "bg-white border-[#d4d4d4] hover:border-[#111111]/50"
                      }`}
                      onClick={() => togglePromptSelection(prompt.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`mt-1 h-4 w-4 rounded border flex items-center justify-center flex-shrink-0 ${
                            selectedPrompts.includes(prompt.id)
                              ? isDarkMode
                                ? "bg-[#8b5cf6] border-[#8b5cf6]"
                                : "bg-[#111111] border-[#111111]"
                              : isDarkMode
                              ? "border-[#27272a]"
                              : "border-[#d4d4d4]"
                          }`}
                        >
                          {selectedPrompts.includes(prompt.id) && (
                            <div className="h-2 w-2 bg-white rounded-sm" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4
                            className={`text-sm mb-1 ${
                              isDarkMode ? "text-[#fafafa]" : "text-[#333333]"
                            }`}
                          >
                            {prompt.title}
                          </h4>
                          <p
                            className={`text-xs line-clamp-1 ${
                              isDarkMode ? "text-[#a1a1aa]" : "text-[#868686]"
                            }`}
                          >
                            {prompt.description}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className={`flex-shrink-0 text-xs ${
                            isDarkMode
                              ? "border-[#27272a] text-[#a1a1aa]"
                              : "border-[#d4d4d4] text-[#868686]"
                          }`}
                        >
                          {prompt.model}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>

          <div className="flex items-center justify-between pt-4">
            <p
              className={`text-sm ${
                isDarkMode ? "text-[#a1a1aa]" : "text-[#868686]"
              }`}
            >
              {selectedPrompts.length} selected
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddDialog(false);
                  setSelectedPrompts([]);
                  setSearchQuery("");
                }}
                className={
                  isDarkMode
                    ? "border-[#27272a] bg-transparent text-[#fafafa] hover:bg-[#18181b]"
                    : "border-[#d4d4d4] bg-transparent text-[#333333] hover:bg-[#f1f5f9]"
                }
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddPrompts}
                disabled={selectedPrompts.length === 0}
                className={
                  isDarkMode
                    ? "bg-[#8b5cf6] text-white hover:bg-[#7c3aed] disabled:opacity-50"
                    : "bg-[#111111] text-white hover:bg-zinc-800 disabled:opacity-50"
                }
              >
                Add {selectedPrompts.length > 0 && `(${selectedPrompts.length})`}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
