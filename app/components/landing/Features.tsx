import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { 
  Sparkles, 
  Search, 
  Share2, 
  Video, 
  Heart, 
  TrendingUp, 
  Plus, 
  ArrowRight,
  Zap,
  Shield,
  Star
} from "lucide-react";

interface Feature {
  icon: any;
  title: string;
  description: string;
  details: string;
}

interface FeaturesProps {
  isDarkMode: boolean;
  features: Feature[];
  onGetStarted: () => void;
}

export function Features({ isDarkMode, features, onGetStarted }: FeaturesProps) {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [selectedFeature, setSelectedFeature] = useState<number | null>(null);

  return (
    <section className="py-20 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-6xl mb-6 font-medium ${isDarkMode ? 'text-[#fafafa]' : 'text-[#333333]'}`}>
            Supercharge your AI workflow
          </h2>
          <p className={`text-xl max-w-2xl mx-auto ${isDarkMode ? 'text-[#a1a1aa]' : 'text-[#868686]'}`}>
            All the tools you need to manage, optimize, and share your AI prompts in one place.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Feature List */}
          <div className="space-y-4">
            {features.map((feature, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentFeature(index)}
                className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 relative group overflow-hidden ${
                  currentFeature === index
                    ? isDarkMode 
                      ? 'bg-[#18181b] border-[#8b5cf6] shadow-[0_0_20px_rgba(139,92,246,0.15)]' 
                      : 'bg-white border-[#CF0707] shadow-[0_0_20px_rgba(207,7,7,0.1)]'
                    : isDarkMode
                      ? 'bg-transparent border-[#27272a] hover:border-[#8b5cf6]/50'
                      : 'bg-transparent border-[#e5e5e5] hover:border-[#CF0707]/30'
                }`}
                whileHover={{ x: 4 }}
              >
                <div className="flex items-start gap-4 relative z-10">
                  <div className={`p-3 rounded-xl transition-colors ${
                    currentFeature === index
                      ? isDarkMode ? 'bg-[#8b5cf6] text-white' : 'bg-[#CF0707] text-white'
                      : isDarkMode ? 'bg-[#18181b] text-[#52525b] group-hover:text-[#8b5cf6]' : 'bg-[#f5f5f5] text-[#a3a3a3] group-hover:text-[#CF0707]'
                  }`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className={`text-lg font-medium mb-1 transition-colors ${
                      currentFeature === index
                        ? isDarkMode ? 'text-[#fafafa]' : 'text-[#333333]'
                        : isDarkMode ? 'text-[#52525b] group-hover:text-[#fafafa]' : 'text-[#a3a3a3] group-hover:text-[#333333]'
                    }`}>
                      {feature.title}
                    </h3>
                    <p className={`text-sm leading-relaxed transition-colors ${
                      currentFeature === index
                        ? isDarkMode ? 'text-[#a1a1aa]' : 'text-[#868686]'
                        : isDarkMode ? 'text-[#3f3f46] group-hover:text-[#a1a1aa]' : 'text-[#d4d4d4] group-hover:text-[#868686]'
                    }`}>
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Feature Preview Window */}
          <div className="relative aspect-square md:aspect-auto md:h-[100%]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentFeature}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.05, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className={`relative h-full w-full rounded-2xl border ${
                  isDarkMode ? 'bg-[#0f0f11] border-[#27272a]' : 'bg-white border-[#d4d4d4]'
                } shadow-2xl overflow-hidden p-8 flex flex-col`}
              >
                {/* Decorative Background */}
                <div className={`absolute inset-0 opacity-10 pointer-events-none`}>
                  <div className={`absolute top-0 right-0 w-64 h-64 blur-3xl rounded-full ${isDarkMode ? 'bg-[#8b5cf6]' : 'bg-[#CF0707]'}`} />
                  <div className={`absolute bottom-0 left-0 w-64 h-64 blur-3xl rounded-full ${isDarkMode ? 'bg-[#6366f1]' : 'bg-[#E11D48]'}`} />
                </div>

                <div className="relative z-10">
                  <div className={`inline-flex p-4 rounded-2xl mb-6 ${isDarkMode ? 'bg-[#18181b] text-[#8b5cf6]' : 'bg-[#f5f5f5] text-[#CF0707]'}`}>
                    {React.createElement(features[currentFeature].icon, { className: "h-8 w-8" })}
                  </div>
                  <h3 className={`text-3xl font-medium mb-4 ${isDarkMode ? 'text-[#fafafa]' : 'text-[#333333]'}`}>
                    {features[currentFeature].title}
                  </h3>
                  <p className={`text-lg leading-relaxed mb-8 ${isDarkMode ? 'text-[#a1a1aa]' : 'text-[#868686]'}`}>
                    {features[currentFeature].details}
                  </p>
                </div>

                {/* Animated Feature Visuals */}
                <div className="flex-1 relative flex items-center justify-center min-h-[250px]">
                  <motion.div
                    className="w-full flex justify-center"
                    layoutId="feature-visual"
                  >
                   {/* Feature 0: Organization - Stacked cards animation */}
                   {currentFeature === 0 && (
                     <div className="relative w-48 h-48 md:w-64 md:h-64">
                       {[0, 1, 2].map((i) => (
                         <motion.div
                           key={i}
                           className={`absolute inset-0 rounded-2xl border-2 ${isDarkMode ? 'bg-[#18181b] border-[#27272a]' : 'bg-white border-[#e5e5e5]'} flex items-center justify-center shadow-xl`}
                           initial={{ rotate: 0, x: 0, y: 0 }}
                           animate={{ 
                             rotate: (i - 1) * 15,
                             x: (i - 1) * 40,
                             y: (i - 1) * 10
                           }}
                           transition={{ duration: 0.6, delay: i * 0.1 }}
                         >
                           <Sparkles className={`h-12 w-12 ${isDarkMode ? 'text-[#8b5cf6]' : 'text-[#CF0707]'}`} />
                         </motion.div>
                       ))}
                     </div>
                   )}

                   {/* Feature 1: Search - Search interaction animation */}
                   {currentFeature === 1 && (
                     <div className="w-full max-w-xs space-y-3">
                       <motion.div 
                         className={`p-4 rounded-xl border-2 ${isDarkMode ? 'bg-[#18181b] border-[#8b5cf6]' : 'bg-white border-[#CF0707]'} flex items-center gap-3 shadow-lg`}
                         initial={{ width: "60%" }}
                         animate={{ width: "100%" }}
                         transition={{ duration: 1.5, repeat: Infinity, repeatType: "mirror" }}
                       >
                         <Search className={`h-5 w-5 ${isDarkMode ? 'text-[#8b5cf6]' : 'text-[#CF0707]'}`} />
                         <motion.div 
                           className={`h-2 w-24 rounded-full ${isDarkMode ? 'bg-[#27272a]' : 'bg-[#e5e5e5]'}`}
                           initial={{ opacity: 0.3 }}
                           animate={{ opacity: 1 }}
                           transition={{ duration: 0.8, repeat: Infinity }}
                         />
                       </motion.div>
                       {[0, 1].map((i) => (
                         <motion.div 
                           key={i}
                           className={`p-4 rounded-xl border ${isDarkMode ? 'bg-[#0f0f11] border-[#27272a]' : 'bg-white border-[#f1f5f9]'} space-y-2`}
                           initial={{ opacity: 0, x: -20 }}
                           animate={{ opacity: 1, x: 0 }}
                           transition={{ delay: 0.5 + i * 0.2 }}
                         >
                           <div className={`h-2 w-3/4 rounded-full ${isDarkMode ? 'bg-[#27272a]' : 'bg-[#f1f5f9]'}`} />
                           <div className={`h-2 w-1/2 rounded-full ${isDarkMode ? 'bg-[#27272a]' : 'bg-[#f1f5f9]'}`} />
                         </motion.div>
                       ))}
                     </div>
                   )}

                   {/* Feature 2: Share - Connection lines animation */}
                   {currentFeature === 2 && (
                     <div className="relative w-64 h-48 flex items-center justify-center gap-12">
                       <motion.div 
                         className={`h-16 w-16 rounded-2xl ${isDarkMode ? 'bg-[#18181b] border-[#8b5cf6]' : 'bg-white border-[#CF0707]'} border-2 flex items-center justify-center shadow-lg relative z-10`}
                         animate={{ y: [0, -10, 0] }}
                         transition={{ duration: 2, repeat: Infinity }}
                       >
                         <Share2 className={`h-8 w-8 ${isDarkMode ? 'text-[#8b5cf6]' : 'text-[#CF0707]'}`} />
                       </motion.div>
                       <div className="absolute inset-0 flex items-center justify-center">
                         {[...Array(6)].map((_, i) => (
                           <motion.div
                             key={i}
                             className={`absolute h-0.5 ${isDarkMode ? 'bg-[#8b5cf6]/20' : 'bg-[#CF0707]/20'}`}
                             style={{ 
                               width: '100px', 
                               rotate: i * 60,
                               transformOrigin: 'center'
                             }}
                             initial={{ scaleX: 0 }}
                             animate={{ scaleX: [0, 1, 0] }}
                             transition={{ duration: 3, delay: i * 0.2, repeat: Infinity }}
                           />
                         ))}
                       </div>
                     </div>
                   )}

                   {/* Feature 3: Formats - Icon grid pulse animation */}
                   {currentFeature === 3 && (
                     <div className="grid grid-cols-2 gap-4">
                       {[Video, Zap, Heart, Star].map((Icon, i) => (
                         <motion.div
                           key={i}
                           className={`h-20 w-20 md:h-24 md:w-24 rounded-2xl ${isDarkMode ? 'bg-[#18181b] border-[#27272a]' : 'bg-[#fafafa] border-[#e5e5e5]'} border-2 flex items-center justify-center shadow-md`}
                           animate={{ scale: [1, 1.1, 1], backgroundColor: currentFeature === 3 ? (isDarkMode ? '#18181b' : '#ffffff') : '' }}
                           transition={{ duration: 1.5, delay: i * 0.1, repeat: Infinity }}
                         >
                           <Icon className={`h-8 w-8 md:h-10 md:w-10 ${isDarkMode ? 'text-[#52525b]' : 'text-[#a3a3a3]'}`} />
                         </motion.div>
                       ))}
                     </div>
                   )}

                   {/* Feature 4: Favorites - Floating hearts animation */}
                   {currentFeature === 4 && (
                     <div className="relative w-48 h-48 flex items-center justify-center">
                       <motion.div
                         className={`h-24 w-24 rounded-3xl ${isDarkMode ? 'bg-[#18181b] border-[#8b5cf6]' : 'bg-white border-[#CF0707]'} border-2 flex items-center justify-center shadow-2xl z-10`}
                         animate={{ scale: [1, 1.05, 1] }}
                         transition={{ duration: 0.8, repeat: Infinity }}
                       >
                         <Heart className={`h-12 w-12 fill-current ${isDarkMode ? 'text-[#8b5cf6]' : 'text-[#CF0707]'}`} />
                       </motion.div>
                       {[...Array(5)].map((_, i) => (
                         <motion.div
                           key={i}
                           className="absolute text-red-500"
                           initial={{ y: 0, x: 0, opacity: 1, scale: 0.5 }}
                           animate={{ 
                             y: -100 - Math.random() * 50,
                             x: (Math.random() - 0.5) * 100,
                             opacity: 0,
                             scale: 1.5
                           }}
                           transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                         >
                           <Heart className="h-6 w-6 fill-current" />
                         </motion.div>
                       ))}
                     </div>
                   )}

                   {/* Feature 5: Performance - Trending chart */}
                   {currentFeature === 5 && (
                     <div className="relative w-48 h-40 md:w-64 md:h-56 flex items-end justify-center gap-2 md:gap-3 pb-4">
                       {[40, 60, 45, 80, 65, 95].map((h, i) => (
                         <motion.div
                           key={i}
                           className={`w-6 md:w-8 rounded-t-lg ${isDarkMode ? 'bg-gradient-to-t from-[#8b5cf6] to-[#a78bfa]' : 'bg-gradient-to-t from-[#CF0707] to-[#E11D48]'}`}
                           initial={{ height: 0 }}
                           animate={{ height: `${h}%` }}
                           transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
                         />
                       ))}
                       <motion.div
                         className="absolute -top-8 right-0 flex items-center gap-1 z-10"
                         animate={{ y: [0, -5, 0] }}
                         transition={{ duration: 2, repeat: Infinity }}
                       >
                         <TrendingUp className={`h-6 w-6 md:h-8 md:w-8 ${isDarkMode ? 'text-[#50E3C2]' : 'text-[#CF0707]'}`} />
                         <span className={`text-sm md:text-lg font-bold ${isDarkMode ? 'text-[#50E3C2]' : 'text-[#CF0707]'}`}>+24%</span>
                       </motion.div>
                     </div>
                   )}
                  </motion.div>
                </div>
                
                <div className="relative z-10 flex items-center justify-between mt-auto">
                  <Button
                    onClick={() => setSelectedFeature(currentFeature)}
                    className={`group ${
                      isDarkMode 
                        ? 'bg-[#8b5cf6] hover:bg-[#7c3aed] text-white' 
                        : 'bg-[#CF0707] hover:bg-[#a80606] text-white'
                    } transition-all duration-200`}
                  >
                    <Plus className="h-4 w-4 mr-2 transition-transform group-hover:rotate-90" />
                    Learn More
                  </Button>
                  <span className={`text-sm ${isDarkMode ? 'text-[#52525b]' : 'text-[#a3a3a3]'}`}>
                    {String(currentFeature + 1).padStart(2, '0')} / {String(features.length).padStart(2, '0')}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Feature Detail Modal */}
      <Dialog open={selectedFeature !== null} onOpenChange={() => setSelectedFeature(null)}>
        <DialogContent className={`sm:max-w-2xl p-0 overflow-hidden flex flex-col gap-0 ${
          isDarkMode 
            ? 'bg-[#0f0f11] border-[#27272a]' 
            : 'bg-white border-[#d4d4d4]'
        }`}>
          {selectedFeature !== null && (
            <>
              <DialogHeader className={`px-6 py-5 border-b ${isDarkMode ? 'border-[#27272a]' : 'border-[#f1f5f9]'}`}>
                <div className={`inline-flex h-14 w-14 rounded-2xl items-center justify-center mb-4 ${
                  isDarkMode ? 'bg-[#8b5cf6]/10' : 'bg-[#CF0707]/10'
                }`}>
                  {React.createElement(features[selectedFeature].icon, {
                    className: `h-7 w-7 ${isDarkMode ? 'text-[#8b5cf6]' : 'text-[#CF0707]'}`
                  })}
                </div>
                <DialogTitle className={`text-2xl ${isDarkMode ? 'text-[#fafafa]' : 'text-[#333333]'}`}>
                  {features[selectedFeature].title}
                </DialogTitle>
                <DialogDescription className={`${isDarkMode ? 'text-[#a1a1aa]' : 'text-[#868686]'}`}>
                  {features[selectedFeature].description}
                </DialogDescription>
              </DialogHeader>
              <div className="px-6 py-6 space-y-4">
                <p className={`text-lg ${isDarkMode ? 'text-[#a1a1aa]' : 'text-[#868686]'}`}>
                  {features[selectedFeature].description}
                </p>
                <div className={`${isDarkMode ? 'bg-[#18181b]' : 'bg-[#f5f5f5]'} rounded-xl p-6`}>
                  <p className={`${isDarkMode ? 'text-[#d4d4d8]' : 'text-[#333333]'} leading-relaxed`}>
                    {features[selectedFeature].details}
                  </p>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={onGetStarted}
                    className={`flex-1 ${
                      isDarkMode 
                        ? 'bg-[#8b5cf6] hover:bg-[#7c3aed] text-white' 
                        : 'bg-[#CF0707] hover:bg-[#a80606] text-white'
                    }`}
                  >
                    Get Started
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                  <Button
                    onClick={() => setSelectedFeature(null)}
                    variant="outline"
                    className={`${
                      isDarkMode 
                        ? 'border-[#27272a] text-[#a1a1aa] hover:bg-[#18181b] hover:text-[#fafafa]' 
                        : 'border-[#d4d4d4] text-[#868686] hover:bg-[#f5f5f5] hover:text-[#333333]'
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
