import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { FolderOpen, Check } from "lucide-react";
import type { Collection } from "@/lib/types";

interface AddToCollectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  promptId: string;
  collections: Collection[];
  onAddToCollections: (collectionIds: string[]) => void;
  isDarkMode?: boolean;
}

export function AddToCollectionDialog({
  open,
  onOpenChange,
  promptId,
  collections,
  onAddToCollections,
  isDarkMode = false,
}: AddToCollectionDialogProps) {
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);

  const handleToggleCollection = (collectionId: string) => {
    setSelectedCollections((prev) =>
      prev.includes(collectionId)
        ? prev.filter((id) => id !== collectionId)
        : [...prev, collectionId]
    );
  };

  const handleAdd = () => {
    onAddToCollections(selectedCollections);
    setSelectedCollections([]);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setSelectedCollections([]);
    onOpenChange(false);
  };

  // Check which collections already contain this prompt
  const collectionsWithPrompt = collections.filter((c) =>
    c.promptIds.includes(promptId)
  );

  // Available collections (not already containing the prompt)
  const availableCollections = collections.filter(
    (c) => !c.promptIds.includes(promptId)
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`sm:max-w-[500px] p-0 overflow-hidden flex flex-col gap-0 ${
          isDarkMode
            ? "bg-[#0f0f11] border-[#27272a]"
            : "bg-white border-[#d4d4d4]"
        }`}
      >
        <DialogHeader className={`px-6 py-5 border-b ${isDarkMode ? 'border-[#27272a]' : 'border-[#f1f5f9]'}`}>
          <div className="flex items-center gap-3 mb-2">
            <div
              className={`p-2 rounded-lg ${
                isDarkMode
                  ? "bg-gradient-to-br from-[#8b5cf6]/10 to-[#a78bfa]/5 border-[#8b5cf6]/20"
                  : "bg-gradient-to-br from-[#8b5cf6]/10 to-[#8b5cf6]/5 border-[#8b5cf6]/20"
              } border`}
            >
              <FolderOpen
                className={`h-5 w-5 ${
                  isDarkMode ? "text-[#8b5cf6]" : "text-[#8b5cf6]"
                }`}
              />
            </div>
            <DialogTitle
              className={isDarkMode ? "text-[#fafafa]" : "text-[#333333]"}
            >
              Add to Collection
            </DialogTitle>
          </div>
          <DialogDescription
            className={isDarkMode ? "text-[#a1a1aa]" : "text-[#868686]"}
          >
            Select collections to add this prompt to
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 px-6 py-6 overflow-hidden flex flex-col">
          {/* Already in collections */}
          {collectionsWithPrompt.length > 0 && (
            <div className="mb-2">
              <p
                className={`text-sm mb-2 ${
                  isDarkMode ? "text-[#a1a1aa]" : "text-[#868686]"
                }`}
              >
                Already in {collectionsWithPrompt.length} collection
                {collectionsWithPrompt.length === 1 ? "" : "s"}:
              </p>
              <div className="flex flex-wrap gap-2">
                {collectionsWithPrompt.map((collection) => (
                  <Badge
                    key={collection.id}
                    variant="secondary"
                    className={
                      isDarkMode
                        ? "bg-[#8b5cf6]/10 text-[#8b5cf6] border-[#8b5cf6]/20"
                        : "bg-[#8b5cf6]/10 text-[#8b5cf6] border-[#8b5cf6]/20"
                    }
                  >
                    <Check className="h-3 w-3 mr-1" />
                    {collection.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Available collections */}
          {availableCollections.length === 0 ? (
            <div className="text-center py-8">
              <FolderOpen
                className={`h-12 w-12 mx-auto mb-3 ${
                  isDarkMode ? "text-[#27272a]" : "text-[#d4d4d4]"
                }`}
              />
              <p
                className={`text-sm ${
                  isDarkMode ? "text-[#a1a1aa]" : "text-[#868686]"
                }`}
              >
                {collections.length === 0
                  ? "No collections available. Create a collection first."
                  : "This prompt is already in all your collections."}
              </p>
            </div>
          ) : (
            <>
              <p
                className={`text-sm font-medium ${
                  isDarkMode ? "text-[#fafafa]" : "text-[#333333]"
                }`}
              >
                Select collections:
              </p>
              <ScrollArea className="max-h-[300px] flex-1">
                <div className="space-y-2 pr-4">
                  {availableCollections.map((collection) => (
                    <div
                      key={collection.id}
                      onClick={() => handleToggleCollection(collection.id)}
                      className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedCollections.includes(collection.id)
                          ? isDarkMode
                            ? "bg-[#8b5cf6]/10 border-[#8b5cf6] shadow-[0_0_15px_rgba(139,92,246,0.1)]"
                            : "bg-[#8b5cf6]/10 border-[#8b5cf6] shadow-[0_0_15px_rgba(139,92,246,0.1)]"
                          : isDarkMode
                          ? "bg-[#18181b]/50 border-[#27272a] hover:border-[#8b5cf6]/50"
                          : "bg-white border-[#d4d4d4] hover:border-[#8b5cf6]/50"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`mt-1 h-5 w-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                            selectedCollections.includes(collection.id)
                              ? isDarkMode
                                ? "bg-[#8b5cf6] border-[#8b5cf6]"
                                : "bg-[#8b5cf6] border-[#8b5cf6]"
                              : isDarkMode
                              ? "border-[#27272a]"
                              : "border-[#d4d4d4]"
                          }`}
                        >
                          {selectedCollections.includes(collection.id) && (
                            <Check className="h-3.5 w-3.5 text-white" strokeWidth={4} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4
                              className={`text-sm font-bold ${
                                isDarkMode ? "text-[#fafafa]" : "text-[#333333]"
                              }`}
                            >
                              {collection.name}
                            </h4>
                            <Badge
                              variant="outline"
                              className={`text-[10px] h-4 px-1.5 ${
                                isDarkMode
                                  ? "border-[#27272a] text-[#71717a]"
                                  : "border-[#d4d4d4] text-[#868686]"
                              }`}
                            >
                              {collection.promptIds.length}
                            </Badge>
                          </div>
                          {collection.description && (
                            <p
                              className={`text-xs line-clamp-1 ${
                                isDarkMode ? "text-[#a1a1aa]" : "text-[#868686]"
                              }`}
                            >
                              {collection.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </>
          )}
        </div>

        <DialogFooter className={`px-6 py-4 border-t flex items-center justify-between ${isDarkMode ? 'border-[#27272a] bg-[#0f0f11]' : 'border-[#f1f5f9] bg-white'}`}>
          <p
            className={`text-xs font-medium ${
              isDarkMode ? "text-[#71717a]" : "text-[#868686]"
            }`}
          >
            {selectedCollections.length > 0 &&
              `${selectedCollections.length} selected`}
          </p>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={handleCancel}
              className={
                isDarkMode
                  ? "text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#27272a]"
                  : "text-[#666666] hover:text-[#333333] hover:bg-[#f1f5f9]"
              }
            >
              Cancel
            </Button>
            <Button
              onClick={handleAdd}
              disabled={selectedCollections.length === 0}
              className={
                isDarkMode
                  ? "bg-[#8b5cf6] text-white hover:bg-[#7c3aed] disabled:opacity-50"
                  : "bg-[#111111] text-white hover:bg-[#222222] disabled:opacity-50"
              }
            >
              Add to{" "}
              {selectedCollections.length > 0 &&
                `(${selectedCollections.length})`}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
