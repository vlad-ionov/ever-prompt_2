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
  ChartPie,
  CaretDown,
  CaretRight,
  Heart,
  Palette,
  Image as ImageIcon,
  VideoCamera,
  TextT,
  SpeakerHigh,
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
    publicImages: number;
    publicVideos: number;
    publicText: number;
    publicAudio: number;
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
  const [isPersonalOpen, setIsPersonalOpen] = useState(false);
  const [isPublicOpen, setIsPublicOpen] = useState(false);


  const navGroups = [
    {
      title: "Private Space",
      id: "private",
      items: [
        { id: "personal", icon: User, label: "My Library", count: promptCounts.personal },
        { id: "favorites", icon: Heart, label: "Liked", count: promptCounts.favorites },
        { id: "saved", icon: Bookmark, label: "Saved", count: promptCounts.saved || 0 },
        { id: "collections", icon: Folders, label: "Collections", count: collectionsCount },
      ],
    },
    {
      title: "Global Space",
      id: "global",
      items: [
        { id: "all", icon: House, label: "Feed", count: promptCounts.all },
        { id: "public", icon: Globe, label: "Public Library", count: promptCounts.public },
      ],
    },
    {
      title: "Insights",
      id: "tools",
      items: [
        { id: "analytics", icon: ChartPie, label: "Analytics", count: 0 },
      ],
    },
  ];

  const renderNavButton = (item: any) => {
    const Icon = item.icon;
    const isActive = activeView === item.id;
    const hasCount = item.count > 0;
    const displayCount = hasCount ? (item.count > 99 ? "99+" : item.count) : null;

    if ((item.id === "personal" || item.id === "public") && !isCollapsed) {
      const isOpen = item.id === "personal" ? isPersonalOpen : isPublicOpen;
      const setIsOpen = item.id === "personal" ? setIsPersonalOpen : setIsPublicOpen;
      const subItems = item.id === "personal" ? [
        { id: "personal-text", icon: TextT, label: "Text", count: promptCounts.personalText },
        { id: "personal-image", icon: ImageIcon, label: "Images", count: promptCounts.personalImages },
        { id: "personal-video", icon: VideoCamera, label: "Videos", count: promptCounts.personalVideos },
        { id: "personal-audio", icon: SpeakerHigh, label: "Audio", count: promptCounts.personalAudio },
      ] : [
        { id: "public-text", icon: TextT, label: "Text", count: promptCounts.publicText },
        { id: "public-image", icon: ImageIcon, label: "Images", count: promptCounts.publicImages },
        { id: "public-video", icon: VideoCamera, label: "Videos", count: promptCounts.publicVideos },
        { id: "public-audio", icon: SpeakerHigh, label: "Audio", count: promptCounts.publicAudio },
      ];

      const groupColor = item.id === "personal" ? "purple" : "blue";

      return (
        <Collapsible key={item.id} open={isOpen} onOpenChange={setIsOpen} className="space-y-1">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              className={`flex-1 justify-start gap-3 px-3 h-10 rounded-xl text-sm transition-all duration-300 ${
                isActive
                  ? (isDarkMode ? "bg-[#1e293b] text-white font-semibold ring-1 ring-white/10" : "bg-[#f1f5f9] text-[#0f172a] font-bold")
                  : (isDarkMode ? "text-[#94a3b8] hover:bg-[#1e293b]/60 hover:text-white" : "text-[#64748b] hover:bg-slate-100 hover:text-[#0f172a]")
              }`}
              onClick={() => onViewChange(item.id)}
            >
              <div className={`p-1.5 rounded-lg transition-colors ${isActive ? (isDarkMode ? `text-${groupColor}-400` : `text-${groupColor}-600`) : "text-current"}`}>
                <Icon className="h-4 w-4 shrink-0" weight={isActive ? "bold" : "regular"} />
              </div>
              <span className="flex-1 text-left">{item.label}</span>
              {hasCount && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium ${isActive ? (isDarkMode ? `bg-${groupColor}-500/20 text-${groupColor}-400` : `bg-${groupColor}-100 text-${groupColor}-700`) : (isDarkMode ? "bg-zinc-800 text-zinc-500" : "bg-slate-100 text-slate-400")}`}>
                  {displayCount}
                </span>
              )}
            </Button>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-6 rounded-lg opacity-40 hover:opacity-100">
                {isOpen ? <CaretDown className="h-3 w-3" /> : <CaretRight className="h-3 w-3" />}
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="space-y-0.5 ml-4 border-l border-zinc-800/50 pl-2">
            {subItems.map((subItem) => (
              <Button
                key={subItem.id}
                variant="ghost"
                onClick={() => onViewChange(subItem.id)}
                className={`w-full justify-start gap-2 px-3 h-8 rounded-lg text-[11px] uppercase tracking-wider font-semibold transition-all ${
                  activeView === subItem.id
                    ? (isDarkMode ? "text-white bg-white/5" : "text-[#0f172a] bg-[#f1f5f9]")
                    : (isDarkMode ? "text-slate-500 hover:text-white" : "text-slate-500 hover:text-slate-900")
                }`}
              >
                <subItem.icon className="h-3.5 w-3.5" weight={activeView === subItem.id ? "bold" : "regular"} />
                <span className="flex-1 text-left">{subItem.label}</span>
                {subItem.count > 0 && <span className="opacity-40">{subItem.count}</span>}
              </Button>
            ))}
          </CollapsibleContent>
        </Collapsible>
      );
    }

    const buttonElement = (
      <Button
        variant="ghost"
        className={`w-full group/navitem relative ${
          isCollapsed ? "justify-center px-0" : "justify-start gap-2 px-3"
        } h-10 rounded-xl text-sm transition-all duration-300 ${
          isActive
            ? isDarkMode
              ? "bg-[#1e293b] text-white font-semibold shadow-inner ring-1 ring-white/10"
              : "bg-[#f1f5f9] text-[#0f172a] font-bold"
            : isDarkMode
              ? "text-[#94a3b8] hover:bg-[#1e293b]/60 hover:text-white"
              : "text-[#64748b] hover:bg-slate-100/80 hover:text-[#0f172a]"
        }`}
        onClick={() => onViewChange(item.id)}
      >
        <div className={`p-1.5 rounded-lg transition-colors duration-300 ${isActive && !isCollapsed ? (isDarkMode ? "bg-[#8b5cf6]/20 text-[#8b5cf6]" : "bg-[#111111]/10 text-[#111111]") : (isDarkMode ? "bg-transparent group-hover/navitem:bg-[#18181b]" : "bg-transparent group-hover/navitem:bg-slate-100")}`}>
          <Icon className="h-4 w-4 shrink-0" weight={isActive ? "bold" : "regular"} />
        </div>
        {isCollapsed ? (
          hasCount && (
            <span className={`absolute top-2 right-2 h-2 w-2 rounded-full ring-2 ${isDarkMode ? "bg-[#8b5cf6] ring-[#09090b]" : "bg-[#111111] ring-white"}`} />
          )
        ) : (
          <>
            <span className="flex-1 text-left">{item.label}</span>
            {hasCount && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium transition-colors ${isActive ? (isDarkMode ? "bg-[#8b5cf6]/20 text-[#8b5cf6]" : "bg-[#111111]/10 text-[#111111]") : (isDarkMode ? "bg-[#18181b] text-[#52525b]" : "bg-slate-100 text-[#94a3b8]")}`}>
                {displayCount}
              </span>
            )}
          </>
        )}
      </Button>
    );

    return isCollapsed ? (
      <Tooltip key={item.id}>
        <TooltipTrigger asChild>{buttonElement}</TooltipTrigger>
        <TooltipContent side="right" className={`flex items-center gap-2 ${isDarkMode ? "bg-[#18181b] text-[#fafafa] border-[#27272a]" : "bg-white text-[#333333] border-[#e5e5e5]"}`}>
          <p>{item.label}</p>
          {hasCount && <span className={`text-xs ${isDarkMode ? "text-[#a1a1aa]" : "text-[#868686]"}`}>{displayCount}</span>}
        </TooltipContent>
      </Tooltip>
    ) : (
      <div key={item.id}>{buttonElement}</div>
    );
  };

  return (
    <TooltipProvider>
      <div
        className={`relative ${isCollapsed ? "w-20" : "w-64"} ${
          isDarkMode 
            ? "bg-[#020617]/80 border-white/5 supports-[backdrop-filter]:bg-[#020617]/40" 
            : "bg-white border-[var(--border)] shadow-sm"
        } border-r flex flex-col transition-all duration-500 h-full backdrop-blur-xl group/sidebar`}
      >
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
                    {group.items.map(renderNavButton)}
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
