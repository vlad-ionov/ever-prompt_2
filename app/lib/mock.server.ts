import type { Collection, Prompt } from "@/lib/types";
import {
  collectionFixtures,
  getCollectionFixture,
  getPromptFixture,
  promptFixtures,
} from "./mock-data";
import { getServiceSupabaseClient } from "../lib/supabase.server";

function clone<T>(value: T): T {
  if (typeof globalThis !== "undefined" && typeof (globalThis as unknown as { structuredClone: (value: unknown) => unknown }).structuredClone === "function") {
    return (globalThis as unknown as { structuredClone: (value: unknown) => unknown }).structuredClone(value) as T;
  }
  return JSON.parse(JSON.stringify(value)) as T;
}

type PromptRow = {
  id: string;
  title: string;
  description: string | null;
  model: string | null;
  type: string | null;
  tags: string[] | null;
  likes: number | null;
  is_liked: boolean | null;
  is_saved: boolean | null;
  created_at: string | null;
  content: string | null;
  is_public: boolean | null;
  author: { name?: string; email?: string; avatar?: string } | null;
};

type CollectionRow = {
  id: string;
  name: string;
  description: string | null;
  prompt_ids: string[] | null;
  created_at: string | null;
  updated_at: string | null;
};

function isUuid(value: string | undefined): boolean {
  if (!value) return false;
  return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
    value,
  );
}

function safeSupabase() {
  try {
    const client = getServiceSupabaseClient();
    return client;
  } catch (_error) {
    return null;
  }
}

function formatDate(iso: string | null): string {
  if (!iso) return "";
  const dt = new Date(iso);
  if (Number.isNaN(dt.getTime())) {
    return "";
  }
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(dt);
}

function mapAuthor(author: PromptRow["author"]) {
  if (!author || typeof author !== "object") return undefined;
  const name = typeof author.name === "string" ? author.name : undefined;
  const email = typeof author.email === "string" ? author.email : undefined;
  if (!name || !email) return undefined;
  return {
    name,
    email,
    avatar: typeof author.avatar === "string" ? author.avatar : undefined,
  };
}

function mapPrompt(row: PromptRow): Prompt {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? "",
    model: row.model ?? "GPT-4",
    type: (row.type ?? "text") as Prompt["type"],
    tags: row.tags ?? [],
    likes: row.likes ?? 0,
    isLiked: row.is_liked ?? false,
    isSaved: row.is_saved ?? false,
    createdAt: formatDate(row.created_at),
    content: row.content ?? "",
    isPublic: row.is_public ?? false,
    author: mapAuthor(row.author),
  };
}

function mapCollection(row: CollectionRow): Collection {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? "",
    promptIds: row.prompt_ids ?? [],
    createdAt: formatDate(row.created_at),
    updatedAt: formatDate(row.updated_at),
  };
}

export async function listPrompts(userId?: string): Promise<Prompt[]> {
  const supabase = safeSupabase();
  if (supabase && isUuid(userId)) {
    const { data, error } = await supabase
      .from("prompts")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (!error && Array.isArray(data)) {
      return (data as PromptRow[]).map(mapPrompt);
    }
    if (error) {
      console.error("Supabase listPrompts error:", error);
    }
  }
  return clone(promptFixtures);
}

export async function findPrompt(id: string): Promise<Prompt | null> {
  const supabase = safeSupabase();
  if (supabase) {
    const { data, error } = await supabase
      .from("prompts")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (!error && data) {
      return mapPrompt(data as PromptRow);
    }
  }
  const prompt = getPromptFixture(id);
  return prompt ? clone(prompt) : null;
}

export async function listCollections(userId?: string): Promise<Collection[]> {
  const supabase = safeSupabase();
  if (supabase && isUuid(userId)) {
    const { data, error } = await supabase
      .from("collections")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (!error && Array.isArray(data)) {
      return (data as CollectionRow[]).map(mapCollection);
    }
    if (error) {
      console.error("Supabase listCollections error:", error);
    }
  }
  return clone(collectionFixtures);
}

