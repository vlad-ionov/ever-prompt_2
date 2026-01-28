import { useState, useMemo, useCallback, useEffect } from "react";
import { toast } from "sonner";
import type { Prompt, Collection, PromptType } from "@/lib/types";
import type { PromptDraft } from "@/components/AddPromptDialog";
import { promptFixtures, collectionFixtures } from "@/lib/mock-data";
import { exportPromptsAsJSON, exportPromptsAsPlainText } from "@/utils/exportUtils";

interface UseDashboardProps {
    initialPrompts?: Prompt[];
    initialCollections?: Collection[];
    demoMode?: boolean;
}

export function useDashboard({
    initialPrompts,
    initialCollections,
    demoMode = false,
}: UseDashboardProps) {
    const [prompts, setPrompts] = useState<Prompt[]>(() => [
        ...(initialPrompts ?? promptFixtures),
    ]);
    const [collections, setCollections] = useState<Collection[]>(() => [
        ...(initialCollections ?? collectionFixtures),
    ]);

    // --- Helpers ---
    const cloneCollection = (collection: Collection): Collection => ({
        ...collection,
        promptIds: [...collection.promptIds],
    });

    const copyToClipboard = async (text: string): Promise<void> => {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            try {
                await navigator.clipboard.writeText(text);
                return;
            } catch (error) {
                // Fall through
            }
        }

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
                if (successful) resolve();
                else reject(new Error('Copy command failed'));
            } catch (error) {
                document.body.removeChild(textarea);
                reject(error);
            }
        });
    };

    // --- Prompt Handlers ---
    const handleSavePrompt = async (newPrompt: PromptDraft) => {
        if (demoMode) {
            const prompt: Prompt = {
                id: Date.now().toString(),
                ...newPrompt,
                likes: 0,
                views: 0,
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
            if (newPrompt.initialPrompt) {
                formData.append("initialPrompt", newPrompt.initialPrompt);
            }
            if (newPrompt.file) {
                formData.append("file", newPrompt.file);
            }

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

    const handleUpdatePrompt = async (id: string, updatedPrompt: {
        title: string;
        description: string;
        model: string;
        type: PromptType;
        tags: string[];
        content: string;
        initialPrompt?: string;
        file?: File;
    }) => {
        if (demoMode) {
            setPrompts((current) =>
                current.map((p) =>
                    p.id === id ? { ...p, ...updatedPrompt } : p
                )
            );
            toast.success("Prompt updated successfully!");
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
            if (updatedPrompt.initialPrompt) {
                formData.append("initialPrompt", updatedPrompt.initialPrompt);
            }
            if (updatedPrompt.file) {
                formData.append("file", updatedPrompt.file);
            }

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
        } catch (error) {
            console.error("Error updating prompt:", error);
            toast.error(error instanceof Error ? error.message : "Failed to update prompt");
        }
    };

    const handleDeletePrompt = async (id: string) => {
        if (demoMode) {
            setPrompts((current) => current.filter((p) => p.id !== id));
            toast.info("Prompt deleted");
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
            toast.info("Prompt deleted");
        } catch (error) {
            console.error("Error deleting prompt:", error);
            toast.error(error instanceof Error ? error.message : "Failed to delete prompt");
        }
    };

    const handleToggleLike = async (id: string) => {
        const prompt = prompts.find((p) => p.id === id);
        if (!prompt) return;

        const calculateLikes = (liked: boolean, currentLikes: number) =>
            liked ? currentLikes + 1 : Math.max(0, currentLikes - 1);

        const nextIsLiked = !prompt.isLiked;
        const nextLikes = calculateLikes(nextIsLiked, prompt.likes);

        // Optimistic update
        setPrompts((current) =>
            current.map((p) =>
                p.id === id ? { ...p, isLiked: nextIsLiked, likes: nextLikes } : p
            )
        );

        if (demoMode) return;

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

            if (!response.ok) {
                throw new Error("Failed to update likes");
            }

            const { prompt: updatedPrompt } = await response.json();
            if (updatedPrompt) {
                setPrompts((current) =>
                    current.map((p) => (p.id === id ? updatedPrompt : p))
                );
            }
        } catch (error) {
            // Revert on error
            setPrompts((current) =>
                current.map((p) => (p.id === id ? prompt : p))
            );
            toast.error(error instanceof Error ? error.message : "Failed to update likes");
        }
    };

    const handleToggleSave = async (id: string) => {
        const prompt = prompts.find((p) => p.id === id);
        if (!prompt) return;

        const nextIsSaved = !prompt.isSaved;

        // Optimistic update
        setPrompts((current) =>
            current.map((p) =>
                p.id === id ? { ...p, isSaved: nextIsSaved } : p
            )
        );

        if (demoMode) {
            toast.success(nextIsSaved ? "Saved to your collection" : "Removed from saved");
            return;
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

            if (!response.ok) {
                throw new Error("Failed to update saved state");
            }

            const { prompt: updatedPrompt } = await response.json();
            if (updatedPrompt) {
                setPrompts((current) =>
                    current.map((p) => (p.id === id ? updatedPrompt : p))
                );
            }
            toast.success(nextIsSaved ? "Saved to your collection" : "Removed from saved");
        } catch (error) {
            setPrompts((current) =>
                current.map((p) => (p.id === id ? prompt : p))
            );
            toast.error(error instanceof Error ? error.message : "Failed to update saved state");
        }
    };

    const handleToggleVisibility = async (id: string) => {
        const prompt = prompts.find((p) => p.id === id);
        if (!prompt) return;

        const nextIsPublic = !prompt.isPublic;

        // Optimistic update
        setPrompts((current) =>
            current.map((p) =>
                p.id === id ? { ...p, isPublic: nextIsPublic } : p
            )
        );

        if (demoMode) {
            toast.success(nextIsPublic ? "Prompt is now public" : "Prompt is now private");
            return;
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

            if (!response.ok) {
                throw new Error("Failed to update prompt visibility");
            }

            const { prompt: updatedPrompt } = await response.json();
            if (updatedPrompt) {
                setPrompts((current) =>
                    current.map((p) => (p.id === id ? updatedPrompt : p))
                );
            }
            toast.success(nextIsPublic ? "Prompt is now public" : "Prompt is now private");
        } catch (error) {
            setPrompts((current) =>
                current.map((p) => (p.id === id ? prompt : p))
            );
            toast.error(error instanceof Error ? error.message : "Failed to update visibility");
        }
    };

    const handleCopyPrompt = async (id: string) => {
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

    const handleSharePrompt = async (id: string) => {
        const shareUrl = typeof window !== "undefined"
            ? `${window.location.origin}/prompts/${id}`
            : `/prompts/${id}`;

        try {
            await copyToClipboard(shareUrl);
            toast.success("Share link copied to clipboard");
        } catch (error) {
            toast.error("Unable to copy share link");
        }
    };

    // --- Collection Handlers ---
    const handleAddCollection = async (collection: { name: string; description: string }) => {
        if (demoMode) {
            const newCollection: Collection = {
                id: Date.now().toString(),
                ...collection,
                promptIds: [],
                createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
                updatedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
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
            toast.error(error instanceof Error ? error.message : "Failed to create collection");
        }
    };

    const handleUpdateCollection = async (id: string, updates: { name: string; description: string }) => {
        if (demoMode) {
            setCollections((current) =>
                current.map((c) =>
                    c.id === id ? { ...c, ...updates, updatedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) } : c
                )
            );
            toast.success("Collection updated successfully!");
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
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to update collection");
        }
    };

    const handleDeleteCollection = async (id: string) => {
        if (demoMode) {
            setCollections((current) => current.filter((c) => c.id !== id));
            toast.success("Collection deleted");
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
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to delete collection");
        }
    };

    const handleAddPromptsToCollection = async (collectionId: string, promptIds: string[]) => {
        const collection = collections.find(c => c.id === collectionId);
        if (!collection) return;

        const previous = cloneCollection(collection);
        const nextPromptIds = [...new Set([...collection.promptIds, ...promptIds])];

        setCollections((current) =>
            current.map((c) =>
                c.id === collectionId ? { ...c, promptIds: nextPromptIds, updatedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) } : c
            )
        );

        if (demoMode) {
            toast.success(`Updated collection`);
            return;
        }

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

            if (!response.ok) throw new Error("Failed to update collection");

            const { collection: updatedCollection } = await response.json();
            if (updatedCollection) {
                setCollections((current) => current.map((c) => (c.id === collectionId ? updatedCollection : c)));
            }
            toast.success(`Updated collection`);
        } catch (error) {
            setCollections((current) => current.map((c) => (c.id === collectionId ? previous : c)));
            toast.error(error instanceof Error ? error.message : "Failed to update collection");
        }
    };

    const handleRemovePromptFromCollection = async (collectionId: string, promptId: string) => {
        const collection = collections.find(c => c.id === collectionId);
        if (!collection) return;

        const previous = cloneCollection(collection);
        const nextPromptIds = collection.promptIds.filter(id => id !== promptId);

        setCollections((current) =>
            current.map((c) =>
                c.id === collectionId ? { ...c, promptIds: nextPromptIds, updatedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) } : c
            )
        );

        if (demoMode) {
            toast.success("Removed from collection");
            return;
        }

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

            if (!response.ok) throw new Error("Failed to update collection");

            const { collection: updatedCollection } = await response.json();
            if (updatedCollection) {
                setCollections((current) => current.map((c) => (c.id === collectionId ? updatedCollection : c)));
            }
            toast.success("Removed from collection");
        } catch (error) {
            setCollections((current) => current.map((c) => (c.id === collectionId ? previous : c)));
            toast.error(error instanceof Error ? error.message : "Failed to update collection");
        }
    };

    const handleAddToSelectedCollections = async (promptId: string, collectionIds: string[]) => {
        if (demoMode) {
            setCollections((current) =>
                current.map((c) =>
                    collectionIds.includes(c.id)
                        ? { ...c, promptIds: [...new Set([...c.promptIds, promptId])], updatedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) }
                        : c
                )
            );
            toast.success(`Added to ${collectionIds.length} collections`);
            return;
        }

        try {
            await Promise.all(collectionIds.map(cid => {
                const c = collections.find(x => x.id === cid);
                if (!c) return Promise.resolve();
                const nextPromptIds = [...new Set([...c.promptIds, promptId])];
                const formData = new FormData();
                formData.append("intent", "update");
                formData.append("id", cid);
                formData.append("prompt_ids", JSON.stringify(nextPromptIds));
                return fetch("/api/collections", { method: "POST", body: formData, credentials: "include" });
            }));

            // Refresh collections
            const response = await fetch("/api/collections", { credentials: "include" });
            if (response.ok) {
                const { collections: newCollections } = await response.json();
                setCollections(newCollections);
            }
            toast.success(`Added to ${collectionIds.length} collections`);
        } catch (error) {
            toast.error("Failed to add to collections");
        }
    };

    // --- Stats and Counts ---
    const promptCounts = useMemo(() => ({
        all: prompts.length,
        personal: prompts.filter((p) => !p.isPublic).length,
        personalText: prompts.filter((p) => !p.isPublic && p.type === "text").length,
        personalImages: prompts.filter((p) => !p.isPublic && p.type === "image").length,
        personalVideos: prompts.filter((p) => !p.isPublic && p.type === "video").length,
        personalAudio: prompts.filter((p) => !p.isPublic && p.type === "audio").length,
        public: prompts.filter((p) => p.isPublic).length,
        publicText: prompts.filter((p) => p.isPublic && p.type === "text").length,
        publicImages: prompts.filter((p) => p.isPublic && p.type === "image").length,
        publicVideos: prompts.filter((p) => p.isPublic && p.type === "video").length,
        publicAudio: prompts.filter((p) => p.isPublic && p.type === "audio").length,
        favorites: prompts.filter((p) => p.isLiked).length,
        saved: prompts.filter((p) => p.isSaved).length,
    }), [prompts]);

    const stats = useMemo(() => ({
        total: prompts.length,
        favorites: prompts.filter((p) => p.isLiked).length,
        totalLikes: prompts.reduce((sum, p) => sum + p.likes, 0),
        saved: prompts.filter((p) => p.isSaved).length,
        public: prompts.filter((p) => p.isPublic).length,
        private: prompts.filter((p) => !p.isPublic).length,
        avgLikes: Math.round(prompts.reduce((sum, p) => sum + p.likes, 0) / prompts.length) || 0,
    }), [prompts]);

    return {
        prompts,
        setPrompts,
        collections,
        setCollections,
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
        exportPromptsAsJSON: () => exportPromptsAsJSON(prompts),
        exportPromptsAsPlainText: () => exportPromptsAsPlainText(prompts),
    };
}
