import { motion, AnimatePresence } from "motion/react";
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
        { id: "favorites", icon: Star, label: "My Favorites", count: promptCounts.favorites },
        { id: "saved", icon: Bookmark, label: "Saved", count: promptCounts.saved || 0 },
        { id: "collections", icon: Folders, label: "Collections", count: collectionsCount },
      ],
    },
    {
      title: "Global Space",
      id: "global",
      items: [
        { id: "public", icon: Globe, label: "Prompt Feed", count: promptCounts.public },
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
        { id: "public-image", icon: ImageIcon, label: "Images", count: promptCounts.publicImages },
        { id: "public-video", icon: VideoCamera, label: "Videos", count: promptCounts.publicVideos },
        { id: "public-audio", icon: SpeakerHigh, label: "Audio", count: promptCounts.publicAudio },
        { id: "public-text", icon: TextT, label: "Text", count: promptCounts.publicText },
      ];

      const groupColor = item.id === "personal" ? "purple" : "blue";

      return (
        <Collapsible key={item.id} open={isOpen} onOpenChange={setIsOpen} className="space-y-1">
          <div className="flex items-center gap-1 group/collapsible">
            <Button
              variant="ghost"
              className={`flex-1 justify-start gap-4 px-3 h-11 rounded-2xl text-[13.5px] transition-all duration-500 relative overflow-hidden ${
                isActive
                  ? (isDarkMode ? "bg-[#1e293b]/60 text-white font-bold ring-1 ring-white/10" : "bg-white text-[#0f172a] font-semibold shadow-[0_4px_12px_rgba(0,0,0,0.03)] border border-slate-200/50")
                  : (isDarkMode ? "text-[#94a3b8] hover:bg-white/[0.03] hover:text-white" : "text-[#64748b] hover:bg-slate-100/40 hover:text-[#0f172a]")
              }`}
              onClick={() => onViewChange(item.id)}
            >
              {isActive && (
                <motion.div 
                  layoutId="sidebar-active-indicator"
                  className={`absolute left-0 w-[4px] h-[20px] rounded-r-full ${isDarkMode ? "bg-violet-500 shadow-[0_0_12px_rgba(139,92,246,0.5)]" : "bg-zinc-900"}`} 
                />
              )}
              <div className={`p-2 rounded-xl transition-all duration-500 ${isActive ? (isDarkMode ? "bg-violet-500/10 text-violet-400" : "bg-zinc-100 text-zinc-900") : (isDarkMode ? "text-[#71717a] group-hover/collapsible:scale-110" : "text-slate-400 group-hover/collapsible:scale-110")}`}>
                <Icon className="h-[18px] w-[18px] shrink-0" weight={isActive ? "bold" : "regular"} />
              </div>
              <span className={`flex-1 text-left transition-colors duration-300 ${isActive ? "opacity-100" : "opacity-70"}`}>{item.label}</span>
              {hasCount && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-black transition-all duration-500 ${isActive ? (isDarkMode ? `bg-violet-500/20 text-violet-400` : `bg-zinc-900 text-white`) : (isDarkMode ? "bg-white/5 text-zinc-500" : "bg-slate-100 text-slate-500")}`}>
                  {displayCount}
                </span>
              )}
            </Button>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="icon" className={`h-9 w-7 rounded-xl transition-all duration-300 ${isDarkMode ? "hover:bg-white/5 text-zinc-500 hover:text-white" : "hover:bg-slate-100 text-slate-400 hover:text-slate-900"}`}>
                {isOpen ? <CaretDown className="h-3.5 w-3.5" weight="bold" /> : <CaretRight className="h-3.5 w-3.5" weight="bold" />}
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="space-y-0.5 ml-[26px] border-l-[1.5px] border-zinc-200/50 dark:border-zinc-800/50 pl-3 pt-1">
            {subItems.map((subItem) => (
              <Button
                key={subItem.id}
                variant="ghost"
                onClick={() => onViewChange(subItem.id)}
                className={`w-full justify-start gap-3 px-3 h-8 rounded-xl text-[10px] uppercase tracking-[0.2em] font-semibold transition-all duration-500 group/sub ${
                  activeView === subItem.id
                    ? (isDarkMode ? "text-violet-400 bg-violet-500/10 border border-violet-500/20" : "text-zinc-950 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-200")
                    : (isDarkMode ? "text-[#52525b] hover:text-white hover:bg-white/5" : "text-slate-400 hover:text-slate-900 hover:bg-slate-100")
                }`}
              >
                <subItem.icon className={`h-3.5 w-3.5 transition-transform duration-300 group-hover/sub:scale-110 ${activeView === subItem.id ? "opacity-100" : "opacity-40"}`} weight={activeView === subItem.id ? "bold" : "regular"} />
                <span className="flex-1 text-left">{subItem.label}</span>
                {subItem.count > 0 && <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${activeView === subItem.id ? (isDarkMode ? "bg-violet-500/20" : "bg-zinc-200") : "opacity-30 group-hover/sub:opacity-60"}`}>{subItem.count}</span>}
              </Button>
            ))}
          </CollapsibleContent>
        </Collapsible>
      );
    }

    const buttonElement = (
      <Button
        variant="ghost"
        className={`w-full group/navitem relative overflow-hidden ${
          isCollapsed ? "justify-center px-0" : "justify-start gap-4 px-3"
        } h-11 rounded-2xl text-[13.5px] transition-all duration-500 ${
          isActive
            ? isDarkMode
              ? "bg-[#1e293b]/60 text-white font-bold shadow-[0_8px_16px_rgba(0,0,0,0.2)] ring-1 ring-white/10"
              : "bg-white text-[#0f172a] font-semibold shadow-[0_8px_20px_rgba(0,0,0,0.04)] border border-slate-200/50"
            : isDarkMode
              ? "text-[#94a3b8] hover:bg-white/[0.03] hover:text-white"
              : "text-[#64748b] hover:bg-slate-100/40 hover:text-[#0f172a]"
        }`}
        onClick={() => onViewChange(item.id)}
      >
        {/* Liquid Indicator */}
        {isActive && !isCollapsed && (
          <motion.div 
            layoutId="sidebar-active-indicator"
            className={`absolute left-0 w-[4px] h-[20px] rounded-r-full group-hover/navitem:h-[24px] transition-all duration-300 ${isDarkMode ? "bg-violet-500 shadow-[0_0_12px_rgba(139,92,246,0.5)]" : "bg-zinc-900"}`} 
          />
        )}

        <div className={`p-2 rounded-xl transition-all duration-500 ${
          isActive 
            ? (isDarkMode ? "bg-violet-500/10 text-violet-400" : "bg-zinc-100 text-zinc-900") 
            : (isDarkMode ? "text-[#71717a] group-hover/navitem:text-white group-hover/navitem:scale-110" : "text-slate-400 group-hover/navitem:text-slate-900 group-hover/navitem:scale-110")
        }`}>
          <Icon className="h-[18px] w-[18px] shrink-0" weight={isActive ? "bold" : "regular"} />
        </div>

        {isCollapsed ? (
          hasCount && (
            <span className={`absolute top-2.5 right-2.5 h-2 w-2 rounded-full ring-2 ${isDarkMode ? "bg-violet-500 ring-[#09090b] shadow-[0_0_8px_rgba(139,92,246,0.6)]" : "bg-zinc-900 ring-white shadow-sm"}`} />
          )
        ) : (
          <>
            <span className={`flex-1 text-left transition-colors duration-300 ${isActive ? "opacity-100" : "opacity-70 group-hover/navitem:opacity-100"}`}>
              {item.label}
            </span>
            {hasCount && (
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-black tracking-tight transition-all duration-500 ${
                isActive 
                  ? (isDarkMode ? "bg-violet-500/20 text-violet-400 border border-violet-500/20" : "bg-zinc-900 text-white") 
                  : (isDarkMode ? "bg-white/5 text-zinc-500 group-hover/navitem:bg-white/10 group-hover/navitem:text-zinc-300" : "bg-slate-100 text-slate-500 group-hover/navitem:bg-slate-200")
              }`}>
                {displayCount}
              </span>
            )}
            {/* Liquid Highlight Effect Overlay */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover/navitem:opacity-100 transition-opacity" />
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
            ? "bg-[#020617]/90 border-white/5 supports-[backdrop-filter]:bg-[#020617]/50" 
            : "bg-gradient-to-br from-[#ffffff] via-slate-50 to-[#f8faff] border-[var(--border)] shadow-[var(--shadow-elevated)]"
        } border-r flex flex-col transition-all duration-500 h-full backdrop-blur-2xl group/sidebar overflow-hidden`}
      >
        {/* Decorative Light Glows */}
        {!isDarkMode && (
          <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/[0.03] to-transparent pointer-events-none" />
        )}
        {isDarkMode && (
          <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none opacity-50" />
        )}
        <div className="flex flex-1 flex-col min-h-0">
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className={`${isCollapsed ? "px-2" : "px-4"} py-6 space-y-8`}>
              {navGroups.map((group) => (
                <div key={group.id} className="space-y-2">
                  {!isCollapsed && group.title && (
                    <h4 className={`px-4 text-[10px] font-black uppercase tracking-[0.25em] ${isDarkMode ? "text-[#52525b]" : "text-slate-400"}`}>
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