export async function findCollection(id: string): Promise<Collection | null> {
  const supabase = safeSupabase();
  if (supabase) {
    const { data, error } = await supabase
      .from("collections")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (!error && data) {
      return mapCollection(data as CollectionRow);
    }
  }
  const collection = getCollectionFixture(id);
  return collection ? clone(collection) : null;
}

export async function listPromptsForCollection(collection: Collection): Promise<Prompt[]> {
  const supabase = safeSupabase();
  if (supabase) {
    const ids = collection.promptIds;
    if (ids.length > 0) {
      const { data, error } = await supabase
        .from("prompts")
        .select("*")
        .in("id", ids);
      if (!error && Array.isArray(data)) {
        const map = new Map((data as PromptRow[]).map((row) => [row.id, mapPrompt(row)]));
        return ids
          .map((id) => map.get(id))
          .filter((prompt): prompt is Prompt => Boolean(prompt));
      }
    }
  }
  const ids = collection.promptIds ?? [];
  return Promise.all(ids.map((promptId) => findPrompt(promptId))).then((results) =>
    results.filter((prompt): prompt is Prompt => Boolean(prompt)),
  );
}

// CRUD operations for prompts
export async function createPrompt(userId: string, promptData: {
  title: string;
  description: string;
  model: string;
  type: string;
  tags: string[];
  content: string;
}): Promise<Prompt> {
  const supabase = safeSupabase();
  if (!supabase) {
    throw new Error("Supabase client not available");
  }

  const { data, error } = await supabase
    .from("prompts")
    .insert({
      user_id: userId,
      title: promptData.title,
      description: promptData.description,
      model: promptData.model,
      type: promptData.type,
      tags: promptData.tags,
      content: promptData.content,
      is_public: false,
      author: null,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create prompt: ${error.message}`);
  }

  return mapPrompt(data as PromptRow);
}

export async function updatePrompt(id: string, userId: string, updates: {
  title?: string;
  description?: string;
  model?: string;
  type?: string;
  tags?: string[];
  content?: string;
}): Promise<Prompt> {
  const supabase = safeSupabase();
  if (!supabase) {
    throw new Error("Supabase client not available");
  }

  const { data, error } = await supabase
    .from("prompts")
    .update(updates)
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update prompt: ${error.message}`);
  }

  if (!data) {
    throw new Error("Prompt not found");
  }

  return mapPrompt(data as PromptRow);
}

export async function deletePrompt(id: string, userId: string): Promise<void> {
  const supabase = safeSupabase();
  if (!supabase) {
    throw new Error("Supabase client not available");
  }

  const { error } = await supabase
    .from("prompts")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    throw new Error(`Failed to delete prompt: ${error.message}`);
  }
}

// CRUD operations for collections
export async function createCollection(userId: string, collectionData: {
  name: string;
  description: string;
}): Promise<Collection> {
  const supabase = safeSupabase();
  if (!supabase) {
    throw new Error("Supabase client not available");
  }

  const { data, error } = await supabase
    .from("collections")
    .insert({
      user_id: userId,
      name: collectionData.name,
      description: collectionData.description,
      prompt_ids: [],
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create collection: ${error.message}`);
  }

  return mapCollection(data as CollectionRow);
}

export async function updateCollection(id: string, userId: string, updates: {
  name?: string;
  description?: string;
  prompt_ids?: string[];
}): Promise<Collection> {
  const supabase = safeSupabase();
  if (!supabase) {
    throw new Error("Supabase client not available");
  }

  const { data, error } = await supabase
    .from("collections")
    .update(updates)
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update collection: ${error.message}`);
  }

  if (!data) {
    throw new Error("Collection not found");
  }

  return mapCollection(data as CollectionRow);
}

export async function deleteCollection(id: string, userId: string): Promise<void> {
  const supabase = safeSupabase();
  if (!supabase) {
    throw new Error("Supabase client not available");
  }

  const { error } = await supabase
    .from("collections")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    throw new Error(`Failed to delete collection: ${error.message}`);
  }
}
