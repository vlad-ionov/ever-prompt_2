import { motion } from "motion/react";
import { Copy, Flame, Bookmark, Share2, Heart, Eye } from "lucide-react";
import { Button } from "./ui/button";
import { ModelIcon } from "./ui/model-icon";
import { toast } from "sonner";
import type { Prompt } from "@/lib/types";

interface PublicPromptCardProps {
  prompt: Prompt;
  isDarkMode: boolean;
  onLike?: (id: string) => void;
  onSave?: (id: string) => void;
  onCopy?: (id: string) => void;
  onShare?: (id: string) => void;
  onClick?: (id: string) => void;
}

export function PublicPromptCard({
  prompt,
  isDarkMode,
  onLike,
  onSave,
  onCopy,
  onShare,
  onClick
}: PublicPromptCardProps) {

  return (
    <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        whileHover={{ y: -4 }}
        className="break-inside-avoid w-full"
    >
      <div
        onClick={() => onClick?.(prompt.id)}
        className={`group relative flex flex-col gap-4 p-5 rounded-3xl border transition-all duration-500 cursor-pointer overflow-hidden ${
          isDarkMode 
            ? "bg-white/[0.03] backdrop-blur-md border-white/5 hover:border-violet-500/30 hover:shadow-[0_0_30px_rgba(139,92,246,0.1)]" 
            : "bg-white/70 backdrop-blur-md border-black/5 hover:border-violet-500/20 hover:shadow-[0_0_20px_rgba(139,92,246,0.05)]"
        }`}
      >
        {/* Model Icon Badge (Floating Top Right) */}
        <div className="absolute top-4 right-4 z-20">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-xl border transition-transform duration-500 group-hover:scale-110 ${
                isDarkMode ? "bg-black/40 border-white/10" : "bg-white/80 border-black/5 shadow-sm"
            }`}>
                <ModelIcon model={prompt.model} size={18} isDarkMode={isDarkMode} />
            </div>
        </div>

        {/* Header: Title */}
        <div className="pr-10">
          <h3 className={`text-lg font-semibold tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
            {prompt.title}
          </h3>
        </div>

        {/* Optional Image Thumbnail */}
        {prompt.type === "image" && prompt.content?.startsWith("http") && (
          <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/5 bg-black/20">
            <img 
              src={prompt.content} 
              alt={prompt.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        )}

        {/* Body: Snippet */}
        <div className="relative">
            <p className={`text-sm leading-relaxed ${isDarkMode ? "text-zinc-400" : "text-slate-600"} line-clamp-6`}>
                {prompt.description}
            </p>
            {prompt.description.length > 200 && (
                <div className={`absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t pointer-events-none ${
                    isDarkMode ? "from-[#0f0f12]/10" : "from-white/10"
                } to-transparent`} />
            )}
        </div>

        {/* Footer: Author & Stats */}
        <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
            <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-[10px] text-white font-bold">
                    {prompt.author?.name?.charAt(0) || "U"}
                </div>
                <span className={`text-xs font-medium ${isDarkMode ? "text-zinc-500" : "text-slate-500"}`}>
                    {prompt.author?.name || "Anonymous"}
                </span>
            </div>

            <div className="flex items-center gap-4">
                <button 
                    onClick={(e) => { e.stopPropagation(); onLike?.(prompt.id); }}
                    className={`flex items-center gap-1.5 transition-colors ${prompt.isLiked ? "text-orange-500" : "text-zinc-500 hover:text-orange-500/80"}`}
                >
                    <Flame size={14} className={prompt.isLiked ? "fill-current" : ""} />
                    <span className="text-[11px] font-bold">{prompt.likes}</span>
                </button>
                <button 
                    onClick={(e) => { e.stopPropagation(); onSave?.(prompt.id); }}
                    className={`flex items-center gap-1.5 transition-colors ${prompt.isSaved ? "text-violet-500" : "text-zinc-500 hover:text-violet-500/80"}`}
                >
                    <Bookmark size={14} className={prompt.isSaved ? "fill-current" : ""} />
                    <span className="text-[11px] font-bold">24</span>
                </button>
            </div>
        </div>
      </div>
    </motion.div>
  );
}
