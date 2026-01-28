import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
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
import { Video, Music, Image as ImageIcon, FileText, Upload } from "lucide-react";
import { ModelIcon } from "./ui/model-icon";
import { createClient } from "@/utils/supabase/client";
import type { Prompt, PromptType } from "@/lib/types";

interface EditPromptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isDarkMode?: boolean;
  prompt: Prompt | null;
  onSave: (
    id: string,
    updatedPrompt: {
      title: string;
      description: string;
      model: string;
      type: PromptType;
      tags: string[];
      content: string;
      initialPrompt?: string;
      useCases?: string[];
      file?: File;
    },
  ) => void;
}

const MODELS = ["Gemini", "Grok", "GPT", "Midjourney", "Claude"];

export function EditPromptDialog({ open, onOpenChange, isDarkMode = false, prompt, onSave }: EditPromptDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [model, setModel] = useState("");
  const [type, setType] = useState<PromptType>("text");
  const [tags, setTags] = useState("");
  const [content, setContent] = useState("");
  const [initialPrompt, setInitialPrompt] = useState("");
  const [useCases, setUseCases] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Update form when prompt changes
  useEffect(() => {
    if (prompt && open) {
      setTitle(prompt.title);
      setDescription(prompt.description);
      
      // Map old specific models to new generic categories if needed, or just set it
      // Simple heuristic: if the current model is not in the new list, try to find a match
      const existingModel = MODELS.find(m => prompt.model.includes(m)) || prompt.model;
      setModel(existingModel);
      
      setType(prompt.type);
      setTags(prompt.tags.join(", "));
      setContent(prompt.content);
      setInitialPrompt(prompt.initialPrompt || "");
      setUseCases(prompt.useCases?.join("\n") || "");
      setFile(null);
    }
  }, [prompt, open]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const objectUrl = URL.createObjectURL(selectedFile);
      setContent(objectUrl);
    }
  };

  const handleSave = async () => {
    if (!prompt) return;

    try {
      onSave(prompt.id, {
        title,
        description,
        model,
        type,
        tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean),
        content: content,
        initialPrompt: initialPrompt || undefined,
        useCases: useCases.split("\n").map((line) => line.trim()).filter(Boolean),
        file: file || undefined,
      });
      
      onOpenChange(false);
      toast.success("Prompt successfully updated");
    } catch (error) {
      console.error("Error saving prompt:", error);
      toast.error("Error updating prompt");
    }
  };

  if (!prompt) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`sm:max-w-[600px] max-h-[90svh] flex flex-col gap-0 p-0 overflow-hidden ${isDarkMode ? 'bg-[#0f0f11] border-[#27272a]' : 'bg-white border-[#d4d4d4]'}`}>
        <DialogHeader className={`px-6 py-5 border-b ${isDarkMode ? 'border-[#27272a]' : 'border-[#f1f5f9]'}`}>
          <DialogTitle className={isDarkMode ? 'text-[#fafafa]' : 'text-[#333333]'}>Edit Prompt</DialogTitle>
          <DialogDescription className={isDarkMode ? 'text-[#a1a1aa]' : 'text-[#868686]'}>
            Update your prompt details
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
          <div className="grid gap-2">
            <Label htmlFor="edit-title" className={`text-sm font-medium ${isDarkMode ? 'text-[#e4e4e7]' : 'text-[#333333]'}`}>
              Title
            </Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter prompt title"
              className={`h-10 ${isDarkMode ? 'border-[#27272a] bg-[#18181b] text-[#fafafa] placeholder:text-[#52525b] focus-visible:ring-[#8b5cf6]' : 'border-[#d4d4d4] bg-[#fafafa] focus-visible:ring-[#111111]'}`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="grid gap-2">
                <Label className={`text-sm font-medium ${isDarkMode ? 'text-[#e4e4e7]' : 'text-[#333333]'}`}>
                   Type
                </Label>
                <Select value={type} onValueChange={(value: PromptType) => setType(value)}>
                   <SelectTrigger className={`h-10 ${isDarkMode ? 'border-[#27272a] bg-[#18181b] text-[#fafafa] focus:ring-[#8b5cf6]' : 'border-[#d4d4d4] bg-[#fafafa] focus:ring-[#111111]'}`}>
                      <SelectValue placeholder="Select type" />
                   </SelectTrigger>
                   <SelectContent className={isDarkMode ? 'bg-[#18181b] border-[#27272a] text-[#fafafa]' : 'bg-white border-[#d4d4d4]'}>
                      <SelectItem value="text"><div className="flex items-center gap-2"><FileText className="h-4 w-4" /> Text</div></SelectItem>
                      <SelectItem value="image"><div className="flex items-center gap-2"><ImageIcon className="h-4 w-4" /> Image</div></SelectItem>
                      <SelectItem value="video"><div className="flex items-center gap-2"><Video className="h-4 w-4" /> Video</div></SelectItem>
                      <SelectItem value="audio"><div className="flex items-center gap-2"><Music className="h-4 w-4" /> Audio</div></SelectItem>
                   </SelectContent>
                </Select>
             </div>
             <div className="grid gap-2">
                <Label className={`text-sm font-medium ${isDarkMode ? 'text-[#e4e4e7]' : 'text-[#333333]'}`}>
                   Model
                </Label>
                <Select value={model} onValueChange={setModel}>
                   <SelectTrigger className={`h-10 ${isDarkMode ? 'border-[#27272a] bg-[#18181b] text-[#fafafa] focus:ring-[#8b5cf6]' : 'border-[#d4d4d4] bg-[#fafafa] focus:ring-[#111111]'}`}>
                      <SelectValue placeholder="Select model" />
                   </SelectTrigger>
                   <SelectContent className={isDarkMode ? 'bg-[#18181b] border-[#27272a] text-[#fafafa]' : 'bg-white border-[#d4d4d4]'}>
                      {MODELS.map((m) => (
                         <SelectItem key={m} value={m}>
                            <div className="flex items-center gap-2">
                               <ModelIcon model={m} size={14} isDarkMode={isDarkMode} />
                               <span>{m}</span>
                            </div>
                         </SelectItem>
                      ))}
                   </SelectContent>
                </Select>
             </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="edit-description" className={`text-sm font-medium ${isDarkMode ? 'text-[#e4e4e7]' : 'text-[#333333]'}`}>
              Description <span className={`text-xs font-normal ${isDarkMode ? 'text-[#71717a]' : 'text-[#a1a1aa]'}`}>(Optional)</span>
            </Label>
            <Input
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the prompt"
              className={`h-10 ${isDarkMode ? 'border-[#27272a] bg-[#18181b] text-[#fafafa] placeholder:text-[#52525b] focus-visible:ring-[#8b5cf6]' : 'border-[#d4d4d4] bg-[#fafafa] focus-visible:ring-[#111111]'}`}
            />
          </div>

          <div className="grid gap-2">
             <Label htmlFor="edit-content" className={`text-sm font-medium ${isDarkMode ? 'text-[#e4e4e7]' : 'text-[#333333]'}`}>
                {type === "image" ? "Image Source" : "Prompt Content"}
             </Label>
             
             {type === "image" ? (
               <div className={`border-2 border-dashed rounded-xl p-6 transition-colors ${isDarkMode ? 'border-[#27272a] hover:border-[#8b5cf6]/50 bg-[#18181b]/50' : 'border-[#d4d4d4] hover:border-[#111111]/30 bg-[#fafafa]'}`}>
                  {!content && !file ? (
                     <div className="flex flex-col items-center justify-center text-center">
                        <div className={`p-3 rounded-full mb-3 ${isDarkMode ? 'bg-[#27272a]' : 'bg-[#e5e5e5]'}`}>
                           <Upload className={`h-5 w-5 ${isDarkMode ? 'text-[#a1a1aa]' : 'text-[#666666]'}`} />
                        </div>
                        <p className={`text-sm mb-1 ${isDarkMode ? 'text-[#fafafa]' : 'text-[#333333]'}`}>
                           <label htmlFor="edit-file-upload" className="cursor-pointer hover:underline font-medium">Click to upload</label> or drag and drop
                        </p>
                        <p className={`text-xs ${isDarkMode ? 'text-[#71717a]' : 'text-[#a1a1aa]'}`}>SVG, PNG, JPG or GIF</p>
                        <input id="edit-file-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                     </div>
                  ) : (
                     <div className="relative group">
                        <img src={content} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                        <button 
                           onClick={() => { setFile(null); setContent(""); }}
                           className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                        >
                           <span className="sr-only">Remove</span>
                           ×
                        </button>
                     </div>
                  )}
               </div>
             ) : (
                <Textarea
                   id="edit-content"
                   value={content}
                   onChange={(e) => setContent(e.target.value)}
                   placeholder="Enter your prompt content here..."
                   className={`min-h-[120px] resize-none ${isDarkMode ? 'border-[#27272a] bg-[#18181b] text-[#fafafa] placeholder:text-[#52525b] focus-visible:ring-[#8b5cf6]' : 'border-[#d4d4d4] bg-[#fafafa] focus-visible:ring-[#111111]'}`}
                />
             )}
          </div>

          {type === "image" && (
            <div className="grid gap-2">
              <Label htmlFor="edit-initial-prompt" className={`text-sm font-medium ${isDarkMode ? 'text-[#e4e4e7]' : 'text-[#333333]'}`}>
                Initial Prompt <span className={`text-xs font-normal ${isDarkMode ? 'text-[#71717a]' : 'text-[#a1a1aa]'}`}>(Prompt used to generate this image)</span>
              </Label>
              <Textarea
                id="edit-initial-prompt"
                value={initialPrompt}
                onChange={(e) => setInitialPrompt(e.target.value)}
                placeholder="Paste the prompt you used to generate this image..."
                className={`min-h-[80px] resize-none ${isDarkMode ? 'border-[#27272a] bg-[#18181b] text-[#fafafa] placeholder:text-[#52525b] focus-visible:ring-[#8b5cf6]' : 'border-[#d4d4d4] bg-[#fafafa] focus-visible:ring-[#111111]'}`}
              />
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="edit-use-cases" className={`text-sm font-medium ${isDarkMode ? 'text-[#e4e4e7]' : 'text-[#333333]'}`}>
              Use Cases <span className={`text-xs font-normal ${isDarkMode ? 'text-[#71717a]' : 'text-[#a1a1aa]'}`}>(Optional, one per line)</span>
            </Label>
            <Textarea
              id="edit-use-cases"
              value={useCases}
              onChange={(e) => setUseCases(e.target.value)}
              placeholder="e.g. Generating creative story ideas&#10;Drafting professional emails&#10;Summarizing long articles"
              className={`min-h-[100px] resize-none ${isDarkMode ? 'border-[#27272a] bg-[#18181b] text-[#fafafa] placeholder:text-[#52525b] focus-visible:ring-[#8b5cf6]' : 'border-[#d4d4d4] bg-[#fafafa] focus-visible:ring-[#111111]'}`}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="edit-tags" className={`text-sm font-medium ${isDarkMode ? 'text-[#e4e4e7]' : 'text-[#333333]'}`}>
              Tags
            </Label>
            <Input
              id="edit-tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="coding, text-generation, creative..."
              className={`h-10 ${isDarkMode ? 'border-[#27272a] bg-[#18181b] text-[#fafafa] placeholder:text-[#52525b] focus-visible:ring-[#8b5cf6]' : 'border-[#d4d4d4] bg-[#fafafa] focus-visible:ring-[#111111]'}`}
            />
          </div>
        </div>

        <DialogFooter className={`px-6 py-4 border-t ${isDarkMode ? 'border-[#27272a] bg-[#0f0f11]' : 'border-[#f1f5f9] bg-white'}`}>
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className={`${isDarkMode ? 'text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#27272a]' : 'text-[#666666] hover:text-[#333333] hover:bg-[#f1f5f9]'}`}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!title || !model || !content || uploading}
            className={`${
              isDarkMode
                ? 'bg-[#8b5cf6] text-white hover:bg-[#7c3aed]'
                : 'bg-[#111111] text-white hover:bg-[#222222]'
            } min-w-[100px]`}
          >
            {uploading ? "Uploading..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
