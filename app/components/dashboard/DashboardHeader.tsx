import { MagnifyingGlass, SunDim, MoonStars, CloudArrowDown, PlusCircle, FolderSimplePlus, ListBullets, List, UserCircle, SignOut } from "@phosphor-icons/react/dist/ssr";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { toast } from "sonner";
import type { Prompt, UserProfile } from "@/lib/types";

interface DashboardHeaderProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  logoSrc: string;
  isMobile: boolean;
  onOpenSidebar: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isSearchFocused: boolean;
  setIsSearchFocused: (focused: boolean) => void;
  promptsCount: number;
  filteredPrompts: Prompt[];
  onExportJSON: (prompts: Prompt[]) => void;
  onExportText: (prompts: Prompt[]) => void;
  activeView: string;
  onNewPrompt: () => void;
  onNewCollection: () => void;
  user: {
    name: string;
    email: string;
    avatar?: string;
    avatar_url?: string;
  };
  demoMode: boolean;
  onExitDemo?: () => void;
  onSignOut: () => void;
  onOpenSettings: () => void;
}

export function DashboardHeader({
  isDarkMode,
  onToggleDarkMode,
  logoSrc,
  isMobile,
  onOpenSidebar,
  searchQuery,
  onSearchChange,
  isSearchFocused,
  setIsSearchFocused,
  promptsCount,
  filteredPrompts,
  onExportJSON,
  onExportText,
  activeView,
  onNewPrompt,
  onNewCollection,
  user,
  demoMode,
  onExitDemo,
  onSignOut,
  onOpenSettings,
}: DashboardHeaderProps) {
  const userDisplayName = user.name || user.email.split("@")[0] || "User";
  const avatarUrl = user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.email || userDisplayName)}`;

  return (
    <header className={`${
      isDarkMode 
        ? 'bg-[#020617]/80 border-white/5' 
        : 'bg-white border-[var(--border)] shadow-sm'
    } border-b sticky top-0 z-30 backdrop-blur-xl transition-all duration-500`}>
      <div className="px-4 md:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Logo */}
        <div className="flex items-center gap-3 flex-shrink-0 min-w-[200px]">
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onOpenSidebar}
              className={`h-9 w-9 rounded-xl ${isDarkMode ? 'text-[#fafafa] hover:bg-[#18181b]' : 'text-[#333333] hover:bg-[#f1f5f9]'}`}
            >
              <ListBullets className="h-5 w-5" weight="regular" />
            </Button>
          )}
          <div className="flex items-center gap-2.5 group cursor-pointer select-none">
            <div className={`p-1.5 rounded-xl transition-all duration-300 ${isDarkMode 
              ? 'bg-[#18181b] ring-1 ring-[#27272a]' 
              : 'bg-[#f1f5f9] shadow-sm ring-1 ring-white'}`}>
               <img src={logoSrc} alt="EverPrompt" className="h-5 w-5" />
            </div>
            <span className={`hidden sm:inline text-sm font-bold tracking-tight ${isDarkMode ? 'text-[#fafafa]' : 'text-[#333333]'}`}>EverPrompt</span>
          </div>
        </div>

        {/* Center: Search */}
        <div className={`flex-1 transition-all duration-500 hidden md:block px-4 ${isSearchFocused ? 'max-w-2xl' : 'max-w-xl'}`}>
          <div className="relative group/search">
            <MagnifyingGlass 
              className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-all duration-300 ${
                isSearchFocused 
                  ? (isDarkMode ? 'text-[#8b5cf6]' : 'text-[#111111]') 
                  : (isDarkMode ? 'text-[#71717a]' : 'text-[#a1a1aa]')
              }`} 
              weight={isSearchFocused ? "bold" : "regular"} 
            />
            <Input
              id="main-search"
              placeholder="Search prompts, tags, or models..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className={`pl-12 pr-12 h-12 w-full rounded-2xl text-base transition-all duration-500 border-0 ${
                isDarkMode 
                  ? `bg-[#18181b]/40 text-white placeholder:text-[#52525b] ${isSearchFocused ? 'bg-[#18181b] shadow-[0_0_20px_rgba(139,92,246,0.15)]' : ''}` 
                  : `bg-[#f8fafc] text-[#0f172a] placeholder:text-[#94a3b8] ${isSearchFocused ? 'bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)]' : ''}`
              } ring-1 ${isSearchFocused ? (isDarkMode ? 'ring-[#8b5cf6]/50' : 'ring-[#0f172a]/20') : (isDarkMode ? 'ring-white/5' : 'ring-black/[0.04]')}`}
            />
            <div className={`absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 transition-opacity duration-300 ${isSearchFocused ? 'opacity-0' : 'opacity-100'}`}>
              <kbd className={`h-5 min-w-[20px] px-1.5 flex items-center justify-center rounded border text-[10px] font-sans font-medium uppercase tracking-widest ${
                isDarkMode ? 'bg-[#27272a] border-white/5 text-[#71717a]' : 'bg-white border-slate-200 text-slate-400'
              }`}>
                {typeof window !== 'undefined' && /Mac/i.test(navigator.userAgent) ? '⌘' : 'Ctrl'}
              </kbd>
              <kbd className={`h-5 min-w-[20px] px-1.5 flex items-center justify-center rounded border text-[10px] font-sans font-medium uppercase tracking-widest ${
                isDarkMode ? 'bg-[#27272a] border-white/5 text-[#71717a]' : 'bg-white border-slate-200 text-slate-400'
              }`}>
                K
              </kbd>
            </div>
          </div>
        </div>

        {/* Right: Stats \u0026 Actions */}
        <div className="flex items-center gap-2 md:gap-3 flex-shrink-0 justify-end min-w-[200px]">
           {/* Mobile Search Toggle */}
           <div className="md:hidden">
              <Button variant="ghost" size="icon" className={`h-9 w-9 rounded-xl ${isDarkMode ? 'text-[#a1a1aa]' : 'text-[#868686]'}`}> 
                <MagnifyingGlass className="h-4 w-4" /> 
              </Button>
           </div>

           {/* Stats Pill */}
           <div className={`hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full border ${isDarkMode ? 'border-[#27272a] bg-[#18181b]/50' : 'border-[#e5e5e5] bg-[#f5f5f7]/50'}`}>
              <span className={`text-[11px] font-medium uppercase tracking-wider ${isDarkMode ? 'text-[#71717a]' : 'text-[#868686]'}`}>Total</span>
              <span className={`text-xs font-bold ${isDarkMode ? 'text-[#fafafa]' : 'text-[#333333]'}`}>{promptsCount}</span>
           </div>

           <div className={`w-px h-6 mx-1 ${isDarkMode ? 'bg-[#27272a]' : 'bg-[#e5e5e5]'} hidden lg:block`} />

           <div className="flex items-center gap-1">
             <Button
                onClick={onToggleDarkMode}
                variant="ghost"
                size="icon"
                className={`h-9 w-9 rounded-xl transition-colors ${isDarkMode ? 'text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#18181b]' : 'text-[#666666] hover:text-[#333333] hover:bg-[#f1f5f9]'}`}
             >
                {isDarkMode ? <SunDim className="h-4 w-4" /> : <MoonStars className="h-4 w-4" />}
             </Button>

             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-9 w-9 rounded-xl transition-colors ${isDarkMode ? 'text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#18181b]' : 'text-[#666666] hover:text-[#333333] hover:bg-[#f1f5f9]'}`}
                  >
                    <CloudArrowDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className={`${isDarkMode ? 'bg-[#18181b] border-[#27272a]' : 'bg-white border-[#d4d4d4]'}`}>
                  <DropdownMenuItem
                    onClick={() => {
                      if (filteredPrompts.length === 0) {
                        toast.error("No prompts to export");
                        return;
                      }
                      onExportJSON(filteredPrompts);
                      toast.success("Prompts exported as JSON");
                    }}
                    className={`${isDarkMode ? 'text-[#fafafa] hover:bg-[#27272a]' : 'text-[#333333] hover:bg-[#f1f5f9]'}`}
                  >
                    <ListBullets className="h-4 w-4 mr-2" weight="regular" />
                    Export as JSON
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      if (filteredPrompts.length === 0) {
                        toast.error("No prompts to export");
                        return;
                      }
                      onExportText(filteredPrompts);
                      toast.success("Prompts exported as Text");
                    }}
                    className={`${isDarkMode ? 'text-[#fafafa] hover:bg-[#27272a]' : 'text-[#333333] hover:bg-[#f1f5f9]'}`}
                  >
                    <List className="h-4 w-4 mr-2" weight="regular" />
                    Export as Text
                  </DropdownMenuItem>
                </DropdownMenuContent>
             </DropdownMenu>
           </div>

            <Button
              onClick={() => {
                if (activeView === "collections") {
                  onNewCollection();
                } else {
                  onNewPrompt();
                }
              }}
              className={`h-10 px-5 rounded-2xl shadow-lg transition-all duration-300 relative group/add overflow-hidden border-0 ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] text-white hover:shadow-purple-500/20' 
                  : 'bg-[#111111] text-white hover:bg-[#222222] shadow-sm'
              }`}
            >
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover/add:opacity-100 transition-opacity duration-300" />
              <div className="flex items-center gap-2 relative z-10">
                {activeView === "collections" ? (
                  <FolderSimplePlus className="h-4 w-4 transition-transform group-hover/add:scale-110" weight="bold" />
                ) : (
                  <PlusCircle className="h-4 w-4 transition-transform group-hover/add:rotate-90 duration-500" weight="bold" />
                )}
                <span className="text-sm font-bold tracking-tight">
                  {activeView === "collections" ? "New Collection" : "New Prompt"}
                </span>
              </div>
            </Button>

           {/* Account */}
           <DropdownMenu>
             <DropdownMenuTrigger asChild>
               <Button
                 variant="ghost"
                 size="icon"
                 className={`h-9 w-9 rounded-full ml-1 ${isDarkMode ? 'hover:bg-[#18181b]' : 'hover:bg-[#f1f5f9]'}`}
               >
                 <Avatar className="h-8 w-8 ring-2 ring-transparent hover:ring-2 hover:ring-opacity-50 transition-all duration-200 ring-offset-2 ring-offset-background">
                   <AvatarImage src={avatarUrl} alt={userDisplayName} />
                   <AvatarFallback className={`text-xs ${isDarkMode ? 'bg-[#18181b] text-[#fafafa]' : 'bg-[#f1f5f9] text-[#333333]'}`}>
                     {userDisplayName.slice(0, 2).toUpperCase()}
                   </AvatarFallback>
                 </Avatar>
               </Button>
             </DropdownMenuTrigger>
             <DropdownMenuContent
               align="end"
               className={`${
                 isDarkMode ? 'bg-[#0f0f11] border-[#27272a]' : 'bg-white border-[#d4d4d4]'
               } w-64 rounded-2xl p-2 shadow-lg mt-2`}
             >
               <div className={`${isDarkMode ? 'bg-[#111113]' : 'bg-[#f5f5f7]'} rounded-xl px-3 py-3 mb-2`}>
                 <p className={`${isDarkMode ? 'text-[#fafafa]' : 'text-[#333333]'} text-sm font-medium`}>{userDisplayName}</p>
                 <p className={`${isDarkMode ? 'text-[#8e8e9a]' : 'text-[#9a9aa1]'} text-xs`}>{demoMode ? "Preview workspace" : user.email}</p>
               </div>
               {!demoMode && (
                 <DropdownMenuItem
                   onClick={onOpenSettings}
                   className={`${isDarkMode ? 'text-[#fafafa]' : 'text-[#333333]'} rounded-xl px-3 py-2 cursor-pointer`}
                 >
                   <UserCircle className="mr-3 h-4 w-4" weight="regular" />
                   Account Settings
                 </DropdownMenuItem>
               )}
               <DropdownMenuItem
                 onClick={() => {
                   if (demoMode) {
                     onExitDemo?.();
                   } else {
                     onSignOut();
                   }
                 }}
                 className={`rounded-xl px-3 py-2 cursor-pointer ${
                   demoMode ? (isDarkMode ? 'text-[#fafafa]' : 'text-[#333333]') : 'text-[#111111]'
                 }`}
               >
                 <SignOut className="mr-3 h-4 w-4" weight="regular" />
                 {demoMode ? 'Exit Demo' : 'Sign Out'}
               </DropdownMenuItem>
             </DropdownMenuContent>
           </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
