import {
  Home,
  User,
  Globe,
  Star,
  Settings,
  Bookmark,
  FolderOpen,
  BarChart3,
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Switch } from "./ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface AppSidebarProps {
  isDarkMode: boolean;
  activeView: string;
  onViewChange: (view: string) => void;
  promptCounts: {
    all: number;
    personal: number;
    public: number;
    favorites: number;
    saved: number;
  };
  collectionsCount?: number;
  onOpenSettings?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function AppSidebar({
  isDarkMode,
  activeView,
  onViewChange,
  promptCounts,
  collectionsCount = 0,
  onOpenSettings,
  isCollapsed = false,
  onToggleCollapse,
}: AppSidebarProps) {
  const navGroups = [
    {
      id: "core",
      items: [
        { id: "personal", icon: User, label: "My Prompts", count: promptCounts.personal },
        { id: "all", icon: Home, label: "All Prompts", count: promptCounts.all },
        { id: "public", icon: Globe, label: "Public Library", count: promptCounts.public },
        { id: "favorites", icon: Star, label: "Favorites", count: promptCounts.favorites },
      ],
    },
    {
      id: "collections",
      items: [
        { id: "saved", icon: Bookmark, label: "Saved", count: promptCounts.saved || 0 },
        { id: "collections", icon: FolderOpen, label: "Collections", count: collectionsCount },
      ],
    },
    {
      id: "analytics",
      items: [
        { id: "analytics", icon: BarChart3, label: "Analytics", count: 0 },
      ],
    },
  ];

  return (
    <TooltipProvider>
      <div
        className={`${isCollapsed ? "w-16" : "w-64"} ${
          isDarkMode ? "bg-[#0f0f11] border-[#27272a]" : "bg-white border-[#d4d4d4]"
        } border-r flex flex-col transition-all duration-300 h-full`}
      >
        <div className="flex flex-1 flex-col min-h-0">
          <div className="flex-1 overflow-y-auto">
            <div className={`${isCollapsed ? "px-2" : "px-4"} py-4 space-y-6`}>
              {navGroups.map((group, groupIndex) => (
                <div key={group.id}>
                  <div className="space-y-1">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeView === item.id;
                      const hasCount = item.count > 0;
                      const displayCount = hasCount
                        ? item.count > 99
                          ? "99+"
                          : item.count
                        : null;

                      const buttonElement = (
                        <Button
                          key={item.id}
                          variant="ghost"
                          className={`w-full ${
                            isCollapsed ? "justify-center px-0" : "justify-start gap-3 px-3"
                          } h-10 rounded-xl text-sm transition-colors duration-200 ${
                            isActive
                              ? isDarkMode
                                ? "bg-[#8b5cf6] text-white hover:bg-[#7c3aed] focus-visible:ring-[#8b5cf6]"
                                : "bg-[#E11D48] text-white hover:bg-[#BE123C] focus-visible:ring-[#E11D48]"
                              : isDarkMode
                                ? "text-[#f6f6f8] hover:bg-[#18181b] hover:text-[#fafafa] focus-visible:ring-[#8b5cf6]"
                                : "text-[#1f1f1f] hover:bg-[#f5f5f5] focus-visible:ring-[#E11D48]"
                          }`}
                          onClick={() => onViewChange(item.id)}
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                          {isCollapsed ? (
                            hasCount && (
                              <span
                                className={`text-[11px] font-semibold ${
                                  isDarkMode ? "text-[#c4b5fd]" : "text-[#F97393]"
                                }`}
                              >
                                {displayCount}
                              </span>
                            )
                          ) : (
                            <>
                              <span className="flex-1 text-left">{item.label}</span>
                              {hasCount && (
                                <Badge
                                  variant="secondary"
                                  className={`${
                                    isActive
                                      ? "bg-white/20 text-white"
                                      : isDarkMode
                                        ? "bg-[#18181b] text-[#71717a]"
                                        : "bg-[#f5f5f5] text-[#868686]"
                                  }`}
                                >
                                  {displayCount}
                                </Badge>
                              )}
                            </>
                          )}
                        </Button>
                      );

                      return isCollapsed ? (
                        <Tooltip key={item.id}>
                          <TooltipTrigger asChild>{buttonElement}</TooltipTrigger>
                          <TooltipContent side="right">
                            <p>
                              {item.label}
                              {hasCount && ` (${displayCount})`}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        buttonElement
                      );
                    })}
                  </div>
                  {groupIndex < navGroups.length - 1 && (
                    <Separator
                      className={`my-3 ${isDarkMode ? "bg-[#27272a]" : "bg-[#d4d4d4]"}`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
          <div
            className={`${isCollapsed ? "px-2 py-3" : "px-4 py-4"} border-t ${
              isDarkMode ? "border-[#27272a]" : "border-[#d4d4d4]"
            }`}
          >
            <div
              className={`flex ${
                isCollapsed ? "flex-col items-center gap-2" : "items-center justify-between gap-3"
              }`}
            >
              {onOpenSettings && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size={isCollapsed ? "icon" : undefined}
                      className={`${
                        isCollapsed
                          ? "h-9 w-9"
                          : "h-9 w-full justify-start gap-2 rounded-xl text-sm px-2"
                      } ${isDarkMode ? "text-[#d4d4d8] hover:bg-[#18181b] hover:text-[#fafafa] focus-visible:ring-[#8b5cf6]" : "text-[#333333] hover:bg-[#f5f5f5] focus-visible:ring-[#E11D48]"}`}
                      onClick={onOpenSettings}
                    >
                      <Settings className="h-4 w-4" />
                      {!isCollapsed && <span>Settings</span>}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>Settings</p>
                  </TooltipContent>
                </Tooltip>
              )}
              {onToggleCollapse && (
                <div className="flex items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Switch
                        checked={isCollapsed}
                        onCheckedChange={() => onToggleCollapse?.()}
                        aria-label={isCollapsed ? "Expand sidebar" : "Compact sidebar"}
                      />
                    </TooltipTrigger>
                    <TooltipContent side={isCollapsed ? "right" : "left"}>
                      <p>{isCollapsed ? "Expand sidebar" : "Compact sidebar"}</p>
                    </TooltipContent>
                  </Tooltip>
                  {!isCollapsed && (
                    <span
                      className={`text-xs ${
                        isDarkMode ? "text-[#a1a1aa]" : "text-[#6b6b6b]"
                      }`}
                    >
                      Compact sidebar
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
