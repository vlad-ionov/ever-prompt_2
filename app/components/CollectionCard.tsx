import type { MouseEvent } from "react";

import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import {
  MoreVertical,
  FolderOpen,
  Lock,
  Edit,
  Trash,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { motion } from "motion/react";

interface CollectionCardProps {
  id: string;
  name: string;
  description: string;
  promptCount: number;
  createdAt: string;
  updatedAt: string;
  isDarkMode?: boolean;
  viewMode?: "grid" | "list" | "table";
  onClick?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function CollectionCard({
  id,
  name,
  description,
  promptCount,
  createdAt,
  updatedAt,
  isDarkMode = false,
  viewMode = "grid",
  onClick,
  onEdit,
  onDelete,
}: CollectionCardProps) {
  const handleClick = () => {
    onClick?.(id);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(id);
  };

  if (viewMode === "list") {
    return (
      <Card
        className={`group relative overflow-hidden transition-all duration-300 cursor-pointer border flex flex-col ${
          isDarkMode
            ? "bg-[#0f0f12]/40 backdrop-blur-xl border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:border-violet-500/40"
            : "bg-white/80 backdrop-blur-md border-slate-200 shadow-[var(--shadow-elevated)] hover:shadow-[var(--shadow-floating)]"
        }`}
        onClick={handleClick}
      >
        <div className="p-4 flex items-center gap-4">
          {/* Icon */}
          <div
            className={`p-3 rounded-xl transition-all ${
              isDarkMode
                ? "bg-gradient-to-br from-[#8b5cf6]/10 to-[#a78bfa]/5 border-[#8b5cf6]/20"
                : "bg-white shadow-none border border-slate-200/50"
            }`}
          >
            <FolderOpen
              className={`h-6 w-6 ${isDarkMode ? "text-[#8b5cf6]" : "text-[#111111]"}`}
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3
                className={`truncate ${
                  isDarkMode ? "text-[#fafafa]" : "text-[#333333]"
                }`}
              >
                {name}
              </h3>
              <Badge
                variant="secondary"
                className={`flex-shrink-0 ${
                  isDarkMode
                    ? "bg-[#18181b] text-[#a1a1aa] border-[#27272a]"
                    : "bg-white text-[#868686] border-[#e5e5e5]"
                }`}
              >
                <Lock className="h-3 w-3 mr-1" />
                Private
              </Badge>
            </div>
            <p
              className={`text-sm truncate ${
                isDarkMode ? "text-[#a1a1aa]" : "text-[#868686]"
              }`}
            >
              {description}
            </p>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 flex-shrink-0">
            <div className="text-center">
              <p
                className={`text-2xl ${
                  isDarkMode ? "text-[#fafafa]" : "text-[#333333]"
                }`}
              >
                {promptCount}
              </p>
              <p
                className={`text-xs ${
                  isDarkMode ? "text-[#71717a]" : "text-[#868686]"
                }`}
              >
                prompts
              </p>
            </div>

            {/* Actions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`${
                    isDarkMode
                      ? "hover:bg-[#18181b] text-[#a1a1aa]"
                      : "hover:bg-white text-[#868686]"
                  }`}
                  onClick={(event: MouseEvent<HTMLButtonElement>) =>
                    event.stopPropagation()
                  }
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className={
                  isDarkMode
                    ? "bg-[#0f0f11] border-[#27272a]"
                    : "bg-white border-[#d4d4d4]"
                }
              >
                <DropdownMenuItem
                  onClick={handleEdit}
                  className={
                    isDarkMode
                      ? "text-[#fafafa] hover:bg-[#18181b]"
                      : "text-[#333333] hover:bg-white"
                  }
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Collection
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleDelete}
                  className={
                    isDarkMode
                      ? "text-[#ef4444] hover:bg-[#18181b]"
                      : "text-[#ef4444] hover:bg-white"
                  }
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Delete Collection
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </Card>
    );
  }

  // Grid view
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={`group relative overflow-hidden transition-all duration-300 cursor-pointer h-full border ${
          isDarkMode
            ? "bg-[#0f0f12]/40 backdrop-blur-xl border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:border-violet-500/50"
            : "bg-white border-slate-200 shadow-[var(--shadow-elevated)] hover:shadow-[var(--shadow-floating)]"
        }`}
        onClick={handleClick}
      >
        {/* Liquid Glass Inner Glow */}
        {isDarkMode && (
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/[0.02] to-transparent opacity-50" />
        )}
        {/* Hover effect gradient */}
        <motion.div
          className={`absolute inset-0 ${
            isDarkMode
              ? "bg-gradient-to-br from-[#8b5cf6]/5 to-transparent"
            : "bg-gradient-to-br from-[#111111]/5 to-transparent"
          } opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`}
        />

        {/* Hover accent line */}
        <motion.div
          className={`absolute left-0 top-0 bottom-0 w-1 ${
            isDarkMode ? "bg-[#8b5cf6]" : "bg-[#111111]"
          }`}
          initial={{ scaleY: 0 }}
          whileHover={{ scaleY: 1 }}
          transition={{ duration: 0.2 }}
        />

        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div
              className={`p-3 rounded-xl transition-all ${
                isDarkMode
                  ? "bg-gradient-to-br from-[#8b5cf6]/10 to-[#a78bfa]/5 border-[#8b5cf6]/20"
                  : "bg-white shadow-none border border-slate-200/50"
              }`}
            >
              <FolderOpen
                className={`h-6 w-6 ${isDarkMode ? "text-[#8b5cf6]" : "text-[#111111]"}`}
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`${
                    isDarkMode
                      ? "hover:bg-[#18181b] text-[#a1a1aa]"
                      : "hover:bg-white text-[#868686]"
                  }`}
                  onClick={(event: MouseEvent<HTMLButtonElement>) =>
                    event.stopPropagation()
                  }
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className={
                  isDarkMode
                    ? "bg-[#0f0f11] border-[#27272a]"
                    : "bg-white border-[#d4d4d4]"
                }
              >
                <DropdownMenuItem
                  onClick={handleEdit}
                  className={
                    isDarkMode
                      ? "text-[#fafafa] hover:bg-[#18181b]"
                      : "text-[#333333] hover:bg-white"
                  }
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Collection
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleDelete}
                  className={
                    isDarkMode
                      ? "text-[#ef4444] hover:bg-[#18181b]"
                      : "text-[#ef4444] hover:bg-white"
                  }
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Delete Collection
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Title and Description */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <h3
                className={`line-clamp-1 ${
                  isDarkMode ? "text-[#fafafa]" : "text-[#333333]"
                }`}
              >
                {name}
              </h3>
            </div>
            <p
              className={`text-sm line-clamp-2 ${
                isDarkMode ? "text-[#a1a1aa]" : "text-[#868686]"
              }`}
            >
              {description}
            </p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-opacity-50"
            style={{
              borderColor: isDarkMode ? '#27272a' : '#e5e5e5'
            }}
          >
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className={`${
                  isDarkMode
                    ? "bg-[#18181b] text-[#a1a1aa] border-[#27272a]"
                    : "bg-white text-[#868686] border-[#e5e5e5]"
                }`}
              >
                <Lock className="h-3 w-3 mr-1" />
                Private
              </Badge>
            </div>
            <div className="text-right">
              <p
                className={`text-2xl ${
                  isDarkMode ? "text-[#fafafa]" : "text-[#333333]"
                }`}
              >
                {promptCount}
              </p>
              <p
                className={`text-xs ${
                  isDarkMode ? "text-[#71717a]" : "text-[#868686]"
                }`}
              >
                prompts
              </p>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
