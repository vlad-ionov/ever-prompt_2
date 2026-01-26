import { Bot } from "lucide-react";

import ClaudeIcon from "../../assets/icons/claude-color.svg";
import OpenAIIcon from "../../assets/icons/openai.svg";
import GeminiIcon from "../../assets/icons/gemini-color.svg";
import MidjourneyIcon from "../../assets/icons/midjourney.svg";
import GrokIcon from "../../assets/icons/grok.svg";
import QwenIcon from "../../assets/icons/qwen-color.svg";

interface ModelConfig {
  keywords: string[];
  icon: string;
}

const MODEL_MAPPINGS: ModelConfig[] = [
  {
    keywords: ["gpt", "openai", "o1", "dall-e", "dalle", "sora"],
    icon: OpenAIIcon,
  },
  {
    keywords: ["claude", "anthropic"],
    icon: ClaudeIcon,
  },
  {
    keywords: ["gemini", "bard", "google", "paalm"],
    icon: GeminiIcon,
  },
  {
    keywords: ["midjourney", "mj"],
    icon: MidjourneyIcon,
  },
  {
    keywords: ["grok", "xai"],
    icon: GrokIcon,
  },
  {
    keywords: ["qwen"],
    icon: QwenIcon,
  },
];

interface ModelIconProps {
  model: string;
  className?: string;
  size?: number;
  isDarkMode?: boolean;
}

export function ModelIcon({ model, className = "", size = 14, isDarkMode = false }: ModelIconProps) {
  const modelLower = model?.toLowerCase() || "";
  const config = MODEL_MAPPINGS.find(m => m.keywords.some(k => modelLower.includes(k)));

  const needsInversion = isDarkMode && (
    modelLower.includes("gpt") || 
    modelLower.includes("openai") || 
    modelLower.includes("dall-e") || 
    modelLower.includes("dalle") || 
    modelLower.includes("midjourney") || 
    modelLower.includes("mj") ||
    modelLower.includes("grok") ||
    modelLower.includes("xai")
  );

  if (config) {
    return (
      <img 
        src={config.icon} 
        alt={model} 
        className={className}
        style={{ 
          width: size, 
          height: size, 
          objectFit: 'contain',
          filter: needsInversion ? 'invert(1) brightness(1.5)' : 'none'
        }}
      />
    );
  }

  return <Bot className={className} style={{ width: size, height: size }} />;
}

