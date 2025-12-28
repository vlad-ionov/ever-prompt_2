export type PromptType = "video" | "audio" | "image" | "text";

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  avatar?: string; // Optional for compatibility
  bio?: string;
  is_public?: boolean;
  created_at: string;
}

export interface PromptAuthor {
  name: string;
  email: string;
  avatar?: string;
}

export interface Prompt {
  id: string;
  title: string;
  description: string;
  model: string;
  type: PromptType;
  tags: string[];
  likes: number;
  isLiked: boolean;
  isSaved: boolean;
  createdAt: string;
  content: string;
  initialPrompt?: string;
  isPublic: boolean;
  author?: PromptAuthor;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  promptIds: string[];
  createdAt: string;
  updatedAt: string;
}
