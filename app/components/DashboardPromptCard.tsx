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
} from "lucide-react";
import { ModelIcon } from "./ModelIcon";
import { motion } from "motion/react";

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
  isLiked: boolean;
  isSaved: boolean;
  isPublic: boolean;
  createdAt: string;
  content: string;
  isDarkMode?: boolean;
}

export function DashboardPromptCard({
  title,
  description,
  model,
  type,
  tags,
  likes,
  isLiked,
  isSaved,
  isPublic,
  content,
  isDarkMode = false,
}: DashboardPromptCardProps) {
  const TypeIcon = TYPE_ICONS[type];

  return (
    <Card
      className={`group relative overflow-hidden ${
        isDarkMode
          ? "bg-[#0f0f11] border-[#27272a] hover:border-[#8b5cf6]"
          : "bg-white border-[#d4d4d4] hover:border-[#CF0707]"
      } hover:shadow-lg transition-all duration-200 cursor-pointer`}
    >
      {/* Hover effect line */}
      <motion.div
        className={`absolute left-0 top-0 bottom-0 w-1 ${
          isDarkMode ? "bg-[#8b5cf6]" : "bg-[#CF0707]"
        }`}
        initial={{ scaleY: 0 }}
        whileHover={{ scaleY: 1 }}
        transition={{ duration: 0.2 }}
      />

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <TypeIcon
              className={`h-4 w-4 flex-shrink-0 ${
                isDarkMode ? "text-[#8b5cf6]" : "text-[#CF0707]"
              }`}
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
            <ModelIcon model={model} size={16} />
            <Badge
              variant="outline"
              className={`text-xs ${
                isPublic
                  ? isDarkMode
                    ? "border-[#8b5cf6]/30 text-[#8b5cf6]"
                    : "border-[#CF0707]/30 text-[#CF0707]"
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
          className={`text-xs mb-3 line-clamp-2 ${
            isDarkMode ? "text-[#a1a1aa]" : "text-[#868686]"
          }`}
        >
          {description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {tags.slice(0, 3).map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className={`text-xs px-2 py-0.5 ${
                isDarkMode
                  ? "bg-[#18181b] text-[#a1a1aa] border-[#27272a]"
                  : "bg-[#f5f5f5] text-[#868686] border-[#e5e5e5]"
              }`}
            >
              {tag}
            </Badge>
          ))}
        </div>

        {/* Image Preview for image prompts */}
        {type === 'image' && content && (content.startsWith('http') || content.startsWith('blob:')) && (
          <div className="relative mb-3 group/img overflow-hidden rounded-xl border border-border/50">
            <img
              src={content}
              alt={title}
              className="w-full h-40 object-cover transition-transform duration-500 group-hover/img:scale-105"
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
                      : "text-[#CF0707] fill-[#CF0707]"
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

            <motion.div whileHover={{ scale: 1.1 }}>
              <Bookmark
                className={`h-3.5 w-3.5 ${
                  isSaved
                    ? isDarkMode
                      ? "text-[#8b5cf6] fill-[#8b5cf6]"
                      : "text-[#CF0707] fill-[#CF0707]"
                    : isDarkMode
                    ? "text-[#71717a]"
                    : "text-[#868686]"
                }`}
              />
            </motion.div>
          </div>

          <motion.div
            className={`text-xs ${
              isDarkMode ? "text-[#52525b]" : "text-[#a1a1aa]"
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {model}
          </motion.div>
        </div>
      </div>

      {/* Animated gradient overlay on hover */}
      <motion.div
        className={`absolute inset-0 ${
          isDarkMode
            ? "bg-gradient-to-br from-[#8b5cf6]/5 to-transparent"
            : "bg-gradient-to-br from-[#CF0707]/5 to-transparent"
        } opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`}
      />
    </Card>
  );
}
