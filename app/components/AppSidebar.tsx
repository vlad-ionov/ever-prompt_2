import {
  Home,
  User,
  Globe,
  Star,
  Settings,
  LogOut,
  Bookmark,
  PanelLeftClose,
  PanelLeftOpen,
  FolderOpen,
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import MainLogoDark from "../assets/icons/logo-everprompt-dark.svg";
import MainLogoLight from "../assets/icons/logo-everprompt-light.svg";

interface AppSidebarProps {
  isDarkMode: boolean;
  activeView: string;
  onViewChange: (view: string) => void;
  promptCounts: {
    all: number;
    personal: number;
    public: number;
    favorites: number;
    saved: number;
  };
  collectionsCount?: number;
  onOpenSettings?: () => void;
  onLogout?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  userProfile?: {
    name: string;
    email: string;
    avatar_url?: string;
  } | null;
  demoMode?: boolean;
}

export function AppSidebar({
  isDarkMode,
  activeView,
  onViewChange,
  promptCounts,
  collectionsCount = 0,
  onOpenSettings,
  onLogout,
  isCollapsed = false,
  onToggleCollapse,
  userProfile,
  demoMode = false
}: AppSidebarProps) {
  const logoSrc = isDarkMode ? MainLogoDark : MainLogoLight;

  const navItems = [
    { id: "all", icon: Home, label: "All Prompts", count: promptCounts.all },
    { id: "personal", icon: User, label: "My Prompts", count: promptCounts.personal },
    { id: "public", icon: Globe, label: "Public Library", count: promptCounts.public },
    { id: "favorites", icon: Star, label: "Favorites", count: promptCounts.favorites },
    { id: "saved", icon: Bookmark, label: "Saved", count: promptCounts.saved || 0 },
    { id: "collections", icon: FolderOpen, label: "Collections", count: collectionsCount },
  ];

  return (
    <TooltipProvider>
      <div className={`${isCollapsed ? 'w-16' : 'w-64'} ${isDarkMode ? 'bg-[#0f0f11] border-[#27272a]' : 'bg-white border-[#d4d4d4]'} border-r flex flex-col transition-all duration-300`}>
        <div className={`flex-1 overflow-y-auto ${isDarkMode ? 'bg-[#0f0f11]' : 'bg-white'}`}>
          <div className={`${isCollapsed ? 'p-2' : 'p-4'} space-y-6`}>
            {/* Logo and Collapse Toggle */}
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between px-2'}`}>
              {!isCollapsed && (
                <div className="flex items-center gap-2">
                  <img src={logoSrc} alt="EverPrompt logo" className="h-6 w-auto" />
                  <span className={`${isDarkMode ? 'text-[#fafafa]' : 'text-[#333333]'}`}>PromptHub</span>
                </div>
              )}
              {isCollapsed && (
                <img src={logoSrc} alt="EverPrompt logo" className="h-7 w-auto" />
              )}
              {onToggleCollapse && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onToggleCollapse}
                      className={`h-8 w-8 ${isDarkMode ? 'text-[#a1a1aa] hover:bg-[#18181b] hover:text-[#fafafa]' : 'text-[#868686] hover:bg-[#f5f5f5] hover:text-[#333333]'}`}
                    >
                      {isCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>

          {!isCollapsed && <Separator className={isDarkMode ? 'bg-[#27272a]' : 'bg-[#d4d4d4]'} />}

          {/* Navigation */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              const button = (
                <Button
                  key={item.id}
                  variant="ghost"
                  className={`w-full ${isCollapsed ? 'justify-center px-0' : 'justify-start gap-3'} h-9 ${
                    isActive 
                      ? isDarkMode
                        ? 'bg-[#8b5cf6] text-white hover:bg-[#7c3aed] hover:text-white focus-visible:ring-[#8b5cf6]'
                        : 'bg-[#E11D48] text-white hover:bg-[#BE123C] hover:text-white focus-visible:ring-[#E11D48]'
                      : isDarkMode 
                        ? 'text-[#fafafa] hover:bg-[#18181b] hover:text-[#fafafa] focus-visible:ring-[#8b5cf6]' 
                        : 'text-[#333333] hover:bg-[#f5f5f5] hover:text-[#333333] focus-visible:ring-[#E11D48]'
                  }`}
                  onClick={() => onViewChange(item.id)}
                >
                  <Icon className="h-4 w-4" />
                  {!isCollapsed && (
                    <>
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.count > 0 && (
                        <Badge 
                          variant="secondary" 
                          className={`${
                            isActive 
                              ? 'bg-white/20 text-white' 
                              : isDarkMode 
                                ? 'bg-[#18181b] text-[#71717a]' 
                                : 'bg-[#f5f5f5] text-[#868686]'
                          }`}
                        >
                          {item.count}
                        </Badge>
                      )}
                    </>
                  )}
                </Button>
              );
              
              return isCollapsed ? (
                <Tooltip key={item.id}>
                  <TooltipTrigger asChild>
                    {button}
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{item.label} {item.count > 0 && `(${item.count})`}</p>
                  </TooltipContent>
                </Tooltip>
              ) : button;
            })}
          </nav>

          {!isCollapsed && <Separator className={isDarkMode ? 'bg-[#27272a]' : 'bg-[#d4d4d4]'} />}
        </div>
      </div>

      {/* User Profile */}
      <div className={`${isCollapsed ? 'p-2' : 'p-4'} ${isDarkMode ? 'border-[#27272a]' : 'border-[#d4d4d4]'} border-t`}>
        {isCollapsed ? (
          <div className="space-y-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex justify-center cursor-pointer">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={userProfile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${demoMode ? 'demo' : userProfile?.email || 'user'}`} />
                    <AvatarFallback>{demoMode ? 'DM' : userProfile?.name?.slice(0, 2).toUpperCase() || 'U'}</AvatarFallback>
                  </Avatar>
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{demoMode ? 'Demo User' : userProfile?.name || 'User'}</p>
              </TooltipContent>
            </Tooltip>
            {!demoMode && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onOpenSettings}
                    className={`w-full h-9 ${isDarkMode ? 'text-[#a1a1aa] hover:bg-[#18181b] hover:text-[#fafafa] focus-visible:ring-[#8b5cf6]' : 'text-[#333333] hover:bg-[#f5f5f5] focus-visible:ring-[#E11D48]'}`}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Settings</p>
                </TooltipContent>
              </Tooltip>
            )}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onLogout}
                  className={`w-full h-9 ${isDarkMode ? 'text-[#a1a1aa] hover:bg-[#18181b] hover:text-[#fafafa] focus-visible:ring-[#8b5cf6]' : 'text-[#333333] hover:bg-[#f5f5f5] focus-visible:ring-[#E11D48]'}`}
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{demoMode ? 'Exit Demo' : 'Log Out'}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="h-9 w-9">
                <AvatarImage src={userProfile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${demoMode ? 'demo' : userProfile?.email || 'user'}`} />
                <AvatarFallback>{demoMode ? 'DM' : userProfile?.name?.slice(0, 2).toUpperCase() || 'U'}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className={`text-sm truncate ${isDarkMode ? 'text-[#fafafa]' : 'text-[#333333]'}`}>
                  {demoMode ? 'Demo User' : userProfile?.name || 'User'}
                </p>
                <p className={`text-xs truncate ${isDarkMode ? 'text-[#71717a]' : 'text-[#868686]'}`}>
                  {demoMode ? 'demo@example.com' : userProfile?.email || 'user@example.com'}
                </p>
              </div>
            </div>
            <div className="space-y-1">
              {!demoMode && (
                <Button
                  variant="ghost"
                  onClick={onOpenSettings}
                  className={`w-full justify-start gap-3 h-8 text-sm ${isDarkMode ? 'text-[#a1a1aa] hover:bg-[#18181b] hover:text-[#fafafa] focus-visible:ring-[#8b5cf6]' : 'text-[#333333] hover:bg-[#f5f5f5] focus-visible:ring-[#E11D48]'}`}
                >
                  <Settings className="h-3.5 w-3.5" />
                  <span>Settings</span>
                </Button>
              )}
              <Button
                variant="ghost"
                onClick={onLogout}
                className={`w-full justify-start gap-3 h-8 text-sm ${isDarkMode ? 'text-[#a1a1aa] hover:bg-[#18181b] hover:text-[#fafafa] focus-visible:ring-[#8b5cf6]' : 'text-[#333333] hover:bg-[#f5f5f5] focus-visible:ring-[#E11D48]'}`}
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>{demoMode ? 'Exit Demo' : 'Log Out'}</span>
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
    </TooltipProvider>
  );
}
