import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "./ui/sheet";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Copy,
  Heart,
  Share2,
  Calendar,
  Video,
  Music,
  Image as ImageIcon,
  FileText,
  Check,
  Edit,
  Trash,
  Bookmark,
  Eye,
  EyeOff,
  Globe,
  Lock,
  Sparkles,
  Clock,
  TrendingUp,
  FolderOpen,
} from "lucide-react";
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

  const TypeIcon = TYPE_ICONS[prompt.type];

  const copyToClipboard = (text: string) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }

    return new Promise<void>((resolve, reject) => {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();

      try {
        const successful = document.execCommand("copy");
        document.body.removeChild(textarea);
        if (successful) {
          resolve();
        } else {
          reject(new Error("Copy command failed"));
        }
      } catch (error) {
        document.body.removeChild(textarea);
        reject(error);
      }
    });
  };

  const handleCopy = async () => {
    try {
      await copyToClipboard(prompt.content);
      setCopied(true);
      toast.success("Prompt copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy prompt");
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/prompts/${prompt.id}`;
    try {
      await copyToClipboard(shareUrl);
      toast.success("Share link copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy share link");
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    onLike?.(prompt.id);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    onSave?.(prompt.id);
  };

  const characterCount = prompt.content.length;
  const wordCount = prompt.content.trim().split(/\s+/).length;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className={`${
          isDarkMode ? "bg-[#0f0f11] border-[#27272a]" : "bg-white border-[#e5e5e5]"
        } w-full sm:max-w-2xl p-0 flex flex-col overflow-hidden`}
      >
        {/* Header Section - Fixed */}
        <div
          className={`border-b ${
            isDarkMode ? "border-[#27272a]" : "border-[#e5e5e5]"
          } px-6 py-5 overflow-hidden`}
        >
          <SheetHeader className="space-y-0">
            <div className="flex items-start gap-4 mb-4">
              <div
                className={`p-3 rounded-xl ${
                  isDarkMode
                    ? "bg-gradient-to-br from-[#8b5cf6]/10 to-[#a78bfa]/5 border-[#8b5cf6]/20"
                    : "bg-gradient-to-br from-[#CF0707]/10 to-[#E11D48]/5 border-[#CF0707]/20"
                } border flex-shrink-0`}
              >
                <TypeIcon
                  className={`h-6 w-6 ${
                    isDarkMode ? "text-[#8b5cf6]" : "text-[#CF0707]"
                  }`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <SheetTitle
                  className={`${
                    isDarkMode ? "text-[#fafafa]" : "text-[#333333]"
                  } text-xl mb-2`}
                >
                  {prompt.title}
                </SheetTitle>
                <SheetDescription
                  className={`text-sm ${
                    isDarkMode ? "text-[#a1a1aa]" : "text-[#868686]"
                  } line-clamp-2`}
                >
                  {prompt.description}
                </SheetDescription>
              </div>
            </div>

            {/* Meta Badges */}
            <div className="flex flex-wrap gap-2 mb-4 w-full">
              <Badge
                variant="secondary"
                className={`${
                  isDarkMode
                    ? "bg-[#18181b] text-[#fafafa] border-[#27272a]"
                    : "bg-[#f5f5f5] text-[#333333] border-[#e5e5e5]"
                } flex items-center gap-1.5 border`}
              >
                <ModelIcon model={prompt.model} size={12} />
                {prompt.model}
              </Badge>
              <Badge
                variant="outline"
                className={`${
                  prompt.isPublic
                    ? isDarkMode
                      ? "border-[#8b5cf6] text-[#8b5cf6] bg-[#8b5cf6]/10"
                      : "border-[#E11D48] text-[#E11D48] bg-[#E11D48]/10"
                    : isDarkMode
                    ? "border-[#27272a] text-[#71717a] bg-[#18181b]"
                    : "border-[#d4d4d4] text-[#868686] bg-[#f5f5f5]"
                } flex items-center gap-1.5`}
              >
                {prompt.isPublic ? (
                  <>
                    <Globe className="h-3 w-3" />
                    Public
                  </>
                ) : (
                  <>
                    <Lock className="h-3 w-3" />
                    Private
                  </>
                )}
              </Badge>
              <Badge
                variant="outline"
                className={`${
                  isDarkMode
                    ? "border-[#27272a] text-[#a1a1aa]"
                    : "border-[#d4d4d4] text-[#868686]"
                } flex items-center gap-1.5 capitalize`}
              >
                <TypeIcon className="h-3 w-3" />
                {prompt.type}
              </Badge>
            </div>

            {/* Author & Date Info */}
            <div className="flex items-center gap-4 mb-4">
              {prompt.isPublic && prompt.author ? (
                <div className="flex items-center gap-2">
                  <Avatar className="h-7 w-7">
                    <AvatarImage
                      src={
                        prompt.author.avatar ||
                        `https://api.dicebear.com/7.x/bottts/svg?seed=${prompt.author.email}`
                      }
                    />
                    <AvatarFallback className="text-xs">
                      {prompt.author.name?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-[#fafafa]" : "text-[#333333]"
                      }`}
                    >
                      {prompt.author.name}
                    </p>
                    <p
                      className={`text-xs ${
                        isDarkMode ? "text-[#71717a]" : "text-[#868686]"
                      }`}
                    >
                      Creator
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Calendar
                    className={`h-4 w-4 ${
                      isDarkMode ? "text-[#71717a]" : "text-[#868686]"
                    }`}
                  />
                  <span
                    className={`text-sm ${
                      isDarkMode ? "text-[#a1a1aa]" : "text-[#868686]"
                    }`}
                  >
                    {prompt.createdAt}
                  </span>
                </div>
              )}
            </div>

            {/* Primary Actions */}
            <div className="flex gap-2">
              <Button
                onClick={handleCopy}
                className={`flex-1 ${
                  copied
                    ? "bg-green-600 hover:bg-green-700"
                    : isDarkMode
                    ? "bg-[#8b5cf6] hover:bg-[#7c3aed]"
                    : "bg-[#CF0707] hover:bg-[#a80606]"
                } text-white transition-all duration-200`}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Prompt
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleLike}
                className={`${
                  isLiked
                    ? isDarkMode
                      ? "border-[#8b5cf6] text-[#8b5cf6] bg-[#8b5cf6]/10"
                      : "border-[#CF0707] text-[#CF0707] bg-[#CF0707]/10"
                    : isDarkMode
                    ? "border-[#27272a] text-[#a1a1aa] hover:border-[#8b5cf6] hover:text-[#8b5cf6]"
                    : "border-[#d4d4d4] text-[#868686] hover:border-[#CF0707] hover:text-[#CF0707]"
                } transition-all duration-200`}
              >
                <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleSave}
                className={`${
                  isSaved
                    ? isDarkMode
                      ? "border-[#8b5cf6] text-[#8b5cf6] bg-[#8b5cf6]/10"
                      : "border-[#CF0707] text-[#CF0707] bg-[#CF0707]/10"
                    : isDarkMode
                    ? "border-[#27272a] text-[#a1a1aa] hover:border-[#8b5cf6] hover:text-[#8b5cf6]"
                    : "border-[#d4d4d4] text-[#868686] hover:border-[#CF0707] hover:text-[#CF0707]"
                } transition-all duration-200`}
              >
                <Bookmark className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleShare}
                className={`${
                  isDarkMode
                    ? "border-[#27272a] text-[#a1a1aa] hover:border-[#8b5cf6] hover:text-[#8b5cf6]"
                    : "border-[#d4d4d4] text-[#868686] hover:border-[#CF0707] hover:text-[#CF0707]"
                } transition-all duration-200`}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </SheetHeader>
        </div>

        {/* Scrollable Content */}
        <ScrollArea className="flex-1 w-full overflow-hidden">
          <div className="px-6 py-6 space-y-6 max-w-full">
            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-3 w-full">
              <div
                className={`${
                  isDarkMode
                    ? "bg-[#18181b] border-[#27272a]"
                    : "bg-[#f5f5f5] border-[#e5e5e5]"
                } border rounded-lg p-3`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Heart
                    className={`h-4 w-4 ${
                      isDarkMode ? "text-[#8b5cf6]" : "text-[#CF0707]"
                    }`}
                  />
                  <span
                    className={`text-xs ${
                      isDarkMode ? "text-[#a1a1aa]" : "text-[#868686]"
                    }`}
                  >
                    Likes
                  </span>
                </div>
                <p
                  className={`text-xl ${
                    isDarkMode ? "text-[#fafafa]" : "text-[#333333]"
                  }`}
                >
                  {likeCount}
                </p>
              </div>
              <div
                className={`${
                  isDarkMode
                    ? "bg-[#18181b] border-[#27272a]"
                    : "bg-[#f5f5f5] border-[#e5e5e5]"
                } border rounded-lg p-3`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <FileText
                    className={`h-4 w-4 ${
                      isDarkMode ? "text-[#8b5cf6]" : "text-[#CF0707]"
                    }`}
                  />
                  <span
                    className={`text-xs ${
                      isDarkMode ? "text-[#a1a1aa]" : "text-[#868686]"
                    }`}
                  >
                    Words
                  </span>
                </div>
                <p
                  className={`text-xl ${
                    isDarkMode ? "text-[#fafafa]" : "text-[#333333]"
                  }`}
                >
                  {wordCount}
                </p>
              </div>
              <div
                className={`${
                  isDarkMode
                    ? "bg-[#18181b] border-[#27272a]"
                    : "bg-[#f5f5f5] border-[#e5e5e5]"
                } border rounded-lg p-3`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp
                    className={`h-4 w-4 ${
                      isDarkMode ? "text-[#8b5cf6]" : "text-[#CF0707]"
                    }`}
                  />
                  <span
                    className={`text-xs ${
                      isDarkMode ? "text-[#a1a1aa]" : "text-[#868686]"
                    }`}
                  >
                    Chars
                  </span>
                </div>
                <p
                  className={`text-xl ${
                    isDarkMode ? "text-[#fafafa]" : "text-[#333333]"
                  }`}
                >
                  {characterCount}
                </p>
              </div>
            </div>

            <Separator className={isDarkMode ? "bg-[#27272a]" : "bg-[#e5e5e5]"} />

            {/* Tags Section */}
            {prompt.tags.length > 0 && (
              <div>
                <h3
                  className={`text-sm mb-3 flex items-center gap-2 ${
                    isDarkMode ? "text-[#fafafa]" : "text-[#333333]"
                  }`}
                >
                  <Sparkles className="h-4 w-4" />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {prompt.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className={`${
                        isDarkMode
                          ? "border-[#27272a] text-[#a1a1aa] hover:border-[#8b5cf6] hover:text-[#8b5cf6] hover:bg-[#8b5cf6]/10"
                          : "border-[#d4d4d4] text-[#868686] hover:border-[#CF0707] hover:text-[#CF0707] hover:bg-[#CF0707]/10"
                      } cursor-pointer transition-all duration-200`}
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <Separator className={isDarkMode ? "bg-[#27272a]" : "bg-[#e5e5e5]"} />

            {/* Prompt Content */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3
                  className={`text-sm flex items-center gap-2 ${
                    isDarkMode ? "text-[#fafafa]" : "text-[#333333]"
                  }`}
                >
                  <FileText className="h-4 w-4" />
                  Prompt Content
                </h3>
                <div className="flex items-center gap-2">
                  {onEdit && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        onEdit(prompt.id);
                        onOpenChange(false);
                      }}
                      className={`h-7 text-xs ${
                        isDarkMode
                          ? "text-[#a1a1aa] hover:text-[#8b5cf6] hover:bg-[#18181b]"
                          : "text-[#868686] hover:text-[#E11D48] hover:bg-[#f5f5f5]"
                      }`}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopy}
                    className={`h-7 text-xs ${
                      isDarkMode
                        ? "text-[#a1a1aa] hover:text-[#8b5cf6] hover:bg-[#18181b]"
                        : "text-[#868686] hover:text-[#E11D48] hover:bg-[#f5f5f5]"
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="h-3 w-3 mr-1" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3 mr-1" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
              </div>
              <div
                className={`${
                  isDarkMode
                    ? "bg-[#09090b] border-[#27272a]"
                    : "bg-[#fafafa] border-[#e5e5e5]"
                } border rounded-lg p-4 relative group`}
              >
                <pre
                  className={`text-sm whitespace-pre-wrap font-mono leading-relaxed break-words overflow-x-auto max-w-full ${
                    isDarkMode ? "text-[#e5e7eb]" : "text-[#333333]"
                  }`}
                >
                  {prompt.content}
                </pre>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCopy}
                  className={`absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity ${
                    isDarkMode
                      ? "bg-[#18181b] hover:bg-[#27272a] text-[#a1a1aa]"
                      : "bg-white hover:bg-[#f5f5f5] text-[#868686]"
                  }`}
                >
                  {copied ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
              </div>
            </div>

            <Separator className={isDarkMode ? "bg-[#27272a]" : "bg-[#e5e5e5]"} />

            {/* Management Actions */}
            <div>
              <h3
                className={`text-sm mb-3 flex items-center gap-2 ${
                  isDarkMode ? "text-[#fafafa]" : "text-[#333333]"
                }`}
              >
                <Sparkles className="h-4 w-4" />
                Actions
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {onToggleVisibility && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      onToggleVisibility(prompt.id);
                    }}
                    className={`${
                      isDarkMode
                        ? "border-[#27272a] text-[#fafafa] hover:bg-[#18181b]"
                        : "border-[#d4d4d4] text-[#333333] hover:bg-[#f5f5f5]"
                    } justify-start`}
                  >
                    {prompt.isPublic ? (
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
                  </Button>
                )}
                {!prompt.isPublic && onAddToCollection && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      onAddToCollection(prompt.id);
                    }}
                    className={`${
                      isDarkMode
                        ? "border-[#27272a] text-[#fafafa] hover:bg-[#18181b]"
                        : "border-[#d4d4d4] text-[#333333] hover:bg-[#f5f5f5]"
                    } justify-start`}
                  >
                    <FolderOpen className="h-4 w-4 mr-2" />
                    Add to Collection
                  </Button>
                )}
                {onEdit && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      onEdit(prompt.id);
                      onOpenChange(false);
                    }}
                    className={`${
                      isDarkMode
                        ? "border-[#27272a] text-[#fafafa] hover:bg-[#18181b]"
                        : "border-[#d4d4d4] text-[#333333] hover:bg-[#f5f5f5]"
                    } justify-start`}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Prompt
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      onDelete(prompt.id);
                      onOpenChange(false);
                    }}
                    className={`${
                      isDarkMode
                        ? "border-[#27272a] text-[#f87171] hover:bg-[#18181b] hover:border-[#f87171]"
                        : "border-[#d4d4d4] text-[#E11D48] hover:bg-[#f5f5f5] hover:border-[#E11D48]"
                    } justify-start`}
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Delete Prompt
                  </Button>
                )}
              </div>
            </div>

            {/* Use Case Examples */}
            <div
              className={`${
                isDarkMode
                  ? "bg-gradient-to-br from-[#8b5cf6]/5 to-transparent border-[#8b5cf6]/20"
                  : "bg-gradient-to-br from-[#CF0707]/5 to-transparent border-[#CF0707]/20"
              } border rounded-lg p-4`}
            >
              <h3
                className={`text-sm mb-3 flex items-center gap-2 ${
                  isDarkMode ? "text-[#fafafa]" : "text-[#333333]"
                }`}
              >
                <Sparkles className="h-4 w-4" />
                Suggested Use Cases
              </h3>
              <div className="space-y-2">
                {prompt.type === "text" && (
                  <>
                    <div
                      className={`text-sm flex items-start gap-2 ${
                        isDarkMode ? "text-[#a1a1aa]" : "text-[#868686]"
                      }`}
                    >
                      <div
                        className={`h-1.5 w-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                          isDarkMode ? "bg-[#8b5cf6]" : "bg-[#CF0707]"
                        }`}
                      />
                      Blog posts and articles
                    </div>
                    <div
                      className={`text-sm flex items-start gap-2 ${
                        isDarkMode ? "text-[#a1a1aa]" : "text-[#868686]"
                      }`}
                    >
                      <div
                        className={`h-1.5 w-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                          isDarkMode ? "bg-[#8b5cf6]" : "bg-[#CF0707]"
                        }`}
                      />
                      Marketing copy and emails
                    </div>
                    <div
                      className={`text-sm flex items-start gap-2 ${
                        isDarkMode ? "text-[#a1a1aa]" : "text-[#868686]"
                      }`}
                    >
                      <div
                        className={`h-1.5 w-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                          isDarkMode ? "bg-[#8b5cf6]" : "bg-[#CF0707]"
                        }`}
                      />
                      Documentation and guides
                    </div>
                  </>
                )}
                {prompt.type === "video" && (
                  <>
                    <div
                      className={`text-sm flex items-start gap-2 ${
                        isDarkMode ? "text-[#a1a1aa]" : "text-[#868686]"
                      }`}
                    >
                      <div
                        className={`h-1.5 w-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                          isDarkMode ? "bg-[#8b5cf6]" : "bg-[#CF0707]"
                        }`}
                      />
                      YouTube video scripts
                    </div>
                    <div
                      className={`text-sm flex items-start gap-2 ${
                        isDarkMode ? "text-[#a1a1aa]" : "text-[#868686]"
                      }`}
                    >
                      <div
                        className={`h-1.5 w-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                          isDarkMode ? "bg-[#8b5cf6]" : "bg-[#CF0707]"
                        }`}
                      />
                      TikTok and short-form content
                    </div>
                    <div
                      className={`text-sm flex items-start gap-2 ${
                        isDarkMode ? "text-[#a1a1aa]" : "text-[#868686]"
                      }`}
                    >
                      <div
                        className={`h-1.5 w-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                          isDarkMode ? "bg-[#8b5cf6]" : "bg-[#CF0707]"
                        }`}
                      />
                      Educational tutorials
                    </div>
                  </>
                )}
                {prompt.type === "audio" && (
                  <>
                    <div
                      className={`text-sm flex items-start gap-2 ${
                        isDarkMode ? "text-[#a1a1aa]" : "text-[#868686]"
                      }`}
                    >
                      <div
                        className={`h-1.5 w-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                          isDarkMode ? "bg-[#8b5cf6]" : "bg-[#CF0707]"
                        }`}
                      />
                      Podcast episodes
                    </div>
                    <div
                      className={`text-sm flex items-start gap-2 ${
                        isDarkMode ? "text-[#a1a1aa]" : "text-[#868686]"
                      }`}
                    >
                      <div
                        className={`h-1.5 w-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                          isDarkMode ? "bg-[#8b5cf6]" : "bg-[#CF0707]"
                        }`}
                      />
                      Audio advertisements
                    </div>
                    <div
                      className={`text-sm flex items-start gap-2 ${
                        isDarkMode ? "text-[#a1a1aa]" : "text-[#868686]"
                      }`}
                    >
                      <div
                        className={`h-1.5 w-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                          isDarkMode ? "bg-[#8b5cf6]" : "bg-[#CF0707]"
                        }`}
                      />
                      Voice-over scripts
                    </div>
                  </>
                )}
                {prompt.type === "image" && (
                  <>
                    <div
                      className={`text-sm flex items-start gap-2 ${
                        isDarkMode ? "text-[#a1a1aa]" : "text-[#868686]"
                      }`}
                    >
                      <div
                        className={`h-1.5 w-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                          isDarkMode ? "bg-[#8b5cf6]" : "bg-[#CF0707]"
                        }`}
                      />
                      AI art generation
                    </div>
                    <div
                      className={`text-sm flex items-start gap-2 ${
                        isDarkMode ? "text-[#a1a1aa]" : "text-[#868686]"
                      }`}
                    >
                      <div
                        className={`h-1.5 w-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                          isDarkMode ? "bg-[#8b5cf6]" : "bg-[#CF0707]"
                        }`}
                      />
                      Social media graphics
                    </div>
                    <div
                      className={`text-sm flex items-start gap-2 ${
                        isDarkMode ? "text-[#a1a1aa]" : "text-[#868686]"
                      }`}
                    >
                      <div
                        className={`h-1.5 w-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                          isDarkMode ? "bg-[#8b5cf6]" : "bg-[#CF0707]"
                        }`}
                      />
                      Marketing visuals
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
