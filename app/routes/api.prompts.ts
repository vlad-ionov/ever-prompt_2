import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  createPrompt,
  updatePrompt,
  deletePrompt,
} from "@/lib/mock.server";
import { requireUser } from "@/lib/auth.server";

import { getServiceSupabaseClient } from "@/lib/supabase.server";

export async function action({ request }: ActionFunctionArgs) {
  const user = await requireUser(request);
  const formData = await request.formData();
  const intent = formData.get("intent");

  const parseBoolean = (value: FormDataEntryValue | null) => {
    if (value === null) return undefined;
    const normalised = value.toString().trim().toLowerCase();
    if (normalised === "true") return true;
    if (normalised === "false") return false;
    return undefined;
  };

  const parseStringArray = (value: FormDataEntryValue | null) => {
    if (value === null) return undefined;
    try {
      const parsed = JSON.parse(value.toString());
      if (Array.isArray(parsed) && parsed.every((item) => typeof item === "string")) {
        return parsed;
      }
    } catch (_error) {
      // handled below
    }
    throw new Error("tags must be a JSON encoded string array");
  };

  try {
    if (intent === "create") {
      const title = formData.get("title") as string;
      const description = formData.get("description") as string;
      const model = formData.get("model") as string;
      const type = formData.get("type") as string;
      const content = formData.get("content") as string;
      const initialPrompt = formData.get("initialPrompt") as string;
      let tags: string[] = [];

      try {
        tags = parseStringArray(formData.get("tags")) ?? [];
      } catch (error) {
        return json(
          { error: error instanceof Error ? error.message : "Invalid tags payload" },
          { status: 400 },
        );
      }

      let finalContent = content;

      // Handle image upload if a file is provided
      const file = formData.get("file") as File | null;
      if (type === "image" && file && file.size > 0) {
        const supabase = await getServiceSupabaseClient();
        const fileExt = file.name.split('.').pop() || 'png';
        const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('prompt-images')
          .upload(fileName, file, {
            contentType: file.type,
            upsert: false
          });

        if (uploadError) {
          console.error("Server-side upload error:", uploadError);
          return json({ error: `Upload failed: ${uploadError.message}` }, { status: 500 });
        }

        const { data: { publicUrl } } = supabase.storage
          .from('prompt-images')
          .getPublicUrl(fileName);

        finalContent = publicUrl;
      }

      if (!title || !model || !finalContent) {
        return json({ error: "Title, model, and content are required" }, { status: 400 });
      }

      const prompt = await createPrompt(user.id, {
        title,
        description,
        model,
        type,
        tags,
        content: finalContent,
        initialPrompt,
      });

      return json({ prompt });
    }

    if (intent === "update") {
      const id = formData.get("id")?.toString();
      if (!id) {
        return json({ error: "id is required" }, { status: 400 });
      }

      const updates: Record<string, unknown> = {};
      if (formData.has("title")) {
        updates.title = (formData.get("title") ?? "").toString();
      }
      if (formData.has("description")) {
        updates.description = (formData.get("description") ?? "").toString();
      }
      if (formData.has("model")) {
        updates.model = (formData.get("model") ?? "").toString();
      }
      if (formData.has("type")) {
        updates.type = (formData.get("type") ?? "").toString();
      }
      if (formData.has("tags")) {
        try {
          const parsedTags = parseStringArray(formData.get("tags"));
          if (parsedTags) {
            updates.tags = parsedTags;
          }
        } catch (error) {
          return json(
            { error: error instanceof Error ? error.message : "Invalid tags payload" },
            { status: 400 },
          );
        }
      }
      if (formData.has("content")) {
        updates.content = (formData.get("content") ?? "").toString();
      }
      if (formData.has("initialPrompt")) {
        updates.initial_prompt = (formData.get("initialPrompt") ?? "").toString();
      }
      if (formData.has("is_public")) {
        const next = parseBoolean(formData.get("is_public"));
        if (next === undefined) {
          return json({ error: "is_public must be true or false" }, { status: 400 });
        }
        updates.is_public = next;
      }
      if (formData.has("is_saved")) {
        const next = parseBoolean(formData.get("is_saved"));
        if (next === undefined) {
          return json({ error: "is_saved must be true or false" }, { status: 400 });
        }
        updates.is_saved = next;
      }
      if (formData.has("is_liked")) {
        const next = parseBoolean(formData.get("is_liked"));
        if (next === undefined) {
          return json({ error: "is_liked must be true or false" }, { status: 400 });
        }
        updates.is_liked = next;
      }
      if (formData.has("likes")) {
        const rawLikes = formData.get("likes");
        const likes = Number(rawLikes);
        if (Number.isNaN(likes)) {
          return json({ error: "likes must be a number" }, { status: 400 });
        }
        updates.likes = likes;
      }

      // Handle image update if a file is provided
      const file = formData.get("file") as File | null;
      if (updates.type === "image" && file && file.size > 0) {
        const supabase = await getServiceSupabaseClient();
        const fileExt = file.name.split('.').pop() || 'png';
        const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('prompt-images')
          .upload(fileName, file, {
            contentType: file.type,
            upsert: false
          });

        if (uploadError) {
          console.error("Server-side update upload error:", uploadError);
          return json({ error: `Upload failed: ${uploadError.message}` }, { status: 500 });
        }

        const { data: { publicUrl } } = supabase.storage
          .from('prompt-images')
          .getPublicUrl(fileName);

        updates.content = publicUrl;
      }
      if (Object.keys(updates).length === 0) {
        return json({ error: "No updates provided" }, { status: 400 });
      }

      const prompt = await updatePrompt(id, user.id, updates);
      return json({ prompt });
    }

    if (intent === "delete") {
      const id = formData.get("id") as string;
      await deletePrompt(id, user.id);
      return json({ success: true });
    }

    return json({ error: "Invalid intent" }, { status: 400 });
  } catch (error) {
    console.error("Prompt action error:", error);
    return json(
      { error: error instanceof Error ? error.message : "An error occurred" },
      { status: 500 }
    );
  }
}
