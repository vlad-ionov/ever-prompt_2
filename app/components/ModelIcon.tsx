import { 
  Brain, 
  Sparkles, 
  Zap, 
  Network,
  Bot,
  Star,
  type LucideIcon
} from "lucide-react";

// Map models to icons and colors
export const MODEL_CONFIG: Record<string, { icon: LucideIcon; color: string }> = {
  "GPT-4": { icon: Sparkles, color: "#10a37f" },
  "GPT-3.5": { icon: Zap, color: "#10a37f" },
  "Claude 3": { icon: Brain, color: "#d97757" },
  "Claude 2": { icon: Brain, color: "#d97757" },
  "Gemini Pro": { icon: Star, color: "#4285f4" },
  "Llama 2": { icon: Network, color: "#0668e1" },
  "Mistral": { icon: Bot, color: "#f2613f" },
};

interface ModelIconProps {
  model: string;
  className?: string;
  size?: number;
}

export function ModelIcon({ model, className = "", size = 14 }: ModelIconProps) {
  const config = MODEL_CONFIG[model];
  
  if (!config) {
    return <Bot className={className} style={{ width: size, height: size }} />;
  }

  const Icon = config.icon;
  
  return (
    <Icon 
      className={className} 
      style={{ width: size, height: size, color: config.color }} 
    />
  );
}

export function getModelIcon(model: string): LucideIcon {
  return MODEL_CONFIG[model]?.icon || Bot;
}

export function getModelColor(model: string): string {
  return MODEL_CONFIG[model]?.color || "#6b7280";
}
