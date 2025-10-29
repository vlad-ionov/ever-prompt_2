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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Video, Music, Image as ImageIcon, FileText } from "lucide-react";
import { ModelIcon } from "./ModelIcon";
import type { Prompt, PromptType } from "@/lib/types";

export type PromptDraft = Pick<Prompt, "title" | "description" | "model" | "type" | "tags" | "content">;

interface AddPromptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isDarkMode?: boolean;
  onSave: (prompt: PromptDraft) => void;
}

export function AddPromptDialog({ open, onOpenChange, isDarkMode = false, onSave }: AddPromptDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [model, setModel] = useState("");
  const [type, setType] = useState<PromptType>("text");
  const [tags, setTags] = useState("");
  const [content, setContent] = useState("");

  const handleSave = () => {
    onSave({
      title,
      description,
      model,
      type,
      tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      content,
    });
    
    // Reset form
    setTitle("");
    setDescription("");
    setModel("");
    setType("text");
    setTags("");
    setContent("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`sm:max-w-[600px] max-h-[90svh] flex flex-col ${isDarkMode ? 'bg-[#141414] border-[#262626]' : 'bg-white border-[#d4d4d4]'}`}>
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className={isDarkMode ? 'text-[#f5f5f5]' : 'text-[#333333]'}>Add New Prompt</DialogTitle>
          <DialogDescription className={isDarkMode ? 'text-[#b0b0b0]' : 'text-[#868686]'}>
            Create a new prompt to save to your library
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 overflow-y-auto flex-1">
          <div className="grid gap-2">
            <Label htmlFor="title" className={isDarkMode ? 'text-[#f5f5f5]' : 'text-[#333333]'}>
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter prompt title"
              className={`${isDarkMode ? 'border-[#262626] bg-[#0f0f0f] text-[#f5f5f5] placeholder:text-[#606060] focus-visible:ring-[#60a5fa]' : 'border-[#d4d4d4] bg-white focus-visible:ring-[#E11D48]'}`}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description" className={isDarkMode ? 'text-[#f5f5f5]' : 'text-[#333333]'}>
              Description
            </Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the prompt"
              className={`${isDarkMode ? 'border-[#262626] bg-[#0f0f0f] text-[#f5f5f5] placeholder:text-[#606060] focus-visible:ring-[#60a5fa]' : 'border-[#d4d4d4] bg-white focus-visible:ring-[#E11D48]'}`}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="type" className={isDarkMode ? 'text-[#f5f5f5]' : 'text-[#333333]'}>
              Type
            </Label>
            <Select value={type} onValueChange={(value: PromptType) => setType(value)}>
              <SelectTrigger className={`${isDarkMode ? 'border-[#262626] bg-[#0f0f0f] text-[#f5f5f5] focus:ring-[#60a5fa]' : 'border-[#d4d4d4] bg-white focus:ring-[#E11D48]'}`}>
                <SelectValue placeholder="Select a type" />
              </SelectTrigger>
              <SelectContent className={`${isDarkMode ? 'bg-[#141414] border-[#262626]' : 'bg-white border-[#d4d4d4]'}`}>
                <SelectItem value="text">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Text
                  </div>
                </SelectItem>
                <SelectItem value="video">
                  <div className="flex items-center gap-2">
                    <Video className="h-4 w-4" />
                    Video
                  </div>
                </SelectItem>
                <SelectItem value="audio">
                  <div className="flex items-center gap-2">
                    <Music className="h-4 w-4" />
                    Audio
                  </div>
                </SelectItem>
                <SelectItem value="image">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    Image
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="model" className={isDarkMode ? 'text-[#f5f5f5]' : 'text-[#333333]'}>
              Model
            </Label>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger className={`${isDarkMode ? 'border-[#262626] bg-[#0f0f0f] text-[#f5f5f5] focus:ring-[#60a5fa]' : 'border-[#d4d4d4] bg-white focus:ring-[#E11D48]'}`}>
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent className={`${isDarkMode ? 'bg-[#141414] border-[#262626]' : 'bg-white border-[#d4d4d4]'}`}>
                <SelectItem value="GPT-4">
                  <div className="flex items-center gap-2">
                    <ModelIcon model="GPT-4" size={14} />
                    <span>GPT-4</span>
                  </div>
                </SelectItem>
                <SelectItem value="GPT-3.5">
                  <div className="flex items-center gap-2">
                    <ModelIcon model="GPT-3.5" size={14} />
                    <span>GPT-3.5</span>
                  </div>
                </SelectItem>
                <SelectItem value="Claude 3">
                  <div className="flex items-center gap-2">
                    <ModelIcon model="Claude 3" size={14} />
                    <span>Claude 3</span>
                  </div>
                </SelectItem>
                <SelectItem value="Claude 2">
                  <div className="flex items-center gap-2">
                    <ModelIcon model="Claude 2" size={14} />
                    <span>Claude 2</span>
                  </div>
                </SelectItem>
                <SelectItem value="Gemini Pro">
                  <div className="flex items-center gap-2">
                    <ModelIcon model="Gemini Pro" size={14} />
                    <span>Gemini Pro</span>
                  </div>
                </SelectItem>
                <SelectItem value="Llama 2">
                  <div className="flex items-center gap-2">
                    <ModelIcon model="Llama 2" size={14} />
                    <span>Llama 2</span>
                  </div>
                </SelectItem>
                <SelectItem value="Mistral">
                  <div className="flex items-center gap-2">
                    <ModelIcon model="Mistral" size={14} />
                    <span>Mistral</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="tags" className={isDarkMode ? 'text-[#f5f5f5]' : 'text-[#333333]'}>
              Tags
            </Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Enter tags separated by commas"
              className={`${isDarkMode ? 'border-[#262626] bg-[#0f0f0f] text-[#f5f5f5] placeholder:text-[#606060] focus-visible:ring-[#60a5fa]' : 'border-[#d4d4d4] bg-white focus-visible:ring-[#E11D48]'}`}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="content" className={isDarkMode ? 'text-[#f5f5f5]' : 'text-[#333333]'}>
              Prompt Content
            </Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter your prompt here..."
              className={`min-h-[150px] max-h-[30svh] overflow-y-auto ${isDarkMode ? 'border-[#262626] bg-[#0f0f0f] text-[#f5f5f5] placeholder:text-[#606060] focus-visible:ring-[#60a5fa]' : 'border-[#d4d4d4] bg-white focus-visible:ring-[#E11D48]'} resize-none`}
            />
          </div>
        </div>
        <DialogFooter className="flex-shrink-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className={`${isDarkMode ? 'border-[#262626] text-[#b0b0b0] hover:bg-[#1a1a1a] hover:text-[#f5f5f5]' : 'border-[#d4d4d4] text-[#333333] hover:bg-[#f5f5f5]'}`}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!title || !model || !content}
            className={`${
              isDarkMode
                ? 'bg-[#60a5fa] text-white hover:bg-[#8b5cf6]'
                : 'bg-[#E11D48] text-white hover:bg-[#BE123C]'
            } transition-all duration-200 hover:shadow-lg`}
          >
            Save Prompt
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
