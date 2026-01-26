export type PromptType = "video" | "audio" | "image" | "text";

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  username?: string;
  avatar_url?: string;
  avatar?: string;
  bio?: string;
  is_public?: boolean;
  created_at: string;
  stats?: {
    prompts_count: number;
    total_views: number;
    total_likes: number;
  };
}

export interface PromptAuthor {
  id: string;
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
  views: number;
  isLiked: boolean;
  isSaved: boolean;
  createdAt: string;
  content: string;
  useCases?: string[];
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
