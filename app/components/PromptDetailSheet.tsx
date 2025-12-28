import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Copy,
  Heart,
  ShareNetwork,
  VideoCamera,
  MusicNotes,
  Image as ImageIcon,
  TextT,
  DotsThreeVertical,
  Check,
  PencilSimple,
  Trash,
  BookmarkSimple,
  Eye,
  EyeSlash,
  Globe,
  Lock,
  FolderSimplePlus,
  X,
  Shapes,
  Clock,
  TextAa,
  ArrowSquareOut
} from "@phosphor-icons/react";
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
import { motion, AnimatePresence } from "motion/react";

const TYPE_ICONS = {
  video: VideoCamera,
  audio: MusicNotes,
  image: ImageIcon,
  text: TextT,
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

  const TypeIcon = TYPE_ICONS[prompt.type] || Shapes;

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
      const textToCopy = prompt.type === 'image' && prompt.initialPrompt 
        ? prompt.initialPrompt 
        : prompt.content;
      await copyToClipboard(textToCopy);
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

  const contentForStats = prompt.type === 'image' && prompt.initialPrompt ? prompt.initialPrompt : prompt.content;
  const wordCount = contentForStats.trim().split(/\s+/).length;

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className={`w-full sm:max-w-xl p-0 flex flex-col gap-0 border-l shadow-2xl transition-all duration-300 ${
          isDarkMode 
            ? "bg-[#09090b]/95 border-[#27272a] text-zinc-100" 
            : "bg-white/95 border-slate-200 text-slate-900"
        } backdrop-blur-2xl`}
      >
        {/* Decorative Background Glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className={`absolute top-0 right-0 w-64 h-64 blur-[100px] opacity-20 rounded-full ${isDarkMode ? "bg-violet-500" : "bg-rose-500"}`} />
          <div className={`absolute bottom-0 left-0 w-64 h-64 blur-[100px] opacity-10 rounded-full ${isDarkMode ? "bg-blue-500" : "bg-blue-400"}`} />
        </div>

        {/* Custom Header with Integrated Navigation/Shortcuts */}
        <div className={`relative flex flex-col px-6 pt-6 pb-4 border-b shrink-0 z-10 ${
          isDarkMode ? "border-white/5 bg-[#09090b]/40" : "border-slate-100 bg-white/40"
        }`}>
            {/* Top row: Badges and More actions */}
            <div className="flex items-center justify-between mb-4 pr-20">
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${
                        isDarkMode ? "bg-violet-500/10 text-violet-400 border-violet-500/20" : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                    }`}>
                        {prompt.type}
                    </Badge>
                    <Badge variant="outline" className={`px-2 py-0.5 text-[10px] font-medium flex items-center gap-1.5 ${
                        isDarkMode ? "bg-white/5 border-white/10 text-zinc-400" : "bg-slate-100 border-slate-200 text-slate-500"
                    }`}>
                        <ModelIcon model={prompt.model} size={10} isDarkMode={isDarkMode} />
                        {prompt.model}
                    </Badge>
                </div>

                <div className="flex items-center gap-1">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all">
                          <DotsThreeVertical weight="bold" className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className={isDarkMode ? "bg-[#18181b] border-[#27272a] text-zinc-300" : "bg-white border-slate-200"}>
                        <DropdownMenuLabel>Prompt Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator className={isDarkMode ? "bg-[#27272a]" : "bg-slate-100"} />
                        {onEdit && (
                            <DropdownMenuItem onClick={() => onEdit(prompt.id)} className="gap-2">
                                <PencilSimple weight="bold" className="h-4 w-4" /> Edit Details
                            </DropdownMenuItem>
                        )}
                        {onToggleVisibility && (
                            <DropdownMenuItem onClick={() => onToggleVisibility(prompt.id)} className="gap-2">
                                {prompt.isPublic ? <EyeSlash weight="bold" className="h-4 w-4 text-amber-500" /> : <Eye weight="bold" className="h-4 w-4 text-blue-500" />}
                                {prompt.isPublic ? "Set to Private" : "Make Public"}
                            </DropdownMenuItem>
                        )}
                        {onAddToCollection && !prompt.isPublic && (
                            <DropdownMenuItem onClick={() => onAddToCollection(prompt.id)} className="gap-2">
                                <FolderSimplePlus weight="bold" className="h-4 w-4" /> Add to Collection
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator className={isDarkMode ? "bg-[#27272a]" : "bg-slate-100"} />
                        <DropdownMenuItem onClick={handleShare} className="gap-2">
                            <ShareNetwork weight="bold" className="h-4 w-4" /> Share Link
                        </DropdownMenuItem>
                        {onDelete && (
                            <>
                                <DropdownMenuSeparator className={isDarkMode ? "bg-[#27272a]" : "bg-slate-100"} />
                                <DropdownMenuItem onClick={() => onDelete(prompt.id)} className="text-rose-500 focus:text-rose-500 gap-2">
                                    <Trash weight="bold" className="h-4 w-4" /> Delete Prompt
                                </DropdownMenuItem>
                            </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Middle row: Title */}
            <h2 className="text-2xl font-bold tracking-tight mb-4 pr-20">{prompt.title}</h2>

            {/* Bottom row: Quick Shortcut Icons (Navigation Improvement) */}
            <div className={`flex items-center gap-1.5 p-1 rounded-2xl w-fit ${
                isDarkMode ? "bg-white/5 border border-white/5" : "bg-slate-100/50 border border-slate-200/50"
            }`}>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLike}
                    className={`h-9 gap-2 px-3 rounded-xl transition-all ${
                        isLiked 
                          ? "text-rose-500 bg-rose-500/10 hover:bg-rose-500/20" 
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                >
                    <Heart weight={isLiked ? "fill" : "bold"} className="h-4 w-4" />
                    <span className="text-xs font-semibold">{likeCount}</span>
                </Button>

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSave}
                    className={`h-9 px-3 rounded-xl transition-all ${
                        isSaved 
                          ? (isDarkMode ? "text-violet-400 bg-violet-400/10 hover:bg-violet-400/20" : "text-rose-500 bg-rose-500/10 hover:bg-rose-500/20") 
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                >
                    <BookmarkSimple weight={isSaved ? "fill" : "bold"} className="h-4 w-4" />
                </Button>

                <div className={`w-px h-4 mx-1 ${isDarkMode ? "bg-white/10" : "bg-slate-200"}`} />

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopy}
                    className="h-9 gap-2 px-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                >
                    {copied ? <Check weight="bold" className="h-4 w-4 text-green-500" /> : <Copy weight="bold" className="h-4 w-4" />}
                    <span className="text-xs font-semibold">{copied ? "Copied" : "Copy"}</span>
                </Button>

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit?.(prompt.id)}
                    className="h-9 px-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                >
                    <PencilSimple weight="bold" className="h-4 w-4" />
                </Button>

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleShare}
                    className="h-9 px-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                >
                    <ShareNetwork weight="bold" className="h-4 w-4" />
                </Button>
            </div>
        </div>

        <ScrollArea className="flex-1 w-full bg-transparent min-h-0">
            <motion.div 
                className="pb-20"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Hero for Image (Vibrant Display) */}
                {prompt.type === 'image' && (
                    <motion.div 
                        variants={itemVariants}
                        className="w-full bg-black/5 dark:bg-black/40 border-b border-border/50 relative group"
                    >
                        <div className="w-full flex items-center justify-center p-0 overflow-hidden">
                            <img 
                                src={prompt.content} 
                                alt={prompt.title}
                                className="w-full h-auto object-cover max-h-[450px] transition-transform duration-700 group-hover:scale-105"
                            />
                        </div>
                        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                            <Button variant="secondary" size="sm" className="bg-white/20 backdrop-blur-md text-white border-white/20 hover:bg-white/30 gap-2" onClick={() => window.open(prompt.content, '_blank')}>
                                <ArrowSquareOut weight="bold" className="h-4 w-4" />
                                View Full Image
                            </Button>
                        </div>
                    </motion.div>
                )}

                <div className="px-6 py-8 space-y-10">
                    {/* Header Info / Description */}
                    <motion.div variants={itemVariants} className="space-y-4">
                        {prompt.description && (
                            <div className={`p-4 rounded-2xl border ${
                                isDarkMode ? "bg-white/[0.02] border-white/5 text-zinc-400" : "bg-slate-50 border-slate-200 text-slate-500"
                            }`}>
                                <p className="text-[13px] leading-relaxed italic">
                                    “{prompt.description}”
                                </p>
                            </div>
                        )}

                        {/* Metadata Strip */}
                        <div className="flex flex-wrap items-center gap-4 text-xs">
                             <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${isDarkMode ? "bg-white/5 border-white/10 text-zinc-300" : "bg-white border-slate-200 text-slate-600"}`}>
                                {prompt.isPublic ? <Globe weight="bold" className="h-3.5 w-3.5 text-blue-500" /> : <Lock weight="bold" className="h-3.5 w-3.5 text-amber-500" />}
                                <span className="font-medium">{prompt.isPublic ? "Public Access" : "Private Vault"}</span>
                             </div>
                             
                             <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${isDarkMode ? "bg-white/5 border-white/10 text-zinc-300" : "bg-white border-slate-200 text-slate-600"}`}>
                                <Clock weight="bold" className="h-3.5 w-3.5" />
                                <span>{prompt.createdAt}</span>
                             </div>

                             <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${isDarkMode ? "bg-white/5 border-white/10 text-zinc-300" : "bg-white border-slate-200 text-slate-600"}`}>
                                <TextAa weight="bold" className="h-3.5 w-3.5" />
                                <span>{wordCount} words</span>
                             </div>
                        </div>
                         
                        {prompt.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {prompt.tags.map(tag => (
                                    <span key={tag} className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg border transition-all ${
                                        isDarkMode 
                                            ? "bg-white/5 border-white/10 text-zinc-400 hover:text-violet-400 hover:border-violet-400/30" 
                                            : "bg-slate-50 border-slate-200 text-slate-500 hover:text-rose-500 hover:border-rose-500/30"
                                    }`}>
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* Prompt Content Section */}
                    <motion.div variants={itemVariants} className="space-y-4">
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className={`p-1.5 rounded-lg ${isDarkMode ? "bg-violet-500/10 text-violet-400" : "bg-rose-500/10 text-rose-500"}`}>
                                    <TypeIcon weight="bold" className="h-4 w-4" />
                                </div>
                                <h3 className="text-sm font-bold uppercase tracking-wider opacity-60">Prompt Content</h3>
                            </div>
                            <Button variant="ghost" size="sm" onClick={handleCopy} className={`h-8 gap-2 px-3 rounded-lg text-xs font-bold transition-all ${
                                isDarkMode ? "hover:bg-violet-500/10 hover:text-violet-400" : "hover:bg-rose-500/10 hover:text-rose-500"
                            }`}>
                                {copied ? <Check weight="bold" className="h-3.5 w-3.5 text-green-500" /> : <Copy weight="bold" className="h-3.5 w-3.5" />}
                                {copied ? "Copied" : "Copy to Clipboard"}
                            </Button>
                         </div>
                         
                         <div className={`relative rounded-3xl border p-6 overflow-hidden ${
                            isDarkMode 
                                ? "bg-[#111113] border-white/10 shadow-[inner_0_2px_4px_rgba(0,0,0,0.3)]" 
                                : "bg-slate-50/50 border-slate-200 shadow-sm"
                         }`}>
                            {/* Decorative accent for content box */}
                            <div className={`absolute top-0 left-0 w-1 h-full ${isDarkMode ? "bg-violet-500/50" : "bg-rose-500/50"}`} />
                            
                            <div className={`text-[15px] leading-relaxed whitespace-pre-wrap break-words text-foreground/90 ${
                                prompt.type !== 'image' ? "font-mono" : "italic font-serif"
                            }`}>
                                {prompt.type === 'image' ? (prompt.initialPrompt || prompt.content) : prompt.content}
                            </div>
                         </div>
                    </motion.div>

                    {/* Author Section */}
                    {prompt.author && (
                        <motion.div variants={itemVariants} className={`flex items-center gap-4 p-4 rounded-3xl border border-dashed ${
                            isDarkMode ? "border-white/10 bg-white/[0.01]" : "border-slate-200 bg-slate-50/30"
                        }`}>
                            <Avatar className="h-10 w-10 ring-2 ring-white/10 ring-offset-2 ring-offset-background">
                                <AvatarImage src={prompt.author.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${prompt.author.email}`} />
                                <AvatarFallback className="bg-gradient-to-br from-violet-500 to-blue-500 text-white">
                                    {prompt.author.name?.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <span className="text-sm font-bold tracking-tight">{prompt.author.name}</span>
                                <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-widest opacity-60">Creator of this Prompt</span>
                            </div>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </ScrollArea>
        
        {/* Fixed Footer Actions (Vibrant) */}
        <div className={`p-6 border-t flex gap-4 z-10 ${
            isDarkMode 
                ? "border-white/5 bg-[#09090b]/80 backdrop-blur-md" 
                : "border-slate-100 bg-white/80 backdrop-blur-md"
        }`}>
             <Button 
                className={`flex-1 h-12 text-sm font-bold shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] ${
                    isDarkMode 
                        ? "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-violet-500/20" 
                        : "bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white shadow-rose-500/20"
                }`} 
                onClick={handleCopy}
             >
                <div className="flex items-center gap-2">
                    <Copy weight="bold" className="h-5 w-5" />
                    Copy Original Prompt
                </div>
             </Button>
             
             <Button 
                variant="outline" 
                size="icon" 
                className={`h-12 w-12 shrink-0 rounded-xl transition-all hover:scale-105 active:scale-95 ${
                    isDarkMode ? "border-white/10 hover:bg-white/5" : "border-slate-200 hover:bg-slate-50"
                }`}
                onClick={handleShare}
             >
                <ShareNetwork weight="bold" className="h-5 w-5" />
             </Button>
        </div>

      </SheetContent>
    </Sheet>
  );
}
