import type { Collection, Prompt, UserProfile } from "@/lib/types";
import {
  collectionFixtures,
  getCollectionFixture,
  getPromptFixture,
  promptFixtures,
} from "./mock-data";
import { getServiceSupabaseClient } from "../lib/supabase.server";

const DEMO_USER_ID = "demo-user";

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
  view_count: number | null;
  is_liked: boolean | null;
  is_saved: boolean | null;
  created_at: string | null;
  content: string | null;
  initial_prompt: string | null;
  is_public: boolean | null;
  user_id: string;
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

function isDemoUser(userId?: string | null): boolean {
  return userId === DEMO_USER_ID;
}

function requireSupabaseClient() {
  try {
    return getServiceSupabaseClient();
  } catch (error) {
    console.error("Failed to initialise Supabase service client", error);
    throw new Error("Supabase client is not configured correctly. Check environment variables.");
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

function mapAuthor(author: PromptRow["author"], userId: string) {
  if (!author || typeof author !== "object") return undefined;
  const name = typeof author.name === "string" ? author.name : undefined;
  const email = typeof author.email === "string" ? author.email : undefined;
  if (!name || !email) return undefined;
  return {
    id: userId,
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
    views: row.view_count ?? 0,
    isLiked: row.is_liked ?? false,
    isSaved: row.is_saved ?? false,
    createdAt: formatDate(row.created_at),
    content: row.content ?? "",
    initialPrompt: row.initial_prompt ?? undefined,
    isPublic: row.is_public ?? false,
    author: mapAuthor(row.author, row.user_id),
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

export async function listPrompts(userId: string): Promise<Prompt[]> {
  if (isDemoUser(userId)) {
    return clone(promptFixtures);
  }

  if (!isUuid(userId)) {
    throw new Error("Invalid user id for Supabase prompt query");
  }

  const supabase = requireSupabaseClient();
  const { data, error } = await supabase
    .from("prompts")
    .select("*")
    .or(`user_id.eq.${userId},is_public.eq.true`)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch prompts: ${error.message}`);
  }

  const rows = (data ?? []) as PromptRow[];
  return rows.map(mapPrompt);
}

export async function listPublicPrompts(userId: string): Promise<Prompt[]> {
  const supabase = requireSupabaseClient();
  const { data, error } = await supabase
    .from("prompts")
    .select("*")
    .eq("user_id", userId)
    .eq("is_public", true)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch public prompts: ${error.message}`);
  }

  const rows = (data ?? []) as PromptRow[];
  return rows.map(mapPrompt);
}

export async function findPrompt(id: string, userId: string): Promise<Prompt | null> {
  if (isDemoUser(userId) || !isUuid(id) || !isUuid(userId)) {
    const prompt = getPromptFixture(id);
    return prompt ? clone(prompt) : null;
  }

  const supabase = requireSupabaseClient();
  const { data, error } = await supabase
    .from("prompts")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch prompt: ${error.message}`);
  }

  if (!data) {
    return null;
  }

  return mapPrompt(data as PromptRow);
}

export async function listCollections(userId: string): Promise<Collection[]> {
  if (isDemoUser(userId)) {
    return clone(collectionFixtures);
  }

  if (!isUuid(userId)) {
    throw new Error("Invalid user id for Supabase collection query");
  }

  const supabase = requireSupabaseClient();
  const { data, error } = await supabase
    .from("collections")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch collections: ${error.message}`);
  }

  const rows = (data ?? []) as CollectionRow[];
  return rows.map(mapCollection);
}

