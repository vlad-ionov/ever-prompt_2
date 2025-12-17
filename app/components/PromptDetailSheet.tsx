import { useState } from "react";
import { Sheet, SheetContent } from "./ui/sheet";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Copy,
  Heart,
  Share2,
  Video,
  Music,
  Image as ImageIcon,
  FileText,
  MoreVertical,
  Check,
  Edit,
  Trash,
  Bookmark,
  Eye,
  EyeOff,
  Globe,
  Lock,
  FolderOpen,
  X,
  Type
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { toast } from "sonner";
import { ModelIcon } from "./ModelIcon";
import type { Prompt } from "@/lib/types";

const TYPE_ICONS = {
  video: Video,
  audio: Music,
  image: ImageIcon,
  text: FileText,
};

interface PromptDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prompt: Prompt | null;
  isDarkMode: boolean;
  onLike?: (id: string) => void;
  onSave?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onToggleVisibility?: (id: string) => void;
  onShare?: (id: string) => void;
  onAddToCollection?: (id: string) => void;
}

export function PromptDetailSheet({
  open,
  onOpenChange,
  prompt,
  isDarkMode,
  onLike,
  onSave,
  onEdit,
  onDelete,
  onToggleVisibility,
  onShare,
  onAddToCollection,
}: PromptDetailSheetProps) {
  const [copied, setCopied] = useState(false);
  const [isLiked, setIsLiked] = useState(prompt?.isLiked || false);
  const [isSaved, setIsSaved] = useState(prompt?.isSaved || false);
  const [likeCount, setLikeCount] = useState(prompt?.likes || 0);

  if (!prompt) return null;

  const TypeIcon = TYPE_ICONS[prompt.type] || Type;

  // --- Helpers ---
  const copyToClipboard = async (text: string) => {
    if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
    } else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
    }
  };

  const handleCopy = async () => {
    try {
      await copyToClipboard(prompt.content);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy");
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/prompts/${prompt.id}`;
    try {
      await copyToClipboard(shareUrl);
      toast.success("Link copied");
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  const handleLike = () => {
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikeCount(newLikedState ? likeCount + 1 : likeCount - 1);
    onLike?.(prompt.id);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    onSave?.(prompt.id);
  };

  const wordCount = prompt.content.trim().split(/\s+/).length;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className={`w-full sm:max-w-xl p-0 flex flex-col gap-0 border-l shadow-2xl transition-all duration-300 ${
          isDarkMode 
            ? "bg-[#09090b]/95 backdrop-blur-xl border-[#27272a] text-zinc-100" 
            : "bg-white/95 backdrop-blur-xl border-slate-200 text-slate-900"
        }`}
      >
        {/* Compact Header */}
        <div className={`flex items-center justify-between px-4 py-3 border-b shrink-0 ${isDarkMode ? "border-white/5 bg-[#09090b]/50" : "border-slate-100 bg-white/50"}`}>
            <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => onOpenChange(false)}
                className="rounded-full hover:bg-muted h-8 w-8"
            >
                <X className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center gap-1">
                 <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleLike}
                    className={`h-8 w-8 rounded-full transition-colors ${isLiked ? "text-red-500 bg-red-500/10 hover:bg-red-500/20" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
                  >
                    <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleSave}
                    className={`h-8 w-8 rounded-full transition-colors ${isSaved ? (isDarkMode ? "text-violet-400 bg-violet-400/10" : "text-rose-500 bg-rose-500/10") : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
                  >
                    <Bookmark className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
                  </Button>
                  
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className={isDarkMode ? "bg-[#18181b] border-[#27272a] text-zinc-300" : "bg-white border-slate-200"}>
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator className={isDarkMode ? "bg-[#27272a]" : "bg-slate-100"} />
                    {onEdit && (
                        <DropdownMenuItem onClick={() => onEdit(prompt.id)}>
                            <Edit className="h-4 w-4 mr-2" /> Edit Prompt
                        </DropdownMenuItem>
                    )}
                    {onToggleVisibility && (
                        <DropdownMenuItem onClick={() => onToggleVisibility(prompt.id)}>
                            {prompt.isPublic ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                            {prompt.isPublic ? "Make Private" : "Make Public"}
                        </DropdownMenuItem>
                    )}
                    {onAddToCollection && !prompt.isPublic && (
                        <DropdownMenuItem onClick={() => onAddToCollection(prompt.id)}>
                            <FolderOpen className="h-4 w-4 mr-2" /> Add to Collection
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator className={isDarkMode ? "bg-[#27272a]" : "bg-slate-100"} />
                    {onDelete && (
                        <DropdownMenuItem onClick={() => onDelete(prompt.id)} className="text-red-500 focus:text-red-500">
                            <Trash className="h-4 w-4 mr-2" /> Delete
                        </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>

        <ScrollArea className="flex-1 w-full">
            <div className="pb-10">
                {/* Hero for Image */}
                {prompt.type === 'image' && (
                    <div className="w-full bg-black/5 dark:bg-black/40 border-b border-border/50">
                        <div className="w-full flex items-center justify-center p-0">
                            <img 
                                src={prompt.content} 
                                alt={prompt.title}
                                className="w-full h-auto object-cover max-h-[400px]"
                            />
                        </div>
                    </div>
                )}

                <div className="px-5 py-6 space-y-6">
                    {/* Header Info */}
                    <div className="space-y-3">
                         <div className="flex gap-3 items-start">
                             <div className={`p-2.5 rounded-xl shrink-0 ${
                                isDarkMode ? "bg-white/5 ring-1 ring-white/10" : "bg-slate-100 ring-1 ring-slate-200"
                             }`}>
                                <TypeIcon className={`h-5 w-5 ${isDarkMode ? "text-violet-400" : "text-rose-500"}`} />
                             </div>
                             <div>
                                <h2 className="text-xl font-bold leading-tight">{prompt.title}</h2>
                                {prompt.description && <p className={`mt-1 text-sm leading-relaxed ${isDarkMode ? "text-zinc-400" : "text-slate-500"}`}>
                                    {prompt.description}
                                </p>}
                             </div>
                        </div>

                        {/* Compact Metadata Strip */}
                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                             <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/50">
                                <ModelIcon model={prompt.model} size={12} />
                                <span className="font-medium">{prompt.model}</span>
                             </div>
                             <div className="w-px h-3 bg-border" />
                             <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/50">
                                {prompt.isPublic ? <Globe className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                                <span>{prompt.isPublic ? "Public" : "Private"}</span>
                             </div>
                             <div className="w-px h-3 bg-border" />
                             <span>{likeCount} likes</span>
                             <span>•</span>
                             <span>{wordCount} words</span>
                             <span>•</span>
                             <span>{prompt.createdAt}</span>
                        </div>
                         
                         <div className="flex flex-wrap gap-1.5">
                             {prompt.tags.map(tag => (
                                 <span key={tag} className="px-2 py-0.5 text-[10px] font-medium rounded-full border border-border text-muted-foreground">
                                    #{tag}
                                 </span>
                             ))}
                        </div>
                    </div>

                    {/* Prompt Content */}
                    <div className="space-y-2">
                         <div className="flex items-center justify-between">
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Prompt Content</h3>
                            <Button variant="ghost" size="sm" onClick={handleCopy} className="h-6 gap-1.5 text-xs hover:bg-muted">
                                {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                                {copied ? "Copied" : "Copy"}
                            </Button>
                         </div>
                         
                         {prompt.type !== 'image' && (
                             <div className={`relative rounded-xl border p-4 ${isDarkMode ? "bg-[#18181b]/50 border-white/10" : "bg-slate-50/80 border-slate-200"}`}>
                                <div className="font-mono text-sm leading-relaxed whitespace-pre-wrap break-words text-foreground/90">
                                    {prompt.content}
                                </div>
                             </div>
                         )}

                         {prompt.type === 'image' && (
                            <div className="p-3 rounded-lg border border-dashed text-xs text-muted-foreground text-center">
                                Image generated from parameters.
                            </div>
                         )}
                    </div>

                    {/* Compact Author */}
                    {prompt.author && (
                         <div className="flex items-center gap-3 pt-2 border-t border-dashed">
                            <Avatar className="h-8 w-8 border">
                                <AvatarImage src={prompt.author.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${prompt.author.email}`} />
                                <AvatarFallback>{prompt.author.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium leading-none">{prompt.author.name}</span>
                                <span className="text-[10px] text-muted-foreground">Creator</span>
                            </div>
                         </div>
                    )}
                </div>
            </div>
        </ScrollArea>
        
        {/* Footer Actions */}
        <div className={`p-4 border-t flex gap-3 ${isDarkMode ? "border-white/5 bg-[#09090b]/80" : "border-slate-100 bg-white/80"}`}>
             <Button className={`flex-1 h-10 font-semibold shadow-md ${isDarkMode ? "bg-violet-600 hover:bg-violet-700 text-white" : "bg-rose-600 hover:bg-rose-700 text-white"}`} onClick={handleCopy}>
                Copy Prompt
             </Button>
             <Button variant="outline" size="icon" className="h-10 w-10 shrink-0" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
             </Button>
        </div>

      </SheetContent>
    </Sheet>
  );
}
