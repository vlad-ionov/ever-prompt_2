import type { Collection, Prompt } from "@/lib/types";

export const promptFixtures: Prompt[] = [
  {
    id: "1",
    title: "SAAS Product Strategist",
    description:
      "A high-level strategic partner for defining product-market fit, user personas, and feature prioritization for modern SAAS platforms.",
    model: "o1-preview",
    type: "text",
    tags: ["business", "strategy", "saas", "product"],
    likes: 1240,
    views: 45700,
    isLiked: false,
    isSaved: true,
    createdAt: "Jan 22, 2026",
    content: "Act as a Senior Product Strategist at a top-tier venture studio. Your goal is to help me refine a SaaS product concept. \n\nPlease analyze the following market niche: [INSERT NICHE]. \n\n1. Identify 3 underserved user personas.\n2. Define the 'Job to be Done' for each.\n3. Propose a 'Minimum Viable Delight' feature set that differentiates us from incumbents like [INSERT COMPETITORS].",
    useCases: [
      "Refining early-stage startup ideas",
      "Brainstorming differentiator features for existing apps",
      "Creating investor pitch deck content"
    ],
    isPublic: true,
    author: {
      id: "sarah-chen-id",
      name: "Sarah Chen",
      email: "sarah@example.com",
    },
  },
  {
    id: "2",
    title: "Advanced TypeScript Architect",
    description:
      "Deep-dive code analysis focusing on type safety, architectural patterns, and performance overhead in large-scale React applications.",
    model: "Claude 3.5 Sonnet",
    type: "text",
    tags: ["coding", "architecture", "typescript", "react"],
    likes: 856,
    views: 12400,
    isLiked: true,
    isSaved: false,
    createdAt: "Jan 20, 2026",
    content: "Review the following TypeScript code snippets for architectural integrity and type safety. \n\nFocus on: \n- Potential 'any' leakages or weak type definitions.\n- Circular dependency risks.\n- Opportunities for better abstraction using Generics or Discriminated Unions.\n- React performance bottlenecks (unnecessary re-renders).",
    useCases: [
      "Pre-PR internal audits",
      "Refactoring legacy JS to strict TS",
      "Optimizing heavy state management logic"
    ],
    isPublic: false,
  },
  {
    id: "3",
    title: "Cinematic Scene Director",
    description:
      "Generates precise, multi-angle camera directions and atmospheric descriptions for AI video platforms like Sora or Runway Gen-3.",
    model: "GPT-4o",
    type: "video",
    tags: ["video", "creative", "cinematography", "ai-art"],
    likes: 2150,
    views: 89000,
    isLiked: false,
    isSaved: true,
    createdAt: "Jan 18, 2026",
    content: "A cinematic eye-level tracking shot follows a lone traveler walking through a neon-drenched cyberpunk marketplace in a downpour. \n\nLighting: Flickering holographic advertisements reflected in deep puddles, high contrast, teal and orange palette. \nDetails: Steaming noodle stalls, robotic merchants, volumetric fog. \nCamera: Slow push-in, 35mm lens, shallow depth of field, 60fps slow motion.",
    useCases: [
      "Storyboarding for AI film projects",
      "Generating high-fidelity shorts for social media",
      "Visualizing concept art for game dev"
    ],
    isPublic: true,
    author: {
      id: "mike-johnson-id",
      name: "Mike Johnson",
      email: "mike@example.com",
    },
  },
  {
    id: "4",
    title: "Ghostwriter: Viral Tech Threads",
    description:
      "Engineers high-engagement X (Twitter) and LinkedIn threads that break down complex technical topics into accessible, viral narratives.",
    model: "Claude 3.5 Sonnet",
    type: "text",
    tags: ["marketing", "social", "writing", "growth"],
    likes: 298,
    views: 1420,
    isLiked: true,
    isSaved: false,
    createdAt: "Jan 15, 2026",
    content: "Convert the following technical documentation into a 7-tweet viral thread. \n\nConstraint 1: The first tweet must be a 'pattern interrupt' hook.\nConstraint 2: Use the 'Problem-Agitation-Solution' framework.\nConstraint 3: End with a high-friction CTA that encourages bookmarks.",
    useCases: [
      "Founder-led marketing",
      "DevRel content distribution",
      "Explaining complex ROI to non-technical stakeholders"
    ],
    isPublic: true,
    author: {
      id: "emma-davis-id",
      name: "Emma Davis",
      email: "emma@example.com",
    },
  },
  {
    id: "5",
    title: "Cyber-Atmospheric Soundscape",
    description:
      "Prompts for generating immersive, layering background music and foley for futuristic or noir-themed digital experiences.",
    model: "Stable Audio 2.0",
    type: "audio",
    tags: ["audio", "music", "ambient", "production"],
    likes: 167,
    views: 620,
    isLiked: false,
    isSaved: false,
    createdAt: "Jan 12, 2026",
    content: "Ambient dark techno, 110 BPM. Deep pulsating basslines, industrial metallic percussions, distant police sirens with heavy reverb. Ethereal synth pads fading in and out. High-fidelity, binaural spatial audio, lo-fi aesthetic.",
    useCases: [
      "Background music for coding streams",
      "Immersive game foley",
      "Podcast intro/outro creation"
    ],
    isPublic: false,
  },
  {
    id: "6",
    title: "Portrait of the Neo-Viking",
    description:
      "A hyper-realistic image prompt focusing on texture, skin detail, and lighting for high-end AI portraiture.",
    model: "Midjourney v6.1",
    type: "image",
    tags: ["image", "art", "portrait", "realism"],
    likes: 3100,
    views: 105000,
    isLiked: true,
    isSaved: true,
    createdAt: "Jan 10, 2026",
    content: "https://images.unsplash.com/photo-1514539079130-25950c84af65?q=80&w=2000&auto=format&fit=crop",
    initialPrompt: "Hyper-realistic close-up portrait of a modern neo-viking tech CEO. Shaved sides, intricate geometric tattoos on the scalp, silver-flecked beard. Wearing a sleek, matte black carbon-fiber techwear jacket. Harsh side lighting, rainy city background at night, 8k resolution, photorealistic, shot on Sony A7R IV.",
    useCases: [
      "Character concept for film",
      "Website hero backgrounds",
      "Artistic reference for physical painters"
    ],
    isPublic: true,
    author: {
      id: "alex-kim-id",
      name: "Alex Kim",
      email: "alex@example.com",
    },
  },
  {
    id: "7",
    title: "Legal Tech Query Optimizer",
    description:
      "A specialized assistant for translating complex legal questions into precise database queries for e-discovery platforms.",
    model: "GPT-4o",
    type: "text",
    tags: ["legal", "business", "data", "queries"],
    likes: 203,
    views: 840,
    isLiked: false,
    isSaved: false,
    createdAt: "Jan 05, 2026",
    content: "Given the following legal complaint, extract the core allegations and translate them into a series of boolean search queries for an Relativity e-discovery database. \n\nTargeting: Internal emails, Slack history, and deleted document metadata.",
    useCases: [
      "E-discovery preparation",
      "Summarizing litigation risks",
      "Automating document review workflows"
    ],
    isPublic: true,
    author: {
      id: "james-wilson-id",
      name: "James Wilson",
      email: "james@example.com",
    },
  },
  {
    id: "8",
    title: "Abstract Neon Workspace",
    description:
      "Generative art prompt for wide-angle isometric illustrations of futuristic developer setups.",
    model: "DALL-E 3",
    type: "image",
    tags: ["image", "illustration", "tech", "isometric"],
    likes: 145,
    views: 530,
    isLiked: false,
    isSaved: false,
    createdAt: "Jan 02, 2026",
    content: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2000&auto=format&fit=crop",
    initialPrompt: "Isometric 3D render of a futuristic glass-top desk. 5 monitors floating in air, holographic code floating above the keyboard. Glowing fiber-optic cables running across the floor. Vibrant purple and cyan neon lighting. Minimalist white room. Soft shadows, Octane Render style.",
    useCases: [
      "Backgrounds for tech-related blogs",
      "App landing page illustrations",
      "Presentation deck visuals"
    ],
    isPublic: false,
  }
];

export const collectionFixtures: Collection[] = [
  {
    id: "1",
    name: "Business Strategy",
    description:
      "A curated collection of prompts for growth, product discovery, and market analysis.",
    promptIds: ["1", "4", "7"],
    createdAt: "Jan 10, 2026",
    updatedAt: "Jan 23, 2026",
  },
  {
    id: "2",
    name: "Aesthetics & Art",
    description:
      "Visual and auditory prompts for high-fidelity generative AI projects.",
    promptIds: ["3", "5", "6", "8"],
    createdAt: "Jan 12, 2026",
    updatedAt: "Jan 24, 2026",
  },
];

export function getPromptFixture(id: string) {
  return promptFixtures.find((prompt) => prompt.id === id) ?? null;
}

export function getCollectionFixture(id: string) {
  return collectionFixtures.find((collection) => collection.id === id) ?? null;
}
