import { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { FolderOpen } from "lucide-react";
import type { Collection } from "@/lib/types";

type CollectionInput = Pick<Collection, "name" | "description">;

interface AddCollectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (collection: CollectionInput) => void;
  isDarkMode?: boolean;
}

export function AddCollectionDialog({
  open,
  onOpenChange,
  onAdd,
  isDarkMode = false,
}: AddCollectionDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAdd({
      name: name.trim(),
      description: description.trim(),
    });

    // Reset form
    setName("");
    setDescription("");
    onOpenChange(false);
  };

  const handleCancel = () => {
    setName("");
    setDescription("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`sm:max-w-[500px] p-0 overflow-hidden flex flex-col gap-0 ${
          isDarkMode
            ? "bg-[#0f0f11] border-[#27272a]"
            : "bg-white border-[#d4d4d4]"
        }`}
      >
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
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
                Create New Collection
              </DialogTitle>
            </div>
            <DialogDescription
              className={isDarkMode ? "text-[#a1a1aa]" : "text-[#868686]"}
            >
              Bundle your private prompts into organized collections for easy access and management.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 px-6 py-6">
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className={isDarkMode ? "text-[#fafafa]" : "text-[#333333]"}
              >
                Collection Name *
              </Label>
              <Input
                id="name"
                placeholder="e.g., Marketing Prompts, Development Tools"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={
                  isDarkMode
                    ? "bg-[#18181b] border-[#27272a] text-[#fafafa] placeholder:text-[#52525b] focus-visible:ring-[#8b5cf6]"
                    : "bg-[#fafafa] border-[#d4d4d4] text-[#333333] placeholder:text-[#868686] focus-visible:ring-[#111111]"
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="description"
                className={isDarkMode ? "text-[#fafafa]" : "text-[#333333]"}
              >
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Describe what this collection is for..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={
                  isDarkMode
                    ? "bg-[#18181b] border-[#27272a] text-[#fafafa] placeholder:text-[#52525b] min-h-[100px] focus-visible:ring-[#8b5cf6]"
                    : "bg-[#fafafa] border-[#d4d4d4] text-[#333333] placeholder:text-[#868686] min-h-[100px] focus-visible:ring-[#111111]"
                }
              />
            </div>
          </div>

          <DialogFooter className={`px-6 py-4 border-t ${isDarkMode ? 'border-[#27272a] bg-[#0f0f11]' : 'border-[#f1f5f9] bg-white'}`}>
            <Button
              type="button"
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
              type="submit"
              className={
                isDarkMode
                  ? "bg-[#8b5cf6] text-white hover:bg-[#7c3aed]"
                  : "bg-[#111111] text-white hover:bg-[#222222]"
              }
            >
              Create Collection
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
