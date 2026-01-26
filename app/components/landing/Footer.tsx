import { Sparkles } from "lucide-react";

interface FooterProps {
  isDarkMode: boolean;
}

export function Footer({ isDarkMode }: FooterProps) {
  return (
    <footer className={`${isDarkMode ? 'bg-[#0f0f11] border-[#27272a]' : 'bg-white border-[#d4d4d4]'} border-t py-12`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className={`h-8 w-8 rounded-lg flex items-center justify-center bg-gradient-to-br ${isDarkMode ? 'from-[#8b5cf6] to-[#7c3aed]' : 'from-[#CF0707] to-[#a80606]'}`}>
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className={isDarkMode ? 'text-[#fafafa]' : 'text-[#333333]'}>EverPrompt</span>
            </div>
            <p className={`text-sm max-w-64 ${isDarkMode ? 'text-[#a1a1aa]' : 'text-[#868686]'}`}>
              Your central hub for AI prompt management
            </p>
          </div>
          <div>
            <h4 className={`mb-4 ${isDarkMode ? 'text-[#fafafa]' : 'text-[#333333]'}`}>Product</h4>
            <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-[#a1a1aa]' : 'text-[#868686]'}`}>
              <li><a href="#" className={isDarkMode ? 'hover:text-[#8b5cf6] transition-colors' : 'hover:text-[#CF0707]'}>Features</a></li>
              <li><a href="#" className={isDarkMode ? 'hover:text-[#8b5cf6] transition-colors' : 'hover:text-[#CF0707]'}>Pricing</a></li>
              <li><a href="#" className={isDarkMode ? 'hover:text-[#8b5cf6] transition-colors' : 'hover:text-[#CF0707]'}>Templates</a></li>
              <li><a href="#" className={isDarkMode ? 'hover:text-[#8b5cf6] transition-colors' : 'hover:text-[#CF0707]'}>API</a></li>
            </ul>
          </div>
          <div>
            <h4 className={`mb-4 ${isDarkMode ? 'text-[#fafafa]' : 'text-[#333333]'}`}>Resources</h4>
            <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-[#a1a1aa]' : 'text-[#868686]'}`}>
              <li><a href="#" className={isDarkMode ? 'hover:text-[#8b5cf6] transition-colors' : 'hover:text-[#CF0707]'}>Documentation</a></li>
              <li><a href="#" className={isDarkMode ? 'hover:text-[#8b5cf6] transition-colors' : 'hover:text-[#CF0707]'}>Guides</a></li>
              <li><a href="#" className={isDarkMode ? 'hover:text-[#8b5cf6] transition-colors' : 'hover:text-[#CF0707]'}>Blog</a></li>
              <li><a href="#" className={isDarkMode ? 'hover:text-[#8b5cf6] transition-colors' : 'hover:text-[#CF0707]'}>Support</a></li>
            </ul>
          </div>
          <div>
            <h4 className={`mb-4 ${isDarkMode ? 'text-[#fafafa]' : 'text-[#333333]'}`}>Company</h4>
            <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-[#a1a1aa]' : 'text-[#868686]'}`}>
              <li><a href="/about" className={isDarkMode ? 'hover:text-[#8b5cf6] transition-colors' : 'hover:text-[#CF0707]'}>About</a></li>
              <li><a href="/privacy" className={isDarkMode ? 'hover:text-[#8b5cf6] transition-colors' : 'hover:text-[#CF0707]'}>Privacy</a></li>
              <li><a href="/terms" className={isDarkMode ? 'hover:text-[#8b5cf6] transition-colors' : 'hover:text-[#CF0707]'}>Terms</a></li>
            </ul>
          </div>
        </div>
        <div className={`pt-8 border-t ${isDarkMode ? 'border-[#27272a]' : 'border-[#d4d4d4]'} text-center text-sm ${isDarkMode ? 'text-[#a1a1aa]' : 'text-[#868686]'}`}>
          <p>© 2025 EverPrompt. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
