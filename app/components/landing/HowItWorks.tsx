import * as React from "react";
import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { 
  Users, 
  Zap, 
  Shield, 
  TrendingUp, 
  Plus, 
  ArrowRight,
  Star
} from "lucide-react";

interface Step {
  number: number;
  icon: any;
  title: string;
  description: string;
  details: string;
  visual: string;
}

interface HowItWorksProps {
  isDarkMode: boolean;
  steps: Step[];
  onGetStarted: () => void;
}

export function HowItWorks({ isDarkMode, steps, onGetStarted }: HowItWorksProps) {
  const [selectedStep, setSelectedStep] = useState<number | null>(null);

  return (
    <section className={`${isDarkMode ? 'bg-[#09090b]' : 'bg-white'} py-20 md:py-32`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-12 items-start mb-16">
          <div className="lg:col-span-12">
            <h2 className={`text-4xl md:text-6xl mb-6 leading-tight text-center ${isDarkMode ? 'text-[#fafafa]' : 'text-[#333333]'}`}>
              Made for AI<br />prompt enthusiasts
            </h2>
            <p className={`text-lg mb-6 text-center ${isDarkMode ? 'text-[#a1a1aa]' : 'text-[#868686]'}`}>
              EverPrompt is shaped by the practices and principles that distinguish world-class AI workflows from the rest: organization, speed, and commitment to quality.
            </p>
          </div>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`group relative ${
                isDarkMode 
                  ? 'bg-[#0f0f11] border-[#27272a] hover:border-[#8b5cf6]/50' 
                  : 'bg-[#fafafa] border-[#e5e5e5] hover:border-[#CF0707]/50'
              } border rounded-2xl p-8 transition-all duration-300 cursor-pointer overflow-hidden`}
              onClick={() => setSelectedStep(index)}
            >
              {/* Visual Element */}
              <div className="mb-20 relative h-48 flex items-center justify-center">
                {step.visual === "account" && (
                  <div className="relative">
                    {/* Stacked cards effect */}
                    <div className={`absolute inset-0 ${isDarkMode ? 'bg-[#18181b]' : 'bg-white'} rounded-xl border ${isDarkMode ? 'border-[#27272a]' : 'border-[#e5e5e5]'} transform -rotate-6 scale-95 opacity-40`} />
                    <div className={`absolute inset-0 ${isDarkMode ? 'bg-[#18181b]' : 'bg-white'} rounded-xl border ${isDarkMode ? 'border-[#27272a]' : 'border-[#e5e5e5]'} transform -rotate-3 scale-97 opacity-60`} />
                    <div className={`relative ${isDarkMode ? 'bg-[#18181b]' : 'bg-white'} rounded-xl border ${isDarkMode ? 'border-[#8b5cf6]' : 'border-[#CF0707]'} p-6 w-32 h-32 flex items-center justify-center shadow-xl`}>
                      <Users className={`h-12 w-12 ${isDarkMode ? 'text-[#8b5cf6]' : 'text-[#CF0707]'}`} />
                    </div>
                  </div>
                )}
                
                {step.visual === "speed" && (
                  <div className="relative w-full">
                    {/* Speed lines */}
                    <div className="space-y-3">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ width: "40%" }}
                          animate={{ width: ["40%", "80%", "40%"] }}
                          transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
                          className={`h-2 rounded-full ${isDarkMode ? 'bg-[#27272a]' : 'bg-[#e5e5e5]'}`}
                          style={{ marginLeft: `${i * 10}%` }}
                        />
                      ))}
                    </div>
                    <div className={`absolute -top-8 right-8 text-3xl ${isDarkMode ? 'text-[#52525b]' : 'text-[#d4d4d4]'}`}>
                      50ms
                    </div>
                  </div>
                )}
                
                {step.visual === "share" && (
                  <div className="relative">
                    {/* Collaboration circles */}
                    <div className="flex items-center justify-center gap-2">
                      <div className={`h-16 w-16 rounded-full ${isDarkMode ? 'bg-[#8b5cf6]/20 border-[#8b5cf6]' : 'bg-[#CF0707]/20 border-[#CF0707]'} border-2 flex items-center justify-center`}>
                        <Users className={`h-7 w-7 ${isDarkMode ? 'text-[#8b5cf6]' : 'text-[#CF0707]'}`} />
                      </div>
                      <div className={`h-12 w-12 rounded-full ${isDarkMode ? 'bg-[#27272a]' : 'bg-[#e5e5e5]'} flex items-center justify-center -ml-4`}>
                        <Shield className={`h-5 w-5 ${isDarkMode ? 'text-[#a1a1aa]' : 'text-[#868686]'}`} />
                      </div>
                    </div>
                  </div>
                )}
                
                {step.visual === "optimize" && (
                  <div className="relative">
                    {/* Keyboard shortcut style */}
                    <div className={`${isDarkMode ? 'bg-[#18181b] border-[#27272a]' : 'bg-white border-[#e5e5e5]'} border-2 rounded-xl px-8 py-4 flex items-center gap-3 shadow-xl`}>
                      <TrendingUp className={`h-8 w-8 ${isDarkMode ? 'text-[#8b5cf6]' : 'text-[#CF0707]'}`} />
                      <span className={`text-2xl ${isDarkMode ? 'text-[#52525b]' : 'text-[#d4d4d4]'}`}>+</span>
                      <Star className={`h-8 w-8 ${isDarkMode ? 'text-[#8b5cf6]' : 'text-[#CF0707]'}`} />
                    </div>
                  </div>
                )}
              </div>

              {/* Title */}
              <h3 className={`text-xl mb-4 ${isDarkMode ? 'text-[#fafafa]' : 'text-[#333333]'}`}>
                {step.title}
              </h3>

              {/* Plus button */}
              <button 
                className={`absolute bottom-8 right-8 h-10 w-10 rounded-lg ${
                  isDarkMode 
                    ? 'bg-[#18181b] border-[#27272a] hover:border-[#8b5cf6] hover:bg-[#8b5cf6]/10' 
                    : 'bg-white border-[#e5e5e5] hover:border-[#CF0707] hover:bg-[#CF0707]/10'
                } border flex items-center justify-center transition-all group-hover:scale-110`}
              >
                <Plus className={`h-5 w-5 ${
                  isDarkMode ? 'text-[#a1a1aa] group-hover:text-[#8b5cf6]' : 'text-[#868686] group-hover:text-[#CF0707]'
                } transition-colors`} />
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Step Detail Modal */}
      <Dialog open={selectedStep !== null} onOpenChange={() => setSelectedStep(null)}>
        <DialogContent className={`sm:max-w-2xl p-0 overflow-hidden flex flex-col gap-0 ${
          isDarkMode 
            ? 'bg-[#0f0f11] border-[#27272a]' 
            : 'bg-white border-[#d4d4d4]'
        }`}>
          {selectedStep !== null && (
            <>
              <DialogHeader className={`px-6 py-5 border-b ${isDarkMode ? 'border-[#27272a]' : 'border-[#f1f5f9]'}`}>
                <div className="flex items-center gap-4 mb-4">
                  <div className={`h-14 w-14 rounded-xl ${
                    isDarkMode ? 'bg-[#8b5cf6]/10' : 'bg-[#CF0707]/10'
                  } flex items-center justify-center`}>
                    {React.createElement(steps[selectedStep].icon, {
                      className: `h-7 w-7 ${isDarkMode ? 'text-[#8b5cf6]' : 'text-[#CF0707]'}`
                    })}
                  </div>
                  <div>
                    <div className={`text-xs mb-1 ${isDarkMode ? 'text-[#52525b]' : 'text-[#a3a3a3]'}`}>
                      Step {steps[selectedStep].number}
                    </div>
                    <DialogTitle className={`text-2xl ${isDarkMode ? 'text-[#fafafa]' : 'text-[#333333]'}`}>
                      {steps[selectedStep].title}
                    </DialogTitle>
                    <DialogDescription className={`${isDarkMode ? 'text-[#a1a1aa]' : 'text-[#868686]'}`}>
                      {steps[selectedStep].description}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              <div className="px-6 py-6 space-y-6">
                <p className={`text-lg leading-relaxed ${isDarkMode ? 'text-[#d4d4d8]' : 'text-[#333333]'}`}>
                  {steps[selectedStep].details}
                </p>
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={onGetStarted}
                    className={`${
                      isDarkMode 
                        ? 'bg-[#8b5cf6] hover:bg-[#7c3aed] text-white' 
                        : 'bg-[#CF0707] hover:bg-[#a80606] text-white'
                    }`}
                  >
                    Get Started
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                  <Button
                    onClick={() => setSelectedStep(null)}
                    variant="ghost"
                    className={`${
                      isDarkMode 
                        ? 'text-[#a1a1aa] hover:bg-[#18181b] hover:text-[#fafafa]' 
                        : 'text-[#868686] hover:bg-[#f5f5f5] hover:text-[#333333]'
                    }`}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
