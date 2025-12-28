import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { PromptCard } from "./PromptCard";
import { Input } from "./ui/input";
import { FolderOpen, X, Plus, Search, Grid3x3, List, Lock } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";

import type { Collection, Prompt } from "@/lib/types";

interface CollectionDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  collection: Collection | null;
  prompts: Prompt[];
  allPrompts: Prompt[];
  isDarkMode?: boolean;
  viewMode?: "grid" | "list";
  onViewModeChange?: (mode: "grid" | "list") => void;
  onRemovePrompt?: (promptId: string) => void;
  onAddPrompts?: (promptIds: string[]) => void;
  onPromptClick?: (id: string) => void;
  onPromptEdit?: (id: string) => void;
  onPromptDelete?: (id: string) => void;
  onPromptShare?: (id: string) => void;
  onPromptCopy?: (id: string) => void;
  onPromptLike?: (id: string) => void;
  onPromptSave?: (id: string) => void;
}

export function CollectionDetailSheet({
  open,
  onOpenChange,
  collection,
  prompts,
  allPrompts,
  isDarkMode = false,
  viewMode = "grid",
  onViewModeChange,
  onRemovePrompt,
  onAddPrompts,
  onPromptClick,
  onPromptEdit,
  onPromptDelete,
  onPromptShare,
  onPromptCopy,
  onPromptLike,
  onPromptSave,
}: CollectionDetailSheetProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedPrompts, setSelectedPrompts] = useState<string[]>([]);

  if (!collection) return null;

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
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="right"
          className={`w-full sm:max-w-4xl p-0 ${
            isDarkMode
              ? "bg-[#0f0f11] border-[#27272a]"
              : "bg-white border-[#d4d4d4]"
          }`}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <SheetHeader
              className={`p-6 border-b ${
                isDarkMode ? "border-[#27272a]" : "border-[#e5e5e5]"
              }`}
            >
              <div className="flex items-start gap-4">
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
                    <SheetTitle
                      className={
                        isDarkMode ? "text-[#fafafa]" : "text-[#333333]"
                      }
                    >
                      {collection.name}
                    </SheetTitle>
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
                  </div>
                  <SheetDescription
                    className={
                      isDarkMode ? "text-[#a1a1aa]" : "text-[#868686]"
                    }
                  >
                    {collection.description || "No description provided"}
                  </SheetDescription>
                  <div
                    className={`text-sm mt-2 ${
                      isDarkMode ? "text-[#71717a]" : "text-[#868686]"
                    }`}
                  >
                    {prompts.length} {prompts.length === 1 ? "prompt" : "prompts"}
                  </div>
                </div>
              </div>
            </SheetHeader>

            {/* Toolbar */}
            <div
              className={`p-4 border-b ${
                isDarkMode ? "border-[#27272a]" : "border-[#e5e5e5]"
              }`}
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
            <ScrollArea className="flex-1 p-6">
              {prompts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
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
                      ? "grid grid-cols-1 md:grid-cols-2 gap-4"
                      : "space-y-3"
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
                    />
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </SheetContent>
      </Sheet>

      {/* Add Prompts Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent
          className={`sm:max-w-3xl ${
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
                            <X className="h-3 w-3 text-white" strokeWidth={3} />
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
    </>
  );
}
