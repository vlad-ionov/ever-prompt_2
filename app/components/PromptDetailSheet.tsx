import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
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
  isOwner?: boolean;
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
  isOwner = true,
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

        {/* Header Section */}
        <div className={`relative flex flex-col px-6 pt-12 pb-6 border-b shrink-0 z-10 ${
          isDarkMode ? "border-white/5 bg-[#09090b]/40" : "border-slate-100 bg-white/40"
        }`}>
            {/* Type & Model Badges */}
            <div className="flex items-center gap-2 mb-4">
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

            {/* Title & Description */}
            <div className="space-y-1">
                <h2 className="text-2xl font-bold tracking-tight leading-tight">{prompt.title}</h2>
                {prompt.description && (
                    <p className={`text-[15px] leading-relaxed ${isDarkMode ? "text-zinc-500" : "text-slate-500"}`}>
                        {prompt.description}
                    </p>
                )}
            </div>
        </div>

        <ScrollArea className="flex-1 w-full bg-transparent min-h-0">
            <motion.div 
                className="pb-10"
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

                             {prompt.isPublic && (
                                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${isDarkMode ? "bg-white/5 border-white/10 text-zinc-300" : "bg-white border-slate-200 text-slate-600"}`}>
                                    <Eye weight="bold" className="h-3.5 w-3.5" />
                                    <span>{prompt.views} views</span>
                                </div>
                             )}
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
                </div>
            </motion.div>
        </ScrollArea>
        
        {/* Fixed Footer Actions (Vibrant & Consolidated) */}
        <div className={`p-6 border-t space-y-4 z-10 ${
            isDarkMode 
                ? "border-white/5 bg-[#09090b]/80 backdrop-blur-md" 
                : "border-slate-100 bg-white/80 backdrop-blur-md"
        }`}>
             {/* Dynamic Row: Like, Save, and Owner Actions */}
             <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLike}
                    className={`h-11 flex-1 gap-2 rounded-xl border transition-all ${
                        isLiked 
                          ? "text-rose-500 bg-rose-500/10 border-rose-500/20 hover:bg-rose-500/20" 
                          : isDarkMode ? "bg-white/5 border-white/5 text-zinc-400 hover:text-white" : "bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-900"
                    }`}
                >
                    <Heart weight={isLiked ? "fill" : "bold"} className="h-4 w-4" />
                    <span className="text-xs font-bold tracking-tight">{likeCount}</span>
                </Button>

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSave}
                    className={`h-11 flex-1 gap-2 rounded-xl border transition-all ${
                        isSaved 
                          ? "text-blue-500 bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20" 
                          : isDarkMode ? "bg-white/5 border-white/5 text-zinc-400 hover:text-white" : "bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-900"
                    }`}
                >
                    <BookmarkSimple weight={isSaved ? "fill" : "bold"} className="h-4 w-4" />
                    <span className="text-xs font-bold tracking-tight">{isSaved ? "Saved" : "Save"}</span>
                </Button>

                {isOwner && (
                    <>
                        <div className={`w-px h-6 mx-1 ${isDarkMode ? "bg-white/10" : "bg-slate-200"}`} />
                        
                        <Button 
                            variant="outline" 
                            size="icon" 
                            className={`h-11 w-11 shrink-0 rounded-xl transition-all ${isDarkMode ? "border-white/10 hover:bg-white/5" : "border-slate-200 hover:bg-slate-50"}`}
                            onClick={() => onEdit?.(prompt.id)}
                            title="Edit Prompt"
                        >
                            <PencilSimple weight="bold" className="h-4 w-4" />
                        </Button>

                        <Button 
                            variant="outline" 
                            size="icon" 
                            className={`h-11 w-11 shrink-0 rounded-xl transition-all ${isDarkMode ? "border-white/10 hover:bg-white/5" : "border-slate-200 hover:bg-slate-50"}`}
                            onClick={() => onToggleVisibility?.(prompt.id)}
                            title={prompt.isPublic ? "Make Private" : "Make Public"}
                        >
                            {prompt.isPublic ? <EyeSlash weight="bold" className="h-4 w-4 text-amber-500" /> : <Eye weight="bold" className="h-4 w-4 text-blue-500" />}
                        </Button>

                        <Button 
                            variant="outline" 
                            size="icon" 
                            className={`h-11 w-11 shrink-0 rounded-xl transition-all border-rose-500/20 hover:bg-rose-500/10 text-rose-500`}
                            onClick={() => onDelete?.(prompt.id)}
                            title="Delete Prompt"
                        >
                            <Trash weight="bold" className="h-4 w-4" />
                        </Button>
                    </>
                )}
             </div>

             {/* Primary Action Row */}
             <div className="flex gap-4">
                <Button 
                    className={`flex-1 h-12 text-sm font-bold shadow-xl transition-all hover:scale-[1.01] active:scale-[0.98] ${
                        isDarkMode 
                            ? "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-violet-500/20" 
                            : "bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white shadow-rose-500/20"
                    }`} 
                    onClick={handleCopy}
                >
                    <div className="flex items-center gap-2">
                        {copied ? <Check weight="bold" className="h-5 w-5" /> : <Copy weight="bold" className="h-5 w-5" />}
                        {copied ? "Copied to Clipboard" : "Copy Original Prompt"}
                    </div>
                </Button>
                
                <Button 
                    variant="outline" 
                    size="icon" 
                    className={`h-12 w-12 shrink-0 rounded-xl transition-all hover:scale-105 active:scale-95 ${
                        isDarkMode ? "border-white/10 hover:bg-white/5" : "border-slate-200 hover:bg-slate-50"
                    }`}
                    onClick={handleShare}
                    title="Share Link"
                >
                    <ShareNetwork weight="bold" className="h-5 w-5" />
                </Button>
             </div>
        </div>

      </SheetContent>
    </Sheet>
  );
}
