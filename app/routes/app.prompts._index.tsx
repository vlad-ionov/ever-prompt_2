import { useOutletContext } from "@remix-run/react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { PromptCard } from "@/components/PromptCard";
import { PublicPromptCard } from "@/components/PublicPromptCard";
import { Toaster } from "@/components/ui/sonner";
import type { AppOutletContext } from "./app";
import type { Prompt } from "@/lib/types";
import { motion, AnimatePresence } from "motion/react";
import { Sparkle, Code, PencilLine, Palette, Rocket, Globe } from "lucide-react";

import { useTheme } from "@/hooks/useTheme";

const CATEGORIES = [
  { id: "all", label: "All Prompts", icon: Sparkle },
  { id: "marketing", label: "Marketing", icon: Rocket },
  { id: "coding", label: "Coding", icon: Code },
  { id: "writing", label: "Writing", icon: PencilLine },
  { id: "ui/ux", label: "UI/UX", icon: Palette },
];

const MODELS = [
  { id: "all", label: "All Models" },
  { id: "gpt-4", label: "GPT-4" },
  { id: "claude-3.5", label: "Claude 3.5" },
  { id: "gemini", label: "Gemini Pro" },
];

export async function action() {
  // TODO: wire Supabase mutations
  return null;
}

export default function PromptsIndexRoute() {
  const { prompts: initialPrompts } = useOutletContext<AppOutletContext>();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [promptState, setPromptState] = useState<Prompt[]>(initialPrompts);
  const [searchQuery, setSearchQuery] = useState("");
  const [modelFilter, setModelFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredPrompts = useMemo(() => {
    return promptState.filter((prompt) => {
      const matchesQuery = prompt.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) || 
        prompt.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesModel =
        modelFilter === "all" || prompt.model.toLowerCase().includes(modelFilter.toLowerCase());
      
      const matchesType = typeFilter === "all" || prompt.type === typeFilter;
      
      const matchesCategory = selectedCategory === "all" || 
        prompt.tags.some(t => t.toLowerCase() === selectedCategory.toLowerCase());

      return matchesQuery && matchesModel && matchesType && matchesCategory;
    });
  }, [modelFilter, promptState, searchQuery, typeFilter, selectedCategory]);

  const toggleLike = (id: string) => {
    setPromptState((prev) =>
      prev.map((prompt) =>
        prompt.id === id
          ? {
              ...prompt,
              isLiked: !prompt.isLiked,
              likes: prompt.isLiked ? prompt.likes - 1 : prompt.likes + 1,
            }
          : prompt,
      ),
    );
  };

  const toggleSave = (id: string) => {
    setPromptState((prev) =>
      prev.map((prompt) =>
        prompt.id === id
          ? {
              ...prompt,
              isSaved: !prompt.isSaved,
            }
          : prompt,
      ),
    );
  };

  const toggleVisibility = (id: string) => {
    setPromptState((prev) =>
      prev.map((prompt) =>
        prompt.id === id
          ? {
              ...prompt,
              isPublic: !prompt.isPublic,
            }
          : prompt,
      ),
    );
  };

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "grain-bg-dark" : "grain-bg-light"
      }`}
    >
      <div className="grain-content">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10">
          <header className="flex flex-col gap-6 items-center text-center max-w-2xl mx-auto mb-4">
            <div className="space-y-2">
              <h1
                className={`text-4xl md:text-5xl font-bold tracking-tight ${
                  isDarkMode ? "text-white" : "text-slate-900"
                }`}
              >
                Prompt Explorer
              </h1>
              <p className={`text-lg ${isDarkMode ? "text-zinc-500" : "text-slate-500"}`}>
                Discover high-performance prompts crafted by the community.
              </p>
            </div>
            
            <div className={`w-full max-w-xl relative group`}>
              <input
                type="search"
                placeholder="Search premium prompts..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className={`w-full h-14 pl-12 pr-4 rounded-2xl border transition-all duration-300 outline-none ${
                  isDarkMode 
                    ? "bg-white/[0.03] border-white/10 text-white focus:border-violet-500/50 focus:bg-white/[0.05]" 
                    : "bg-white border-slate-200 text-slate-900 focus:border-violet-500/30 focus:shadow-xl focus:shadow-slate-200/50"
                }`}
              />
              <Globe className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 ${isDarkMode ? "text-zinc-600" : "text-slate-400"}`} />
            </div>
          </header>

          <div className="space-y-6">
            {/* Category Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                    selectedCategory === cat.id
                      ? (isDarkMode ? "bg-violet-600 text-white scale-105 shadow-lg shadow-violet-600/20" : "bg-violet-600 text-white scale-105 shadow-lg shadow-violet-600/10")
                      : (isDarkMode ? "bg-white/[0.03] text-zinc-500 border border-white/5 hover:bg-white/10" : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300")
                  }`}
                >
                  <cat.icon size={16} />
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Model & Additional Filters */}
            <div className="flex flex-wrap items-center justify-center gap-6 py-2">
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold uppercase tracking-widest ${isDarkMode ? "text-zinc-600" : "text-slate-400"}`}>Model:</span>
                  <div className="flex items-center gap-1.5">
                    {MODELS.map(m => (
                      <button 
                        key={m.id}
                        onClick={() => setModelFilter(m.id)}
                        className={`px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all duration-300 ${
                          modelFilter === m.id 
                            ? (isDarkMode ? "text-violet-400 bg-violet-500/10" : "text-violet-700 bg-violet-50") 
                            : (isDarkMode ? "text-zinc-600 hover:text-zinc-400" : "text-slate-400 hover:text-slate-600")
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={`h-4 w-px ${isDarkMode ? "bg-white/10" : "bg-slate-200"}`} />

                <div className="flex items-center gap-3">
                  <select
                    value={typeFilter}
                    onChange={(event) => setTypeFilter(event.target.value)}
                    className={`bg-transparent outline-none text-xs font-bold uppercase tracking-widest cursor-pointer ${
                      isDarkMode ? "text-zinc-400 focus:text-white" : "text-slate-500 focus:text-slate-900"
                    }`}
                  >
                    <option value="all">All Formats</option>
                    <option value="text">Text Only</option>
                    <option value="video">Video Clips</option>
                    <option value="image">Visuals</option>
                  </select>
                </div>
            </div>
          </div>

            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
              <AnimatePresence mode="popLayout">
                {filteredPrompts.map((prompt) => (
                  <PublicPromptCard
                    key={prompt.id}
                    prompt={prompt}
                    isDarkMode={isDarkMode}
                    onCopy={() => toast.success("Промпт скопирован!")}
                    onLike={(id) => toggleLike(id)}
                    onSave={(id) => toggleSave(id)}
                  />
                ))}
              </AnimatePresence>
            </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
