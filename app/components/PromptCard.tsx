import type { MouseEvent } from "react";

import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
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
} from "lucide-react";
import { useEffect, useState } from "react";
import { ModelIcon } from "./ModelIcon";
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
  isLiked: boolean;
  isSaved: boolean;
  isPublic: boolean;
  createdAt: string;
  author?: {
    name: string;
    email: string;
    avatar?: string;
  };
  isDarkMode?: boolean;
  viewMode?: "grid" | "list";
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onShare?: (id: string) => void;
  onCopy?: (id: string) => void;
  onLike?: (id: string) => void;
  onSave?: (id: string) => void;
  onClick?: (id: string) => void;
  onToggleVisibility?: (id: string) => void;
  onAddToCollection?: (id: string) => void;
}

export function PromptCard({
  id,
  title,
  description,
  model,
  type,
  tags,
  likes,
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
      <Card
        className={`group relative overflow-hidden ${isDarkMode ? "bg-[#0f0f11] border-[#27272a] hover:border-[#8b5cf6]" : "bg-white border-[#d4d4d4] hover:border-[#FF5722]"} hover:shadow-lg transition-all duration-200 cursor-pointer`}
        onClick={() => onClick?.(id)}
      >
        <div className="p-4 md:p-5">
          <div className="flex items-center gap-4">
            {/* Type Icon */}
            <div
              className={`h-10 w-10 md:h-12 md:w-12 min-w-[2.5rem] md:min-w-[3rem] rounded-lg ${isDarkMode ? "bg-[#18181b]" : "bg-[#f5f5f5]"} flex items-center justify-center flex-shrink-0`}
            >
              <TypeIcon
                className={`h-5 w-5 md:h-6 md:w-6 ${isDarkMode ? "text-[#8b5cf6]" : "text-[#FF5722]"}`}
              />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3
                  className={`${isDarkMode ? "text-[#fafafa]" : "text-[#333333]"} line-clamp-1`}
                  title={title}
                >
                  {truncatedTitle}
                </h3>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(event: MouseEvent<HTMLElement>) => event.stopPropagation()}
                      className={`h-8 w-8 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ${isDarkMode ? "text-[#71717a] hover:text-[#8b5cf6]" : "text-[#868686] hover:text-[#E11D48]"} hover:bg-transparent`}
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
                      className={`${isDarkMode ? "hover:bg-[#18181b] text-[#fafafa]" : "hover:bg-[#f5f5f5]"} cursor-pointer`}
                    >
                      <Heart
                        className={`h-4 w-4 mr-2 ${liked ? "fill-current" : ""}`}
                      />
                      {liked ? "Unfavorite" : "Favorite"}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(event: MouseEvent<HTMLElement>) => {
                        event.stopPropagation();
                        onEdit?.(id);
                      }}
                      className={`${isDarkMode ? "hover:bg-[#18181b] text-[#fafafa]" : "hover:bg-[#f5f5f5]"} cursor-pointer`}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(event: MouseEvent<HTMLElement>) => {
                        event.stopPropagation();
                        onCopy?.(id);
                      }}
                      className={`${isDarkMode ? "hover:bg-[#18181b] text-[#fafafa]" : "hover:bg-[#f5f5f5]"} cursor-pointer`}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(event: MouseEvent<HTMLElement>) => {
                        event.stopPropagation();
                        handleSave();
                      }}
                      className={`${isDarkMode ? "hover:bg-[#18181b] text-[#fafafa]" : "hover:bg-[#f5f5f5]"} cursor-pointer`}
                    >
                      <Bookmark
                        className={`h-4 w-4 mr-2 ${saved ? "fill-current" : ""}`}
                      />
                      {saved ? "Unsave" : "Save"}
                    </DropdownMenuItem>
                    {!isPublic && onAddToCollection && (
                      <DropdownMenuItem
                        onClick={(event: MouseEvent<HTMLElement>) => {
                          event.stopPropagation();
                          onAddToCollection?.(id);
                        }}
                        className={`${isDarkMode ? "hover:bg-[#18181b] text-[#fafafa]" : "hover:bg-[#f5f5f5]"} cursor-pointer`}
                      >
                        <FolderOpen className="h-4 w-4 mr-2" />
                        Add to Collection
                      </DropdownMenuItem>
                    )}
                    {onToggleVisibility && (
                      <DropdownMenuItem
                        onClick={(event: MouseEvent<HTMLElement>) => {
                          event.stopPropagation();
                          onToggleVisibility?.(id);
                        }}
                        className={`${isDarkMode ? "hover:bg-[#18181b] text-[#fafafa]" : "hover:bg-[#f5f5f5]"} cursor-pointer`}
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
                      className={`${isDarkMode ? "hover:bg-[#18181b] text-[#fafafa]" : "hover:bg-[#f5f5f5]"} cursor-pointer`}
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(event: MouseEvent<HTMLElement>) => {
                        event.stopPropagation();
                        onDelete?.(id);
                      }}
                      className={`${isDarkMode ? "hover:bg-[#18181b] text-[#f87171]" : "hover:bg-[#f5f5f5] text-[#E11D48]"} cursor-pointer`}
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <p
                className={`text-sm ${isDarkMode ? "text-[#a1a1aa]" : "text-[#868686]"} line-clamp-1 mb-3`}
              >
                {description}
              </p>

              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant="secondary"
                    className={`${
                      isDarkMode
                        ? "bg-[#18181b] text-[#fafafa] hover:bg-[#8b5cf6] hover:text-white"
                        : "bg-[#f5f5f5] text-[#333333] hover:bg-[#E11D48] hover:text-white"
                    } transition-colors flex items-center gap-1.5`}
                  >
                    <ModelIcon model={model} size={12} />
                    {model}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={`${
                      isPublic
                        ? isDarkMode
                          ? "border-[#8b5cf6] text-[#8b5cf6] bg-[#8b5cf6]/10"
                          : "border-[#E11D48] text-[#E11D48] bg-[#E11D48]/10"
                        : isDarkMode
                          ? "border-[#27272a] text-[#71717a] bg-[#18181b]"
                          : "border-[#d4d4d4] text-[#868686] bg-[#f5f5f5]"
                    } flex items-center gap-1.5`}
                  >
                    {isPublic ? (
                      <Globe className="h-3 w-3" />
                    ) : (
                      <Lock className="h-3 w-3" />
                    )}
                    {isPublic ? "Public" : "Private"}
                  </Badge>
                  {tags.slice(0, 2).map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className={`${
                        isDarkMode
                          ? "border-[#27272a] text-[#a1a1aa] hover:border-[#8b5cf6] hover:text-[#8b5cf6]"
                          : "border-[#d4d4d4] text-[#868686] hover:border-[#E11D48] hover:text-[#E11D48]"
                      } transition-colors`}
                    >
                      {tag}
                    </Badge>
                  ))}
                  {tags.length > 2 && (
                    <Badge
                      variant="outline"
                      className={`${
                        isDarkMode
                          ? "border-[#27272a] text-[#a1a1aa]"
                          : "border-[#d4d4d4] text-[#868686]"
                      }`}
                    >
                      +{tags.length - 2}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {/* Author info for public prompts */}
                  {isPublic && author && (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={author.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${author.email}`} />
                        <AvatarFallback className="text-xs">{author.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span className={`text-xs ${isDarkMode ? "text-[#71717a]" : "text-[#868686]"}`}>
                        {author.name}
                      </span>
                    </div>
                  )}
                  
                  {!isPublic && (
                    <div className="flex items-center gap-1.5">
                      <Calendar className={`h-3 w-3 ${isDarkMode ? "text-[#71717a]" : "text-[#868686]"}`} />
                      <span
                        className={`text-xs ${isDarkMode ? "text-[#71717a]" : "text-[#868686]"}`}
                      >
                        {createdAt}
                      </span>
                    </div>
                  )}
                  
                  {/* Show likes only for public prompts */}
                  {isPublic && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(event: MouseEvent<HTMLElement>) => {
                        event.stopPropagation();
                        handleLike();
                      }}
                      className={`h-8 gap-1.5 hover:bg-transparent ${
                        liked
                          ? isDarkMode
                            ? "text-[#8b5cf6]"
                            : "text-[#E11D48]"
                          : isDarkMode
                            ? "text-[#71717a] hover:text-[#8b5cf6]"
                            : "text-[#868686] hover:text-[#E11D48]"
                      }`}
                    >
                      <Heart
                        className={`h-4 w-4 ${liked ? "fill-current" : ""}`}
                      />
                      <span className="text-sm">{likeCount}</span>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Grid view layout (default)
  return (
    <Card
      className={`group relative overflow-hidden ${isDarkMode ? "bg-[#0f0f11] border-[#27272a] hover:border-[#8b5cf6]" : "bg-white border-[#d4d4d4] hover:border-[#E11D48]"} hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col`}
      onClick={() => onClick?.(id)}
    >
      <div className="p-0">
        <div className="w-full aspect-video relative overflow-hidden bg-muted/20 border-b">
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
      <div className="p-5 flex flex-col flex-1 gap-4">
        {/* Header Row: Title & Menu */}
        <div className="flex items-start justify-between gap-3">
           <h3
             className={`${
               isDarkMode ? "text-[#fafafa]" : "text-[#333333]"
             } line-clamp-2 text-base font-semibold leading-tight flex-1`}
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
                className={`h-8 w-8 -mr-2 opacity-0 group-hover:opacity-100 transition-opacity ${isDarkMode ? "text-[#71717a] hover:text-[#8b5cf6]" : "text-[#868686] hover:text-[#E11D48]"} hover:bg-transparent`}
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
                className={`${isDarkMode ? "hover:bg-[#18181b] text-[#fafafa]" : "hover:bg-[#f5f5f5]"} cursor-pointer`}
              >
                <Heart
                  className={`h-4 w-4 mr-2 ${liked ? "fill-current" : ""}`}
                />
                {liked ? "Unfavorite" : "Favorite"}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(event: MouseEvent<HTMLElement>) => {
                  event.stopPropagation();
                  onEdit?.(id);
                }}
                className={`${isDarkMode ? "hover:bg-[#18181b] text-[#fafafa]" : "hover:bg-[#f5f5f5]"} cursor-pointer`}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(event: MouseEvent<HTMLElement>) => {
                  event.stopPropagation();
                  onCopy?.(id);
                }}
                className={`${isDarkMode ? "hover:bg-[#18181b] text-[#fafafa]" : "hover:bg-[#f5f5f5]"} cursor-pointer`}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(event: MouseEvent<HTMLElement>) => {
                  event.stopPropagation();
                  handleSave();
                }}
                className={`${isDarkMode ? "hover:bg-[#18181b] text-[#fafafa]" : "hover:bg-[#f5f5f5]"} cursor-pointer`}
              >
                <Bookmark
                  className={`h-4 w-4 mr-2 ${saved ? "fill-current" : ""}`}
                />
                {saved ? "Unsave" : "Save"}
              </DropdownMenuItem>
              {!isPublic && onAddToCollection && (
                <DropdownMenuItem
                  onClick={(event: MouseEvent<HTMLElement>) => {
                    event.stopPropagation();
                    onAddToCollection?.(id);
                  }}
                  className={`${isDarkMode ? "hover:bg-[#18181b] text-[#fafafa]" : "hover:bg-[#f5f5f5]"} cursor-pointer`}
                >
                  <FolderOpen className="h-4 w-4 mr-2" />
                  Add to Collection
                </DropdownMenuItem>
              )}
              {onToggleVisibility && (
                <DropdownMenuItem
                  onClick={(event: MouseEvent<HTMLElement>) => {
                    event.stopPropagation();
                    onToggleVisibility?.(id);
                  }}
                  className={`${isDarkMode ? "hover:bg-[#18181b] text-[#fafafa]" : "hover:bg-[#f5f5f5]"} cursor-pointer`}
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
                className={`${isDarkMode ? "hover:bg-[#18181b] text-[#fafafa]" : "hover:bg-[#f5f5f5]"} cursor-pointer`}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(event: MouseEvent<HTMLElement>) => {
                  event.stopPropagation();
                  onDelete?.(id);
                }}
                className={`${isDarkMode ? "hover:bg-[#18181b] text-[#f87171]" : "hover:bg-[#f5f5f5] text-[#E11D48]"} cursor-pointer`}
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <p
           className={`text-sm ${isDarkMode ? "text-[#a1a1aa]" : "text-[#868686]"} line-clamp-2 leading-relaxed`}
        >
           {description}
        </p>

        <div className="flex flex-wrap gap-2 mt-auto">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className={`${
                isDarkMode
                  ? "bg-[#18181b] text-[#a1a1aa] border border-[#27272a]"
                  : "bg-[#f5f5f5] text-[#868686] border border-[#e5e5e5]"
              } transition-colors whitespace-nowrap px-2.5 py-1 font-normal`}
            >
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between mt-4 border-t pt-4 border-dashed border-border/50">
           <div className="flex items-center gap-4">
              <button 
                 onClick={(e) => { e.stopPropagation(); handleLike(); }}
                 className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${liked ? "text-pink-500" : (isDarkMode ? "text-[#71717a] hover:text-[#fafafa]" : "text-[#868686] hover:text-[#333333]")}`}
              >
                 <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
                 <span>{likeCount}</span>
              </button>
              <button
                 onClick={(e) => { e.stopPropagation(); handleSave(); }} 
                 className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${saved ? "text-blue-500" : (isDarkMode ? "text-[#71717a] hover:text-[#fafafa]" : "text-[#868686] hover:text-[#333333]")}`}
              >
                 <Bookmark className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />
              </button>
           </div>
           
           <span className={`text-xs font-medium ${isDarkMode ? "text-[#71717a]" : "text-[#868686]"}`}>
              {model}
           </span>
        </div>
      </div>
    </Card>
  );
}
