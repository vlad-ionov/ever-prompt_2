import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { PromptCard } from "./PromptCard";
import { AddPromptDialog } from "./AddPromptDialog";
import { EditPromptDialog } from "./EditPromptDialog";
import { AppSidebar } from "./AppSidebar";
import { PromptDetailSheet } from "./PromptDetailSheet";
import { UserSettingsDialog } from "./UserSettingsDialog";
import { CollectionCard } from "./CollectionCard";
import { AddCollectionDialog } from "./AddCollectionDialog";
import { EditCollectionDialog } from "./EditCollectionDialog";
import { CollectionView } from "./CollectionView";
import { AddToCollectionDialog } from "./AddToCollectionDialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "./ui/sheet";
import { VisuallyHidden } from "./ui/visually-hidden";
import { useIsMobile } from "./ui/use-mobile";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  SquaresFour,
  Heart,
  Flame,
  BookmarkSimple,
  GlobeHemisphereEast,
  ChartLineUp,
  MagnifyingGlass,
  ShareNetwork,
  CloudArrowDown,
  PlusCircle,
  List,
  SunDim,
  MoonStars,
  FolderSimplePlus,
  Sparkle,
  ListBullets,
  ClockClockwise,
  FireSimple,
  SortAscending,
  SortDescending,
  CaretDown,
  UserCircle,
  SignOut,
} from "@phosphor-icons/react/dist/ssr";
import { toast } from "sonner";
import { exportPromptsAsJSON, exportPromptsAsPlainText } from "../utils/exportUtils";
import { promptFixtures, collectionFixtures } from "@/lib/mock-data";
import type { Prompt, Collection } from "@/lib/types";
import type { PromptDraft } from "./AddPromptDialog";

interface DashboardProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  demoMode?: boolean;
  onExitDemo?: () => void;
  initialPrompts?: Prompt[];
  initialCollections?: Collection[];
}