export async function findCollection(id: string, userId: string): Promise<Collection | null> {
  if (isDemoUser(userId) || !isUuid(id) || !isUuid(userId)) {
    const collection = getCollectionFixture(id);
    return collection ? clone(collection) : null;
  }

  const supabase = requireSupabaseClient();
  const { data, error } = await supabase
    .from("collections")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch collection: ${error.message}`);
  }

  if (!data) {
    return null;
  }

  return mapCollection(data as CollectionRow);
}

export async function listPromptsForCollection(collection: Collection, userId: string): Promise<Prompt[]> {
  const ids = collection.promptIds ?? [];

  if (isDemoUser(userId) || !isUuid(collection.id)) {
    return Promise.all(ids.map((promptId) => findPrompt(promptId, userId))).then((results) =>
      results.filter((prompt): prompt is Prompt => Boolean(prompt)),
    );
  }

  const supabase = requireSupabaseClient();
  const validIds = ids.filter((id) => isUuid(id));
  if (validIds.length === 0) {
    return [];
  }

  let query = supabase
    .from("prompts")
    .select("*")
    .in("id", validIds);

  if (isUuid(userId)) {
    query = query.eq("user_id", userId);
  }

  const { data, error } = await query;
  if (error) {
    throw new Error(`Failed to load prompts for collection: ${error.message}`);
  }

  const rows = (data ?? []) as PromptRow[];
  const mapped = rows.map(mapPrompt);
  const promptMap = new Map(mapped.map((prompt) => [prompt.id, prompt]));

  return validIds
    .map((id) => promptMap.get(id))
    .filter((prompt): prompt is Prompt => Boolean(prompt));
}

// CRUD operations for prompts
export async function createPrompt(userId: string, promptData: {
  title: string;
  description: string;
  model: string;
  type: string;
  tags: string[];
  content: string;
  initialPrompt?: string;
}): Promise<Prompt> {
  const supabase = requireSupabaseClient();

  const { data: userData } = await supabase.auth.admin.getUserById(userId);
  const user = userData.user;
  const authorData = user ? {
    id: userId,
    name: user.user_metadata?.name || user.email?.split('@')[0] || "User",
    email: user.email,
    avatar: user.user_metadata?.avatar_url
  } : null;

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
      initial_prompt: promptData.initialPrompt,
      is_public: false,
      author: authorData,
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
  initial_prompt?: string;
  is_public?: boolean;
  is_saved?: boolean;
  is_liked?: boolean;
  likes?: number;
}): Promise<Prompt> {
  const supabase = requireSupabaseClient();

  // First, fetch the prompt to check ownership and visibility
  const { data: existing, error: fetchError } = await supabase
    .from("prompts")
    .select("user_id, is_public")
    .eq("id", id)
    .single();

  if (fetchError || !existing) {
    throw new Error("Prompt not found");
  }

  const isOwner = existing.user_id === userId;

  if (!isOwner) {
    // If not owner, only allow updating certain fields and only if public
    if (!existing.is_public) {
      throw new Error("Unauthorized");
    }

    // Only allow non-sensitive fields
    const allowedKeys = ["is_liked", "is_saved", "likes", "view_count"];
    const requestedKeys = Object.keys(updates);
    const forbiddenKeys = requestedKeys.filter(key => !allowedKeys.includes(key));

    if (forbiddenKeys.length > 0) {
      throw new Error(`Unauthorized to update: ${forbiddenKeys.join(", ")}`);
    }
  }

  const { data, error } = await supabase
    .from("prompts")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update prompt: ${error.message}`);
  }

  return mapPrompt(data as PromptRow);
}

export async function deletePrompt(id: string, userId: string): Promise<void> {
  const supabase = requireSupabaseClient();

  const { error } = await supabase
    .from("prompts")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    throw new Error(`Failed to delete prompt: ${error.message}`);
  }
}

export async function incrementPromptViews(id: string): Promise<void> {
  if (!isUuid(id)) return;

  const supabase = requireSupabaseClient();

  // Using RPC for atomic increment
  await supabase.rpc('increment_prompt_views', { prompt_id: id });
}

// CRUD operations for collections
export async function createCollection(userId: string, collectionData: {
  name: string;
  description: string;
}): Promise<Collection> {
  const supabase = requireSupabaseClient();

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
  const supabase = requireSupabaseClient();

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
  const supabase = requireSupabaseClient();

  const { error } = await supabase
    .from("collections")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    throw new Error(`Failed to delete collection: ${error.message}`);
  }
}

export async function getPublicProfile(userId: string): Promise<UserProfile | null> {
  const supabase = requireSupabaseClient();

  const { data: user, error } = await supabase.auth.admin.getUserById(userId);

  if (error || !user.user) {
    // Fallback: check if we have any public prompts from this user and extract author info
    const { data: prompts } = await supabase
      .from("prompts")
      .select("author, user_id")
      .eq("user_id", userId)
      .eq("is_public", true)
      .limit(1);

    if (prompts && prompts.length > 0) {
      const p = prompts[0];
      const author = p.author as any;
      return {
        id: userId,
        name: author?.name || "Unknown User",
        email: author?.email || "",
        avatar_url: author?.avatar,
        created_at: new Date().toISOString(),
        is_public: true
      };
    }
    return null;
  }

  const u = user.user;
  return {
    id: u.id,
    email: u.email || "",
    name: u.user_metadata?.name || u.email?.split('@')[0] || "User",
    avatar_url: u.user_metadata?.avatar_url,
    bio: u.user_metadata?.bio,
    is_public: u.user_metadata?.is_public ?? true,
    created_at: u.created_at,
  };
}

export async function getUserStats(userId: string): Promise<{
  prompts_count: number;
  total_views: number;
  total_likes: number;
}> {
  const supabase = requireSupabaseClient();

  const { data, error } = await supabase
    .from("prompts")
    .select("view_count, likes")
    .eq("user_id", userId)
    .eq("is_public", true);

  if (error || !data) {
    return { prompts_count: 0, total_views: 0, total_likes: 0 };
  }

  return {
    prompts_count: data.length,
    total_views: data.reduce((acc, p) => acc + (p.view_count || 0), 0),
    total_likes: data.reduce((acc, p) => acc + (p.likes || 0), 0),
  };
}
