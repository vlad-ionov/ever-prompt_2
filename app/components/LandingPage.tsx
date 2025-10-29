import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { 
  Sparkles, 
  Zap, 
  Shield, 
  Users, 
  BookOpen,
  Heart,
  Share2,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Video,
  Music,
  Image as ImageIcon,
  FileText,
  Search,
  Filter,
  Star,
  Moon,
  Sun,
  Plus,
  ChevronLeft,
  ChevronRight,
  Grid3x3,
  Bookmark
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { DashboardPromptCard } from "./DashboardPromptCard";
import { motion, AnimatePresence } from "motion/react";
import { useState, useRef } from "react";
import * as React from "react";

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
  onDemo: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  isDarkMode: boolean;
}

function BentoCard({ children, className = "", isDarkMode }: BentoCardProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    setMousePosition({ x, y });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePosition({ x: 0, y: 0 });
  };

  // Calculate rotation based on mouse position (magnetic effect)
  const rotateX = isHovered ? (mousePosition.y / 20) * -1 : 0;
  const rotateY = isHovered ? mousePosition.x / 20 : 0;
  const translateX = isHovered ? mousePosition.x / 10 : 0;
  const translateY = isHovered ? mousePosition.y / 10 : 0;

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX,
        rotateY,
        x: translateX,
        y: translateY,
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 20,
      }}
      style={{
        transformStyle: "preserve-3d",
      }}
      className={`${
        isDarkMode 
          ? 'bg-[#0f0f0f] border-[#262626] hover:border-[#60a5fa]/50' 
          : 'bg-white border-[#d4d4d4] hover:border-[#E11D48]/50'
      } border rounded-2xl transition-all duration-300 relative overflow-hidden ${className}`}
    >
      <motion.div
        animate={{
          opacity: isHovered ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        className={`absolute inset-0 ${
          isDarkMode 
            ? 'bg-gradient-to-br from-[#60a5fa]/5 to-transparent' 
            : 'bg-gradient-to-br from-[#E11D48]/5 to-transparent'
        }`}
        style={{ pointerEvents: 'none' }}
      />
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}

export function LandingPage({ onGetStarted, onLogin, onDemo, isDarkMode, onToggleDarkMode }: LandingPageProps) {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [selectedFeature, setSelectedFeature] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedStep, setSelectedStep] = useState<number | null>(null);
  
  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Organization",
      description: "Intelligently categorize and tag your prompts across GPT-4, Claude, Gemini, and more",
      details: "Our intelligent tagging system automatically organizes your prompts by AI model, use case, and content type. Smart folders help you find what you need instantly, while our advanced categorization learns from your usage patterns to suggest better organization over time."
    },
    {
      icon: Search,
      title: "Smart Search & Filter",
      description: "Find the perfect prompt instantly with advanced search and filtering by model, type, and tags",
      details: "Advanced search capabilities let you filter by multiple criteria simultaneously. Search across titles, descriptions, and content. Save your favorite search combinations for quick access. Our fuzzy matching ensures you find what you're looking for, even with typos."
    },
    {
      icon: Share2,
      title: "Share & Collaborate",
      description: "Build a public library or keep prompts private. Share your best work with the community",
      details: "Choose to keep prompts private or share them with the world. Build your public profile and gain followers. Collaborate with teams using shared workspaces. Export and import prompts easily across different platforms and tools."
    },
    {
      icon: Video,
      title: "Multi-Format Support",
      description: "Manage prompts for text, video, audio, and image generation all in one place",
      details: "Whether you're generating blog posts, creating videos, producing podcasts, or designing images, manage all your prompts in one unified interface. Each format gets specialized tools and templates tailored to its unique requirements."
    },
    {
      icon: Heart,
      title: "Save Your Favorites",
      description: "Like and favorite prompts to quickly access your most-used templates",
      details: "Bookmark your most useful prompts with a single click. Create custom collections and folders. Access your favorites from anywhere. Track which prompts work best for different scenarios and build your personal prompt library over time."
    },
    {
      icon: TrendingUp,
      title: "Track Performance",
      description: "See which prompts get the most engagement and optimize your workflow",
      details: "Comprehensive analytics show you which prompts perform best. See usage statistics, engagement metrics, and community favorites. Identify trends and patterns to improve your prompt engineering skills and create more effective prompts."
    }
  ];

  const steps = [
    {
      number: 1,
      icon: Users,
      title: "Purpose-built for prompt management",
      description: "Sign up in seconds and get instant access to your personal prompt vault",
      details: "Getting started is quick and simple. Just provide your email and create a password - no credit card required. You'll immediately get access to all features including unlimited prompt storage, public library access, and community features. Set up your profile, customize your settings, and you're ready to go.",
      visual: "account"
    },
    {
      number: 2,
      icon: Zap,
      title: "Designed to move fast",
      description: "Import existing prompts or create new ones with our intuitive editor",
      details: "Our smart editor makes it easy to add and organize prompts. Tag them by AI model (GPT-4, Claude, Gemini, etc.), categorize by type (text, image, video, audio), and add custom tags for easy searching. Bulk import your existing prompts or start fresh. Our AI-powered suggestions help you improve prompt quality and organization.",
      visual: "speed"
    },
    {
      number: 3,
      icon: Shield,
      title: "Built for collaboration",
      description: "Choose to keep prompts private or share them with the community",
      details: "Decide what to share and what to keep private. Public prompts help build your reputation and allow others to benefit from your expertise. Private prompts stay secure in your vault. Join collaborative workspaces to share prompts with your team. Get feedback, track engagement, and see how others use your prompts.",
      visual: "share"
    },
    {
      number: 4,
      icon: TrendingUp,
      title: "Crafted to perfection",
      description: "Track performance, discover trends, and improve your prompt engineering",
      details: "Use our analytics dashboard to see which prompts perform best. Track views, likes, and usage patterns. Discover trending prompts in the community. Learn from top prompt engineers and continuously improve your skills. Export your data, create backups, and integrate with your favorite AI tools.",
      visual: "optimize"
    }
  ];

  const stats = [
    { label: "Active Users", value: "10K+" },
    { label: "Prompts Shared", value: "50K+" },
    { label: "AI Models", value: "15+" },
    { label: "Success Rate", value: "98%" }
  ];

  const contentTypes = [
    { icon: FileText, label: "Text", color: "text-blue-500" },
    { icon: Video, label: "Video", color: "text-purple-500" },
    { icon: Music, label: "Audio", color: "text-green-500" },
    { icon: ImageIcon, label: "Image", color: "text-pink-500" }
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className={`${isDarkMode ? 'bg-[#09090b]/80 border-[#27272a]' : 'bg-white/80 border-[#d4d4d4]'} border-b backdrop-blur-md sticky top-0 z-50`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`h-8 w-8 rounded-lg flex items-center justify-center bg-gradient-to-br ${isDarkMode ? 'from-[#8b5cf6] to-[#7c3aed]' : 'from-[#FF5722] to-[#EA4C1E]'}`}>
                <Sparkles className="h-5 w-5 text-white" />
              </div>
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

      {/* Hero Section with Futuristic Ambient Animation */}
      <section className="relative overflow-hidden">
        {/* Ambient Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Floating particles */}
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className={`absolute w-1 h-1 rounded-full ${isDarkMode ? 'bg-[#8b5cf6]' : 'bg-[#CF0707]'}`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                x: [0, Math.random() * 50 - 25, 0],
                opacity: [0, 0.6, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 5 + Math.random() * 5,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: "easeInOut"
              }}
            />
          ))}

          {/* Holographic grid */}
          <motion.div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(${isDarkMode ? 'rgba(139, 92, 246, 0.03)' : 'rgba(207, 7, 7, 0.02)'} 1px, transparent 1px),
                linear-gradient(90deg, ${isDarkMode ? 'rgba(139, 92, 246, 0.03)' : 'rgba(207, 7, 7, 0.02)'} 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px',
            }}
            animate={{
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Glowing orbs with color shifts */}
          <motion.div
            className="absolute top-1/4 right-1/3 w-96 h-96 rounded-full blur-3xl"
            style={{
              background: isDarkMode 
                ? 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(207, 7, 7, 0.1) 0%, transparent 70%)'
            }}
            animate={{
              y: [0, -40, 0],
              x: [0, 40, 0],
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-1/4 left-1/3 w-[500px] h-[500px] rounded-full blur-3xl"
            style={{
              background: isDarkMode 
                ? 'radial-gradient(circle, rgba(167, 139, 250, 0.12) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(225, 29, 72, 0.08) 0%, transparent 70%)'
            }}
            animate={{
              y: [0, 40, 0],
              x: [0, -40, 0],
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Scanning lines */}
          <motion.div
            className={`absolute left-0 right-0 h-px ${isDarkMode ? 'bg-gradient-to-r from-transparent via-[#8b5cf6]/50 to-transparent' : 'bg-gradient-to-r from-transparent via-[#CF0707]/40 to-transparent'}`}
            animate={{
              top: ['0%', '100%'],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear"
            }}
          />

          {/* Geometric shapes */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={`shape-${i}`}
              className={`absolute w-2 h-2 ${isDarkMode ? 'border border-[#8b5cf6]/20' : 'border border-[#CF0707]/20'}`}
              style={{
                left: `${20 + i * 20}%`,
                top: `${30 + (i % 2) * 40}%`,
              }}
              animate={{
                rotate: [0, 360],
                scale: [1, 1.5, 1],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: 6 + i,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}

          {/* Ambient glow at edges */}
          <div className={`absolute top-0 left-0 right-0 h-px ${isDarkMode ? 'bg-gradient-to-r from-transparent via-[#8b5cf6]/30 to-transparent' : 'bg-gradient-to-r from-transparent via-[#CF0707]/20 to-transparent'}`} />
          <div className={`absolute bottom-0 left-0 right-0 h-px ${isDarkMode ? 'bg-gradient-to-r from-transparent via-[#a78bfa]/30 to-transparent' : 'bg-gradient-to-r from-transparent via-[#E11D48]/20 to-transparent'}`} />
        </div>

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
                className={`text-xl ${isDarkMode ? 'text-[#a1a1aa]' : 'text-[#868686]'} leading-relaxed`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                The next-generation platform for AI prompt management. Organize, share, and discover 
                prompts across GPT-4, Claude, Gemini, and more. Built for creators who craft the future.
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
                className="flex items-center gap-8 pt-4"
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
                      isLiked: true,
                      isSaved: false,
                      isPublic: true,
                      createdAt: '2024-01-15',
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
                      isLiked: false,
                      isSaved: true,
                      isPublic: true,
                      createdAt: '2024-01-14',
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
                      isLiked: false,
                      isSaved: false,
                      isPublic: false,
                      createdAt: '2024-01-13',
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
                  <p className={`text-xs ${isDarkMode ? 'text-[#10b981]' : 'text-[#10b981]'}`}>+24% this week</p>
                </motion.div>

                {/* Bottom fade gradient - suggests more content below */}
                <div 
                  className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
                  style={{
                    background: isDarkMode
                      ? 'linear-gradient(to bottom, transparent, rgba(15, 15, 17, 0.95))'
                      : 'linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.95))'
                  }}
                />

                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={`${isDarkMode ? 'bg-[#0f0f11] border-[#27272a]' : 'bg-white border-[#d4d4d4]'} border-y py-12`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className={`text-3xl md:text-4xl mb-2 ${isDarkMode ? 'text-[#fafafa]' : 'text-[#333333]'}`}>
                  {stat.value}
                </div>
                <div className={`text-sm ${isDarkMode ? 'text-[#a1a1aa]' : 'text-[#868686]'}`}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section with Slider */}
      <section className="py-20 md:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className={`${isDarkMode ? 'bg-[#8b5cf6]/10 text-[#8b5cf6] border-[#8b5cf6]/20' : 'bg-[#CF0707]/10 text-[#CF0707] border-[#CF0707]/20'} mb-4`}>
              Features
            </Badge>
            <h2 className={`text-4xl md:text-5xl mb-4 ${isDarkMode ? 'text-[#fafafa]' : 'text-[#333333]'}`}>
              Everything you need to
              <br />
              <span className={isDarkMode ? 'text-[#8b5cf6]' : 'text-[#CF0707]'}>manage AI prompts</span>
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${isDarkMode ? 'text-[#a1a1aa]' : 'text-[#868686]'}`}>
              Built for teams and individuals who want a better way to organize, share, and discover AI prompts
            </p>
          </div>

          {/* Feature Slider */}
          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <div className="flex gap-2">
                {features.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentFeature(index)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      index === currentFeature
                        ? isDarkMode
                          ? 'w-8 bg-[#8b5cf6]'
                          : 'w-8 bg-[#CF0707]'
                        : isDarkMode
                          ? 'w-1.5 bg-[#27272a]'
                          : 'w-1.5 bg-[#d4d4d4]'
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCurrentFeature((prev) => (prev === 0 ? features.length - 1 : prev - 1))}
                  className={`h-8 w-8 ${isDarkMode ? 'text-[#a1a1aa] hover:text-[#8b5cf6] hover:bg-[#18181b]' : 'text-[#868686] hover:text-[#CF0707] hover:bg-[#f5f5f5]'}`}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCurrentFeature((prev) => (prev === features.length - 1 ? 0 : prev + 1))}
                  className={`h-8 w-8 ${isDarkMode ? 'text-[#a1a1aa] hover:text-[#8b5cf6] hover:bg-[#18181b]' : 'text-[#868686] hover:text-[#CF0707] hover:bg-[#f5f5f5]'}`}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="relative h-[400px] md:h-[450px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentFeature}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                  className={`absolute inset-0 ${
                    isDarkMode 
                      ? 'bg-gradient-to-br from-[#0f0f11] to-[#18181b] border-[#27272a]' 
                      : 'bg-gradient-to-br from-white to-[#f5f5f5] border-[#d4d4d4]'
                  } border rounded-2xl p-8 md:p-12 flex flex-col justify-between overflow-hidden`}
                >
                  {/* Decorative gradient */}
                  <div className={`absolute top-0 right-0 w-96 h-96 ${isDarkMode ? 'bg-[#8b5cf6]/5' : 'bg-[#CF0707]/5'} rounded-full blur-3xl`} />
                  
                  <div className="relative z-10">
                    <div className={`inline-flex h-16 w-16 rounded-2xl items-center justify-center mb-6 ${
                      isDarkMode ? 'bg-[#8b5cf6]/10 backdrop-blur-sm' : 'bg-[#CF0707]/10'
                    }`}>
                      {React.createElement(features[currentFeature].icon, {
                        className: `h-8 w-8 ${isDarkMode ? 'text-[#8b5cf6]' : 'text-[#CF0707]'}`
                      })}
                    </div>
                    <h3 className={`text-3xl md:text-4xl mb-4 ${isDarkMode ? 'text-[#fafafa]' : 'text-[#333333]'}`}>
                      {features[currentFeature].title}
                    </h3>
                    <p className={`text-lg md:text-xl mb-6 max-w-2xl ${isDarkMode ? 'text-[#a1a1aa]' : 'text-[#868686]'}`}>
                      {features[currentFeature].description}
                    </p>
                  </div>

                  <div className="relative z-10 flex items-center justify-between">
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

            {/* Feature Grid - Thumbnails */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-8">
              {features.map((feature, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentFeature(index)}
                  className={`${
                    index === currentFeature
                      ? isDarkMode
                        ? 'bg-[#18181b] border-[#8b5cf6]'
                        : 'bg-white border-[#CF0707]'
                      : isDarkMode
                        ? 'bg-[#0f0f11] border-[#27272a] hover:border-[#8b5cf6]/50'
                        : 'bg-white border-[#d4d4d4] hover:border-[#CF0707]/50'
                  } border rounded-xl p-4 transition-all duration-200 text-left`}
                >
                  <feature.icon className={`h-5 w-5 mb-2 ${
                    index === currentFeature
                      ? isDarkMode ? 'text-[#8b5cf6]' : 'text-[#CF0707]'
                      : isDarkMode ? 'text-[#a1a1aa]' : 'text-[#868686]'
                  }`} />
                  <p className={`text-xs ${
                    index === currentFeature
                      ? isDarkMode ? 'text-[#fafafa]' : 'text-[#333333]'
                      : isDarkMode ? 'text-[#a1a1aa]' : 'text-[#868686]'
                  }`}>
                    {feature.title}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Detail Modal */}
      <Dialog open={selectedFeature !== null} onOpenChange={() => setSelectedFeature(null)}>
        <DialogContent className={`${
          isDarkMode 
            ? 'bg-[#0f0f11] border-[#27272a]' 
            : 'bg-white border-[#d4d4d4]'
        } max-w-2xl`}>
          {selectedFeature !== null && (
            <>
              <DialogHeader>
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
              <div className="space-y-4">
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

      {/* How It Works Section - Linear Style */}
      <section className={`${isDarkMode ? 'bg-[#09090b]' : 'bg-white'} py-20 md:py-32`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-12 items-start mb-16">
            <div className="lg:col-span-5">
              <h2 className={`text-4xl md:text-6xl mb-6 leading-tight ${isDarkMode ? 'text-[#fafafa]' : 'text-[#333333]'}`}>
                Made for AI<br />prompt enthusiasts
              </h2>
              <p className={`text-lg mb-6 ${isDarkMode ? 'text-[#a1a1aa]' : 'text-[#868686]'}`}>
                EverPrompt is shaped by the practices and principles that distinguish world-class AI workflows from the rest: organization, speed, and commitment to quality.
              </p>
              <button 
                onClick={onGetStarted}
                className={`group inline-flex items-center gap-2 ${isDarkMode ? 'text-[#fafafa] hover:text-[#8b5cf6]' : 'text-[#333333] hover:text-[#CF0707]'} transition-colors`}
              >
                <span>Get started now</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
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
      </section>

      {/* Step Detail Modal */}
      <Dialog open={selectedStep !== null} onOpenChange={() => setSelectedStep(null)}>
        <DialogContent className={`${
          isDarkMode 
            ? 'bg-[#0f0f11] border-[#27272a]' 
            : 'bg-white border-[#d4d4d4]'
        } max-w-2xl`}>
          {selectedStep !== null && (
            <>
              <DialogHeader>
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
              <div className="space-y-6">
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

      {/* CTA Section */}
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

      {/* Footer */}
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
              <p className={`text-sm ${isDarkMode ? 'text-[#a1a1aa]' : 'text-[#868686]'}`}>
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
                <li><a href="#" className={isDarkMode ? 'hover:text-[#8b5cf6] transition-colors' : 'hover:text-[#CF0707]'}>About</a></li>
                <li><a href="#" className={isDarkMode ? 'hover:text-[#8b5cf6] transition-colors' : 'hover:text-[#CF0707]'}>Careers</a></li>
                <li><a href="#" className={isDarkMode ? 'hover:text-[#8b5cf6] transition-colors' : 'hover:text-[#CF0707]'}>Privacy</a></li>
                <li><a href="#" className={isDarkMode ? 'hover:text-[#8b5cf6] transition-colors' : 'hover:text-[#CF0707]'}>Terms</a></li>
              </ul>
            </div>
          </div>
          <div className={`pt-8 border-t ${isDarkMode ? 'border-[#27272a]' : 'border-[#d4d4d4]'} text-center text-sm ${isDarkMode ? 'text-[#a1a1aa]' : 'text-[#868686]'}`}>
            <p>© 2025 EverPrompt. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
