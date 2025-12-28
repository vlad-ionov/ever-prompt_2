import * as React from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../ui/command";
import {
  Sparkle,
  User,
  Cards,
  Heart,
  BookmarkSimple,
  Globe,
  PlusCircle,
  FolderSimplePlus,
  Moon,
  Sun,
  FileText,
  VideoCamera,
  SpeakerHifi,
  Image as ImageIcon,
} from "@phosphor-icons/react";
import type { Prompt } from "@/lib/types";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prompts: Prompt[];
  onPromptSelect: (id: string) => void;
  onViewChange: (view: string) => void;
  onToggleDarkMode: () => void;
  isDarkMode: boolean;
  onNewPrompt: () => void;
  onNewCollection: () => void;
}

export function CommandPalette({
  open,
  onOpenChange,
  prompts,
  onPromptSelect,
  onViewChange,
  onToggleDarkMode,
  isDarkMode,
  onNewPrompt,
  onNewCollection,
}: CommandPaletteProps) {
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  const runCommand = React.useCallback(
    (command: () => void) => {
      onOpenChange(false);
      command();
    },
    [onOpenChange]
  );

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Type a command or search prompts..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem onSelect={() => runCommand(onNewPrompt)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            <span>Create New Prompt</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(onNewCollection)}>
            <FolderSimplePlus className="mr-2 h-4 w-4" />
            <span>Create New Collection</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Views">
          <CommandItem onSelect={() => runCommand(() => onViewChange("all"))}>
            <Cards className="mr-2 h-4 w-4" />
            <span>All Prompts</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => onViewChange("personal"))}>
            <User className="mr-2 h-4 w-4" />
            <span>My Prompts</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => onViewChange("public"))}>
            <Globe className="mr-2 h-4 w-4" />
            <span>Public Library</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => onViewChange("favorites"))}>
            <Heart className="mr-2 h-4 w-4" />
            <span>Favorites</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => onViewChange("saved"))}>
            <BookmarkSimple className="mr-2 h-4 w-4" />
            <span>Saved</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Prompts">
          {prompts.slice(0, 10).map((prompt) => (
            <CommandItem
              key={prompt.id}
              onSelect={() => runCommand(() => onPromptSelect(prompt.id))}
            >
              {prompt.type === "text" && <FileText className="mr-2 h-4 w-4" />}
              {prompt.type === "image" && <ImageIcon className="mr-2 h-4 w-4" />}
              {prompt.type === "video" && <VideoCamera className="mr-2 h-4 w-4" />}
              {prompt.type === "audio" && <SpeakerHifi className="mr-2 h-4 w-4" />}
              <span>{prompt.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem onSelect={() => runCommand(onToggleDarkMode)}>
            {isDarkMode ? (
              <Sun className="mr-2 h-4 w-4" />
            ) : (
              <Moon className="mr-2 h-4 w-4" />
            )}
            <span>Toggle {isDarkMode ? "Light" : "Dark"} Mode</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
