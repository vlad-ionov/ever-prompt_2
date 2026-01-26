import type { MouseEvent } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Copy,
  Edit,
  Heart,
  MoreVertical,
  Share2,
  Trash,
  Bookmark,
  Video,
  Music,
  Image as ImageIcon,
  FileText,
  Lock,
  Globe,
  Calendar,
  FolderOpen,
  Eye,
  EyeOff,
  Tag,
  Star,
} from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ModelIcon } from "./ui/model-icon";
import TextPlaceholder from "../assets/images/text-placeholder.png";
import VideoPlaceholder from "../assets/images/video-placeholder.png";
import AudioPlaceholder from "../assets/images/audio-placeholder.png";
import ImagePlaceholder from "../assets/images/image-placeholder.png";

const TYPE_ICONS = {
  video: Video,
  audio: Music,
  image: ImageIcon,
  text: FileText,
};

const getPlaceholder = (type: string) => {
  switch (type) {
    case "video":
      return VideoPlaceholder;
    case "audio":
      return AudioPlaceholder;
    case "image":
      return ImagePlaceholder;
    case "text":
    default:
      return TextPlaceholder;
  }
};

interface PromptCardProps {
  id: string;
  title: string;
  description: string;
  model: string;
  type: "video" | "audio" | "image" | "text";
  content?: string;
  tags: string[];
  likes: number;
  views: number;
  isLiked: boolean;
  isSaved: boolean;
  isPublic: boolean;
  createdAt: string;
  author?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  isDarkMode?: boolean;
  viewMode?: "grid" | "list" | "table";
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onShare?: (id: string) => void;
  onCopy?: (id: string) => void;
  onLike?: (id: string) => void;
  onSave?: (id: string) => void;
  onClick?: (id: string) => void;
  onToggleVisibility?: (id: string) => void;
  onAddToCollection?: (id: string) => void;
  isOwner?: boolean;
}

