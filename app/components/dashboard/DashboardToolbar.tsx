import { Globe, Lock, Eye, SquaresFour, List, Table, Sparkle, Tag, TextT, VideoCamera, SpeakerHifi, Image as ImageIcon } from "@phosphor-icons/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ModelIcon } from "../ui/model-icon";
import type { ElementType } from "react";

interface Option {
  value: string;
  label: string;
  icon?: any;
  description?: string;
}

interface DashboardToolbarProps {
  isDarkMode: boolean;
  activeViewLabel: string;
  activeViewTotal: number;
  viewMode: "grid" | "list" | "table";
  onViewModeChange: (mode: "grid" | "list" | "table") => void;
  activeView: string;
  allPromptsVisibility: "all" | "public" | "private";
  onVisibilityChange: (v: "all" | "public" | "private") => void;
  selectedModel: string;
  onModelChange: (model: string) => void;
  selectedType: string;
  onTypeChange: (type: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  selectedTag: string;
  onTagChange: (tag: string) => void;
  modelOptions: Option[];
  typeOptions: Option[];
  sortOptions: Option[];
  availableTags: string[];
}

export function DashboardToolbar({
  isDarkMode,
  activeViewLabel,
  activeViewTotal,
  viewMode,
  onViewModeChange,
  activeView,
  allPromptsVisibility,
  onVisibilityChange,
  selectedModel,
  onModelChange,
  selectedType,
  onTypeChange,
  selectedTag,
  onTagChange,
  sortBy,
  onSortChange,
  modelOptions,
  typeOptions,
  sortOptions,
  availableTags,
}: DashboardToolbarProps) {
  const selectedSortOption = sortOptions.find((option) => option.value === sortBy) ?? sortOptions[0];
  const SelectedSortIcon = selectedSortOption.icon;

  if (activeView === "analytics") return null;

  return (
    <div className={`sticky top-[0rem] z-20 -mx-4 px-4 py-2 md:-mx-8 md:px-8 md:py-2.5 backdrop-blur-2xl backdrop-saturate-150 border-b transition-all duration-500 ${
      isDarkMode 
        ? "bg-gradient-to-r from-[#020617]/80 via-[#0f172a]/70 to-[#020617]/80 border-white/5 shadow-2xl shadow-black/20 supports-[backdrop-filter]:bg-opacity-60" 
        : "bg-gradient-to-r from-white/70 via-slate-50/60 to-white/70 border-white/40 shadow-[0_4px_30px_rgba(0,0,0,0.03)] supports-[backdrop-filter]:bg-opacity-60"
    }`}>
      <div className="mx-auto flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Mobile Top Row: Title + View Toggle */}
        <div className="flex items-center justify-between md:justify-start gap-3">
            <div className="flex items-center gap-3">
                <h1 className={`text-xl md:text-2xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-[#0f172a]'}`}>
                    {activeViewLabel}
                </h1>
                <span className={`px-2 py-0.5 rounded-full text-[10px] md:text-xs font-semibold ${isDarkMode ? 'bg-[#27272a] text-zinc-400' : 'bg-slate-100 text-slate-500'}`}>
                    {activeViewTotal}
                </span>
            </div>

            {/* Mobile View Toggle */}
            <div className={`md:hidden p-1 rounded-lg border flex h-8 ${isDarkMode ? "bg-[#18181b]/50 border-[#27272a]" : "bg-white border-[#e2e8f0]"}`}>
                <button
                    onClick={() => onViewModeChange("grid")}
                    className={`w-7 h-full flex items-center justify-center rounded-md transition-all ${viewMode === "grid" ? (isDarkMode ? "bg-[#27272a] text-white shadow-sm" : "bg-slate-100 text-slate-900 shadow-sm") : (isDarkMode ? "text-zinc-500 hover:text-zinc-300" : "text-slate-500 hover:text-slate-700")}`}
                >
                    <SquaresFour weight="regular" className="h-4 w-4" />
                </button>
                <button
                    onClick={() => onViewModeChange("list")}
                    className={`w-7 h-full flex items-center justify-center rounded-md transition-all ${viewMode === "list" ? (isDarkMode ? "bg-[#27272a] text-white shadow-sm" : "bg-slate-100 text-slate-900 shadow-sm") : (isDarkMode ? "text-zinc-500 hover:text-zinc-300" : "text-slate-500 hover:text-slate-700")}`}
                >
                    <List weight="regular" className="h-4 w-4" />
                </button>
                <button
                    onClick={() => onViewModeChange("table")}
                    className={`w-7 h-full flex items-center justify-center rounded-md transition-all ${viewMode === "table" ? (isDarkMode ? "bg-[#27272a] text-white shadow-sm" : "bg-slate-100 text-slate-900 shadow-sm") : (isDarkMode ? "text-zinc-500 hover:text-zinc-300" : "text-slate-500 hover:text-slate-700")}`}
                >
                    <Table weight="regular" className="h-4 w-4" />
                </button>
            </div>
        </div>

        {/* Controls Section */}
        <div className="w-full md:w-auto">
            <div className="grid grid-cols-2 gap-2 md:flex md:items-center md:gap-2">
                {/* Visibility Filter */}
                {activeView === "all" && (
                <Select value={allPromptsVisibility} onValueChange={(v) => onVisibilityChange(v as any)}>
                    <SelectTrigger className={`relative min-w-[120px] h-10 rounded-xl transition-all border-none ${isDarkMode ? "bg-[#0f172a] hover:bg-[#1e293b] text-[#f8fafc]" : "bg-white hover:bg-slate-50 text-[#0f172a] shadow-sm border border-[var(--border)]"}`}>
                        <span className={`absolute -top-1.5 left-2 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider rounded-sm z-10 leading-none shadow-sm transition-transform group-hover/filter:-translate-y-0.5 ${isDarkMode ? "bg-[#8b5cf6] text-white" : "bg-zinc-100 text-zinc-900"}`}>
                            Visibility
                        </span>
                        <div className="flex items-center gap-2 mt-0.5">
                            {allPromptsVisibility === "public" ? <Globe className="h-3.5 w-3.5" /> : allPromptsVisibility === "private" ? <Lock className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                            <span className="capitalize">{allPromptsVisibility === "all" ? "View All" : allPromptsVisibility}</span>
                        </div>
                    </SelectTrigger>
                    <SelectContent className={isDarkMode ? "bg-[#18181b] border-[#27272a] text-zinc-300" : "bg-white border-[#d4d4d4]"}>
                        <SelectItem value="all" className="text-xs">
                            <div className="flex items-center gap-2">
                                <Eye className="h-3.5 w-3.5" />
                                <span>View All</span>
                            </div>
                        </SelectItem>
                        <SelectItem value="public" className="text-xs">
                            <div className="flex items-center gap-2">
                                <Globe className="h-3.5 w-3.5 text-blue-500" />
                                <span>Public</span>
                            </div>
                        </SelectItem>
                        <SelectItem value="private" className="text-xs">
                            <div className="flex items-center gap-2">
                                <Lock className="h-3.5 w-3.5 text-orange-500" />
                                <span>Private</span>
                            </div>
                        </SelectItem>
                    </SelectContent>
                </Select>
                )}
                
                {activeView === "all" && <div className={`hidden md:block w-px h-5 ${isDarkMode ? "bg-[#27272a]" : "bg-slate-200"}`} />}

                {activeView !== "collections" && (
                <>
                    {/* Model Select */}
                    <Select value={selectedModel} onValueChange={onModelChange}>
                        <SelectTrigger className={`relative col-span-1 md:w-auto h-9 rounded-lg border shadow-sm text-xs font-medium transition-all hover:border-primary/50 ${isDarkMode 
                          ? "bg-[#0f172a]/40 border-white/5 text-zinc-300 hover:bg-[#1e293b]" 
                          : "bg-white border-slate-200 text-slate-700 shadow-sm"}`}>
                            <span className={`absolute -top-1.5 left-2 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider rounded-sm z-10 leading-none shadow-sm transition-transform group-hover/filter:-translate-y-0.5 ${isDarkMode ? "bg-[#8b5cf6] text-white" : "bg-zinc-100 text-zinc-900"}`}>
                                Models
                            </span>
                            <div className="mt-0.5">
                                <SelectValue />
                            </div>
                        </SelectTrigger>
                        <SelectContent className={isDarkMode ? "bg-[#18181b] border-[#27272a] text-zinc-300" : "bg-white border-[#d4d4d4]"}>
                            {modelOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value} className="text-xs">
                                    <div className="flex items-center gap-2">
                                    {option.value === "all" ? <Sparkle className="h-3.5 w-3.5" /> : <ModelIcon model={option.value} size={14} isDarkMode={isDarkMode} />}
                                    <span>{option.label}</span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    
                    {/* Type Select */}
                    <Select value={selectedType} onValueChange={onTypeChange}>
                        <SelectTrigger className={`relative col-span-1 md:w-auto h-9 rounded-lg border shadow-sm text-xs font-medium transition-all hover:border-primary/50 ${isDarkMode 
                          ? "bg-[#0f172a]/40 border-white/5 text-zinc-300 hover:bg-[#1e293b]" 
                          : "bg-white border-slate-200 text-slate-700 shadow-sm"}`}>
                            <span className={`absolute -top-1.5 left-2 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider rounded-sm z-10 leading-none shadow-sm transition-transform group-hover/filter:-translate-y-0.5 ${isDarkMode ? "bg-[#8b5cf6] text-white" : "bg-zinc-100 text-zinc-900"}`}>
                                Type
                            </span>
                            <div className="mt-0.5">
                                <SelectValue placeholder="View All" />
                            </div>
                        </SelectTrigger>
                        <SelectContent className={isDarkMode ? "bg-[#18181b] border-[#27272a] text-zinc-300" : "bg-white border-[#d4d4d4]"}>
                            {typeOptions.map((type) => {
                                const TypeIcon = type.icon;
                                return (
                                    <SelectItem key={type.value} value={type.value} className="text-xs">
                                        <div className="flex items-center gap-2">
                                            {TypeIcon && <TypeIcon className="h-3.5 w-3.5" weight="regular" />}
                                            <span>{type.label}</span>
                                        </div>
                                    </SelectItem>
                                )
                            })}
                        </SelectContent>
                    </Select>

                    {/* Tag Select */}
                    <Select value={selectedTag} onValueChange={onTagChange}>
                        <SelectTrigger className={`relative col-span-1 md:w-auto h-9 min-w-[120px] rounded-lg border shadow-sm text-xs font-medium transition-all hover:border-primary/50 ${isDarkMode 
                          ? "bg-[#0f172a]/40 border-white/5 text-zinc-300 hover:bg-[#1e293b]" 
                          : "bg-white border-slate-200 text-slate-700 shadow-sm"}`}>
                            <span className={`absolute -top-1.5 left-2 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider rounded-sm z-10 leading-none shadow-sm transition-transform group-hover/filter:-translate-y-0.5 ${isDarkMode ? "bg-[#8b5cf6] text-white" : "bg-zinc-100 text-zinc-900"}`}>
                                Tags
                            </span>
                            <div className="mt-0.5 flex items-center gap-2">
                                <Tag className="h-3.5 w-3.5" />
                                <span className="capitalize">{selectedTag === "all" ? "All Tags" : selectedTag}</span>
                            </div>
                        </SelectTrigger>
                        <SelectContent className={isDarkMode ? "bg-[#18181b] border-[#27272a] text-zinc-300" : "bg-white border-[#d4d4d4]"}>
                            <SelectItem value="all" className="text-xs">
                                <div className="flex items-center gap-2">
                                    <Tag className="h-3.5 w-3.5" />
                                    <span>All Tags</span>
                                </div>
                            </SelectItem>
                            {availableTags.map((tag) => (
                                <SelectItem key={tag} value={tag} className="text-xs">
                                    <div className="flex items-center gap-2">
                                        <div className="h-1.5 w-1.5 rounded-full bg-primary/40" />
                                        <span className="capitalize">{tag}</span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    
                    {/* Sort Select */}
                    <Select value={sortBy} onValueChange={onSortChange}>
                        <SelectTrigger className={`relative col-span-2 md:col-span-1 md:w-auto h-9 rounded-lg border shadow-sm text-xs font-medium transition-all hover:border-primary/50 ${isDarkMode 
                          ? "bg-[#0f172a]/40 border-white/5 text-zinc-300 hover:bg-[#1e293b]" 
                          : "bg-white border-slate-200 text-slate-700 shadow-sm"}`}>
                            <span className={`absolute -top-1.5 left-2 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider rounded-sm z-10 leading-none shadow-sm transition-transform group-hover/filter:-translate-y-0.5 ${isDarkMode ? "bg-[#8b5cf6] text-white" : "bg-zinc-100 text-zinc-900"}`}>
                                Sort by
                            </span>
                            <div className="flex items-center justify-center md:justify-start gap-2 mt-0.5"><SelectedSortIcon className="h-3.5 w-3.5" /><span>{selectedSortOption.label}</span></div>
                        </SelectTrigger>
                        <SelectContent className={isDarkMode ? "bg-[#18181b] border-[#27272a] text-zinc-300" : "bg-white border-[#d4d4d4]"}>
                            {sortOptions.map((option) => {
                                const Icon = option.icon;
                                return (
                                <SelectItem key={option.value} value={option.value} className="text-xs">
                                    <div className="flex items-center gap-2"><Icon className="h-3.5 w-3.5" /><span>{option.label}</span></div>
                                </SelectItem>
                                )
                            })}
                        </SelectContent>
                    </Select>
                </>
                )}

                {activeView !== "collections" && <div className={`hidden md:block w-px h-5 ${isDarkMode ? "bg-[#27272a]" : "bg-slate-200"}`} />}

                {/* Desktop View Toggle */}
                <div className={`hidden md:flex p-1 rounded-xl h-10 ${isDarkMode ? "bg-[#18181b] shadow-inner ring-1 ring-white/5" : "bg-[#f1f5f9] shadow-none border border-slate-200/50"}`}>
                    <button
                        onClick={() => onViewModeChange("grid")}
                        className={`w-8 h-full flex items-center justify-center rounded-md transition-all ${viewMode === "grid" ? (isDarkMode ? "bg-[#27272a] text-white shadow-sm" : "bg-slate-100 text-slate-900 shadow-sm") : (isDarkMode ? "text-zinc-500 hover:text-zinc-300" : "text-slate-500 hover:text-slate-700")}`}
                        title="Grid View"
                    >
                        <SquaresFour weight="regular" className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => onViewModeChange("list")}
                        className={`w-8 h-full flex items-center justify-center rounded-md transition-all ${viewMode === "list" ? (isDarkMode ? "bg-[#27272a] text-white shadow-sm" : "bg-slate-100 text-slate-900 shadow-sm") : (isDarkMode ? "text-zinc-500 hover:text-zinc-300" : "text-slate-500 hover:text-slate-700")}`}
                        title="List View"
                    >
                        <List weight="regular" className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => onViewModeChange("table")}
                        className={`w-8 h-full flex items-center justify-center rounded-md transition-all ${viewMode === "table" ? (isDarkMode ? "bg-[#27272a] text-white shadow-sm" : "bg-slate-100 text-slate-900 shadow-sm") : (isDarkMode ? "text-zinc-500 hover:text-zinc-300" : "text-slate-500 hover:text-slate-700")}`}
                        title="Table View"
                    >
                        <Table weight="regular" className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
