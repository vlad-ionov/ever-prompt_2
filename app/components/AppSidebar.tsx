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
        className={`relative ${isCollapsed ? "w-20" : "w-64"} ${
          isDarkMode 
            ? "bg-[#09090b]/80 border-[#27272a] supports-[backdrop-filter]:bg-[#09090b]/40" 
            : "bg-white/80 border-[#e5e5e5] supports-[backdrop-filter]:bg-white/40"
        } border-r flex flex-col transition-all duration-500 h-full backdrop-blur-xl group/sidebar shadow-xl`}
      >
        {/* Subtle background glow for dark mode */}
        {isDarkMode && (
          <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none opacity-50" />
        )}
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
                                className={`flex-1 justify-start gap-3 px-3 h-10 rounded-xl text-sm transition-all duration-300 group/navitem ${
                                  isActive
                                    ? isDarkMode
                                      ? "bg-[#18181b] text-white font-semibold shadow-inner ring-1 ring-white/10"
                                      : "bg-slate-100 text-[#0f172a] font-semibold shadow-sm ring-1 ring-slate-200"
                                    : isDarkMode
                                    ? "text-[#a1a1aa] hover:bg-[#18181b]/60 hover:text-white"
                                    : "text-[#64748b] hover:bg-slate-50 hover:text-[#0f172a]"
                                }`}
                                onClick={() => onViewChange("personal")}
                              >
                                <div className={`p-1.5 rounded-lg transition-colors duration-300 ${isActive ? (isDarkMode ? "bg-[#8b5cf6]/20 text-[#8b5cf6]" : "bg-[#E11D48]/10 text-[#E11D48]") : (isDarkMode ? "bg-transparent group-hover/navitem:bg-[#18181b]" : "bg-transparent group-hover/navitem:bg-slate-100")}`}>
                                  <Icon className="h-4 w-4 shrink-0" weight={isActive ? "bold" : "regular"} />
                                </div>
                                <span className="flex-1 text-left">{item.label}</span>
                                {hasCount && (
                                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium transition-colors ${isActive ? (isDarkMode ? "bg-[#8b5cf6]/20 text-[#8b5cf6]" : "bg-[#E11D48]/10 text-[#E11D48]") : (isDarkMode ? "bg-[#18181b] text-[#52525b]" : "bg-slate-100 text-[#94a3b8]")}`}>
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
                                  className={`w-full relative justify-start gap-3 pl-10 pr-3 h-9 rounded-xl text-sm transition-all duration-300 group/subnav ${
                                    activeView === subItem.id
                                      ? isDarkMode
                                        ? "text-white font-medium bg-white/5"
                                        : "text-[#0f172a] font-medium bg-slate-50"
                                      : isDarkMode
                                      ? "text-[#71717a] hover:text-white hover:bg-white/5"
                                      : "text-[#64748b] hover:text-[#0f172a] hover:bg-slate-50"
                                  }`}
                                >
                                  <div className={`p-1 rounded-md transition-colors ${activeView === subItem.id ? (isDarkMode ? "text-[#8b5cf6]" : "text-[#E11D48]") : "text-current"}`}>
                                    <subItem.icon className="h-3.5 w-3.5 shrink-0" weight={activeView === subItem.id ? "bold" : "regular"} />
                                  </div>
                                  <span className="flex-1 text-left text-[11px] tracking-wide uppercase font-semibold opacity-80 group-hover/subnav:opacity-100">{subItem.label}</span>
                                  {subItem.count > 0 && (
                                     <span className={`text-[10px] font-bold ${activeView === subItem.id ? (isDarkMode ? "text-[#8b5cf6]" : "text-[#E11D48]") : "opacity-40"}`}>
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
                            className={`w-full group/navitem relative ${
                              isCollapsed ? "justify-center px-0" : "justify-start gap-3 px-3"
                            } h-10 rounded-xl text-sm transition-all duration-300 ${
                              isActive
                                ? isDarkMode
                                  ? "bg-[#18181b] text-white font-semibold shadow-inner ring-1 ring-white/10"
                                  : "bg-slate-100 text-[#0f172a] font-semibold shadow-sm ring-1 ring-slate-200"
                                : isDarkMode
                                  ? "text-[#a1a1aa] hover:bg-[#18181b]/60 hover:text-white"
                                  : "text-[#64748b] hover:bg-slate-50 hover:text-[#0f172a]"
                            }`}
                            onClick={() => onViewChange(item.id)}
                          >
                            <div className={`p-1.5 rounded-lg transition-colors duration-300 ${isActive && !isCollapsed ? (isDarkMode ? "bg-[#8b5cf6]/20 text-[#8b5cf6]" : "bg-[#E11D48]/10 text-[#E11D48]") : (isDarkMode ? "bg-transparent group-hover/navitem:bg-[#18181b]" : "bg-transparent group-hover/navitem:bg-slate-100")}`}>
                              <Icon className="h-4 w-4 shrink-0" weight={isActive ? "bold" : "regular"} />
                            </div>
                            {isCollapsed ? (
                              hasCount && (
                                <span className={`absolute top-2 right-2 h-2 w-2 rounded-full ring-2 ${isDarkMode ? "bg-[#8b5cf6] ring-[#09090b]" : "bg-[#E11D48] ring-white"}`} />
                              )
                            ) : (
                              <>
                                <span className="flex-1 text-left">{item.label}</span>
                                {hasCount && (
                                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium transition-colors ${isActive ? (isDarkMode ? "bg-[#8b5cf6]/20 text-[#8b5cf6]" : "bg-[#E11D48]/10 text-[#E11D48]") : (isDarkMode ? "bg-[#18181b] text-[#52525b]" : "bg-slate-100 text-[#94a3b8]")}`}>
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
            className={`${isCollapsed ? "px-3 py-4" : "px-4 py-4"} border-t ${
              isDarkMode ? "border-white/5 bg-white/[0.02]" : "border-slate-200 bg-slate-50/50"
            } mt-auto transition-colors duration-300`}
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
                      className={`h-10 transition-all duration-300 ${isCollapsed ? "w-10 rounded-xl" : "flex-1 min-w-0 justify-start gap-3 px-3 rounded-xl text-sm font-medium"} ${
                        isDarkMode
                          ? "text-[#a1a1aa] hover:bg-white/5 hover:text-white"
                          : "text-[#64748b] hover:bg-slate-100 hover:text-[#0f172a]"
                      }`}
                      onClick={onOpenSettings}
                    >
                      <Gear className="h-4 w-4" weight="regular" />
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
                        className={`h-10 w-10 rounded-xl border-0 transition-all duration-300 justify-center items-center flex relative overflow-hidden group/collapse ${
                          isDarkMode
                            ? "bg-[#18181b] text-white hover:bg-[#27272a]"
                            : "bg-slate-100 text-[#0f172a] hover:bg-slate-200"
                        }`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-transparent opacity-0 group-hover/collapse:opacity-100 transition-opacity" />
                        <CaretDoubleLeft
                          size={16}
                          weight="bold"
                          className={`transition-transform duration-500 relative z-10 ${
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