export function PromptCard({
  id,
  title,
  description,
  model,
  type,
  tags,
  likes,
  views,
  isLiked,
  isSaved,
  isPublic,
  createdAt,
  author,
  isDarkMode = false,
  viewMode = "grid",
  onEdit,
  onDelete,
  onShare,
  onCopy,
  onLike,
  onSave,
  onClick,
  onToggleVisibility,
  onAddToCollection,
  content,
  isOwner = true,
}: PromptCardProps) {
  const [liked, setLiked] = useState(isLiked);
  const [likeCount, setLikeCount] = useState(likes);
  const [saved, setSaved] = useState(isSaved);
  const truncatedTitle = (() => {
    const words = title.trim().split(/\s+/);
    if (words.length <= 8) {
      return title;
    }
    return `${words.slice(0, 8).join(" ")}…`;
  })();

  useEffect(() => {
    setLiked(isLiked);
  }, [isLiked]);

  useEffect(() => {
    setLikeCount(likes);
  }, [likes]);

  useEffect(() => {
    setSaved(isSaved);
  }, [isSaved]);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
    onLike?.(id);
  };

  const handleSave = () => {
    setSaved(!saved);
    onSave?.(id);
  };

  const TypeIcon = TYPE_ICONS[type];

  // List view layout
  if (viewMode === "list") {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        whileHover={{ y: -2 }}
        className="h-full"
      >
        <Card
          className={`group h-full relative overflow-hidden transition-all duration-300 cursor-pointer border flex flex-col ${
            isDarkMode 
              ? "bg-[#0f0f12]/40 backdrop-blur-xl border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:bg-[#16161a]/60 hover:border-violet-500/40" 
              : "bg-white/80 backdrop-blur-md border-slate-200 shadow-[var(--shadow-elevated)] hover:shadow-[var(--shadow-floating)] hover:border-slate-300"
          }`}
          onClick={() => onClick?.(id)}
        >
          {/* Subtle accent hover line */}
          <motion.div 
            className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#8b5cf6]"
            initial={{ scaleY: 0 }}
            whileHover={{ scaleY: 1 }}
            transition={{ duration: 0.2 }}
          />

          <div className="p-4 md:p-5">
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
              {/* Type Icon Section */}
              <div className="flex-shrink-0">
                <div
                  className={`p-3 md:p-4 rounded-2xl transition-all duration-300 ${
                    isDarkMode 
                      ? "bg-[#18181b] group-hover:bg-[#1c1c21] group-hover:scale-105" 
                      : "bg-slate-50 border border-slate-100 group-hover:bg-white group-hover:shadow-sm"
                  }`}
                >
                  <TypeIcon
                    className={`h-5 w-5 md:h-6 w-6 ${isDarkMode ? "text-[#8b5cf6]" : "text-[#111111]"}`}
                  />
                </div>
              </div>

              {/* Main Content: Title & Description */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col gap-1 mb-3">
                  <h3
                    className={`${
                      isDarkMode ? "text-white" : "text-[#0f172a]"
                    } font-bold text-base md:text-lg tracking-tight truncate group-hover:text-[#8b5cf6] transition-colors`}
                    title={title}
                  >
                    {title}
                  </h3>
                  <p
                    className={`text-[13px] md:text-sm ${
                      isDarkMode ? "text-[#94a3b8]" : "text-[#64748b]"
                    } line-clamp-2 md:line-clamp-1 leading-relaxed max-w-2xl`}
                  >
                    {description}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <Badge
                    variant="secondary"
                    className={`${
                      isDarkMode
                        ? "bg-[#1e293b] text-white hover:bg-[#8b5cf6]"
                        : "bg-slate-100 text-slate-900"
                    } transition-colors flex items-center gap-1.5 h-6 text-[10px] font-bold uppercase tracking-wider px-2`}
                  >
                    <ModelIcon model={model} size={12} isDarkMode={isDarkMode} />
                    {model}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={`${
                      isPublic
                        ? isDarkMode
                          ? "border-[#8b5cf6]/40 text-[#8b5cf6] bg-[#8b5cf6]/5"
                          : "border-emerald-200 text-emerald-600 bg-emerald-50"
                        : isDarkMode
                          ? "border-zinc-700 text-zinc-400 bg-zinc-800/50"
                          : "border-slate-200 text-slate-400 bg-slate-50"
                    } flex items-center gap-1.5 h-6 text-[10px] font-bold uppercase tracking-wider px-2`}
                  >
                    {isPublic ? <Globe className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                    {isPublic ? "Public" : "Private"}
                  </Badge>
                </div>
              </div>

              {/* Categories Column (Desktop) */}
              <div className={`hidden lg:flex flex-col gap-2 min-w-[140px] max-w-[200px] border-l ${isDarkMode ? 'border-zinc-800' : 'border-slate-200'} pl-6 h-full`}>
                 <span className={`${isDarkMode ? "text-zinc-500" : "text-slate-400"} text-[10px] uppercase font-bold tracking-[0.1em]`}>Categories</span>
                 <div className="flex flex-wrap gap-1.5 max-h-[48px] overflow-hidden">
                   {tags.length > 0 ? (
                     tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className={`${
                          isDarkMode
                            ? "border-zinc-800 text-zinc-400 hover:border-[#8b5cf6] hover:text-[#8b5cf6]"
                            : "border-slate-200 text-slate-500 hover:border-slate-900 hover:text-slate-900"
                        } transition-all duration-300 flex items-center gap-1 px-2 py-0 h-5 rounded-full font-medium text-[9px]`}
                      >
                        {tag}
                      </Badge>
                    ))
                   ) : (
                     <span className="text-[10px] italic opacity-30">No tags</span>
                   )}
                 </div>
              </div>

              {/* Actions & Meta - Right Aligned */}
              <div className={`flex items-center md:flex-col md:items-end md:justify-between gap-3 md:min-w-[140px] border-t md:border-t-0 md:border-l ${isDarkMode ? 'border-zinc-800' : 'border-slate-200'} pt-3 md:pt-0 md:pl-6`}>
                  <div className="flex items-center gap-1.5 md:mb-1">
                    {isPublic && (
                      <div className="flex items-center gap-3 mr-2">
                        <div className="flex items-center gap-1 text-pink-500 text-xs font-bold">
                          <Heart className={`h-3.5 w-3.5 ${liked ? "fill-current" : ""}`} />
                          <span>{likeCount}</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-500 text-xs font-bold">
                          <Eye className="h-3.5 w-3.5" />
                          <span>{views}</span>
                        </div>
                      </div>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(event: MouseEvent<HTMLElement>) => event.stopPropagation()}
                          className={`h-9 w-9 rounded-xl transition-all ${
                            isDarkMode 
                              ? "text-zinc-500 hover:text-white hover:bg-zinc-800" 
                              : "text-slate-400 hover:text-slate-900 hover:bg-slate-100"
                          }`}
                        >
                          <MoreVertical className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent 
                        align="end" 
                        className={`w-52 p-1.5 ${isDarkMode ? "bg-[#0f0f12] border-zinc-800 text-zinc-200" : "bg-white border-slate-200 text-slate-900"}`}
                      >
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleLike(); }} className="cursor-pointer rounded-lg focus:bg-[#8b5cf6] focus:text-white">
                          {isPublic ? (
                            <><Heart className={`h-4 w-4 mr-2 ${liked ? "fill-current" : ""}`} /> {liked ? "Unlike" : "Like"}</>
                          ) : (
                            <><Star className={`h-4 w-4 mr-2 ${liked ? "fill-current" : ""}`} /> {liked ? "Remove from Favorites" : "Mark as Favorite"}</>
                          )}
                        </DropdownMenuItem>
                        {isOwner && onEdit && (
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit?.(id); }} className="cursor-pointer rounded-lg focus:bg-[#8b5cf6] focus:text-white">
                            <Edit className="h-4 w-4 mr-2" /> Edit
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onCopy?.(id); }} className="cursor-pointer rounded-lg focus:bg-[#8b5cf6] focus:text-white">
                          <Copy className="h-4 w-4 mr-2" /> Copy
                        </DropdownMenuItem>
                        {isPublic && (
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleSave(); }} className="cursor-pointer rounded-lg focus:bg-[#8b5cf6] focus:text-white">
                            <Bookmark className={`h-4 w-4 mr-2 ${saved ? "fill-current" : ""}`} /> {saved ? "Unsave" : "Save"}
                          </DropdownMenuItem>
                        )}
                        {isOwner && !isPublic && onAddToCollection && (
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onAddToCollection?.(id); }} className="cursor-pointer rounded-lg focus:bg-[#8b5cf6] focus:text-white">
                             <FolderOpen className="h-4 w-4 mr-2" /> Add to Collection
                          </DropdownMenuItem>
                        )}
                        {isOwner && onToggleVisibility && (
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onToggleVisibility?.(id); }} className="cursor-pointer rounded-lg focus:bg-[#8b5cf6] focus:text-white">
                             {isPublic ? <><EyeOff className="h-4 w-4 mr-2" /> Make Private</> : <><Eye className="h-4 w-4 mr-2" /> Make Public</>}
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onShare?.(id); }} className="cursor-pointer rounded-lg focus:bg-[#8b5cf6] focus:text-white">
                          <Share2 className="h-4 w-4 mr-2" /> Share
                        </DropdownMenuItem>
                        {isOwner && onDelete && (
                          <>
                            <div className="h-px bg-border/50 my-1" />
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDelete?.(id); }} className="cursor-pointer rounded-lg text-red-500 focus:bg-red-500 focus:text-white font-medium">
                              <Trash className="h-4 w-4 mr-2" /> Delete
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                 </div>
                                  <div className="flex-1 md:flex-initial flex items-center justify-end gap-1.5">
                    <Calendar className={`h-3 w-3 ${isDarkMode ? "text-zinc-600" : "text-slate-400"}`} />
                    <span className={`text-[11px] font-bold tracking-tight ${isDarkMode ? "text-zinc-600" : "text-slate-400"}`}>{createdAt}</span>
                  </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  // Grid view layout (default)
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
      className="h-full"
    >
      <Card
        className={`group relative overflow-hidden transition-all duration-500 cursor-pointer flex flex-col border h-full ${
          isDarkMode 
            ? "bg-[#0f0f12]/40 backdrop-blur-xl border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:border-violet-500/50 hover:shadow-violet-500/10" 
            : "bg-white border-slate-200 shadow-[var(--shadow-elevated)] hover:shadow-[var(--shadow-floating)]"
        }`}
        onClick={() => onClick?.(id)}
      >
        {/* Liquid Glass Inner Glow */}
        {isDarkMode && (
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/[0.02] to-transparent opacity-50" />
        )}
      <div className="p-0">
        <div className={`w-full aspect-video relative overflow-hidden bg-muted/20 border-b ${isDarkMode ? 'border-white/[0.02]' : 'border-black/[0.03]'}`}>
          <img 
            src={type === "image" && content ? content : getPlaceholder(type)} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.src = getPlaceholder(type);
            }} 
          />
          
          {/* Overlay: Type (Top Left) */}
          <div className="absolute top-3 left-3">
             <span className={`flex h-8 w-8 items-center justify-center rounded-lg shadow-sm backdrop-blur-md ${isDarkMode ? "bg-black/50 text-white" : "bg-white/90 text-black/80"}`}>
                <TypeIcon className="h-4 w-4" />
             </span>
          </div>

          {/* Overlay: Model & Status (Top Right) */}
          <div className="absolute top-3 right-3 flex items-center gap-2">
             <span className={`flex h-8 w-8 items-center justify-center rounded-lg shadow-sm backdrop-blur-md ${isDarkMode ? "bg-black/50 text-white" : "bg-white/90 text-black/80"}`} title={model}>
                <ModelIcon model={model} size={16} isDarkMode={isDarkMode} />
             </span>
              <span className={`flex h-8 w-8 items-center justify-center rounded-lg shadow-sm backdrop-blur-md ${isDarkMode ? "bg-black/50 text-white" : "bg-white/90 text-black/80"}`} title={isPublic ? "Public" : "Private"}>
                 {isPublic ? <Globe className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
              </span>
          </div>
        </div>
      </div>
      <div className="p-3 md:p-4 flex flex-col flex-1 gap-2">
        {/* Header Row: Title & Menu */}
        <div className="flex items-start justify-between gap-3">
            <h3
              className={`${
                isDarkMode ? "text-[#fafafa]" : "text-[#333333]"
              } line-clamp-1 text-sm md:text-base font-bold leading-tight flex-1`}
              title={title}
            >
              {title}
            </h3>
           <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={(event: MouseEvent<HTMLElement>) => event.stopPropagation()}
                className={`h-8 w-8 -mr-2 opacity-0 group-hover:opacity-100 transition-opacity ${isDarkMode ? "text-[#71717a] hover:text-[#8b5cf6]" : "text-[#868686] hover:text-[#111111]"} hover:bg-transparent`}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className={`${isDarkMode ? "bg-[#0f0f11] border-[#27272a]" : "bg-white border-[#d4d4d4]"}`}
            >
              <DropdownMenuItem
                onClick={(event: MouseEvent<HTMLElement>) => {
                  event.stopPropagation();
                  handleLike();
                }}
                className={`${isDarkMode ? "hover:bg-[#18181b] text-[#fafafa]" : "hover:bg-white"} cursor-pointer`}
              >
                <Heart
                  className={`h-4 w-4 mr-2 ${liked ? "fill-current" : ""}`}
                />
                {liked ? "Unfavorite" : "Favorite"}
              </DropdownMenuItem>
                {isOwner && onEdit && (
                  <DropdownMenuItem
                    onClick={(event: MouseEvent<HTMLElement>) => {
                      event.stopPropagation();
                      onEdit?.(id);
                    }}
                    className={`${isDarkMode ? "hover:bg-[#18181b] text-[#fafafa]" : "hover:bg-white"} cursor-pointer`}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={(event: MouseEvent<HTMLElement>) => {
                    event.stopPropagation();
                    onCopy?.(id);
                  }}
                  className={`${isDarkMode ? "hover:bg-[#18181b] text-[#fafafa]" : "hover:bg-white"} cursor-pointer`}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(event: MouseEvent<HTMLElement>) => {
                    event.stopPropagation();
                    handleSave();
                  }}
                  className={`${isDarkMode ? "hover:bg-[#18181b] text-[#fafafa]" : "hover:bg-white"} cursor-pointer`}
                >
                  <Bookmark
                    className={`h-4 w-4 mr-2 ${saved ? "fill-current" : ""}`}
                  />
                  {saved ? "Unsave" : "Save"}
                </DropdownMenuItem>
                {isOwner && !isPublic && onAddToCollection && (
                  <DropdownMenuItem
                    onClick={(event: MouseEvent<HTMLElement>) => {
                      event.stopPropagation();
                      onAddToCollection?.(id);
                    }}
                    className={`${isDarkMode ? "hover:bg-[#18181b] text-[#fafafa]" : "hover:bg-white"} cursor-pointer`}
                  >
                    <FolderOpen className="h-4 w-4 mr-2" />
                    Add to Collection
                  </DropdownMenuItem>
                )}
                {isOwner && onToggleVisibility && (
                  <DropdownMenuItem
                    onClick={(event: MouseEvent<HTMLElement>) => {
                      event.stopPropagation();
                      onToggleVisibility?.(id);
                    }}
                    className={`${isDarkMode ? "hover:bg-[#18181b] text-[#fafafa]" : "hover:bg-white"} cursor-pointer`}
                  >
                    {isPublic ? (
                      <>
                        <EyeOff className="h-4 w-4 mr-2" />
                        Make Private
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-2" />
                        Make Public
                      </>
                    )}
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={(event: MouseEvent<HTMLElement>) => {
                    event.stopPropagation();
                    onShare?.(id);
                  }}
                  className={`${isDarkMode ? "hover:bg-[#18181b] text-[#fafafa]" : "hover:bg-white"} cursor-pointer`}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </DropdownMenuItem>
                {isOwner && onDelete && (
                  <DropdownMenuItem
                    onClick={(event: MouseEvent<HTMLElement>) => {
                      event.stopPropagation();
                      onDelete?.(id);
                    }}
                    className={`${isDarkMode ? "hover:bg-[#18181b] text-[#f87171]" : "hover:bg-white text-[#111111]"} cursor-pointer`}
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <p
           className={`text-[13px] ${isDarkMode ? "text-[#a1a1aa]" : "text-[#868686]"} line-clamp-3 leading-snug`}
        >
           {description}
        </p>

        <div className="flex flex-wrap gap-1.5 mt-auto pt-1">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className={`${
                isDarkMode
                  ? "bg-[#18181b] text-[#71717a] border-[#27272a]/30"
                  : "bg-slate-50 text-[#64748b] border-slate-100"
              } transition-all duration-300 hover:scale-105 border flex items-center gap-1 px-2 py-0.5 rounded-full font-medium text-[10px]`}
            >
              <Tag className="h-2.5 w-2.5 opacity-40" />
              {tag}
            </Badge>
          ))}
        </div>

        <div className={`flex items-center justify-between mt-3 border-t pt-3 ${isDarkMode ? 'border-white/5 border-solid' : 'border-solid border-border/05'}`}>
            <div className="flex items-center gap-3">
              <button 
                 onClick={(e) => { e.stopPropagation(); handleLike(); }}
                 className={`flex items-center gap-1 text-[13px] font-semibold transition-colors ${liked ? (isPublic ? "text-pink-500" : "text-amber-500") : (isDarkMode ? "text-[#71717a] hover:text-[#fafafa]" : "text-[#868686] hover:text-[#333333]")}`}
                 title={isPublic ? (liked ? "Unlike" : "Like") : (liked ? "Remove from Favorites" : "Mark as Favorite")}
              >
                 {isPublic ? (
                   <Heart className={`h-3.5 w-3.5 ${liked ? "fill-current" : ""}`} />
                 ) : (
                   <Star className={`h-3.5 w-3.5 ${liked ? "fill-current text-amber-500" : ""}`} />
                 )}
                 {isPublic && <span>{likeCount}</span>}
              </button>
              {isPublic && (
                <>
                  <div className={`flex items-center gap-1 text-[13px] font-semibold opacity-60 ${isDarkMode ? "text-[#71717a]" : "text-[#868686]"}`}>
                    <Eye className="h-3.5 w-3.5" />
                    <span>{views}</span>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleSave(); }} 
                    className={`flex items-center gap-1 text-[13px] font-semibold transition-colors ${saved ? "text-blue-500" : (isDarkMode ? "text-[#71717a] hover:text-[#fafafa]" : "text-[#868686] hover:text-[#333333]")}`}
                  >
                    <Bookmark className={`h-3.5 w-3.5 ${saved ? "fill-current" : ""}`} />
                  </button>
                </>
              )}
            </div>
                      <div className="flex items-center gap-1.5">
              <Calendar className={`h-3 w-3 ${isDarkMode ? "text-[#71717a]" : "text-[#868686]"}`} />
              <span className={`text-[11px] font-bold ${isDarkMode ? "text-[#71717a]" : "text-[#868686]"}`}>
                {createdAt}
              </span>
            </div>
        </div>
      </div>
    </Card>
    </motion.div>
  );
}
