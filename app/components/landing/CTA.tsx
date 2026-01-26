import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

interface CTAProps {
  isDarkMode: boolean;
  onGetStarted: () => void;
  onLogin: () => void;
}

export function CTA({ isDarkMode, onGetStarted, onLogin }: CTAProps) {
  return (
    <section className="py-20 md:py-32">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className={`${isDarkMode ? 'bg-gradient-to-br from-[#0f0f11] to-[#18181b] border-[#27272a]' : 'bg-gradient-to-br from-white to-[#f5f5f5] border-[#d4d4d4]'} border rounded-2xl p-12 md:p-16 relative overflow-hidden`}>
          {/* Decorative gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br ${isDarkMode ? 'from-[#8b5cf6]/10 to-transparent' : 'from-[#CF0707]/5 to-transparent'} pointer-events-none`} />
          
          <div className="relative z-10">
            <h2 className={`text-4xl md:text-5xl mb-4 ${isDarkMode ? 'text-[#fafafa]' : 'text-[#333333]'}`}>
              Ready to organize your
              <br />
              <span className={isDarkMode ? 'text-[#8b5cf6]' : 'text-[#CF0707]'}>AI workflow?</span>
            </h2>
            <p className={`text-lg mb-8 ${isDarkMode ? 'text-[#a1a1aa]' : 'text-[#868686]'}`}>
              Join thousands of creators and teams using PromptVault to streamline their AI prompts
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                size="lg"
                onClick={onGetStarted}
                className={`${isDarkMode ? 'bg-[#8b5cf6] text-white hover:bg-[#7c3aed]' : 'bg-[#CF0707] text-white hover:bg-[#a80606]'} transition-all duration-300 hover:shadow-xl hover:scale-105 group`}
              >
                Get Started Free
                <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={onLogin}
                className={`${isDarkMode 
                  ? 'border-[#27272a] bg-[#18181b] text-[#fafafa] hover:bg-[#27272a] hover:border-[#8b5cf6] hover:text-[#fafafa]'
                  : 'border-[#d4d4d4] text-[#333333] hover:bg-[#f5f5f5] hover:border-[#CF0707] hover:text-[#333333]'
                } transition-all duration-300 hover:shadow-lg hover:scale-105`}
              >
                Sign In
              </Button>
            </div>
            <p className={`text-sm mt-6 ${isDarkMode ? 'text-[#a1a1aa]' : 'text-[#868686]'}`}>
              No credit card required • Free 14-day trial
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
