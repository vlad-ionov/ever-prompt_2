import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigation } from "@remix-run/react";
import { useAuth } from "../contexts/AuthContext";
import { AppSidebar } from "./AppSidebar";
import { PromptDetailSheet } from "./PromptDetailSheet";
import { UserSettingsDialog } from "./UserSettingsDialog";
import { AddPromptDialog } from "./AddPromptDialog";
import { EditPromptDialog } from "./EditPromptDialog";
import { AddCollectionDialog } from "./AddCollectionDialog";
import { EditCollectionDialog } from "./EditCollectionDialog";
import { AddToCollectionDialog } from "./AddToCollectionDialog";
import { Toaster } from "./ui/sonner";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "./ui/sheet";
import { VisuallyHidden } from "./ui/visually-hidden";
import { useIsMobile } from "./ui/use-mobile";
import { Button } from "./ui/button";
import { PlusCircle } from "@phosphor-icons/react/dist/ssr";
import {
  SquaresFour,
  Heart,
  Flame,
  BookmarkSimple,
  GlobeHemisphereEast,
  ChartLineUp,
  ClockClockwise,
  FireSimple,
  SortAscending,
  SortDescending,
  Sparkle,
  TextT,
  VideoCamera,
  SpeakerHifi,
  Image as ImageIcon,
} from "@phosphor-icons/react/dist/ssr";

import MainLogoDark from "../assets/icons/logo-everprompt-dark.svg";
import MainLogoLight from "../assets/icons/logo-everprompt-light.svg";

import { useDashboard } from "../hooks/useDashboard";
import { DashboardHeader } from "./dashboard/DashboardHeader";
import { DashboardToolbar } from "./dashboard/DashboardToolbar";
import { DashboardContent } from "./dashboard/DashboardContent";
import { CommandPalette } from "./dashboard/CommandPalette";
import { Breadcrumbs } from "./dashboard/Breadcrumbs";

import type { Prompt, Collection } from "@/lib/types";

interface DashboardProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  demoMode?: boolean;
  onExitDemo?: () => void;
  initialPrompts?: Prompt[];
  initialCollections?: Collection[];
  isLoading?: boolean;
}

const MODEL_OPTIONS = [
  { value: "all", label: "View All" },
  { value: "gemini", label: "Gemini" },
  { value: "grok", label: "Grok" },
  { value: "gpt", label: "GPT" },
  { value: "midjourney", label: "Midjourney" },
  { value: "claude", label: "Claude" },
];

const TYPE_OPTIONS = [
  { value: "all", label: "View All", icon: Sparkle },
  { value: "text", label: "Text", icon: TextT },
  { value: "video", label: "Video", icon: VideoCamera },
  { value: "audio", label: "Audio", icon: SpeakerHifi },
  { value: "image", label: "Image", icon: ImageIcon },
];

const SORT_OPTIONS = [
  { value: "recent", label: "Recent", icon: ClockClockwise },
  { value: "popular", label: "Popular", icon: FireSimple },
  { value: "alphabetical-asc", label: "Name (A–Z)", icon: SortAscending },
  { value: "alphabetical-desc", label: "Name (Z–A)", icon: SortDescending },
];

const VIEW_LABELS: Record<string, string> = {
  personal: "My Prompts",
  "personal-text": "My Text",
  "personal-image": "My Images",
  "personal-video": "My Videos",
  "personal-audio": "My Audio",
  all: "Feed",
  public: "Public Library",
  "public-text": "Public Text",
  "public-image": "Public Images",
  "public-video": "Public Videos",
  "public-audio": "Public Audio",
  favorites: "Liked",
  saved: "Saved",
  collections: "Collections",
  analytics: "Analytics",
};

