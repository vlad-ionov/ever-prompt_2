import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  createCollection,
  updateCollection,
  deleteCollection,
} from "@/lib/mock.server";
import { requireUser } from "@/lib/auth.server";

export async function action({ request }: ActionFunctionArgs) {
  const user = await requireUser(request);
  const formData = await request.formData();
  const intent = formData.get("intent");

  try {
    if (intent === "create") {
      const name = formData.get("name") as string;
      const description = formData.get("description") as string;

      if (!name) {
        return json({ error: "Name is required" }, { status: 400 });
      }

      const collection = await createCollection(user.id, {
        name,
        description,
      });

      return json({ collection });
    }

    if (intent === "update") {
      const id = formData.get("id")?.toString();
      if (!id) {
        return json({ error: "id is required" }, { status: 400 });
      }
      const name = formData.get("name") as string | null;
      const description = formData.get("description") as string | null;
      let promptIds: string[] | null = null;
      if (formData.has("prompt_ids")) {
        const rawPromptIds = formData.get("prompt_ids");
        try {
          const parsed = rawPromptIds ? JSON.parse(rawPromptIds.toString()) : [];
          if (Array.isArray(parsed) && parsed.every((value) => typeof value === "string")) {
            promptIds = parsed;
          } else {
            return json({ error: "prompt_ids must be an array of strings" }, { status: 400 });
          }
        } catch (_error) {
          return json({ error: "prompt_ids must be valid JSON" }, { status: 400 });
        }
      }

      const updates: Record<string, unknown> = {};
      if (name) updates.name = name;
      if (description) updates.description = description;
      if (promptIds !== null) updates.prompt_ids = promptIds;

      const collection = await updateCollection(id, user.id, updates);
      return json({ collection });
    }

    if (intent === "delete") {
      const id = formData.get("id") as string;
      await deleteCollection(id, user.id);
      return json({ success: true });
    }

    return json({ error: "Invalid intent" }, { status: 400 });
  } catch (error) {
    console.error("Collection action error:", error);
    return json(
      { error: error instanceof Error ? error.message : "An error occurred" },
      { status: 500 }
    );
  }
}
