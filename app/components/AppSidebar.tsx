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
  Folders,
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
import {
  Image as ImageIcon,
  VideoCamera,
  TextT,
  SpeakerHigh,
  CaretDown,
  CaretRight,
} from "@phosphor-icons/react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { useState, useEffect } from "react";

interface AppSidebarProps {
  isDarkMode: boolean;
  activeView: string;
  onViewChange: (view: string) => void;
  promptCounts: {
    all: number;
    personal: number;
    personalImages: number;
    personalVideos: number;
    personalText: number;
    personalAudio: number;
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
      title: "Private Space",
      id: "private",
      items: [
        { id: "personal", icon: User, label: "My Prompts", count: promptCounts.personal },
        { id: "favorites", icon: Star, label: "Favorites", count: promptCounts.favorites },
        { id: "saved", icon: Bookmark, label: "Saved", count: promptCounts.saved || 0 },
        { id: "collections", icon: Folders, label: "Collections", count: collectionsCount },
      ],
    },
    {
      title: "Global Space",
      id: "global",
      items: [
        { id: "all", icon: House, label: "All Prompts", count: promptCounts.all },
        { id: "public", icon: Globe, label: "Public Library", count: promptCounts.public },
      ],
    },
    {
      title: "Insights",
      id: "tools",
      items: [
        { id: "analytics", icon: ChartBar, label: "Analytics", count: 0 },
      ],
    },
  ];

  const settingsButtonClass = isCollapsed
    ? "h-9 w-9 rounded-full"
    : "h-9 flex-1 min-w-0 justify-start gap-2 rounded-xl text-sm px-2";

  const [isPersonalOpen, setIsPersonalOpen] = useState(true);

  useEffect(() => {
    if (activeView.startsWith("personal")) {
      setIsPersonalOpen(true);
    }
  }, [activeView]);

  return (
    <TooltipProvider>
      <div
        className={`${isCollapsed ? "w-16" : "w-64"} ${
          isDarkMode ? "bg-[#0f0f11] border-[#27272a]" : "bg-white border-[#d4d4d4]"
        } border-r flex flex-col transition-all duration-300 h-full`}
      >
        <div className="flex flex-1 flex-col min-h-0">
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className={`${isCollapsed ? "px-2" : "px-4"} py-6 space-y-8`}>
              {navGroups.map((group) => (
                <div key={group.id} className="space-y-2">
                  {!isCollapsed && group.title && (
                    <h4 className={`px-2 text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "text-[#71717a]" : "text-[#a1a1aa]"}`}>
                      {group.title}
                    </h4>
                  )}
                  <div className="space-y-1">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeView === item.id;
                      const isSubActive = activeView.startsWith(item.id + "-");
                      const hasCount = item.count > 0;
                      const displayCount = hasCount
                        ? item.count > 99
                          ? "99+"
                          : item.count
                        : null;

                      let buttonElement;

                      if (item.id === "personal" && !isCollapsed) {
                        buttonElement = (
                          <Collapsible
                            open={isPersonalOpen}
                            onOpenChange={setIsPersonalOpen}
                            className="space-y-1"
                          >
                            <div className="flex items-center gap-1 group/collapsible">
                              <Button
                                variant="ghost"
                                className={`flex-1 justify-start gap-3 px-3 h-9 rounded-lg text-sm transition-all duration-200 ${
                                  isActive
                                    ? isDarkMode
                                      ? "bg-[#18181b] text-[#fafafa] font-medium"
                                      : "bg-[#f5f5f5] text-[#333333] font-medium"
                                    : isDarkMode
                                    ? "text-[#a1a1aa] hover:bg-[#18181b] hover:text-[#fafafa]"
                                    : "text-[#666666] hover:bg-[#f5f5f5] hover:text-[#333333]"
                                }`}
                                onClick={() => onViewChange("personal")}
                              >
                                <Icon className={`h-4 w-4 shrink-0 ${isActive ? (isDarkMode ? "text-[#8b5cf6]" : "text-[#E11D48]") : ""}`} />
                                <span className="flex-1 text-left">{item.label}</span>
                                {hasCount && (
                                  <span className={`text-xs ${isActive ? (isDarkMode ? "text-[#fafafa]" : "text-[#333333]") : (isDarkMode ? "text-[#52525b]" : "text-[#a1a1aa]")}`}>
                                    {displayCount}
                                  </span>
                                )}
                              </Button>
                              <CollapsibleTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className={`h-9 w-6 rounded-lg ${
                                    isDarkMode
                                      ? "text-[#52525b] hover:text-[#fafafa] hover:bg-[#18181b]"
                                      : "text-[#a1a1aa] hover:text-[#333333] hover:bg-[#f5f5f5]"
                                  }`}
                                >
                                  {isPersonalOpen ? (
                                    <CaretDown className="h-3 w-3" />
                                  ) : (
                                    <CaretRight className="h-3 w-3" />
                                  )}
                                </Button>
                              </CollapsibleTrigger>
                            </div>
                            <CollapsibleContent className="space-y-0.5 relative">
                              {[
                                { id: "personal-image", icon: ImageIcon, label: "Images", count: promptCounts.personalImages },
                                { id: "personal-video", icon: VideoCamera, label: "Videos", count: promptCounts.personalVideos },
                                { id: "personal-audio", icon: SpeakerHigh, label: "Audio", count: promptCounts.personalAudio },
                                { id: "personal-text", icon: TextT, label: "Text", count: promptCounts.personalText },
                              ].map((subItem) => (
                                <Button
                                  key={subItem.id}
                                  variant="ghost"
                                  onClick={() => onViewChange(subItem.id)}
                                  className={`w-full relative justify-start gap-3 pl-8 pr-3 h-8 rounded-lg text-sm transition-colors ${
                                    activeView === subItem.id
                                      ? isDarkMode
                                        ? "bg-transparent text-[#fafafa] font-medium"
                                        : "bg-transparent text-[#333333] font-medium"
                                      : isDarkMode
                                      ? "text-[#71717a] hover:text-[#fafafa] hover:bg-[#18181b]/50"
                                      : "text-[#868686] hover:text-[#333333] hover:bg-[#f5f5f5]/50"
                                  }`}
                                >
                                  <subItem.icon className={`h-3.5 w-3.5 shrink-0 ${activeView === subItem.id ? (isDarkMode ? "text-[#8b5cf6]" : "text-[#E11D48]") : ""}`} />
                                  <span className="flex-1 text-left text-xs">{subItem.label}</span>
                                  {subItem.count > 0 && (
                                     <span className={`text-[10px] ${activeView === subItem.id ? (isDarkMode ? "text-[#fafafa]" : "text-[#333333]") : (isDarkMode ? "text-[#52525b]" : "text-[#a1a1aa]")}`}>
                                        {subItem.count}
                                     </span>
                                  )}
                                </Button>
                              ))}
                            </CollapsibleContent>
                          </Collapsible>
                        );
                      } else {
                        buttonElement = (
                          <Button
                            key={item.id}
                            variant="ghost"
                            className={`w-full ${
                              isCollapsed ? "justify-center px-0" : "justify-start gap-3 px-3"
                            } h-9 rounded-lg text-sm transition-all duration-200 ${
                              isActive
                                ? isDarkMode
                                  ? "bg-[#18181b] text-[#fafafa] font-medium"
                                  : "bg-[#f5f5f5] text-[#333333] font-medium"
                                : isDarkMode
                                  ? "text-[#a1a1aa] hover:bg-[#18181b] hover:text-[#fafafa]"
                                  : "text-[#666666] hover:bg-[#f5f5f5] hover:text-[#333333]"
                            }`}
                            onClick={() => onViewChange(item.id)}
                          >
                            <Icon className={`h-4 w-4 shrink-0 ${isActive && !isCollapsed ? (isDarkMode ? "text-[#8b5cf6]" : "text-[#E11D48]") : ""}`} />
                            {isCollapsed ? (
                              hasCount && (
                                <span className={`absolute top-1 right-1 h-2 w-2 rounded-full ${isDarkMode ? "bg-[#8b5cf6]" : "bg-[#E11D48]"}`} />
                              )
                            ) : (
                              <>
                                <span className="flex-1 text-left">{item.label}</span>
                                {hasCount && (
                                  <span className={`text-xs ${isActive ? (isDarkMode ? "text-[#fafafa]" : "text-[#333333]") : (isDarkMode ? "text-[#52525b]" : "text-[#a1a1aa]")}`}>
                                    {displayCount}
                                  </span>
                                )}
                              </>
                            )}
                          </Button>
                        );
                      }

                      return isCollapsed ? (
                        <Tooltip key={item.id}>
                          <TooltipTrigger asChild>{buttonElement}</TooltipTrigger>
                          <TooltipContent side="right" className={`flex items-center gap-2 ${isDarkMode ? "bg-[#18181b] text-[#fafafa] border-[#27272a]" : "bg-white text-[#333333] border-[#e5e5e5]"}`}>
                            <p>{item.label}</p>
                            {hasCount && <span className={`text-xs ${isDarkMode ? "text-[#a1a1aa]" : "text-[#868686]"}`}>{displayCount}</span>}
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        buttonElement
                      );
                    })}
                  </div>
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