export function Dashboard({
  isDarkMode,
  onToggleDarkMode,
  demoMode = false,
  onExitDemo,
  initialPrompts,
  initialCollections,
  isLoading: propLoading,
}: DashboardProps) {
  const { profile, signOut } = useAuth();
  const isMobile = useIsMobile();
  const navigation = useNavigation();
  const logoSrc = isDarkMode ? MainLogoDark : MainLogoLight;

  const isLoading = propLoading || navigation.state === "loading";

  // --- Logic Hook ---
  const {
    prompts,
    collections,
    promptCounts,
    stats,
    handleSavePrompt,
    handleUpdatePrompt,
    handleDeletePrompt,
    handleToggleLike,
    handleToggleSave,
    handleToggleVisibility,
    handleCopyPrompt,
    handleSharePrompt,
    handleAddCollection,
    handleUpdateCollection,
    handleDeleteCollection,
    handleAddPromptsToCollection,
    handleRemovePromptFromCollection,
    handleAddToSelectedCollections,
    exportPromptsAsJSON,
    exportPromptsAsPlainText,
  } = useDashboard({ initialPrompts, initialCollections, demoMode });

  // --- UI State ---
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedModel, setSelectedModel] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedTag, setSelectedTag] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeView, setActiveView] = useState<string>("all");
  const [allPromptsVisibility, setAllPromptsVisibility] = useState<"all" | "public" | "private">("public");
  
  // Dialog/Sheet State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isAddCollectionOpen, setIsAddCollectionOpen] = useState(false);
  const [isEditCollectionOpen, setIsEditCollectionOpen] = useState(false);
  const [isAddToCollectionOpen, setIsAddToCollectionOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  
  // Active Items State
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [promptToEdit, setPromptToEdit] = useState<Prompt | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [collectionToEdit, setCollectionToEdit] = useState<Collection | null>(null);
  const [promptToAddToCollection, setPromptToAddToCollection] = useState<string | null>(null);
  const [viewingCollection, setViewingCollection] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Keyboard shortcut listener is now handled in CommandPalette
  // but we still need the main view state here.

  // Update selected prompt if it changes in the main list (e.g. liked/saved)
  useEffect(() => {
    if (selectedPrompt) {
      const updated = prompts.find(p => p.id === selectedPrompt.id);
      if (updated) setSelectedPrompt(updated);
    }
  }, [prompts, selectedPrompt?.id]);

  // Update selected collection if it changes
  useEffect(() => {
    if (selectedCollection) {
      const updated = collections.find(c => c.id === selectedCollection.id);
      if (updated) setSelectedCollection(updated);
    }
  }, [collections, selectedCollection?.id]);

  const filteredPrompts = useMemo(() => {
    return prompts
      .filter((prompt) => {
        const matchesSearch =
          prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          prompt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          prompt.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        
        const matchesModel =
          selectedModel === "all" || prompt.model.toLowerCase().includes(selectedModel.toLowerCase());
        
        const matchesType = selectedType === "all" || prompt.type === selectedType;

        const matchesTag = selectedTag === "all" || prompt.tags.includes(selectedTag);
        
        const matchesView =
          (activeView === "all" && (
            allPromptsVisibility === "all" ? true : // Show both in 'All' mode
            allPromptsVisibility === "public" ? prompt.isPublic : 
            !prompt.isPublic // 'private' mode
          )) ||
          (activeView === "personal" && !prompt.isPublic) ||
          (activeView.startsWith("personal-") && !prompt.isPublic && prompt.type === activeView.replace("personal-", "")) ||
          (activeView === "public" && prompt.isPublic) ||
          (activeView.startsWith("public-") && prompt.isPublic && prompt.type === activeView.replace("public-", "")) ||
          (activeView === "favorites" && prompt.isLiked) ||
          (activeView === "saved" && prompt.isSaved);
          
        return matchesSearch && matchesModel && matchesType && matchesView && matchesTag;
      })
      .sort((a, b) => {
        if (sortBy === "popular") return b.likes - a.likes;
        if (sortBy === "alphabetical-asc") return a.title.localeCompare(b.title);
        if (sortBy === "alphabetical-desc") return b.title.localeCompare(a.title);
        
        // Default sort: Text and Image first
        const typeOrder: Record<string, number> = { text: 1, image: 2, video: 3, audio: 4 };
        return (typeOrder[a.type] || 99) - (typeOrder[b.type] || 99);
      });
  }, [prompts, searchQuery, selectedModel, selectedType, selectedTag, activeView, allPromptsVisibility, sortBy]);


  const breadcrumbItems = useMemo(() => {
    const items = [{ label: VIEW_LABELS[activeView] || "Dashboard", active: !viewingCollection }];
    if (viewingCollection && selectedCollection) {
      items.push({ label: selectedCollection.name, active: true });
    }
    return items;
  }, [activeView, viewingCollection, selectedCollection]);

  // --- Handlers for UI state ---
  const handlePromptClick = (id: string) => {
    const prompt = prompts.find(p => p.id === id);
    if (prompt) {
      setSelectedPrompt(prompt);
      setIsDetailSheetOpen(true);
    }
  };

  const handleEditPromptInit = (id: string) => {
    const prompt = prompts.find(p => p.id === id);
    if (prompt) {
      setPromptToEdit(prompt);
      setIsEditDialogOpen(true);
    }
  };

  const handleCollectionClick = (id: string) => {
    const col = collections.find(c => c.id === id);
    if (col) {
      setSelectedCollection(col);
      setViewingCollection(true);
    }
  };

  const handleEditCollectionInit = (id: string) => {
    const col = collections.find(c => c.id === id);
    if (col) {
      setCollectionToEdit(col);
      setIsEditCollectionOpen(true);
    }
  };

  const handleAddToCollectionInit = (id: string) => {
    setPromptToAddToCollection(id);
    setIsAddToCollectionOpen(true);
  };

  const sidebarContent = (
    <AppSidebar
      isDarkMode={isDarkMode}
      activeView={activeView}
      onViewChange={(view) => {
        setActiveView(view);
        setViewingCollection(false);
        if (isMobile) setIsSidebarOpen(false);
      }}
      promptCounts={promptCounts}
      collectionsCount={collections.length}
      onOpenSettings={() => {
        setIsSettingsOpen(true);
        if (isMobile) setIsSidebarOpen(false);
      }}
      isCollapsed={!isMobile && isSidebarCollapsed}
      onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
    />
  );

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Demo Banner */}
      {demoMode && (
        <div className={`${isDarkMode ? 'bg-[#8b5cf6]' : 'bg-[#111111]'} text-white px-4 py-2 flex items-center justify-between`}>
          <p className="text-sm"><strong>Demo Mode:</strong> You're viewing sample data. Sign up to save your own!</p>
          <Button size="sm" variant="ghost" onClick={onExitDemo} className="text-white hover:bg-white/20">Exit Demo</Button>
        </div>
      )}

      <DashboardHeader
        isDarkMode={isDarkMode}
        onToggleDarkMode={onToggleDarkMode}
        logoSrc={logoSrc}
        isMobile={isMobile}
        onOpenSidebar={() => setIsSidebarOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isSearchFocused={isSearchFocused}
        setIsSearchFocused={setIsSearchFocused}
        promptsCount={prompts.length}
        filteredPrompts={filteredPrompts}
        onExportJSON={exportPromptsAsJSON}
        onExportText={exportPromptsAsPlainText}
        activeView={activeView}
        onNewPrompt={() => setIsDialogOpen(true)}
        onNewCollection={() => setIsAddCollectionOpen(true)}
        user={{
          name: profile?.name || "",
          email: profile?.email || "demo@example.com",
          avatar: profile?.avatar_url
        }}
        demoMode={demoMode}
        onExitDemo={onExitDemo}
        onSignOut={signOut}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <div className="flex flex-1 overflow-hidden">
        {!isMobile && sidebarContent}
        {isMobile && (
          <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SheetContent side="left" className={`p-0 w-64 ${isDarkMode ? 'bg-[#0f0f11] border-[#27272a]' : 'bg-white border-[#d4d4d4]'}`}>
              <VisuallyHidden><SheetTitle>Navigation</SheetTitle><SheetDescription>Sidebar</SheetDescription></VisuallyHidden>
              {sidebarContent}
            </SheetContent>
          </Sheet>
        )}

        <div className="flex-1 flex flex-col overflow-hidden relative">
          <div className={`flex-1 overflow-y-auto ${isDarkMode ? "bg-[var(--bg)]" : "bg-[var(--bg)]"}`}>
            <div className={`mx-auto max-w-[1920px] ${viewingCollection ? "" : "px-4 md:px-8 pb-8"}`}>
              {!viewingCollection && (
                <DashboardToolbar
                  isDarkMode={isDarkMode}
                  activeViewLabel={VIEW_LABELS[activeView] || "Prompts"}
                  activeViewTotal={activeView === "collections" ? collections.length : filteredPrompts.length}
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                  activeView={activeView}
                  allPromptsVisibility={allPromptsVisibility}
                  onVisibilityChange={setAllPromptsVisibility}
                  selectedModel={selectedModel}
                  onModelChange={setSelectedModel}
                  selectedType={selectedType}
                  onTypeChange={setSelectedType}
                  selectedTag={selectedTag}
                  onTagChange={setSelectedTag}
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                  modelOptions={MODEL_OPTIONS}
                  typeOptions={TYPE_OPTIONS}
                  sortOptions={SORT_OPTIONS}
                  availableTags={useMemo(() => {
                    const tags = new Set<string>();
                    prompts.forEach((p) => p.tags.forEach((t) => tags.add(t)));
                    return Array.from(tags).sort();
                  }, [prompts])}
                />
              )}

              <div className="mb-3 px-4 md:px-0">
                <Breadcrumbs 
                  items={breadcrumbItems} 
                  isDarkMode={isDarkMode} 
                  onHomeClick={() => {
                    setActiveView("all");
                    setViewingCollection(false);
                  }}
                />
              </div>

              <div className={viewingCollection ? "" : "space-y-8"}>
                <DashboardContent
                  isDarkMode={isDarkMode}
                  activeView={activeView}
                  viewingCollection={viewingCollection}
                  selectedCollection={selectedCollection}
                  prompts={prompts}
                  collections={collections}
                  filteredPrompts={filteredPrompts}
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                  onBackFromCollection={() => setViewingCollection(false)}
                  onRemovePromptFromCollection={(pid) => handleRemovePromptFromCollection(selectedCollection!.id, pid)}
                  onAddPromptsToCollection={(pids) => handleAddPromptsToCollection(selectedCollection!.id, pids)}
                  onPromptClick={handlePromptClick}
                  onPromptEdit={handleEditPromptInit}
                  onPromptDelete={handleDeletePrompt}
                  onPromptShare={handleSharePrompt}
                  onPromptCopy={handleCopyPrompt}
                  onPromptLike={handleToggleLike}
                  onPromptSave={handleToggleSave}
                  onToggleVisibility={handleToggleVisibility}
                  onAddToCollection={handleAddToCollectionInit}
                  onCollectionClick={handleCollectionClick}
                  onCollectionEdit={handleEditCollectionInit}
                  onCollectionDelete={handleDeleteCollection}
                  onAddCollection={() => setIsAddCollectionOpen(true)}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAB */}
      <div className="fixed bottom-8 right-8 z-40">
        <Button
          onClick={() => setIsDialogOpen(true)}
          className={`h-14 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-[#8b5cf6]/20 group ${
            isDarkMode ? 'bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed]' : 'bg-[#111111]'
          } flex items-center gap-2 px-6 text-white border-0`}
        >
          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover/fab:opacity-100 transition-opacity duration-300" />
          <PlusCircle size={24} weight="bold" className="relative z-10" />
          <span className="relative z-10 font-bold">New Prompt</span>
        </Button>
      </div>

      <AddPromptDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} onSave={handleSavePrompt} isDarkMode={isDarkMode} />
      <EditPromptDialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} prompt={promptToEdit} onSave={handleUpdatePrompt} isDarkMode={isDarkMode} />
      <PromptDetailSheet 
        open={isDetailSheetOpen} onOpenChange={setIsDetailSheetOpen} prompt={selectedPrompt} isDarkMode={isDarkMode}
        onEdit={handleEditPromptInit} onDelete={handleDeletePrompt} onSave={handleToggleSave} 
        onToggleVisibility={handleToggleVisibility} onAddToCollection={handleAddToCollectionInit} onLike={handleToggleLike}
      />
      <UserSettingsDialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen} isDarkMode={isDarkMode} onToggleDarkMode={onToggleDarkMode} />
      <AddCollectionDialog open={isAddCollectionOpen} onOpenChange={setIsAddCollectionOpen} onAdd={handleAddCollection} isDarkMode={isDarkMode} />
      <EditCollectionDialog open={isEditCollectionOpen} onOpenChange={setIsEditCollectionOpen} collection={collectionToEdit} onEdit={handleUpdateCollection} isDarkMode={isDarkMode} />
      <AddToCollectionDialog 
        open={isAddToCollectionOpen} onOpenChange={setIsAddToCollectionOpen} promptId={promptToAddToCollection || ""} collections={collections}
         onAddToCollections={(cids) => handleAddToSelectedCollections(promptToAddToCollection!, cids)} isDarkMode={isDarkMode}
      />
      <CommandPalette
        open={isCommandPaletteOpen}
        onOpenChange={setIsCommandPaletteOpen}
        prompts={prompts}
        onPromptSelect={handlePromptClick}
        onViewChange={(view) => {
          setActiveView(view);
          setViewingCollection(false);
        }}
        onToggleDarkMode={onToggleDarkMode}
        isDarkMode={isDarkMode}
        onNewPrompt={() => setIsDialogOpen(true)}
        onNewCollection={() => setIsAddCollectionOpen(true)}
      />
      <Toaster />
    </div>
  );
}
