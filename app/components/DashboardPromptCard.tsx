import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import {
  Heart,
  Bookmark,
  Video,
  Music,
  Image as ImageIcon,
  FileText,
  Lock,
  Globe,
  Eye,
} from "lucide-react";
import { ModelIcon } from "./ModelIcon";
import { motion } from "motion/react";
import { Link } from "@remix-run/react";

const TYPE_ICONS = {
  video: Video,
  audio: Music,
  image: ImageIcon,
  text: FileText,
};

interface DashboardPromptCardProps {
  id: string;
  title: string;
  description: string;
  model: string;
  type: "video" | "audio" | "image" | "text";
  tags: string[];
  likes: number;
  views: number;
  isLiked: boolean;
  isSaved: boolean;
  isPublic: boolean;
  createdAt: string;
  content: string;
  isDarkMode?: boolean;
  author?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
}

export function DashboardPromptCard({
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
  content,
  isDarkMode = false,
  author,
  createdAt,
}: DashboardPromptCardProps) {
  const TypeIcon = TYPE_ICONS[type];

  return (
    <Card
      className={`group relative overflow-hidden transition-all duration-300 cursor-pointer border-none ${
        isDarkMode
          ? "bg-[#0f0f11] shadow-[var(--shadow-elevated)] hover:shadow-[var(--shadow-floating)] hover:border-[#8b5cf6]/50"
          : "bg-white shadow-[var(--shadow-elevated)] hover:shadow-[var(--shadow-floating)] active:shadow-[var(--shadow-elevated)]"
      }`}
    >
      {/* Hover effect line */}
      <motion.div
        className={`absolute left-0 top-0 bottom-0 w-1 ${
          isDarkMode ? "bg-[#8b5cf6]" : "bg-[#111111]"
        }`}
        initial={{ scaleY: 0 }}
        whileHover={{ scaleY: 1 }}
        transition={{ duration: 0.2 }}
      />

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <TypeIcon
              className={`h-4 w-4 flex-shrink-0 ${isDarkMode ? "text-[#8b5cf6]" : "text-[#111111]"}`}
            />
            <h3
              className={`text-sm truncate ${
                isDarkMode ? "text-[#fafafa]" : "text-[#333333]"
              }`}
            >
              {title}
            </h3>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <ModelIcon model={model} size={16} isDarkMode={isDarkMode} />
            <Badge
              variant="outline"
              className={`text-xs ${
                isPublic
                  ? isDarkMode
                    ? "border-[#8b5cf6]/30 text-[#8b5cf6]"
                    : "border-[#111111]/30 text-[#111111]"
                  : isDarkMode
                  ? "border-[#71717a] text-[#71717a]"
                  : "border-[#868686] text-[#868686]"
              }`}
            >
              {isPublic ? <Globe className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
            </Badge>
          </div>
        </div>

        {/* Description */}
        <p
          className={`text-[13px] mb-2 line-clamp-3 leading-snug ${
            isDarkMode ? "text-[#a1a1aa]" : "text-[#868686]"
          }`}
        >
          {description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-2">
          {tags.slice(0, 3).map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className={`text-[10px] px-1.5 py-0 ${
                isDarkMode
                  ? "bg-[#18181b] text-[#71717a] border-[#27272a]"
                  : "bg-white text-[#868686] border-[#e5e5e5]"
              }`}
            >
              {tag}
            </Badge>
          ))}
        </div>

        {/* Image Preview for image prompts */}
        {type === 'image' && content && (content.startsWith('http') || content.startsWith('blob:')) && (
          <div className="relative mb-2 group/img overflow-hidden rounded-xl border border-border/50">
            <img
              src={content}
              alt={title}
              className="w-full h-32 object-cover transition-transform duration-500 group-hover/img:scale-105"
            />
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              className="flex items-center gap-1.5"
              whileHover={{ scale: 1.1 }}
            >
              <Heart
                className={`h-3.5 w-3.5 ${
                  isLiked
                    ? isDarkMode
                      ? "text-[#8b5cf6] fill-[#8b5cf6]"
                      : "text-[#111111] fill-[#111111]"
                    : isDarkMode
                    ? "text-[#71717a]"
                    : "text-[#868686]"
                }`}
              />
              <span
                className={`text-xs ${
                  isDarkMode ? "text-[#a1a1aa]" : "text-[#868686]"
                }`}
              >
                {likes}
              </span>
            </motion.div>
            
            {isPublic && (
              <div className="flex items-center gap-1.5 opacity-60">
                <Eye className={`h-3.5 w-3.5 ${isDarkMode ? "text-[#71717a]" : "text-[#868686]"}`} />
                <span className={`text-xs ${isDarkMode ? "text-[#a1a1aa]" : "text-[#868686]"}`}>
                  {views}
                </span>
              </div>
            )}

            <motion.div whileHover={{ scale: 1.1 }}>
              <Bookmark
                className={`h-3.5 w-3.5 ${
                  isSaved
                    ? isDarkMode
                      ? "text-[#8b5cf6] fill-[#8b5cf6]"
                      : "text-[#111111] fill-[#111111]"
                    : isDarkMode
                    ? "text-[#71717a]"
                    : "text-[#868686]"
                }`}
              />
            </motion.div>
          </div>

          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {isPublic && author ? (
              <Link 
                to={`/app/profiles/${author.id}`}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <div className={`h-5 w-5 rounded-full overflow-hidden border ${isDarkMode ? "border-[#27272a]" : "border-gray-200"}`}>
                  <img 
                    src={author.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${author.email}`} 
                    alt={author.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className={`text-xs font-medium ${isDarkMode ? "text-[#71717a]" : "text-[#333333]"}`}>
                  {author.name}
                </span>
              </Link>
            ) : (
              <span className={`text-xs font-medium ${isDarkMode ? "text-[#71717a]" : "text-[#a1a1aa]"}`}>
                {createdAt}
              </span>
            )}
          </motion.div>
        </div>
      </div>

      {/* Animated gradient overlay on hover */}
      <motion.div
        className={`absolute inset-0 ${
          isDarkMode
            ? "bg-gradient-to-br from-[#8b5cf6]/5 to-transparent"
            : "bg-gradient-to-br from-[#111111]/5 to-transparent"
        } opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`}
      />
    </Card>
  );
}
