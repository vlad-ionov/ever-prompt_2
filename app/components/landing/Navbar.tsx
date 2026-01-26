import { Button } from "../ui/button";
import { Moon, Sun } from "lucide-react";
import MainLogoDark from "../../assets/icons/logo-everprompt-dark.svg";
import MainLogoLight from "../../assets/icons/logo-everprompt-light.svg";

interface NavbarProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onLogin: () => void;
  onGetStarted: () => void;
}

export function Navbar({ isDarkMode, onToggleDarkMode, onLogin, onGetStarted }: NavbarProps) {
  const logoSrc = isDarkMode ? MainLogoDark : MainLogoLight;

  return (
    <nav className={`${isDarkMode ? 'bg-[#09090b]/80 border-[#27272a]' : 'bg-white/80 border-[#d4d4d4]'} border-b backdrop-blur-md sticky top-0 z-50`}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={logoSrc} alt="EverPrompt logo" className="h-8 w-auto" />
            <span className={`${isDarkMode ? 'text-[#fafafa]' : 'text-[#333333]'}`}>EverPrompt</span>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={onLogin}
              className={isDarkMode ? 'text-[#fafafa] hover:text-[#8b5cf6] hover:bg-[#18181b]' : 'text-[#333333] hover:text-[#CF0707] hover:bg-[#f5f5f5]'}
            >
              Log In
            </Button>
            <Button
              onClick={onGetStarted}
              className={`${isDarkMode ? 'bg-[#8b5cf6] text-white hover:bg-[#7c3aed]' : 'bg-[#CF0707] text-white hover:bg-[#a80606]'} transition-all duration-200 hover:shadow-lg hover:scale-105`}
            >
              Get Started
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleDarkMode}
              className={`${isDarkMode ? 'border-[#27272a] text-[#a1a1aa] hover:text-[#8b5cf6] hover:bg-[#18181b] hover:border-[#8b5cf6]' : 'border-[#d4d4d4] text-[#333333] hover:text-[#CF0707] hover:bg-[#f5f5f5] hover:border-[#CF0707]'} border transition-all duration-200 hover:scale-105`}
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
