import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Globe, Lock, Eye } from "lucide-react";
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
import { ModelIcon } from "./ModelIcon";
import MainLogoDark from "../assets/icons/logo-everprompt-dark.svg";
import MainLogoLight from "../assets/icons/logo-everprompt-light.svg";
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
  UserCircle,
  SignOut,
  TextT,
  Image,
  VideoCamera,
  SpeakerHifi,
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
  const { profile, signOut } = useAuth();
  const isMobile = useIsMobile();
  const logoSrc = isDarkMode ? MainLogoDark : MainLogoLight;
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
  const [allPromptsVisibility, setAllPromptsVisibility] = useState<"all" | "public" | "private">("all");
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

  const handleShare = async (id: string) => {
    const shareUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/prompts/${id}`
        : `/prompts/${id}`;

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Share link copied to clipboard");
      } else {
        throw new Error("Clipboard API not available");
      }
    } catch (error) {
      console.error("Share link copy failed:", error);
      toast.error("Unable to copy share link");
    }
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
        setViewingCollection(false);
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
        setViewingCollection(false);
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
        selectedModel === "all" || prompt.model.toLowerCase().includes(selectedModel.toLowerCase());
      const matchesType =
        selectedType === "all" || prompt.type === selectedType;
      const matchesView =
        (activeView === "all" && (allPromptsVisibility === "public" ? prompt.isPublic : !prompt.isPublic)) ||
        (activeView === "personal" && !prompt.isPublic) ||
        (activeView.startsWith("personal-") && !prompt.isPublic && prompt.type === activeView.replace("personal-", "")) ||
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
    { value: "all", label: "All Models" },
    { value: "gemini", label: "Gemini" },
    { value: "grok", label: "Grok" },
    { value: "gpt", label: "GPT" },
    { value: "midjourney", label: "Midjourney" },
    { value: "claude", label: "Claude" },
  ];
  const typeOptions = [
    { value: "all", label: "All Types", icon: Sparkle },
    { value: "text", label: "Text", icon: TextT },
    { value: "video", label: "Video", icon: VideoCamera },
    { value: "audio", label: "Audio", icon: SpeakerHifi },
    { value: "image", label: "Image", icon: Image },
  ];
  const promptCounts = {
    all: prompts.length,
    personal: prompts.filter((p) => !p.isPublic).length,
    personalImages: prompts.filter((p) => !p.isPublic && p.type === "image").length,
    personalVideos: prompts.filter((p) => !p.isPublic && p.type === "video").length,
    personalText: prompts.filter((p) => !p.isPublic && p.type === "text").length,
    personalAudio: prompts.filter((p) => !p.isPublic && p.type === "audio").length,
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
    personal: "My Prompts",
    "personal-image": "My Images",
    "personal-video": "My Videos",
    "personal-text": "My Text",
    "personal-audio": "My Audio",
    all: "All Prompts",
    public: "Public Library",
    favorites: "Favorites",
    saved: "Saved",
    collections: "Collections",
    analytics: "Analytics",
  };



  const selectedSortOption = sortOptions.find((option) => option.value === sortBy) ?? sortOptions[0];
  const SelectedSortIcon = selectedSortOption.icon;

  const activeViewLabel = viewLabels[activeView] ?? "Prompts";
  const activeViewTotal =
    viewingCollection && selectedCollection
      ? selectedCollection.promptIds.length
      : activeView === "collections"
        ? collections.length
        : activeView === "analytics"
          ? 0
          : filteredPrompts.length;



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

  const rawUserEmail = demoMode ? "demo@promptvault.io" : profile?.email ?? "";
  const computedNameFromEmail = rawUserEmail ? rawUserEmail.split("@")[0] : "";
  const userDisplayName = demoMode
    ? "Demo User"
    : (profile?.name?.trim() || computedNameFromEmail || "User");
  const userSecondaryText = demoMode ? "Preview workspace" : rawUserEmail;
  const avatarSeed = demoMode ? "demo-user" : rawUserEmail || userDisplayName || "user";
  const avatarUrl =
    profile?.avatar_url ||
    `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(avatarSeed)}`;

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
        isCollapsed={!isMobile && isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
  );

  return (
    <div className="flex flex-col h-screen overflow-hidden">
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
      
      {/* Header - Full Width */}
      <header className={`${isDarkMode ? 'bg-[#09090b]/80 border-[#27272a] supports-[backdrop-filter]:bg-[#09090b]/60' : 'bg-white/80 border-[#d4d4d4] supports-[backdrop-filter]:bg-white/60'} border-b sticky top-0 z-20 backdrop-blur-md transition-colors duration-300`}>
          <div className="px-4 md:px-6 h-16 flex items-center justify-between gap-4">
            {/* Left: Logo */}
            <div className="flex items-center gap-3 flex-shrink-0 min-w-[200px]">
              {isMobile && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSidebarOpen(true)}
                  className={`h-9 w-9 rounded-xl ${isDarkMode ? 'text-[#fafafa] hover:bg-[#18181b]' : 'text-[#333333] hover:bg-[#f5f5f5]'}`}
                >
                  <ListBullets className="h-5 w-5" weight="regular" />
                </Button>
              )}
              <div className="flex items-center gap-2.5 group cursor-pointer select-none">
                <div className={`p-1.5 rounded-xl ${isDarkMode ? 'bg-[#18181b] group-hover:bg-[#27272a] ring-1 ring-[#27272a]' : 'bg-[#f5f5f5] group-hover:bg-[#e5e5e5] ring-1 ring-[#e5e5e5]'} transition-all duration-200`}>
                   <img src={logoSrc} alt="EverPrompt" className="h-5 w-5" />
                </div>
                <span className={`hidden sm:inline text-sm font-semibold tracking-tight ${isDarkMode ? 'text-[#fafafa]' : 'text-[#333333]'}`}>EverPrompt</span>
              </div>
            </div>

            {/* Center: Search */}
            <div className="flex-1 max-w-xl hidden md:block px-4">
              <div className="relative group">
                <MagnifyingGlass className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 ${isDarkMode ? 'text-[#71717a] group-hover:text-[#a1a1aa]' : 'text-[#a1a1aa] group-hover:text-[#737373]'} transition-colors`} weight="regular" />
                <Input
                  placeholder="Search your library..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`pl-10 h-10 w-full rounded-2xl text-sm transition-all duration-200 ${isDarkMode ? 'border-[#27272a] bg-[#18181b]/50 text-[#fafafa] placeholder:text-[#52525b] focus:bg-[#18181b] focus:ring-[#8b5cf6]/50' : 'border-[#e5e5e5] bg-[#f5f5f7]/50 text-[#333333] placeholder:text-[#a1a1aa] focus:bg-white focus:ring-[#E11D48]/20'} shadow-sm`}
                />
              </div>
            </div>

            {/* Right: Stats & Actions */}
            <div className="flex items-center gap-2 md:gap-3 flex-shrink-0 justify-end min-w-[200px]">
               {/* Mobile Search Toggle */}
               <div className="md:hidden">
                  <Button variant="ghost" size="icon" className={`h-9 w-9 rounded-xl ${isDarkMode ? 'text-[#a1a1aa]' : 'text-[#868686]'}`}> 
                    <MagnifyingGlass className="h-4 w-4" /> 
                  </Button>
               </div>

               {/* Stats Pill */}
               <div className={`hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full border ${isDarkMode ? 'border-[#27272a] bg-[#18181b]/50' : 'border-[#e5e5e5] bg-[#f5f5f7]/50'}`}>
                  <span className={`text-[11px] font-medium uppercase tracking-wider ${isDarkMode ? 'text-[#71717a]' : 'text-[#868686]'}`}>Total</span>
                  <span className={`text-xs font-bold ${isDarkMode ? 'text-[#fafafa]' : 'text-[#333333]'}`}>{prompts.length}</span>
               </div>

               <div className={`w-px h-6 mx-1 ${isDarkMode ? 'bg-[#27272a]' : 'bg-[#e5e5e5]'} hidden lg:block`} />

               <div className="flex items-center gap-1">
                 <Button
                    onClick={onToggleDarkMode}
                    variant="ghost"
                    size="icon"
                    className={`h-9 w-9 rounded-xl transition-colors ${isDarkMode ? 'text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#18181b]' : 'text-[#666666] hover:text-[#333333] hover:bg-[#f5f5f5]'}`}
                 >
                    {isDarkMode ? <SunDim className="h-4 w-4" /> : <MoonStars className="h-4 w-4" />}
                 </Button>

                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-9 w-9 rounded-xl transition-colors ${isDarkMode ? 'text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#18181b]' : 'text-[#666666] hover:text-[#333333] hover:bg-[#f5f5f5]'}`}
                      >
                        <CloudArrowDown className="h-4 w-4" />
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
                        <ListBullets className="h-4 w-4 mr-2" weight="regular" />
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
                        <List className="h-4 w-4 mr-2" weight="regular" />
                        Export as Text
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                 </DropdownMenu>
               </div>

               <Button
                  onClick={() => {
                    if (activeView === "collections") {
                      setIsAddCollectionOpen(true);
                    } else if (activeView === "personal-image") {
                      setIsDialogOpen(true);
                    } else {
                      setIsDialogOpen(true);
                    }
                  }}
                  size="sm"
                  className={`h-9 px-4 rounded-xl shadow-sm transition-all hover:shadow duration-200 ${isDarkMode ? 'bg-[#8b5cf6] text-white hover:bg-[#7c3aed]' : 'bg-[#E11D48] text-white hover:bg-[#BE123C]'}`}
               >
                  {activeView === "collections" ? (
                    <FolderSimplePlus className="h-4 w-4 mr-2" weight="regular" />
                  ) : activeView === "personal-image" ? (
                    <CloudArrowDown className="h-4 w-4 mr-2" weight="regular" />
                  ) : (
                    <PlusCircle className="h-4 w-4 mr-2" weight="regular" />
                  )}
                  <span className="text-sm font-medium">
                    {activeView === "collections" ? "New" : activeView === "personal-image" ? "Upload" : "New"}
                  </span>
               </Button>
 
               {/* Account */}
               <DropdownMenu>
                 <DropdownMenuTrigger asChild>
                   <Button
                     variant="ghost"
                     size="icon"
                     className={`h-9 w-9 rounded-full ml-1 ${isDarkMode ? 'hover:bg-[#18181b]' : 'hover:bg-[#f5f5f5]'}`}
                   >
                     <Avatar className="h-8 w-8 ring-2 ring-transparent hover:ring-2 hover:ring-opacity-50 transition-all duration-200 ring-offset-2 ring-offset-background">
                       <AvatarImage src={avatarUrl} alt={userDisplayName} />
                       <AvatarFallback className={`text-xs ${isDarkMode ? 'bg-[#18181b] text-[#fafafa]' : 'bg-[#f5f5f5] text-[#333333]'}`}>
                         {userDisplayName.slice(0, 2).toUpperCase()}
                       </AvatarFallback>
                     </Avatar>
                   </Button>
                 </DropdownMenuTrigger>
                 <DropdownMenuContent
                   align="end"
                   className={`${
                     isDarkMode ? 'bg-[#0f0f11] border-[#27272a]' : 'bg-white border-[#d4d4d4]'
                   } w-64 rounded-2xl p-2 shadow-lg mt-2`}
                 >
                   <div className={`${isDarkMode ? 'bg-[#111113]' : 'bg-[#f5f5f7]'} rounded-xl px-3 py-3 mb-2`}>
                     <p className={`${isDarkMode ? 'text-[#fafafa]' : 'text-[#333333]'} text-sm font-medium`}>{userDisplayName}</p>
                     <p className={`${isDarkMode ? 'text-[#8e8e9a]' : 'text-[#9a9aa1]'} text-xs`}>{userSecondaryText}</p>
                   </div>
                   {!demoMode && (
                     <DropdownMenuItem
                       onClick={() => setIsSettingsOpen(true)}
                       className={`${isDarkMode ? 'text-[#fafafa]' : 'text-[#333333]'} rounded-xl px-3 py-2 cursor-pointer`}
                     >
                       <UserCircle className="mr-3 h-4 w-4" weight="regular" />
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
                     className={`rounded-xl px-3 py-2 cursor-pointer ${
                       demoMode ? (isDarkMode ? 'text-[#fafafa]' : 'text-[#333333]') : 'text-[#E11D48]'
                     }`}
                   >
                     <SignOut className="mr-3 h-4 w-4" weight="regular" />
                     {demoMode ? 'Exit Demo' : 'Sign Out'}
                   </DropdownMenuItem>
                 </DropdownMenuContent>
               </DropdownMenu>
            </div>
          </div>
        </header>

      {/* Main Layout - Sidebar + Content */}
      <div className="flex flex-1 overflow-hidden">
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
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          <div
            className={`flex-1 overflow-y-auto ${
              isDarkMode ? "bg-[#09090b]" : "bg-[#f8fafc]"
            }`}
          >
            <div className={`mx-auto max-w-[1920px] ${viewingCollection ? "" : "p-4 md:p-8"}`}>
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
                <div className="space-y-8">
                  {/* Header / Toolbar Section */}
                  <div className="sticky top-0 z-10 -mx-4 px-4 py-2 md:-mx-8 md:px-8 md:py-3 backdrop-blur-xl bg-background/95 supports-[backdrop-filter]:bg-background/80 border-b border-transparent transition-all duration-300">
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
                            {activeView !== "analytics" && (
                                <div className={`md:hidden p-1 rounded-lg border flex h-8 ${isDarkMode ? "bg-[#18181b]/50 border-[#27272a]" : "bg-white border-[#e2e8f0]"}`}>
                                    <button
                                        onClick={() => setViewMode("grid")}
                                        className={`w-7 h-full flex items-center justify-center rounded-md transition-all ${viewMode === "grid" ? (isDarkMode ? "bg-[#27272a] text-white shadow-sm" : "bg-slate-100 text-slate-900 shadow-sm") : (isDarkMode ? "text-zinc-500 hover:text-zinc-300" : "text-slate-500 hover:text-slate-700")}`}
                                    >
                                        <SquaresFour weight="regular" className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => setViewMode("list")}
                                        className={`w-7 h-full flex items-center justify-center rounded-md transition-all ${viewMode === "list" ? (isDarkMode ? "bg-[#27272a] text-white shadow-sm" : "bg-slate-100 text-slate-900 shadow-sm") : (isDarkMode ? "text-zinc-500 hover:text-zinc-300" : "text-slate-500 hover:text-slate-700")}`}
                                    >
                                        <List weight="regular" className="h-4 w-4" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Controls Section */}
                        {activeView !== "analytics" && (
                            <div className="w-full md:w-auto">
                                <div className="grid grid-cols-2 gap-2 md:flex md:items-center md:gap-2">
                                    {/* Visibility Filter (Replaces Toggle) */}
                                    {activeView === "all" && (
                                    <Select value={allPromptsVisibility || "all"} onValueChange={(v) => setAllPromptsVisibility(v as any)}>
                                        <SelectTrigger className={`col-span-2 md:col-span-1 md:w-auto h-9 min-w-[110px] rounded-lg border-2 border-dashed shadow-sm text-xs font-medium transition-all hover:border-primary/50 ${isDarkMode ? "bg-[#18181b]/30 border-[#27272a] text-zinc-300 hover:bg-[#18181b]" : "bg-white/50 border-[#e2e8f0] text-slate-700 hover:bg-white"}`}>
                                           <div className="flex items-center gap-2">
                                                {allPromptsVisibility === "public" ? <Globe className="h-3.5 w-3.5" /> : allPromptsVisibility === "private" ? <Lock className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                                                <span className="capitalize">{allPromptsVisibility === "all" || !allPromptsVisibility ? "All Visibility" : allPromptsVisibility}</span>
                                           </div>
                                        </SelectTrigger>
                                        <SelectContent className={isDarkMode ? "bg-[#18181b] border-[#27272a] text-zinc-300" : "bg-white border-[#d4d4d4]"}>
                                            <SelectItem value="all" className="text-xs">
                                                <div className="flex items-center gap-2">
                                                    <Eye className="h-3.5 w-3.5" />
                                                    <span>All Visibility</span>
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
                                        <Select value={selectedModel} onValueChange={setSelectedModel}>
                                            <SelectTrigger className={`col-span-1 md:w-auto h-9 rounded-lg border-2 border-dashed shadow-sm text-xs font-medium transition-all hover:border-primary/50 ${isDarkMode ? "bg-[#18181b]/30 border-[#27272a] text-zinc-300 hover:bg-[#18181b]" : "bg-white/50 border-[#e2e8f0] text-slate-700 hover:bg-white"}`}>
                                                <SelectValue />
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
                                        <Select value={selectedType} onValueChange={setSelectedType}>
                                            <SelectTrigger className={`col-span-1 md:w-auto h-9 rounded-lg border-2 border-dashed shadow-sm text-xs font-medium transition-all hover:border-primary/50 ${isDarkMode ? "bg-[#18181b]/30 border-[#27272a] text-zinc-300 hover:bg-[#18181b]" : "bg-white/50 border-[#e2e8f0] text-slate-700 hover:bg-white"}`}>
                                                <SelectValue placeholder="Type" />
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
                                        
                                        {/* Sort Select */}
                                        <Select value={sortBy} onValueChange={setSortBy}>
                                            <SelectTrigger className={`col-span-2 md:col-span-1 md:w-auto h-9 rounded-lg border-2 border-dashed shadow-sm text-xs font-medium transition-all hover:border-primary/50 ${isDarkMode ? "bg-[#18181b]/30 border-[#27272a] text-zinc-300 hover:bg-[#18181b]" : "bg-white/50 border-[#e2e8f0] text-slate-700 hover:bg-white"}`}>
                                                <div className="flex items-center justify-center md:justify-start gap-2"><SelectedSortIcon className="h-3.5 w-3.5" /><span>{selectedSortOption.label}</span></div>
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
                                    <div className={`hidden md:flex p-1 rounded-lg border h-9 ${isDarkMode ? "bg-[#18181b]/50 border-[#27272a]" : "bg-white border-[#e2e8f0]"}`}>
                                        <button
                                            onClick={() => setViewMode("grid")}
                                            className={`w-7 h-full flex items-center justify-center rounded-md transition-all ${viewMode === "grid" ? (isDarkMode ? "bg-[#27272a] text-white shadow-sm" : "bg-slate-100 text-slate-900 shadow-sm") : (isDarkMode ? "text-zinc-500 hover:text-zinc-300" : "text-slate-500 hover:text-slate-700")}`}
                                        >
                                            <SquaresFour weight="regular" className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => setViewMode("list")}
                                            className={`w-7 h-full flex items-center justify-center rounded-md transition-all ${viewMode === "list" ? (isDarkMode ? "bg-[#27272a] text-white shadow-sm" : "bg-slate-100 text-slate-900 shadow-sm") : (isDarkMode ? "text-zinc-500 hover:text-zinc-300" : "text-slate-500 hover:text-slate-700")}`}
                                        >
                                            <List weight="regular" className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                      </div>
                  </div>

                  {/* Collections, Analytics, or Prompts */}
                  {activeView === "analytics" ? (
                    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ${isDarkMode ? "text-[#fafafa]" : "text-[#111827]"}`}>
                      {summaryCards.map((card) => {
                        const Icon = card.icon;
                        return (
                          <div key={card.id} className={`flex items-center justify-between rounded-xl border px-5 py-4 shadow-sm ${isDarkMode ? "bg-[#18181b] border-[#27272a]" : "bg-white border-[#e2e8f0]"}`}>
                            <div className="flex items-center gap-4">
                              <div className={`h-10 w-10 rounded-full flex items-center justify-center ${isDarkMode ? "bg-[#27272a]" : "bg-slate-100"}`}>
                                <Icon className="h-5 w-5 text-[#8b5cf6]" weight="duotone" />
                              </div>
                              <div className="min-w-0">
                                <p className={`text-xs font-medium uppercase tracking-wider ${isDarkMode ? "text-zinc-500" : "text-slate-500"} truncate`}>{card.label}</p>
                                <p className="text-xl font-bold mt-0.5">{card.value}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : activeView === "collections" ? (
                    collections.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in-95 duration-500">
                        <div className={`p-4 rounded-full mb-4 ${isDarkMode ? 'bg-[#18181b]' : 'bg-slate-50'}`}>
                            <FolderSimplePlus className={`h-8 w-8 ${isDarkMode ? "text-zinc-400" : "text-slate-400"}`} weight="light" />
                        </div>
                        <h3 className={`text-lg font-bold mb-1 ${isDarkMode ? "text-white" : "text-slate-900"}`}>No collections yet</h3>
                        <p className={`text-sm mb-6 max-w-sm ${isDarkMode ? "text-zinc-400" : "text-slate-500"}`}>Create collections to organize your prompts into varied groups for easier access.</p>
                        <Button
                            onClick={() => setIsAddCollectionOpen(true)}
                            className={`rounded-xl px-5 h-10 ${isDarkMode ? "bg-[#8b5cf6] text-white hover:bg-[#7c3aed]" : "bg-[#E11D48] text-white hover:bg-[#BE123C]"}`}
                        >
                            <FolderSimplePlus className="h-4 w-4 mr-2" weight="bold" />
                            Create Collection
                        </Button>
                      </div>
                    ) : (
                      <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-3"}>
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
                    <div className="flex flex-col items-center justify-center py-24 text-center animate-in fade-in zoom-in-95 duration-500">
                        <div className={`p-4 rounded-full mb-4 ${isDarkMode ? 'bg-[#18181b]' : 'bg-slate-50'}`}>
                            <MagnifyingGlass className={`h-8 w-8 ${isDarkMode ? "text-zinc-500" : "text-slate-400"}`} weight="light" />
                        </div>
                        <h3 className={`text-lg font-bold mb-1 ${isDarkMode ? "text-white" : "text-slate-900"}`}>No prompts found</h3>
                        <p className={`text-sm ${isDarkMode ? "text-zinc-400" : "text-slate-500"}`}>We couldn't find any prompts matching your criteria.</p>
                    </div>
                  ) : (
                    <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-3"}>
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
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Prompt Dialog */}
      <AddPromptDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSavePrompt}
        isDarkMode={isDarkMode}
        initialType={activeView.startsWith("personal-") ? (activeView.replace("personal-", "") as "image" | "video" | "text" | "audio") : undefined}
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