export function Dashboard({
  isDarkMode,
  onToggleDarkMode,
  demoMode = false,
  onExitDemo,
  initialPrompts,
  initialCollections,
}: DashboardProps) {
  const { profile, user, signOut } = useAuth();
  const isMobile = useIsMobile();
  const [prompts, setPrompts] = useState<Prompt[]>(() => [
    ...(initialPrompts ?? promptFixtures),
  ]);
  const [collections, setCollections] = useState<Collection[]>(() => [
    ...(initialCollections ?? collectionFixtures),
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedModel, setSelectedModel] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("recent");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [activeView, setActiveView] = useState<string>("all");
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [promptToEdit, setPromptToEdit] = useState<Prompt | null>(null);
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // Collection state
  const [isAddCollectionOpen, setIsAddCollectionOpen] = useState(false);
  const [isEditCollectionOpen, setIsEditCollectionOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [collectionToEdit, setCollectionToEdit] = useState<Collection | null>(null);
  const [isCollectionDetailOpen, setIsCollectionDetailOpen] = useState(false);
  const [viewingCollection, setViewingCollection] = useState(false);
  
  // Add to collection state
  const [isAddToCollectionOpen, setIsAddToCollectionOpen] = useState(false);
  const [promptToAddToCollection, setPromptToAddToCollection] = useState<string | null>(null);

  const cloneCollection = (collection: Collection): Collection => ({
    ...collection,
    promptIds: [...collection.promptIds],
  });

  const handleSavePrompt = async (newPrompt: PromptDraft) => {
    if (demoMode) {
      const prompt: Prompt = {
        id: Date.now().toString(),
        ...newPrompt,
        likes: 0,
        isLiked: false,
        isSaved: false,
        isPublic: false,
        createdAt: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      };
      setPrompts((current) => [prompt, ...current]);
      toast.success("Prompt saved successfully!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("intent", "create");
      formData.append("title", newPrompt.title);
      formData.append("description", newPrompt.description);
      formData.append("model", newPrompt.model);
      formData.append("type", newPrompt.type);
      formData.append("tags", JSON.stringify(newPrompt.tags));
      formData.append("content", newPrompt.content);

      const response = await fetch("/api/prompts", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save prompt");
      }

      const { prompt } = await response.json();
      setPrompts((current) => [prompt, ...current]);
      toast.success("Prompt saved successfully!");
    } catch (error) {
      console.error("Error saving prompt:", error);
      toast.error(error instanceof Error ? error.message : "Failed to save prompt");
    }
  };

  const handleEdit = (id: string) => {
    const prompt = prompts.find((p) => p.id === id);
    if (prompt) {
      setPromptToEdit(prompt);
      setIsEditDialogOpen(true);
    }
  };

  const handleUpdatePrompt = async (id: string, updatedPrompt: {
    title: string;
    description: string;
    model: string;
    type: "video" | "audio" | "image" | "text";
    tags: string[];
    content: string;
  }) => {
    if (demoMode) {
      setPrompts((current) =>
        current.map((p) =>
          p.id === id
            ? { ...p, ...updatedPrompt }
            : p
        )
      );
      toast.success("Prompt updated successfully!");
      if (selectedPrompt?.id === id) {
        setSelectedPrompt({ ...selectedPrompt, ...updatedPrompt });
      }
      return;
    }

    try {
      const formData = new FormData();
      formData.append("intent", "update");
      formData.append("id", id);
      formData.append("title", updatedPrompt.title);
      formData.append("description", updatedPrompt.description);
      formData.append("model", updatedPrompt.model);
      formData.append("type", updatedPrompt.type);
      formData.append("tags", JSON.stringify(updatedPrompt.tags));
      formData.append("content", updatedPrompt.content);

      const response = await fetch("/api/prompts", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update prompt");
      }

      const { prompt } = await response.json();
      setPrompts((current) =>
        current.map((p) => (p.id === id ? prompt : p))
      );
      toast.success("Prompt updated successfully!");
      
      if (selectedPrompt?.id === id) {
        setSelectedPrompt(prompt);
      }
    } catch (error) {
      console.error("Error updating prompt:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update prompt");
    }
  };

  const handleDelete = async (id: string) => {
    if (demoMode) {
      setPrompts((current) => current.filter((p) => p.id !== id));
      toast.success("Prompt deleted");
      if (selectedPrompt?.id === id) {
        setIsDetailSheetOpen(false);
        setSelectedPrompt(null);
      }
      return;
    }

    try {
      const formData = new FormData();
      formData.append("intent", "delete");
      formData.append("id", id);

      const response = await fetch("/api/prompts", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete prompt");
      }

      setPrompts((current) => current.filter((p) => p.id !== id));
      toast.success("Prompt deleted");
      
      if (selectedPrompt?.id === id) {
        setIsDetailSheetOpen(false);
        setSelectedPrompt(null);
      }
    } catch (error) {
      console.error("Error deleting prompt:", error);
      toast.error(error instanceof Error ? error.message : "Failed to delete prompt");
    }
  };

  const copyToClipboard = async (text: string): Promise<void> => {
    // Try modern clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        return;
      } catch (error) {
        // Fall through to fallback method
      }
    }
    
    // Fallback for browsers where clipboard API is blocked
    return new Promise((resolve, reject) => {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      
      try {
        const successful = document.execCommand('copy');
        document.body.removeChild(textarea);
        if (successful) {
          resolve();
        } else {
          reject(new Error('Copy command failed'));
        }
      } catch (error) {
        document.body.removeChild(textarea);
        reject(error);
      }
    });
  };

  const handleCopy = async (id: string) => {
    const prompt = prompts.find((p) => p.id === id);
    if (prompt) {
      try {
        await copyToClipboard(prompt.content);
        toast.success("Prompt copied to clipboard");
      } catch (error) {
        toast.error("Failed to copy prompt");
      }
    }
  };

  const handleShare = (id: string) => {
    toast.success("Share link copied to clipboard");
  };

  const handlePromptClick = (id: string) => {
    const prompt = prompts.find((p) => p.id === id);
    if (prompt) {
      setSelectedPrompt(prompt);
      setIsDetailSheetOpen(true);
    }
  };

  const handleSave = async (id: string) => {
    const prompt = prompts.find((p) => p.id === id);
    if (!prompt) return;

    if (demoMode) {
      setPrompts((current) =>
        current.map((p) =>
          p.id === id
            ? { ...p, isSaved: !p.isSaved }
            : p
        )
      );

      toast.success(prompt.isSaved ? "Removed from saved" : "Saved to your collection");

      if (selectedPrompt?.id === id) {
        setSelectedPrompt({ ...selectedPrompt, isSaved: !selectedPrompt.isSaved });
      }
      return;
    }

    const nextIsSaved = !prompt.isSaved;

    setPrompts((current) =>
      current.map((p) =>
        p.id === id ? { ...p, isSaved: nextIsSaved } : p
      )
    );
    if (selectedPrompt?.id === id) {
      setSelectedPrompt({ ...selectedPrompt, isSaved: nextIsSaved });
    }

    try {
      const formData = new FormData();
      formData.append("intent", "update");
      formData.append("id", id);
      formData.append("is_saved", String(nextIsSaved));

      const response = await fetch("/api/prompts", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const payload = await response.json().catch(() => ({} as Record<string, unknown> | undefined));

      if (!response.ok) {
        throw new Error(
          (payload && typeof payload === "object" && "error" in payload
            ? (payload as { error?: string }).error
            : null) ?? "Failed to update saved state"
        );
      }

      const updatedPrompt = (payload as { prompt?: Prompt } | undefined)?.prompt;
      if (updatedPrompt) {
        setPrompts((current) =>
          current.map((p) => (p.id === id ? updatedPrompt : p))
        );
        if (selectedPrompt?.id === id) {
          setSelectedPrompt(updatedPrompt);
        }
      }

      toast.success(nextIsSaved ? "Saved to your collection" : "Removed from saved");
    } catch (error) {
      setPrompts((current) =>
        current.map((p) =>
          p.id === id ? prompt : p
        )
      );
      if (selectedPrompt?.id === id) {
        setSelectedPrompt(prompt);
      }
      toast.error(error instanceof Error ? error.message : "Failed to update saved state");
    }
  };

  const handleToggleLike = async (id: string) => {
    const prompt = prompts.find((p) => p.id === id);
    if (!prompt) return;

    const calculateLikes = (liked: boolean, currentLikes: number) =>
      liked ? currentLikes + 1 : Math.max(0, currentLikes - 1);

    if (demoMode) {
      const nextIsLiked = !prompt.isLiked;
      const nextLikes = calculateLikes(nextIsLiked, prompt.likes);

      setPrompts((current) =>
        current.map((p) =>
          p.id === id ? { ...p, isLiked: nextIsLiked, likes: nextLikes } : p
        )
      );
      if (selectedPrompt?.id === id) {
        setSelectedPrompt({ ...selectedPrompt, isLiked: nextIsLiked, likes: nextLikes });
      }
      return;
    }

    const nextIsLiked = !prompt.isLiked;
    const nextLikes = calculateLikes(nextIsLiked, prompt.likes);

    setPrompts((current) =>
      current.map((p) =>
        p.id === id ? { ...p, isLiked: nextIsLiked, likes: nextLikes } : p
      )
    );
    if (selectedPrompt?.id === id) {
      setSelectedPrompt({ ...selectedPrompt, isLiked: nextIsLiked, likes: nextLikes });
    }

    try {
      const formData = new FormData();
      formData.append("intent", "update");
      formData.append("id", id);
      formData.append("is_liked", String(nextIsLiked));
      formData.append("likes", nextLikes.toString());

      const response = await fetch("/api/prompts", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const payload = await response.json().catch(() => ({} as Record<string, unknown> | undefined));

      if (!response.ok) {
        throw new Error(
          (payload && typeof payload === "object" && "error" in payload
            ? (payload as { error?: string }).error
            : null) ?? "Failed to update likes"
        );
      }

      const updatedPrompt = (payload as { prompt?: Prompt } | undefined)?.prompt;
      if (updatedPrompt) {
        setPrompts((current) =>
          current.map((p) => (p.id === id ? updatedPrompt : p))
        );
        if (selectedPrompt?.id === id) {
          setSelectedPrompt(updatedPrompt);
        }
      }
    } catch (error) {
      setPrompts((current) =>
        current.map((p) =>
          p.id === id ? prompt : p
        )
      );
      if (selectedPrompt?.id === id) {
        setSelectedPrompt(prompt);
      }
      toast.error(error instanceof Error ? error.message : "Failed to update likes");
    }
  };

  // Collection handlers
  const handleAddCollection = async (collection: { name: string; description: string }) => {
    if (demoMode) {
      const newCollection: Collection = {
        id: Date.now().toString(),
        ...collection,
        promptIds: [],
        createdAt: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        updatedAt: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      };
      setCollections((current) => [newCollection, ...current]);
      toast.success("Collection created successfully!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("intent", "create");
      formData.append("name", collection.name);
      formData.append("description", collection.description);

      const response = await fetch("/api/collections", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create collection");
      }

      const { collection: newCollection } = await response.json();
      setCollections((current) => [newCollection, ...current]);
      toast.success("Collection created successfully!");
    } catch (error) {
      console.error("Error creating collection:", error);
      toast.error(error instanceof Error ? error.message : "Failed to create collection");
    }
  };

  const handleEditCollection = async (id: string, updates: { name: string; description: string }) => {
    if (demoMode) {
      setCollections((current) =>
        current.map((c) =>
          c.id === id
            ? {
                ...c,
                ...updates,
                updatedAt: new Date().toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }),
              }
            : c
        )
      );
      toast.success("Collection updated successfully!");
      if (selectedCollection?.id === id) {
        setSelectedCollection({ ...selectedCollection, ...updates });
      }
      return;
    }

    try {
      const formData = new FormData();
      formData.append("intent", "update");
      formData.append("id", id);
      formData.append("name", updates.name);
      formData.append("description", updates.description);

      const response = await fetch("/api/collections", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update collection");
      }

      const { collection: updatedCollection } = await response.json();
      setCollections((current) =>
        current.map((c) => (c.id === id ? updatedCollection : c))
      );
      toast.success("Collection updated successfully!");
      
      if (selectedCollection?.id === id) {
        setSelectedCollection(updatedCollection);
      }
    } catch (error) {
      console.error("Error updating collection:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update collection");
    }
  };

  const handleDeleteCollection = async (id: string) => {
    if (demoMode) {
      setCollections((current) => current.filter((c) => c.id !== id));
      toast.success("Collection deleted");
      if (selectedCollection?.id === id) {
        setIsCollectionDetailOpen(false);
        setSelectedCollection(null);
      }
      return;
    }

    try {
      const formData = new FormData();
      formData.append("intent", "delete");
      formData.append("id", id);

      const response = await fetch("/api/collections", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete collection");
      }

      setCollections((current) => current.filter((c) => c.id !== id));
      toast.success("Collection deleted");
      
      if (selectedCollection?.id === id) {
        setIsCollectionDetailOpen(false);
        setSelectedCollection(null);
      }
    } catch (error) {
      console.error("Error deleting collection:", error);
      toast.error(error instanceof Error ? error.message : "Failed to delete collection");
    }
  };

  const handleCollectionClick = (id: string) => {
    const collection = collections.find((c) => c.id === id);
    if (collection) {
      setSelectedCollection(collection);
      setViewingCollection(true);
    }
  };

  const handleBackFromCollection = () => {
    setViewingCollection(false);
    setSelectedCollection(null);
  };

  const handleCollectionEdit = (id: string) => {
    const collection = collections.find((c) => c.id === id);
    if (collection) {
      setCollectionToEdit(collection);
      setIsEditCollectionOpen(true);
    }
  };

  const handleAddPromptsToCollection = async (promptIds: string[]) => {
    if (!selectedCollection || promptIds.length === 0) return;

    if (demoMode) {
      setCollections((current) =>
        current.map((c) =>
          c.id === selectedCollection.id
            ? {
                ...c,
                promptIds: [...new Set([...c.promptIds, ...promptIds])],
                updatedAt: new Date().toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }),
              }
            : c
        )
      );

      setSelectedCollection((current) =>
        current && current.id === selectedCollection.id
          ? {
              ...current,
              promptIds: [...new Set([...current.promptIds, ...promptIds])],
            }
          : current
      );

      toast.success(`Added ${promptIds.length} ${promptIds.length === 1 ? "prompt" : "prompts"} to collection`);
      return;
    }

    const collectionId = selectedCollection.id;
    const previous = cloneCollection(selectedCollection);
    const nextPromptIds = [...new Set([...selectedCollection.promptIds, ...promptIds])];

    setCollections((current) =>
      current.map((c) =>
        c.id === collectionId
          ? {
              ...c,
              promptIds: nextPromptIds,
              updatedAt: new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }),
            }
          : c
      )
    );

    setSelectedCollection((current) =>
      current && current.id === collectionId ? { ...current, promptIds: nextPromptIds } : current
    );

    try {
      const formData = new FormData();
      formData.append("intent", "update");
      formData.append("id", collectionId);
      formData.append("prompt_ids", JSON.stringify(nextPromptIds));

      const response = await fetch("/api/collections", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const payload = await response.json().catch(() => ({} as Record<string, unknown> | undefined));

      if (!response.ok) {
        throw new Error(
          (payload && typeof payload === "object" && "error" in payload
            ? (payload as { error?: string }).error
            : null) ?? "Failed to update collection"
        );
      }

      const updatedCollection = (payload as { collection?: Collection } | undefined)?.collection;
      if (updatedCollection) {
        setCollections((current) =>
          current.map((c) => (c.id === collectionId ? updatedCollection : c))
        );
        setSelectedCollection((current) =>
          current && current.id === collectionId ? updatedCollection : current
        );
      }

      toast.success(`Added ${promptIds.length} ${promptIds.length === 1 ? "prompt" : "prompts"} to collection`);
    } catch (error) {
      setCollections((current) =>
        current.map((c) => (c.id === collectionId ? previous : c))
      );
      setSelectedCollection((current) =>
        current && current.id === collectionId ? previous : current
      );
      toast.error(error instanceof Error ? error.message : "Failed to update collection");
    }
  };

  const handleRemovePromptFromCollection = async (promptId: string) => {
    if (!selectedCollection) return;

    if (demoMode) {
      setCollections((current) =>
        current.map((c) =>
          c.id === selectedCollection.id
            ? {
                ...c,
                promptIds: c.promptIds.filter((id) => id !== promptId),
                updatedAt: new Date().toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }),
              }
            : c
        )
      );

      setSelectedCollection((current) =>
        current && current.id === selectedCollection.id
          ? {
              ...current,
              promptIds: current.promptIds.filter((id) => id !== promptId),
            }
          : current
      );

      toast.success("Prompt removed from collection");
      return;
    }

    const collectionId = selectedCollection.id;
    const previous = cloneCollection(selectedCollection);
    const nextPromptIds = selectedCollection.promptIds.filter((id) => id !== promptId);

    setCollections((current) =>
      current.map((c) =>
        c.id === collectionId
          ? {
              ...c,
              promptIds: nextPromptIds,
              updatedAt: new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }),
            }
          : c
      )
    );

    setSelectedCollection((current) =>
      current && current.id === collectionId ? { ...current, promptIds: nextPromptIds } : current
    );

    try {
      const formData = new FormData();
      formData.append("intent", "update");
      formData.append("id", collectionId);
      formData.append("prompt_ids", JSON.stringify(nextPromptIds));

      const response = await fetch("/api/collections", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const payload = await response.json().catch(() => ({} as Record<string, unknown> | undefined));

      if (!response.ok) {
        throw new Error(
          (payload && typeof payload === "object" && "error" in payload
            ? (payload as { error?: string }).error
            : null) ?? "Failed to update collection"
        );
      }

      const updatedCollection = (payload as { collection?: Collection } | undefined)?.collection;
      if (updatedCollection) {
        setCollections((current) =>
          current.map((c) => (c.id === collectionId ? updatedCollection : c))
        );
        setSelectedCollection((current) =>
          current && current.id === collectionId ? updatedCollection : current
        );
      }

      toast.success("Prompt removed from collection");
    } catch (error) {
      setCollections((current) =>
        current.map((c) => (c.id === collectionId ? previous : c))
      );
      setSelectedCollection((current) =>
        current && current.id === collectionId ? previous : current
      );
      toast.error(error instanceof Error ? error.message : "Failed to update collection");
    }
  };

  const handleToggleVisibility = async (id: string) => {
    const prompt = prompts.find((p) => p.id === id);
    if (!prompt) return;

    if (demoMode) {
      setPrompts((current) =>
        current.map((p) =>
          p.id === id ? { ...p, isPublic: !p.isPublic } : p
        )
      );

      toast.success(prompt.isPublic ? "Prompt is now private" : "Prompt is now public");

      if (selectedPrompt?.id === id) {
        setSelectedPrompt({ ...selectedPrompt, isPublic: !selectedPrompt.isPublic });
      }
      return;
    }

    const nextIsPublic = !prompt.isPublic;

    const previousPrompt = prompt;

    setPrompts((current) =>
      current.map((p) =>
        p.id === id ? { ...p, isPublic: nextIsPublic } : p
      )
    );
    if (selectedPrompt?.id === id) {
      setSelectedPrompt({ ...selectedPrompt, isPublic: nextIsPublic });
    }

    try {
      const formData = new FormData();
      formData.append("intent", "update");
      formData.append("id", id);
      formData.append("is_public", String(nextIsPublic));

      const response = await fetch("/api/prompts", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const payload = await response.json().catch(() => ({} as Record<string, unknown> | undefined));

      if (!response.ok) {
        throw new Error(
          (payload && typeof payload === "object" && "error" in payload
            ? (payload as { error?: string }).error
            : null) ?? "Failed to update prompt visibility"
        );
      }

      const updatedPrompt = (payload as { prompt?: Prompt } | undefined)?.prompt;
      if (updatedPrompt) {
        setPrompts((current) =>
          current.map((p) => (p.id === id ? updatedPrompt : p))
        );
        if (selectedPrompt?.id === id) {
          setSelectedPrompt(updatedPrompt);
        }
      }

      toast.success(nextIsPublic ? "Prompt is now public" : "Prompt is now private");
    } catch (error) {
      setPrompts((current) =>
        current.map((p) =>
          p.id === id ? previousPrompt : p
        )
      );
      if (selectedPrompt?.id === id) {
        setSelectedPrompt(prompt);
      }
      toast.error(error instanceof Error ? error.message : "Failed to update visibility");
    }
  };

  const handleAddToCollection = (id: string) => {
    setPromptToAddToCollection(id);
    setIsAddToCollectionOpen(true);
  };

  const handleAddToSelectedCollections = async (collectionIds: string[]) => {
    if (!promptToAddToCollection) return;

    const uniqueIds = Array.from(new Set(collectionIds));
    if (uniqueIds.length === 0) return;

    if (demoMode) {
      setCollections((current) =>
        current.map((c) =>
          uniqueIds.includes(c.id)
            ? {
                ...c,
                promptIds: [...new Set([...c.promptIds, promptToAddToCollection])],
                updatedAt: new Date().toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }),
              }
            : c
        )
      );

      setSelectedCollection((current) =>
        current && uniqueIds.includes(current.id)
          ? {
              ...current,
              promptIds: [...new Set([...current.promptIds, promptToAddToCollection])],
            }
          : current
      );

      const count = uniqueIds.length;
      toast.success(`Added to ${count} collection${count === 1 ? "" : "s"}`);
      return;
    }

    const updates = uniqueIds
      .map((id) => {
        const found = collections.find((collection) => collection.id === id);
        if (!found) return null;
        const nextPromptIds = [...new Set([...found.promptIds, promptToAddToCollection])];
        return {
          id,
          nextPromptIds,
          previous: cloneCollection(found),
        };
      })
      .filter((value): value is { id: string; nextPromptIds: string[]; previous: Collection } => Boolean(value));

    if (updates.length === 0) {
      return;
    }

    const updateMap = new Map(updates.map((update) => [update.id, update]));

    setCollections((current) =>
      current.map((collection) => {
        const record = updateMap.get(collection.id);
        if (!record) return collection;
        return {
          ...collection,
          promptIds: record.nextPromptIds,
          updatedAt: new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
        };
      })
    );

    setSelectedCollection((current) => {
      if (!current) return current;
      const record = updateMap.get(current.id);
      return record ? { ...current, promptIds: record.nextPromptIds } : current;
    });

    try {
      const updatedResults = await Promise.all(
        updates.map(async ({ id, nextPromptIds }) => {
          const formData = new FormData();
          formData.append("intent", "update");
          formData.append("id", id);
          formData.append("prompt_ids", JSON.stringify(nextPromptIds));

          const response = await fetch("/api/collections", {
            method: "POST",
            body: formData,
            credentials: "include",
          });
          const payload = await response.json().catch(() => ({} as Record<string, unknown> | undefined));

          if (!response.ok) {
            throw new Error(
              (payload && typeof payload === "object" && "error" in payload
                ? (payload as { error?: string }).error
                : null) ?? "Failed to update collection"
            );
          }

          const updatedCollection = (payload as { collection?: Collection } | undefined)?.collection;
          if (!updatedCollection) {
            throw new Error("Collection response was missing data");
          }

          return updatedCollection;
        })
      );

      const updatedMap = new Map(updatedResults.map((collection) => [collection.id, collection]));

      setCollections((current) =>
        current.map((collection) => updatedMap.get(collection.id) ?? collection)
      );

      setSelectedCollection((current) => {
        if (!current) return current;
        return updatedMap.get(current.id) ?? current;
      });

      const count = updates.length;
      toast.success(`Added to ${count} collection${count === 1 ? "" : "s"}`);
    } catch (error) {
      setCollections((current) =>
        current.map((collection) => {
          const record = updateMap.get(collection.id);
          return record ? record.previous : collection;
        })
      );

      setSelectedCollection((current) => {
        if (!current) return current;
        const record = updateMap.get(current.id);
        return record ? record.previous : current;
      });

      toast.error(error instanceof Error ? error.message : "Failed to update collections");
    }
  };

  const filteredPrompts = prompts
    .filter((prompt) => {
      const matchesSearch =
        prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );
      const matchesModel =
        selectedModel === "all" || prompt.model === selectedModel;
      const matchesType =
        selectedType === "all" || prompt.type === selectedType;
      const matchesView =
        activeView === "all" ||
        (activeView === "personal" && !prompt.isPublic) ||
        (activeView === "public" && prompt.isPublic) ||
        (activeView === "favorites" && prompt.isLiked) ||
        (activeView === "saved" && prompt.isSaved);
      return matchesSearch && matchesModel && matchesType && matchesView;
    })
    .sort((a, b) => {
      if (sortBy === "popular") {
        return b.likes - a.likes;
      }
      if (sortBy === "alphabetical-asc") {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === "alphabetical-desc") {
        return b.title.localeCompare(a.title);
      }
      return 0; // recent keeps original order
    });

  const modelOptions = [
    "all",
    ...Array.from(
      new Set(
        prompts
          .map((prompt) => prompt.model)
          .filter((model): model is string => Boolean(model && model.trim())),
      ),
    ),
  ];
  const typeOptions = [
    { value: "all", label: "All Types" },
    { value: "text", label: "Text" },
    { value: "video", label: "Video" },
    { value: "audio", label: "Audio" },
    { value: "image", label: "Image" },
  ];
  const promptCounts = {
    all: prompts.length,
    personal: prompts.filter((p) => !p.isPublic).length,
    public: prompts.filter((p) => p.isPublic).length,
    favorites: prompts.filter((p) => p.isLiked).length,
    saved: prompts.filter((p) => p.isSaved).length,
  };

  const stats = {
    total: prompts.length,
    favorites: prompts.filter((p) => p.isLiked).length,
    totalLikes: prompts.reduce((sum, p) => sum + p.likes, 0),
    saved: prompts.filter((p) => p.isSaved).length,
    public: prompts.filter((p) => p.isPublic).length,
    private: prompts.filter((p) => !p.isPublic).length,
    avgLikes: Math.round(prompts.reduce((sum, p) => sum + p.likes, 0) / prompts.length) || 0,
  };

  const sortOptions = [
    {
      value: "recent",
      label: "Recent",
      description: "Newest prompts first",
      icon: ClockClockwise,
    },
    {
      value: "popular",
      label: "Popular",
      description: "Most liked and copied",
      icon: FireSimple,
    },
    {
      value: "alphabetical-asc",
      label: "Name (A–Z)",
      description: "Alphabetical ascending",
      icon: SortAscending,
    },
    {
      value: "alphabetical-desc",
      label: "Name (Z–A)",
      description: "Alphabetical descending",
      icon: SortDescending,
    },
  ];

  const summaryCards = [
    {
      id: "total",
      label: "Total Prompts",
      value: stats.total,
      icon: SquaresFour,
      iconBg: isDarkMode ? "bg-[#f4f1ff]" : "bg-[#fdecef]",
      iconColor: isDarkMode ? "text-[#bb9af7]" : "text-[#e11d48]",
    },
    {
      id: "favorites",
      label: "Favorites",
      value: stats.favorites,
      icon: Heart,
      iconBg: isDarkMode ? "bg-[#fdf3f2]" : "bg-[#fff0ed]",
      iconColor: "text-[#f97316]",
    },
    {
      id: "likes",
      label: "Total Likes",
      value: stats.totalLikes,
      icon: Flame,
      iconBg: isDarkMode ? "bg-[#fff1f2]" : "bg-[#ffe4e6]",
      iconColor: "text-[#ef4444]",
    },
    {
      id: "saved",
      label: "Saved",
      value: stats.saved,
      icon: BookmarkSimple,
      iconBg: isDarkMode ? "bg-[#ebf8ff]" : "bg-[#e0f2fe]",
      iconColor: "text-[#0ea5e9]",
    },
    {
      id: "public",
      label: "Public",
      value: stats.public,
      icon: GlobeHemisphereEast,
      iconBg: isDarkMode ? "bg-[#ecfdf5]" : "bg-[#dcfce7]",
      iconColor: "text-[#22c55e]",
    },
    {
      id: "avg",
      label: "Avg Likes",
      value: stats.avgLikes,
      icon: ChartLineUp,
      iconBg: isDarkMode ? "bg-[#eff6ff]" : "bg-[#e0f2ff]",
      iconColor: "text-[#3b82f6]",
    },
  ];

  const viewLabels: Record<string, string> = {
    all: "All Prompts",
    personal: "My Prompts",
    public: "Public Library",
    favorites: "Favorites",
    saved: "Saved",
    collections: "Collections",
  };

  const filterPills = modelOptions.map((model) => ({
    value: model,
    label: model === "all" ? "All" : model,
    icon: model === "all" ? Sparkle : ListBullets,
  }));

  const selectedSortOption = sortOptions.find((option) => option.value === sortBy) ?? sortOptions[0];
  const SelectedSortIcon = selectedSortOption.icon;

  const rawUserEmail = demoMode ? "demo@promptvault.io" : profile?.email ?? user?.email ?? "";
  const computedNameFromEmail = rawUserEmail ? rawUserEmail.split("@")[0] : "";
  const userDisplayName = demoMode
    ? "Demo User"
    : (profile?.name?.trim() || (user?.user_metadata?.name as string | undefined)?.trim() || computedNameFromEmail || "User");
  const userSecondaryText = demoMode ? "Preview workspace" : rawUserEmail;
  const avatarSeed = demoMode ? "demo-user" : rawUserEmail || userDisplayName || "user";
  const avatarUrl =
    profile?.avatar_url ||
    (user?.user_metadata?.avatar_url as string | undefined) ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(avatarSeed)}`;

  const activeViewLabel = viewLabels[activeView] ?? "Prompts";
  const activeViewTotal =
    viewingCollection && selectedCollection
      ? selectedCollection.promptIds.length
      : activeView === "collections"
        ? collections.length
        : filteredPrompts.length;

  const viewToggleControls = (
    <>
      <Button
        variant={viewMode === "grid" ? "default" : "outline"}
        size="icon"
        onClick={() => setViewMode("grid")}
        className={
          viewMode === "grid"
            ? isDarkMode
              ? "bg-[#8b5cf6] text-white hover:bg-[#7c3aed]"
              : "bg-[#E11D48] text-white hover:bg-[#BE123C]"
            : isDarkMode
            ? "border-[#27272a] bg-[#0f0f11] text-[#a1a1aa] hover:text-[#8b5cf6] hover:border-[#8b5cf6] hover:bg-[#18181b]"
            : "border-[#d4d4d4] text-[#868686] hover:text-[#E11D48] hover:border-[#E11D48]"
        }
      >
        <SquaresFour className="h-5 w-5" weight="regular" />
      </Button>
      <Button
        variant={viewMode === "list" ? "default" : "outline"}
        size="icon"
        onClick={() => setViewMode("list")}
        className={
          viewMode === "list"
            ? isDarkMode
              ? "bg-[#8b5cf6] text-white hover:bg-[#7c3aed]"
              : "bg-[#E11D48] text-white hover:bg-[#BE123C]"
            : isDarkMode
            ? "border-[#27272a] bg-[#0f0f11] text-[#a1a1aa] hover:text-[#8b5cf6] hover:border-[#8b5cf6] hover:bg-[#18181b]"
            : "border-[#d4d4d4] text-[#868686] hover:text-[#E11D48] hover:border-[#E11D48]"
        }
      >
        <List className="h-5 w-5" weight="regular" />
      </Button>
    </>
  );

  const handleLogout = async () => {
    if (demoMode && onExitDemo) {
      onExitDemo();
    } else {
      try {
        await signOut();
      } catch (error) {
        console.error('Sign out error:', error);
      }
    }
  };

  const sidebarContent = (
    <AppSidebar
      isDarkMode={isDarkMode}
      activeView={activeView}
      onViewChange={(view) => {
        setActiveView(view);
        if (isMobile) setIsSidebarOpen(false);
      }}
      promptCounts={promptCounts}
      collectionsCount={collections.length}
      onOpenSettings={() => {
        setIsSettingsOpen(true);
        if (isMobile) setIsSidebarOpen(false);
      }}
      onLogout={handleLogout}
      isCollapsed={!isMobile && isSidebarCollapsed}
      onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      userProfile={profile}
      demoMode={demoMode}
    />
  );

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      {!isMobile && sidebarContent}
      
      {/* Mobile Sidebar */}
      {isMobile && (
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetContent side="left" className={`p-0 w-64 ${isDarkMode ? 'bg-[#0f0f11] border-[#27272a]' : 'bg-white border-[#d4d4d4]'}`}>
            <VisuallyHidden>
              <SheetTitle>Navigation Menu</SheetTitle>
              <SheetDescription>Access filters, sorting options, and navigation for your prompts</SheetDescription>
            </VisuallyHidden>
            {sidebarContent}
          </SheetContent>
        </Sheet>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Demo Mode Banner */}
        {demoMode && (
          <div className={`${isDarkMode ? 'bg-[#8b5cf6]' : 'bg-[#E11D48]'} text-white px-4 py-2 flex items-center justify-between`}>
            <p className="text-sm">
              <strong>Demo Mode:</strong> You&apos;re viewing sample data. Sign up to save your own prompts!
            </p>
            <Button
              size="sm"
              variant="ghost"
              onClick={onExitDemo}
              className="text-white hover:bg-white/20 hover:text-white"
            >
              Exit Demo
            </Button>
          </div>
        )}
        
        {/* Header */}
        <header className={`${isDarkMode ? 'bg-[#09090b] border-[#27272a]' : 'bg-white border-[#d4d4d4]'} border-b sticky top-0 z-10 backdrop-blur-sm`}>
          <div className="px-4 md:px-6 py-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex w-full items-center gap-3">
                {isMobile && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsSidebarOpen(true)}
                    className={`${isDarkMode ? 'text-[#fafafa] hover:bg-[#18181b]' : 'text-[#333333] hover:bg-[#f5f5f5]'}`}
                  >
                    <ListBullets className="h-5 w-5" weight="regular" />
                  </Button>
                )}
                <div className="relative flex-1">
                  <MagnifyingGlass className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${isDarkMode ? 'text-[#71717a]' : 'text-[#868686]'}`} weight="regular" />
                  <Input
                    placeholder="Search prompts by title, tags, or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`pl-10 ${isDarkMode ? 'border-[#27272a] bg-[#0f0f11] text-[#fafafa] placeholder:text-[#52525b] focus-visible:ring-[#8b5cf6]' : 'border-[#d4d4d4] bg-[#fafafa] focus-visible:ring-[#E11D48]'}`}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 md:gap-3">
                <Button
                  variant="outline"
                  className={`${isDarkMode ? 'border-[#27272a] bg-[#0f0f11] text-[#a1a1aa] hover:text-[#8b5cf6] hover:border-[#8b5cf6]' : 'border-[#d4d4d4] bg-white text-[#333333] hover:text-[#E11D48] hover:border-[#E11D48]'}`}
                  onClick={() => toast.success("Share link copied to clipboard")}
                >
                  <ShareNetwork className="mr-2 h-5 w-5" weight="regular" />
                  <span className="hidden sm:inline">Share</span>
                </Button>
                <Button
                  onClick={onToggleDarkMode}
                  variant="outline"
                  size="icon"
                  className={`${isDarkMode ? 'border-[#27272a] bg-[#0f0f11] text-[#a1a1aa] hover:text-[#8b5cf6] hover:border-[#8b5cf6]' : 'border-[#d4d4d4] bg-white hover:bg-[#f5f5f5] text-[#333333]'}`}
                >
                  {isDarkMode ? (
                    <SunDim className="h-5 w-5" weight="regular" />
                  ) : (
                    <MoonStars className="h-5 w-5" weight="regular" />
                  )}
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className={`${isDarkMode ? 'border-[#27272a] bg-[#0f0f11] text-[#a1a1aa] hover:text-[#8b5cf6] hover:border-[#8b5cf6]' : 'border-[#d4d4d4] bg-white hover:bg-[#f5f5f5] text-[#333333]'}`}
                    >
                      <CloudArrowDown className="h-5 w-5" weight="regular" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className={`${isDarkMode ? 'bg-[#18181b] border-[#27272a]' : 'bg-white border-[#d4d4d4]'}`}>
                    <DropdownMenuItem
                      onClick={() => {
                        if (filteredPrompts.length === 0) {
                          toast.error("No prompts to export");
                          return;
                        }
                        exportPromptsAsJSON(filteredPrompts);
                        toast.success("Prompts exported as JSON");
                      }}
                      className={`${isDarkMode ? 'text-[#fafafa] hover:bg-[#27272a]' : 'text-[#333333] hover:bg-[#f5f5f5]'}`}
                    >
                      <ListBullets className="h-5 w-5 mr-2" weight="regular" />
                      Export as JSON
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        if (filteredPrompts.length === 0) {
                          toast.error("No prompts to export");
                          return;
                        }
                        exportPromptsAsPlainText(filteredPrompts);
                        toast.success("Prompts exported as Text");
                      }}
                      className={`${isDarkMode ? 'text-[#fafafa] hover:bg-[#27272a]' : 'text-[#333333] hover:bg-[#f5f5f5]'}`}
                    >
                      <List className="h-5 w-5 mr-2" weight="regular" />
                      Export as Text
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  onClick={() =>
                    activeView === "collections" ? setIsAddCollectionOpen(true) : setIsDialogOpen(true)
                  }
                  className={`${isDarkMode ? 'bg-[#8b5cf6] text-white hover:bg-[#7c3aed]' : 'bg-[#E11D48] text-white hover:bg-[#BE123C]'}`}
                >
                  {activeView === "collections" ? (
                    <FolderSimplePlus className="h-5 w-5 md:mr-2" weight="regular" />
                  ) : (
                    <PlusCircle className="h-5 w-5 md:mr-2" weight="regular" />
                  )}
                  <span className="hidden md:inline">
                    {activeView === "collections" ? "New Collection" : "Add Prompt"}
                  </span>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className={`${
                        isDarkMode
                          ? "border border-transparent hover:border-[#27272a]"
                          : "border border-transparent hover:border-[#e5e5e5]"
                      } inline-flex items-center gap-2 rounded-full pl-1 pr-3 h-11`}
                    >
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={avatarUrl} alt={userDisplayName} />
                        <AvatarFallback>{userDisplayName.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="hidden sm:flex flex-col text-left">
                        <span className={`${isDarkMode ? 'text-[#fafafa]' : 'text-[#333333]'} text-sm leading-tight`}>{userDisplayName}</span>
                        <span className={`${isDarkMode ? 'text-[#71717a]' : 'text-[#868686]'} text-xs leading-tight`}>{userSecondaryText}</span>
                      </div>
                      <CaretDown className={`${isDarkMode ? 'text-[#71717a]' : 'text-[#868686]'} h-4 w-4`} weight="regular" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className={`${
                      isDarkMode ? 'bg-[#0f0f11] border-[#27272a]' : 'bg-white border-[#d4d4d4]'
                    } w-64 rounded-2xl p-2 shadow-lg`}
                  >
                    <div className={`${isDarkMode ? 'bg-[#111113]' : 'bg-[#f5f5f7]'} rounded-xl px-3 py-3 mb-2`}>
                      <p className={`${isDarkMode ? 'text-[#fafafa]' : 'text-[#333333]'} text-sm font-medium`}>{userDisplayName}</p>
                      <p className={`${isDarkMode ? 'text-[#8e8e9a]' : 'text-[#9a9aa1]'} text-xs`}>{userSecondaryText}</p>
                    </div>
                    {!demoMode && (
                      <DropdownMenuItem
                        onClick={() => setIsSettingsOpen(true)}
                        className={`${isDarkMode ? 'text-[#fafafa]' : 'text-[#333333]'} rounded-xl px-3 py-2`}
                      >
                        <UserCircle className="mr-3 h-5 w-5" weight="regular" />
                        Account Settings
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={() => {
                        if (demoMode) {
                          onExitDemo?.();
                        } else {
                          void handleLogout();
                        }
                      }}
                      className={`rounded-xl px-3 py-2 ${
                        demoMode ? (isDarkMode ? 'text-[#fafafa]' : 'text-[#333333]') : 'text-[#E11D48]'
                      }`}
                    >
                      <SignOut className="mr-3 h-5 w-5" weight="regular" />
                      {demoMode ? 'Exit Demo' : 'Sign Out'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          <div
            className={`${viewingCollection ? "" : "px-4 md:px-6 py-4 md:py-8"} flex-1 overflow-y-auto ${
              isDarkMode ? "bg-[#09090b]" : "bg-[#EEECEA]"
            }`}
          >
            {/* Show CollectionView when viewing a collection */}
            {viewingCollection && selectedCollection ? (
              <CollectionView
                collection={selectedCollection}
                prompts={prompts.filter((p) => selectedCollection.promptIds.includes(p.id))}
                allPrompts={prompts}
                isDarkMode={isDarkMode}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                onBack={handleBackFromCollection}
                onRemovePrompt={handleRemovePromptFromCollection}
                onAddPrompts={handleAddPromptsToCollection}
                onPromptClick={handlePromptClick}
                onPromptEdit={handleEdit}
                onPromptDelete={handleDelete}
                onPromptShare={handleShare}
                onPromptCopy={handleCopy}
                onPromptLike={handleToggleLike}
                onPromptSave={handleSave}
                onPromptToggleVisibility={handleToggleVisibility}
                onPromptAddToCollection={handleAddToCollection}
              />
            ) : (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h2 className={`${isDarkMode ? "text-[#fafafa]" : "text-[#333333]"} text-lg font-semibold`}>
                      {activeViewLabel}
                    </h2>
                    <span className={`${isDarkMode ? "text-[#a1a1aa]" : "text-[#868686]"}`}>
                      {activeViewTotal} {activeViewTotal === 1 ? "item" : "items"}
                    </span>
                  </div>
                </div>

                {activeView !== "collections" && (
                  <>
                    <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
                      {summaryCards.map((card) => {
                        const Icon = card.icon;
                        return (
                          <div
                            key={card.id}
                            className={`flex items-center gap-3 rounded-2xl border px-4 py-3 ${
                              isDarkMode ? "bg-[#0f0f11] border-[#27272a]" : "bg-white border-[#e5e5e5]"
                            }`}
                          >
                            <div
                              className={`h-10 w-10 rounded-full flex items-center justify-center ${card.iconBg}`}
                            >
                              <Icon className={`h-5 w-5 ${card.iconColor}`} weight="regular" />
                            </div>
                            <div className="min-w-0">
                              <p className={`text-xs ${isDarkMode ? "text-[#71717a]" : "text-[#868686]"} truncate`}>
                                {card.label}
                              </p>
                              <p className={`${isDarkMode ? "text-[#fafafa]" : "text-[#333333]"} text-lg font-semibold`}>
                                {card.value}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div className="flex flex-wrap items-center gap-2">
                        {filterPills.map((pill) => {
                          const isActive = selectedModel === pill.value;
                          return (
                            <Button
                              key={pill.value}
                              variant="outline"
                              className={`rounded-full px-4 ${
                                isActive
                                  ? isDarkMode
                                    ? "bg-[#8b5cf6] text-white border-[#8b5cf6]"
                                    : "bg-[#E11D48] text-white border-[#E11D48]"
                                  : isDarkMode
                                  ? "border-[#27272a] text-[#a1a1aa] hover:text-[#fafafa]"
                                  : "border-[#e5e5e5] text-[#666666] hover:text-[#E11D48]"
                              }`}
                              onClick={() => setSelectedModel(pill.value)}
                            >
                              <pill.icon className="mr-2 h-4 w-4" weight="regular" />
                              {pill.label}
                            </Button>
                          );
                        })}
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <Select value={sortBy} onValueChange={setSortBy}>
                          <SelectTrigger
                            className={`min-w-[200px] justify-between rounded-full px-4 h-11 ${
                              isDarkMode
                                ? "border-[#27272a] bg-[#0f0f11] text-[#fafafa]"
                                : "border-[#d4d4d4] bg-white text-[#333333]"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <SelectedSortIcon className="h-5 w-5" weight="regular" />
                              <span>{selectedSortOption.label}</span>
                            </div>
                            <List className="h-4 w-4" weight="regular" />
                          </SelectTrigger>
                          <SelectContent
                            className={`rounded-3xl p-2 shadow-lg ${
                              isDarkMode ? "bg-[#0f0f11] border-[#27272a] text-[#fafafa]" : "bg-white border-[#d4d4d4]"
                            }`}
                          >
                            {sortOptions.map((option) => {
                              const Icon = option.icon;
                              return (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                  className={`rounded-2xl px-3 py-2 ${
                                    isDarkMode ? "data-[state=checked]:bg-[#1f1f24]" : "data-[state=checked]:bg-[#f1f1f3]"
                                  }`}
                                >
                                  <div className="flex items-start gap-3">
                                    <Icon className="mt-0.5 h-5 w-5" weight="regular" />
                                    <div className="text-left">
                                      <p className={isDarkMode ? "text-[#fafafa]" : "text-[#333333]"}>{option.label}</p>
                                      <p className={`text-xs ${isDarkMode ? "text-[#71717a]" : "text-[#868686]"}`}>
                                        {option.description}
                                      </p>
                                    </div>
                                  </div>
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                        <Select value={selectedType} onValueChange={setSelectedType}>
                          <SelectTrigger
                            className={`min-w-[160px] ${
                              isDarkMode
                                ? "border-[#27272a] bg-[#0f0f11] text-[#fafafa]"
                                : "border-[#d4d4d4] bg-white text-[#333333]"
                            }`}
                          >
                            <SelectValue placeholder="All Types" />
                          </SelectTrigger>
                          <SelectContent
                            className={
                              isDarkMode ? "bg-[#0f0f11] border-[#27272a] text-[#fafafa]" : "bg-white border-[#d4d4d4]"
                            }
                          >
                            {typeOptions.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <div className="flex items-center gap-2">{viewToggleControls}</div>
                      </div>
                    </div>
                  </>
                )}

                {activeView === "collections" && (
                  <div className="mb-6 flex justify-end">
                    <div className="flex items-center gap-2">{viewToggleControls}</div>
                  </div>
                )}

                {/* Collections or Prompts Grid */}
                {activeView === "collections" ? (
                  collections.length === 0 ? (
                    <div className="text-center py-12 md:py-16">
                      <FolderSimplePlus
                        className={`h-12 w-12 ${
                          isDarkMode ? "text-[#8b5cf6]" : "text-[#E11D48]"
                        } mx-auto mb-4`}
                        weight="regular"
                      />
                      <p className={`text-sm md:text-base mb-2 ${isDarkMode ? "text-[#fafafa]" : "text-[#333333]"}`}>
                        No collections yet
                      </p>
                      <p className={`text-sm md:text-base mb-4 ${isDarkMode ? "text-[#a1a1aa]" : "text-[#868686]"}`}>
                        Create collections to organize your private prompts
                      </p>
                      <Button
                        onClick={() => setIsAddCollectionOpen(true)}
                        className={
                          isDarkMode
                            ? "bg-[#8b5cf6] text-white hover:bg-[#7c3aed]"
                            : "bg-[#E11D48] text-white hover:bg-[#BE123C]"
                        }
                      >
                        <FolderSimplePlus className="h-5 w-5 mr-2" weight="regular" />
                        Create Collection
                      </Button>
                    </div>
                  ) : (
                    <div
                      className={
                        viewMode === "grid"
                          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4"
                          : "space-y-3 md:space-y-4"
                      }
                    >
                      {collections.map((collection) => (
                        <CollectionCard
                          key={collection.id}
                          {...collection}
                          promptCount={collection.promptIds.length}
                          isDarkMode={isDarkMode}
                          viewMode={viewMode}
                          onClick={handleCollectionClick}
                          onEdit={handleCollectionEdit}
                          onDelete={handleDeleteCollection}
                        />
                      ))}
                    </div>
                  )
                ) : filteredPrompts.length === 0 ? (
                  <div className="text-center py-12 md:py-16">
                    <Sparkle
                      className={`h-10 w-10 md:h-12 md:w-12 ${
                        isDarkMode ? "text-[#52525b]" : "text-[#868686]"
                      } mx-auto mb-4`}
                      weight="regular"
                    />
                    <p className={`text-sm md:text-base ${isDarkMode ? "text-[#a1a1aa]" : "text-[#868686]"}`}>
                      No prompts found. Try adjusting your filters.
                    </p>
                  </div>
                ) : (
                  <div
                    className={
                      viewMode === "grid"
                        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4"
                        : "space-y-3 md:space-y-4"
                    }
                  >
                    {filteredPrompts.map((prompt) => (
                      <PromptCard
                        key={prompt.id}
                        {...prompt}
                        isDarkMode={isDarkMode}
                        viewMode={viewMode}
                        onClick={handlePromptClick}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onShare={handleShare}
                        onCopy={handleCopy}
                        onLike={handleToggleLike}
                        onSave={handleSave}
                        onToggleVisibility={handleToggleVisibility}
                        onAddToCollection={handleAddToCollection}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Add Prompt Dialog */}
      <AddPromptDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSavePrompt}
        isDarkMode={isDarkMode}
      />

      {/* Edit Prompt Dialog */}
      <EditPromptDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        prompt={promptToEdit}
        onSave={handleUpdatePrompt}
        isDarkMode={isDarkMode}
      />

      {/* Prompt Detail Sheet */}
      <PromptDetailSheet
        open={isDetailSheetOpen}
        onOpenChange={setIsDetailSheetOpen}
        prompt={selectedPrompt}
        isDarkMode={isDarkMode}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSave={handleSave}
        onToggleVisibility={handleToggleVisibility}
        onAddToCollection={handleAddToCollection}
        onLike={handleToggleLike}
      />

      {/* User Settings Dialog */}
      <UserSettingsDialog
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        isDarkMode={isDarkMode}
        onToggleDarkMode={onToggleDarkMode}
      />

      {/* Add Collection Dialog */}
      <AddCollectionDialog
        open={isAddCollectionOpen}
        onOpenChange={setIsAddCollectionOpen}
        onAdd={handleAddCollection}
        isDarkMode={isDarkMode}
      />

      {/* Edit Collection Dialog */}
      <EditCollectionDialog
        open={isEditCollectionOpen}
        onOpenChange={setIsEditCollectionOpen}
        collection={collectionToEdit}
        onEdit={handleEditCollection}
        isDarkMode={isDarkMode}
      />

      {/* Add to Collection Dialog */}
      <AddToCollectionDialog
        open={isAddToCollectionOpen}
        onOpenChange={setIsAddToCollectionOpen}
        promptId={promptToAddToCollection || ""}
        collections={collections}
        onAddToCollections={handleAddToSelectedCollections}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}
