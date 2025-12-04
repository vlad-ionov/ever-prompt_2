import {
  House,
  User,
  Globe,
  Star,
  Gear,
  Bookmark,
  FolderOpen,
  ChartBar,
  CaretDoubleLeft,
} from "@phosphor-icons/react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
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
        { id: "all", icon: House, label: "All Prompts", count: promptCounts.all },
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
        { id: "analytics", icon: ChartBar, label: "Analytics", count: 0 },
      ],
    },
  ];

  const settingsButtonClass = isCollapsed
    ? "h-9 w-9 rounded-full"
    : "h-9 flex-1 min-w-0 justify-start gap-2 rounded-xl text-sm px-2";

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
            } min-h-[72px]`}
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
                      className={`${settingsButtonClass} ${
                        isDarkMode
                          ? "text-[#d4d4d8] hover:bg-[#18181b] hover:text-[#fafafa] focus-visible:ring-[#8b5cf6]"
                          : "text-[#333333] hover:bg-[#f5f5f5] focus-visible:ring-[#E11D48]"
                      }`}
                      onClick={onOpenSettings}
                    >
                      <Gear className="h-4 w-4" />
                      {!isCollapsed && <span>Settings</span>}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>Settings</p>
                  </TooltipContent>
                </Tooltip>
              )}
              {onToggleCollapse && (
                <div className="flex items-center gap-2 justify-center">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        aria-label={isCollapsed ? "Expand sidebar" : "Compact sidebar"}
                        onClick={() => onToggleCollapse?.()}
                        className={`h-9 w-9 rounded-full border transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 justify-center items-center flex ${
                          isDarkMode
                            ? "border-[#27272a] bg-[#121217] text-[#f6f6f8] hover:border-[#8b5cf6] hover:bg-[#18181b] focus-visible:ring-[#8b5cf6]"
                            : "border-[#d4d4d4] bg-white text-[#1f1f1f] hover:border-[#E11D48] hover:bg-[#fef2f2] focus-visible:ring-[#E11D48]"
                        }`}
                      >
                      <CaretDoubleLeft
                        size={16}
                        weight="thin"
                        className={`transition-transform duration-200 ${
                          isCollapsed ? "rotate-180" : ""
                        }`}
                      />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{isCollapsed ? "Expand sidebar" : "Compact sidebar"}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
