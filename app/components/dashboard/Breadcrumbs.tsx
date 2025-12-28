import { CaretRight, House, FolderSimple, Sparkle } from "@phosphor-icons/react";
import { cn } from "../ui/utils";

interface BreadcrumbItem {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  isDarkMode: boolean;
  className?: string;
  onHomeClick?: () => void;
}

export function Breadcrumbs({ items, isDarkMode, className, onHomeClick }: BreadcrumbsProps) {
  return (
    <nav className={cn("flex items-center gap-1.5 text-sm font-medium", className)}>
      <button 
        onClick={onHomeClick}
        className={cn(
          "flex items-center gap-1.5 transition-colors duration-200",
          isDarkMode ? "text-zinc-500 hover:text-white" : "text-slate-400 hover:text-slate-900"
        )}
      >
        <House size={16} weight="bold" />
      </button>
      
      {items.map((item, index) => (
        <div key={item.label} className="flex items-center gap-1.5">
          <CaretRight 
            size={12} 
            className={cn(isDarkMode ? "text-zinc-700" : "text-slate-300")} 
            weight="bold" 
          />
          <button
            onClick={item.onClick}
            disabled={item.active}
            className={cn(
              "flex items-center gap-1.5 transition-colors duration-200",
              item.active 
                ? (isDarkMode ? "text-white" : "text-slate-900") 
                : (isDarkMode ? "text-zinc-500 hover:text-white" : "text-slate-500 hover:text-slate-900"),
              item.active && "cursor-default text-sm"
            )}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        </div>
      ))}
    </nav>
  );
}
