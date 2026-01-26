import { motion } from "motion/react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Sparkles, ArrowRight, Search, Filter, Plus, TrendingUp, FileText, Video, Music, Image as ImageIcon } from "lucide-react";
import { BeamsBackground } from "../ui/beams-background";
import { DashboardPromptCard } from "../ui/dashboard-prompt-card";

interface HeroProps {
  isDarkMode: boolean;
  onGetStarted: () => void;
  onDemo: () => void;
}

const contentTypes = [
  { icon: FileText, label: "Text", color: "text-blue-500" },
  { icon: Video, label: "Video", color: "text-purple-500" },
  { icon: Music, label: "Audio", color: "text-green-500" },
  { icon: ImageIcon, label: "Image", color: "text-pink-500" }
];

export function Hero({ isDarkMode, onGetStarted, onDemo }: HeroProps) {
  return (
    <section className="relative overflow-hidden">
      <BeamsBackground isDarkMode={isDarkMode} />
      <div className="max-w-7xl mx-auto px-6 py-20 md:py-32 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Badge className={`${isDarkMode ? 'bg-[#8b5cf6]/10 text-[#8b5cf6] border-[#8b5cf6]/20' : 'bg-[#CF0707]/10 text-[#CF0707] border-[#CF0707]/20'}`}>
                <Sparkles className="h-3 w-3 mr-1" />
                AI Prompt Management
              </Badge>
            </motion.div>
            
            <motion.h1 
              className={`text-5xl md:text-7xl leading-tight ${isDarkMode ? 'text-[#fafafa]' : 'text-[#333333]'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Master your AI
              <br />
              <motion.span 
                className={`${isDarkMode ? 'bg-gradient-to-r from-[#8b5cf6] via-[#a78bfa] to-[#8b5cf6] bg-clip-text text-transparent' : 'bg-gradient-to-r from-[#CF0707] via-[#E11D48] to-[#CF0707] bg-clip-text text-transparent'}`}
                animate={{
                  backgroundPosition: ['0% 50%', '200% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{
                  backgroundSize: '200% 200%'
                }}
              >
                prompt library.
              </motion.span>
            </motion.h1>
            
            <motion.p 
              className={`text-xl max-w-lg ${isDarkMode ? 'text-[#a1a1aa]' : 'text-[#868686]'} leading-relaxed`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              The next-generation platform for AI prompt management. Organize, share, and discover 
              prompts across GPT, Claude, Gemini, and more. Built for creators who craft the future.
            </motion.p>
            
            <motion.div 
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <Button
                size="lg"
                onClick={onGetStarted}
                className={`group relative ${isDarkMode ? 'bg-[#8b5cf6] text-white hover:bg-[#7c3aed]' : 'bg-[#CF0707] text-white hover:bg-[#a80606]'} transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:-translate-y-0.5 overflow-hidden`}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{
                    x: ['-200%', '200%'],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 1,
                    ease: "easeInOut"
                  }}
                />
                <span className="relative z-10 flex items-center">
                  Start for free
                  <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                </span>
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={onDemo}
                className={`${isDarkMode 
                  ? 'border-[#27272a] bg-[#0f0f11]/50 backdrop-blur-sm text-[#fafafa] hover:bg-[#18181b] hover:border-[#8b5cf6]'
                  : 'border-[#d4d4d4] bg-white/50 backdrop-blur-sm text-[#333333] hover:bg-[#f5f5f5] hover:border-[#CF0707]'
                } transition-all duration-300 hover:shadow-lg hover:scale-105 hover:-translate-y-0.5`}
              >
                Explore demo
              </Button>
            </motion.div>
            
            <motion.div 
              className="flex items-center gap-8 pt-4 flex-wrap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {contentTypes.map((type, index) => (
                <motion.div 
                  key={type.label} 
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                >
                  <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-[#18181b]' : 'bg-[#f5f5f5]'}`}>
                    <type.icon className={`h-4 w-4 ${type.color}`} />
                  </div>
                  <span className={`text-sm ${isDarkMode ? 'text-[#71717a]' : 'text-[#868686]'}`}>
                    {type.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right content - Interactive Dashboard Preview */}
          <motion.div 
            className="relative h-[500px] md:h-[600px]"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {/* Holographic glow effect */}
            <motion.div
              className={`absolute -inset-4 rounded-3xl ${isDarkMode ? 'bg-gradient-to-br from-[#8b5cf6]/20 to-[#a78bfa]/10' : 'bg-gradient-to-br from-[#CF0707]/15 to-[#E11D48]/10'} blur-3xl`}
              animate={{
                opacity: [0.4, 0.7, 0.4],
                scale: [0.95, 1.05, 0.95],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            {/* Floating particles around dashboard */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`preview-particle-${i}`}
                className={`absolute w-2 h-2 rounded-full ${isDarkMode ? 'bg-[#8b5cf6]' : 'bg-[#CF0707]'}`}
                style={{
                  left: `${10 + (i * 12)}%`,
                  top: `${20 + (i % 3) * 30}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.3, 0.8, 0.3],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 3 + (i * 0.5),
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeInOut"
                }}
              />
            ))}

            {/* Main dashboard container */}
            <motion.div 
              className={`relative h-full ${isDarkMode ? 'bg-[#0f0f11] border-[#27272a]' : 'bg-white border-[#d4d4d4]'} border-2 rounded-2xl shadow-2xl overflow-hidden`}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              {/* Animated border gradient on hover */}
              <motion.div
                className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  background: isDarkMode
                    ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.3), transparent, rgba(167, 139, 250, 0.3))'
                    : 'linear-gradient(135deg, rgba(207, 7, 7, 0.2), transparent, rgba(225, 29, 72, 0.2))',
                }}
              />

              {/* Dashboard Header */}
              <div className={`${isDarkMode ? 'bg-[#0f0f11] border-[#27272a]' : 'bg-white border-[#e5e5e5]'} border-b px-6 py-4`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-lg ${isDarkMode ? 'bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed]' : 'bg-gradient-to-br from-[#CF0707] to-[#a80606]'} flex items-center justify-center`}>
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <span className={`${isDarkMode ? 'text-[#fafafa]' : 'text-[#333333]'}`}>My Prompts</span>
                  </div>
                  <motion.button
                    className={`${isDarkMode ? 'bg-[#8b5cf6] hover:bg-[#7c3aed]' : 'bg-[#CF0707] hover:bg-[#a80606]'} text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    animate={{
                      boxShadow: [
                        `0 0 15px ${isDarkMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(207, 7, 7, 0.3)'}`,
                        `0 0 25px ${isDarkMode ? 'rgba(139, 92, 246, 0.5)' : 'rgba(207, 7, 7, 0.5)'}`,
                        `0 0 15px ${isDarkMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(207, 7, 7, 0.3)'}`,
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Plus className="h-4 w-4" />
                    New Prompt
                  </motion.button>
                </div>

                {/* Search and Filter Bar */}
                <div className="flex gap-2">
                  <motion.div 
                    className={`flex-1 flex items-center gap-2 ${isDarkMode ? 'bg-[#18181b] border-[#27272a]' : 'bg-[#f5f5f5] border-[#e5e5e5]'} border rounded-lg px-3 py-2`}
                    whileHover={{ 
                      borderColor: isDarkMode ? '#8b5cf6' : '#CF0707',
                      boxShadow: isDarkMode ? '0 0 0 1px #8b5cf6' : '0 0 0 1px #CF0707'
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <Search className={`h-4 w-4 ${isDarkMode ? 'text-[#71717a]' : 'text-[#868686]'}`} />
                    <div className="flex-1 flex items-center">
                      <span className={`text-sm ${isDarkMode ? 'text-[#52525b]' : 'text-[#868686]'}`}>
                        Search prompts...
                      </span>
                      <motion.span
                        className={`ml-1 ${isDarkMode ? 'text-[#8b5cf6]' : 'text-[#CF0707]'}`}
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        |
                      </motion.span>
                    </div>
                  </motion.div>
                  <motion.button
                    className={`${isDarkMode ? 'bg-[#18181b] border-[#27272a] text-[#a1a1aa] hover:border-[#8b5cf6] hover:text-[#8b5cf6]' : 'bg-[#f5f5f5] border-[#e5e5e5] text-[#868686] hover:border-[#CF0707] hover:text-[#CF0707]'} border rounded-lg px-3 py-2 transition-colors`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Filter className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>

              {/* Prompt Cards Grid */}
              <div className="p-6 space-y-4 overflow-hidden">
                {[
                  { 
                    id: '1',
                    title: 'AI Blog Post Generator',
                    description: 'Generate engaging blog posts with SEO optimization and natural flow',
                    model: 'GPT-4',
                    type: 'text' as const,
                    tags: ['content', 'seo', 'marketing'],
                    likes: 234,
                    views: 1200,
                    isLiked: true,
                    isSaved: false,
                    isPublic: true,
                    createdAt: '2024-01-15',
                    content: 'Write a blog post about...',
                    delay: 0.6
                  },
                  { 
                    id: '2',
                    title: 'Video Script Creator',
                    description: 'Create compelling video scripts for YouTube and social media',
                    model: 'Claude',
                    type: 'video' as const,
                    tags: ['video', 'social', 'creative'],
                    likes: 156,
                    views: 850,
                    isLiked: false,
                    isSaved: true,
                    isPublic: true,
                    createdAt: '2024-01-14',
                    content: 'Create a video script for...',
                    delay: 0.8
                  },
                  { 
                    id: '3',
                    title: 'Image Prompt Engineer',
                    description: 'Craft detailed prompts for AI image generation tools',
                    model: 'Gemini',
                    type: 'image' as const,
                    tags: ['art', 'design', 'midjourney'],
                    likes: 421,
                    views: 2300,
                    isLiked: false,
                    isSaved: false,
                    isPublic: false,
                    createdAt: '2024-01-13',
                    content: 'A futuristic city in the style of cyberpunk with neon lights and flying cars...',
                    delay: 1.0
                  }
                ].map((prompt, index) => (
                  <motion.div
                    key={prompt.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: prompt.delay }}
                    whileHover={{ scale: 1.02, x: 4 }}
                  >
                    <DashboardPromptCard {...prompt} isDarkMode={isDarkMode} />
                  </motion.div>
                ))}
              </div>

              {/* Floating Stats */}
              <motion.div
                className={`absolute top-20 right-6 ${isDarkMode ? 'bg-[#0f0f11]/95 border-[#27272a]' : 'bg-white/95 border-[#e5e5e5]'} border backdrop-blur-lg rounded-xl px-4 py-3 shadow-xl`}
                initial={{ opacity: 0, x: 20, rotate: -3 }}
                animate={{ opacity: 1, x: 0, rotate: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                whileHover={{ scale: 1.05, rotate: 2 }}
              >
                {/* Notification dot */}
                <motion.div
                  className={`absolute -top-1 -right-1 h-3 w-3 rounded-full ${isDarkMode ? 'bg-[#8b5cf6]' : 'bg-[#CF0707]'} border-2 ${isDarkMode ? 'border-[#0f0f11]' : 'border-white'}`}
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.7, 1]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className={`h-4 w-4 ${isDarkMode ? 'text-[#8b5cf6]' : 'text-[#CF0707]'}`} />
                  <span className={`text-xs ${isDarkMode ? 'text-[#71717a]' : 'text-[#868686]'}`}>Total</span>
                </div>
                <motion.p 
                  className={`text-2xl ${isDarkMode ? 'text-[#fafafa]' : 'text-[#333333]'}`}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                >
                  2.4k
                </motion.p>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-green-500 font-medium">+24% this week</span>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
