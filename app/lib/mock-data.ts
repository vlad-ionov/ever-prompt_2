import type { Collection, Prompt } from "@/lib/types";

export const promptFixtures: Prompt[] = [
  {
    id: "1",
    title: "Blog Post Writer",
    description:
      "Generate comprehensive blog posts with SEO optimization and engaging content structure",
    model: "GPT-4o",
    type: "text",
    tags: ["writing", "seo", "content", "marketing"],
    likes: 234,
    isLiked: false,
    isSaved: false,
    createdAt: "Dec 15, 2025",
    content: "You are an expert blog writer...",
    isPublic: true,
    author: {
      name: "Sarah Chen",
      email: "sarah@example.com",
    },
  },
  {
    id: "2",
    title: "Code Review Assistant",
    description:
      "Analyze code for best practices, security issues, and performance improvements",
    model: "Claude 3.5 Sonnet",
    type: "text",
    tags: ["coding", "review", "security", "dev"],
    likes: 189,
    isLiked: true,
    isSaved: false,
    createdAt: "Dec 14, 2025",
    content: "Review the following code...",
    isPublic: false,
  },
  {
    id: "3",
    title: "Video Script Generator",
    description:
      "Create engaging video scripts with hooks, transitions, and call-to-actions for YouTube and TikTok",
    model: "GPT-4o",
    type: "video",
    tags: ["video", "script", "creative", "social"],
    likes: 156,
    isLiked: false,
    isSaved: true,
    createdAt: "Dec 13, 2025",
    content: "Create a video script for...",
    isPublic: true,
    author: {
      name: "Mike Johnson",
      email: "mike@example.com",
    },
  },
  {
    id: "4",
    title: "Marketing Copy Generator",
    description:
      "Create compelling marketing copy for ads, emails, and social media campaigns",
    model: "Claude 3.5 Sonnet",
    type: "text",
    tags: ["marketing", "copywriting", "ads", "business"],
    likes: 298,
    isLiked: true,
    isSaved: false,
    createdAt: "Dec 12, 2025",
    content: "Create marketing copy for...",
    isPublic: true,
    author: {
      name: "Emma Davis",
      email: "emma@example.com",
    },
  },
  {
    id: "5",
    title: "Podcast Episode Planner",
    description:
      "Structure podcast episodes with engaging topics, questions, and segment breakdowns",
    model: "GPT-4o",
    type: "audio",
    tags: ["podcast", "audio", "creative", "media"],
    likes: 167,
    isLiked: false,
    isSaved: false,
    createdAt: "Dec 11, 2025",
    content: "Plan a podcast episode about...",
    isPublic: false,
  },
  {
    id: "6",
    title: "Image Prompt Engineer",
    description:
      "Craft detailed prompts for AI image generation with style, composition, and lighting details",
    model: "Gemini 2.0 Flash",
    type: "image",
    tags: ["image", "art", "creative", "design"],
    likes: 421,
    isLiked: true,
    isSaved: true,
    createdAt: "Dec 10, 2025",
    content: "Generate an image of...",
    isPublic: true,
    author: {
      name: "Alex Kim",
      email: "alex@example.com",
    },
  },
  {
    id: "7",
    title: "Audio Ad Script Writer",
    description:
      "Write persuasive radio and podcast ad scripts with strong hooks and memorable messaging",
    model: "GPT-4o",
    type: "audio",
    tags: ["audio", "marketing", "business", "script"],
    likes: 203,
    isLiked: false,
    isSaved: false,
    createdAt: "Dec 9, 2025",
    content: "Write an audio ad for...",
    isPublic: true,
    author: {
      name: "James Wilson",
      email: "james@example.com",
    },
  },
  {
    id: "8",
    title: "Social Media Image Caption",
    description:
      "Generate compelling captions for Instagram, Facebook, and Pinterest image posts",
    model: "Claude 3.5 Sonnet",
    type: "image",
    tags: ["social-media", "marketing", "creative", "content"],
    likes: 145,
    isLiked: false,
    isSaved: false,
    createdAt: "Dec 8, 2025",
    content: "Write a caption for...",
    isPublic: false,
  },
  {
    id: "9",
    title: "Video Tutorial Outline",
    description:
      "Create step-by-step outlines for educational and how-to video content",
    model: "GPT-4o",
    type: "video",
    tags: ["education", "tutorial", "video", "content"],
    likes: 178,
    isLiked: true,
    isSaved: false,
    createdAt: "Dec 7, 2025",
    content: "Outline a tutorial video about...",
    isPublic: true,
    author: {
      name: "Lisa Martinez",
      email: "lisa@example.com",
    },
  },
];

export const collectionFixtures: Collection[] = [
  {
    id: "1",
    name: "Marketing Campaigns",
    description:
      "Collection of prompts for social media and content marketing",
    promptIds: ["2", "8"],
    createdAt: "Oct 10, 2025",
    updatedAt: "Oct 15, 2025",
  },
  {
    id: "2",
    name: "Development Tools",
    description:
      "Code review, debugging, and development assistant prompts",
    promptIds: [],
    createdAt: "Oct 8, 2025",
    updatedAt: "Oct 8, 2025",
  },
];

export function getPromptFixture(id: string) {
  return promptFixtures.find((prompt) => prompt.id === id) ?? null;
}

export function getCollectionFixture(id: string) {
  return collectionFixtures.find((collection) => collection.id === id) ?? null;
}
