export type PromptType = "video" | "audio" | "image" | "text";

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
