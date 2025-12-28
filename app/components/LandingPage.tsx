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
import { DashboardPromptCard } from "./DashboardPromptCard";
import { motion, AnimatePresence } from "motion/react";
import { useState, useRef, useEffect } from "react";
import * as React from "react";
import MainLogoDark from "../assets/icons/logo-everprompt-dark.svg";
import MainLogoLight from "../assets/icons/logo-everprompt-light.svg";

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
          ? 'bg-[#0f0f0f] border-[#262626] hover:border-[#8b5cf6]/50 shadow-2xl' 
          : 'bg-[#f6f7f8] border-white shadow-[var(--shadow-elevated)]'
      } rounded-[2rem] p-8 overflow-hidden relative group`}
    >
      <motion.div
        animate={{
          opacity: isHovered ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        className={`absolute inset-0 ${
          isDarkMode 
            ? 'bg-gradient-to-br from-[#8b5cf6]/20 to-transparent'
            : 'bg-gradient-to-br from-[#111111]/5 to-transparent'
        }`}
        style={{ pointerEvents: 'none' }}
      />
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}

type BeamConfig = {
  gradient: string;
  top: string;
  height: string;
  rotate: number;
  blur: number;
  duration: number;
  delay: number;
  opacity?: number;
};

const darkBeamConfigs: BeamConfig[] = [
  {
    gradient:
      "linear-gradient(120deg, rgba(139,92,246,0.55) 0%, rgba(59,130,246,0.05) 70%, transparent 90%)",
    top: "12%",
    height: "280px",
    rotate: -12,
    blur: 90,
    duration: 24,
    delay: 0,
    opacity: 0.85,
  },
  {
    gradient:
      "linear-gradient(130deg, rgba(14,165,233,0.35) 0%, rgba(79,70,229,0.05) 75%, transparent 92%)",
    top: "45%",
    height: "220px",
    rotate: 10,
    blur: 140,
    duration: 26,
    delay: 2.5,
    opacity: 0.7,
  },
  {
    gradient:
      "linear-gradient(140deg, rgba(236,72,153,0.2) 0%, rgba(239,68,68,0.05) 60%, transparent 85%)",
    top: "65%",
    height: "320px",
    rotate: -8,
    blur: 70,
    duration: 20,
    delay: 4,
    opacity: 0.6,
  },
];

const lightBeamConfigs: BeamConfig[] = [
  {
    gradient:
      "linear-gradient(120deg, rgba(239,68,68,0.5) 0%, rgba(245,158,11,0.12) 70%, transparent 90%)",
    top: "10%",
    height: "260px",
    rotate: -14,
    blur: 100,
    duration: 22,
    delay: 0.5,
    opacity: 0.9,
  },
  {
    gradient:
      "linear-gradient(140deg, rgba(244,114,182,0.4) 0%, rgba(251,146,60,0.05) 80%, transparent 95%)",
    top: "50%",
    height: "240px",
    rotate: 9,
    blur: 130,
    duration: 24,
    delay: 2,
    opacity: 0.65,
  },
  {
    gradient:
      "linear-gradient(110deg, rgba(59,130,246,0.25) 0%, rgba(236,72,153,0.05) 70%, transparent 90%)",
    top: "70%",
    height: "300px",
    rotate: -6,
    blur: 120,
    duration: 28,
    delay: 3.5,
    opacity: 0.55,
  },
];

type GlowConfig = {
  size: number;
  top: string;
  left?: string;
  right?: string;
  duration: number;
  delay: number;
};

const glowSamples: GlowConfig[] = [
  { size: 420, top: "5%", right: "8%", duration: 12, delay: 0 },
  { size: 360, top: "35%", left: "10%", duration: 14, delay: 1.5 },
  { size: 280, top: "60%", right: "15%", duration: 16, delay: 3 },
];

const particleSeeds = Array.from({ length: 12 }, (_, index) => ({
  left: `${(index * 9) % 90 + 5}%`,
  top: `${((index * 7) % 80) + 5}%`,
  delay: index * 0.35,
}));

function BeamsBackground({ isDarkMode }: { isDarkMode: boolean }) {
  const beamConfigs = isDarkMode ? darkBeamConfigs : lightBeamConfigs;
  const glowColor = isDarkMode
    ? "rgba(59,130,246,0.25)"
    : "rgba(251,113,133,0.35)";
  const particleColor = isDarkMode
    ? "rgba(192,132,252,0.8)"
    : "rgba(248,113,113,0.85)";

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {beamConfigs.map((beam, index) => (
        <motion.div
          key={`beam-${index}`}
          className="absolute left-[-100%] right-[-100%]"
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{
            duration: beam.duration,
            repeat: Infinity,
            delay: beam.delay,
            ease: "linear",
          }}
          style={{
            top: beam.top,
            height: beam.height,
            opacity: (beam.opacity || 0.8) * 0.4,
            filter: `blur(${beam.blur}px)`,
            transform: `rotate(${beam.rotate}deg)`,
            width: "200%",
            backgroundImage: beam.gradient,
          }}
        />
      ))}

      {glowSamples.map((glow, index) => (
        <motion.div
          key={`glow-${index}`}
          className="absolute rounded-full"
          style={{
            width: glow.size,
            height: glow.size,
            top: glow.top,
            left: glow.left,
            right: glow.right,
            background: glowColor,
            filter: "blur(100px)",
          }}
          animate={{
            opacity: [0, 0.4, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: glow.duration,
            repeat: Infinity,
            repeatType: "mirror",
            delay: glow.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {particleSeeds.map((particle, index) => (
        <motion.span
          key={`particle-${index}`}
          className="absolute rounded-full"
          style={{
            width: 6,
            height: 6,
            top: particle.top,
            left: particle.left,
            backgroundColor: particleColor,
            boxShadow: `0 0 12px ${particleColor}`,
          }}
          animate={{
            y: [0, 12, 0],
            opacity: [1, 0.3, 1],
          }}
          transition={{
            duration: 3.5 + index * 0.1,
            repeat: Infinity,
            repeatType: "mirror",
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      <motion.div
        className="absolute inset-0"
        style={{
          background: isDarkMode
            ? "radial-gradient(circle at 20% 20%, rgba(139,92,246,0.15), transparent 45%)"
            : "radial-gradient(circle at 25% 25%, rgba(251,113,133,0.2), transparent 50%)",
          mixBlendMode: "screen",
        }}
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

export function LandingPage({ onGetStarted, onLogin, onDemo, isDarkMode, onToggleDarkMode }: LandingPageProps) {
  const logoSrc = isDarkMode ? MainLogoDark : MainLogoLight;
  const [currentFeature, setCurrentFeature] = useState(0);
  const [selectedFeature, setSelectedFeature] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedStep, setSelectedStep] = useState<number | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
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
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-none ${
          isScrolled 
            ? (isDarkMode ? 'bg-black/60 backdrop-blur-2xl' : 'bg-[#f6f7f8]/80 backdrop-blur-2xl shadow-[var(--shadow-elevated)]') 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className={`h-9 w-9 rounded-xl flex items-center justify-center transition-all duration-500 ${isDarkMode ? 'bg-white/[0.03] border-white/[0.05]' : 'bg-black/[0.03] border-black/[0.05]'} border group-hover:scale-105`}>
                <img src={logoSrc} alt="EverPrompt logo" className="h-5 w-auto transition-transform duration-500 group-hover:rotate-12" />
              </div>
              <span className={`text-lg font-semibold tracking-tight ${isDarkMode ? 'text-white' : 'text-[#0f172a]'}`}>EverPrompt</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onLogin}
                className={`${isDarkMode ? 'text-zinc-400 hover:text-white hover:bg-white/[0.03]' : 'text-slate-600 hover:text-black hover:bg-black/[0.03]'} font-medium transition-colors`}
              >
                Sign In
              </Button>
              <div className={`w-[1px] h-4 ${isDarkMode ? 'bg-white/[0.1]' : 'bg-black/[0.1]'} mx-2`} />
              <Button
                size="sm"
                onClick={onGetStarted}
                className={`${isDarkMode ? 'bg-white text-black hover:bg-zinc-200' : 'bg-[#0f172a] text-white hover:bg-slate-800'} rounded-full px-5 font-semibold shadow-sm transition-transform hover:scale-105 active:scale-95`}
              >
                Get Started
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleDarkMode}
                className={`h-9 w-9 rounded-full ${isDarkMode ? 'text-[#a1a1aa] hover:text-white hover:bg-white/[0.05]' : 'text-[#333333] hover:text-black hover:bg-black/[0.05]'} transition-all`}
              >
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Futuristic Ambient Animation */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">
        <BeamsBackground isDarkMode={isDarkMode} />
        
        {/* Ambient Hero Blobs */}
        <motion.div 
          className={`absolute top-[10%] left-[-5%] w-[35%] h-[35%] rounded-full blur-[120px] pointer-events-none opacity-20 ${isDarkMode ? 'bg-[#8b5cf6]' : 'bg-slate-200'}`}
          animate={{
            x: [0, 40, 0],
            y: [0, -40, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className={`absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] rounded-full blur-[120px] pointer-events-none opacity-20 ${isDarkMode ? 'bg-[#8b5cf6]' : 'bg-zinc-100'}`}
          animate={{
            x: [0, -50, 0],
            y: [0, 30, 0],
            scale: [1.1, 1, 1.1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />

        <div className="max-w-7xl mx-auto px-6 py-20 md:py-32 relative z-10 w-full">
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
                <Badge className={`${isDarkMode 
                  ? 'bg-[#8b5cf6]/10 text-[#8b5cf6] border-[#8b5cf6]/20' 
                  : 'bg-[#f6f7f8] text-[#111111] border-white shadow-[var(--shadow-elevated)]'}`}>
                  <Sparkles className="h-3 w-3 mr-1" />
                  AI Prompt Management
                </Badge>
              </motion.div>
              
              <motion.h1 
                className={`text-2xl md:text-6xl font-medium leading-[0.95] tracking-[-0.04em] ${isDarkMode ? 'text-white' : 'text-[#0f172a]'}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                Master your AI
                <br />
                <motion.span 
                  className={`${isDarkMode ? 'bg-gradient-to-r from-[#8b5cf6] via-[#d8b4fe] to-[#8b5cf6] bg-clip-text text-transparent' : 'bg-gradient-to-r from-[#0f172a] via-slate-600 to-[#0f172a] bg-clip-text text-transparent'}`}
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  style={{
                    backgroundSize: '200% auto'
                  }}
                >
                  prompt library.
                </motion.span>
              </motion.h1>
              
              <motion.p 
                className={`text-lg md:text-xl max-w-lg ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'} leading-relaxed font-medium`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                The next-generation platform for AI prompt management. Organize, share, and discover 
                prompts across every major LLM platform.
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
                  className={`h-14 px-8 rounded-2xl group relative ${isDarkMode 
                    ? 'bg-[#8b5cf6] text-white hover:bg-[#7c3aed] shadow-[var(--shadow-floating)]' 
                    : 'bg-[#111111] text-white hover:bg-[#222222] shadow-[var(--shadow-floating)]'} transition-all duration-300 hover:scale-105 hover:-translate-y-1 font-bold text-lg overflow-hidden border-none`}
                >
                  <span className="relative z-10 flex items-center">
                    Get Started Now
                    <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
                  </span>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={onDemo}
                  className={`h-14 px-8 rounded-2xl ${isDarkMode 
                    ? 'border-[#27272a] bg-black/40 backdrop-blur-xl text-white hover:bg-[#18181b] hover:border-[#8b5cf6]'
                    : 'bg-[#f6f7f8] border-white text-zinc-600 shadow-[var(--shadow-elevated)] hover:border-zinc-300'
                  } transition-all duration-300 font-bold text-lg hover:scale-105 hover:-translate-y-1 border-2`}
                >
                  Watch Demo
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
                    <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-[#18181b]' : 'bg-[#f6f7f8]'}`}>
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
              className="relative h-[500px] md:h-[600px] px-4 md:px-0"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {/* Holographic glow effect */}
              <motion.div
                className={`absolute -inset-4 rounded-3xl ${isDarkMode ? 'bg-gradient-to-br from-[#8b5cf6]/20 to-[#a78bfa]/10' : 'bg-gradient-to-br from-slate-200/50 to-slate-100/30'} blur-3xl`}
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
                  className={`absolute w-2 h-2 rounded-full ${isDarkMode ? 'bg-[#8b5cf6]' : 'bg-[#111111]'}`}
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
                className={`${isDarkMode ? 'bg-[#09090b] border-[#27272a]' : 'bg-white border-[var(--border)] shadow-[var(--shadow-dramatic)]'} border rounded-3xl overflow-hidden relative group`}
                whileHover={{ y: -5, rotateX: 2, rotateY: -2 }}
                transition={{ duration: 0.5 }}
              >
                {/* Animated border gradient on hover */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: isDarkMode
                      ? 'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.1), transparent 70%)'
                      : 'radial-gradient(circle at 50% 50%, rgba(15, 23, 42, 0.05), transparent 70%)',
                  }}
                />

                {/* Dashboard Header */}
                <div className={`${isDarkMode ? 'bg-[#0f0f11] border-[#27272a]' : 'bg-white border-[#e5e5e5]'} border-b px-6 py-6`}>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className={`h-10 w-10 rounded-2xl ${isDarkMode ? 'bg-[#8b5cf6]/10 border-[#8b5cf6]/20' : 'bg-[#0f172a]/5 border-[#0f172a]/10'} border flex items-center justify-center`}>
                        <Sparkles className={`h-5 w-5 ${isDarkMode ? 'text-[#8b5cf6]' : 'text-[#0f172a]'}`} />
                      </div>
                      <div>
                        <h4 className={`text-sm font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-[#0f172a]'}`}>Workspace</h4>
                        <div className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-zinc-500' : 'text-slate-400'}`}>Private Library</div>
                      </div>
                    </div>
                    <motion.button
                      className={`${isDarkMode ? 'bg-[#8b5cf6] hover:bg-[#7c3aed]' : 'bg-[#0f172a] hover:bg-slate-800'} text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg`}
                      whileHover={{ scale: 1.05, translateY: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Plus className="h-4 w-4" />
                      Add Prompt
                    </motion.button>
                  </div>

                  {/* Search and Filter Bar */}
                  <div className="flex gap-2">
                    <motion.div 
                      className={`flex-1 flex items-center gap-2 ${isDarkMode ? 'bg-[#18181b] border-[#27272a]' : 'bg-[#f6f7f8] border-[#e5e5e5]'} border rounded-lg px-3 py-2`}
                      whileHover={{ 
                        borderColor: isDarkMode ? '#8b5cf6' : '#111111',
                        boxShadow: isDarkMode ? '0 0 0 1px #8b5cf6' : '0 0 0 1px #111111'
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <Search className={`h-4 w-4 ${isDarkMode ? 'text-[#71717a]' : 'text-[#868686]'}`} />
                      <div className="flex-1 flex items-center">
                        <span className={`text-sm ${isDarkMode ? 'text-[#52525b]' : 'text-[#868686]'}`}>
                          Search prompts...
                        </span>
                        <motion.span
                          className={`ml-1 ${isDarkMode ? 'text-[#8b5cf6]' : 'text-[#111111]'}`}
                          animate={{ opacity: [0, 1, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          |
                        </motion.span>
                      </div>
                    </motion.div>
                    <motion.button
                      className={`${isDarkMode ? 'bg-[#18181b] border-[#27272a] text-[#a1a1aa] hover:border-[#8b5cf6] hover:text-[#8b5cf6]' : 'bg-[#f6f7f8] border-[#e5e5e5] text-[#868686] hover:border-[#111111] hover:text-[#111111]'} border rounded-lg px-3 py-2 transition-colors`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Filter className="h-4 w-4" />
                    </motion.button>
                  </div>
                </div>

                {/* Prompt Cards Grid */}
                <div className="p-6 pb-20 space-y-4 max-h-[400px] overflow-y-auto scrollbar-thin">
                  {[
                    { 
                      id: '1',
                      title: 'AI Content Strategist',
                      description: 'Comprehensive content planning with semantic SEO and audience personas',
                      model: 'GPT-4o',
                      type: 'text' as const,
                      tags: ['marketing', 'seo', 'strategy'],
                      likes: 1240,
                      isLiked: true,
                      isSaved: false,
                      isPublic: true,
                      createdAt: '2024-03-20',
                      content: 'Develop a 30-day content...',
                      delay: 0.6,
                      author: {
                        name: 'Elena Rossi',
                        email: 'elena@everprompt.ai',
                        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena'
                      }
                    },
                    { 
                      id: '2',
                      title: 'Hyper-Realistic Portait',
                      description: 'Midjourney v6 prompt for cinematic lighting and textures',
                      model: 'GPT-4o',
                      type: 'image' as const,
                      tags: ['design', 'art', 'portrait'],
                      likes: 850,
                      isLiked: false,
                      isSaved: true,
                      isPublic: true,
                      createdAt: '2024-03-18',
                      content: 'Cinematic portrait of a...',
                      delay: 0.8,
                      author: {
                        name: 'Marcus Vane',
                        email: 'marcus@everprompt.ai',
                        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus'
                      }
                    },
                    { 
                      id: '3',
                      title: 'Python Microservice',
                      description: 'Clean, production-ready FastAPI boilerplate with Docker',
                      model: 'Claude 3.5 Sonnet',
                      type: 'text' as const,
                      tags: ['coding', 'python', 'devops'],
                      likes: 2100,
                      isLiked: true,
                      isSaved: true,
                      isPublic: false,
                      createdAt: '2024-03-15',
                      content: 'Write a FastAPI application...',
                      delay: 1.0,
                      author: {
                        name: 'Dev John',
                        email: 'john@everprompt.ai',
                        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
                      }
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
                  className={`absolute -top-8 -right-8 ${isDarkMode ? 'bg-[#0f172a] border-white/10' : 'bg-white border-[var(--border)] shadow-[var(--shadow-floating)]'} border-2 rounded-2xl p-6 shadow-2xl z-30 hidden md:block`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <div className="absolute top-2 left-2 flex gap-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-red-400" />
                    <div className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
                    <div className="h-1.5 w-1.5 rounded-full bg-green-400" />
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className={`h-3 w-3 ${isDarkMode ? 'text-[#8b5cf6]' : 'text-[#111111]'}`} />
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-zinc-500' : 'text-slate-500'}`}>Monthly Views</span>
                  </div>
                  <motion.p 
                    className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-[#0f172a]'}`}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                  >
                    12.8k
                  </motion.p>
                  <p className={`text-[10px] font-bold ${isDarkMode ? 'text-emerald-500/80' : 'text-emerald-600'}`}>+14% Increase</p>
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
      <section className={`${isDarkMode ? 'bg-black/20 border-white/[0.03]' : 'bg-slate-50 border-black/[0.03]'} border-y py-20`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {stats.map((stat, index) => (
              <motion.div 
                key={stat.label} 
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className={`text-5xl md:text-7xl font-black mb-3 tracking-tighter ${isDarkMode ? 'text-white' : 'text-[#0f172a]'}`}>
                  {stat.value}
                </div>
                <div className={`text-[10px] uppercase tracking-[0.3em] font-bold ${isDarkMode ? 'text-zinc-500' : 'text-slate-400'}`}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section with Slider */}
      <section className="py-20 md:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <Badge className={`px-4 py-1.5 rounded-full ${isDarkMode ? 'bg-white/[0.03] text-white/70 border-white/[0.1]' : 'bg-black/[0.03] text-black/70 border-black/[0.1]'} mb-6`}>
              Platform Features
            </Badge>
            <h2 className={`text-4xl md:text-6xl font-black mb-6 tracking-tight leading-[1.1] ${isDarkMode ? 'text-white' : 'text-[#0f172a]'}`}>
              Built for the next generation of 
              <span className={isDarkMode ? 'text-[#8b5cf6]' : 'text-[#111111]'}> prompt engineers</span>
            </h2>
            <p className={`text-lg ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'} leading-relaxed`}>
              Every tool you need to organize, refine, and deploy your AI prompts at scale. 
              Designed for speed, built for precision.
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
                          : 'w-8 bg-[#111111]'
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
                  className={`h-8 w-8 ${isDarkMode ? 'text-[#a1a1aa] hover:text-[#8b5cf6] hover:bg-[#18181b]' : 'text-[#868686] hover:text-[#8b5cf6] hover:bg-[#f6f7f8]'}`}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCurrentFeature((prev) => (prev === features.length - 1 ? 0 : prev + 1))}
                  className={`h-8 w-8 ${isDarkMode ? 'text-[#a1a1aa] hover:text-[#8b5cf6] hover:bg-[#18181b]' : 'text-[#868686] hover:text-[#8b5cf6] hover:bg-[#f6f7f8]'}`}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="relative h-[400px] md:h-[450px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentFeature}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className={`${isDarkMode ? 'bg-[#18181b]/50 border-white/[0.05] shadow-[var(--shadow-floating)]' : 'bg-[#f6f7f8] border-white shadow-[var(--shadow-floating)]'} border-2 rounded-3xl p-12 md:p-20 relative overflow-hidden group/feature h-full flex flex-col justify-center`}
                >
                  {/* Decorative gradient */}
                  <div className={`absolute top-0 right-0 w-96 h-96 ${isDarkMode ? 'bg-[#8b5cf6]/5' : 'bg-[#8b5cf6]/5'} rounded-full blur-3xl`} />
                  
                  <div className="relative z-10">
                    <div className={`inline-flex h-16 w-16 rounded-2xl items-center justify-center mb-6 ${
                      isDarkMode ? 'bg-[#8b5cf6]/10 backdrop-blur-sm' : 'bg-[#8b5cf6]/10'
                    }`}>
                      {React.createElement(features[currentFeature].icon, {
                        className: `h-8 w-8 ${isDarkMode ? 'text-[#8b5cf6]' : 'text-[#111111]'}`
                      })}
                    </div>
                    <h3 className={`text-2xl md:text-4xl mb-4 ${isDarkMode ? 'text-[#fafafa]' : 'text-[#333333]'}`}>
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
                          : 'bg-[#111111] hover:bg-[#222222] text-white'
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-12">
              {features.map((feature, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentFeature(index)}
                  whileHover={{ scale: 1.05, translateY: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className={`${
                    index === currentFeature
                      ? isDarkMode
                        ? 'bg-[#18181b] border-[#8b5cf6] shadow-[0_0_20px_rgba(139,92,246,0.2)]'
                        : 'bg-white border-[#0f172a] shadow-xl'
                      : isDarkMode
                        ? 'bg-black/40 border-white/5 hover:border-white/20'
                        : 'bg-white/40 border-slate-200 hover:border-slate-400'
                  } border rounded-2xl p-6 transition-all duration-300 text-left backdrop-blur-xl group`}
                >
                  <div className={`mb-4 transition-transform duration-500 group-hover:scale-110 ${
                    index === currentFeature
                      ? isDarkMode ? 'text-[#8b5cf6]' : 'text-[#0f172a]'
                      : isDarkMode ? 'text-zinc-600' : 'text-slate-400'
                  }`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <p className={`text-[10px] uppercase tracking-widest font-black ${
                    index === currentFeature
                      ? isDarkMode ? 'text-white' : 'text-[#0f172a]'
                      : isDarkMode ? 'text-zinc-500' : 'text-slate-400'
                  }`}>
                    {feature.title.split(' ')[0]}
                  </p>
                </motion.button>
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
                  isDarkMode ? 'bg-[#8b5cf6]/10' : 'bg-[#8b5cf6]/10'
                }`}>
                  {React.createElement(features[selectedFeature].icon, {
                    className: `h-7 w-7 ${isDarkMode ? 'text-[#8b5cf6]' : 'text-[#111111]'}`
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
                <div className={`${isDarkMode ? 'bg-[#18181b]' : 'bg-[#f6f7f8]'} rounded-xl p-6`}>
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
                        : 'bg-[#8b5cf6] hover:bg-[#7c3aed] text-white'
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
                        : 'border-[#d4d4d4] text-[#868686] hover:bg-[#f6f7f8] hover:text-[#333333]'
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
      <section className={`${isDarkMode ? 'bg-[#09090b]' : 'bg-white'} py-24 md:py-40 border-t ${isDarkMode ? 'border-white/[0.03]' : 'border-black/[0.03]'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-24">
             <Badge className={`px-4 py-1.5 rounded-full ${isDarkMode ? 'bg-white/[0.03] text-white/70 border-white/[0.1]' : 'bg-black/[0.03] text-black/70 border-black/[0.1]'} mb-6`}>
              Our Philosophy
            </Badge>
            <h2 className={`text-5xl md:text-7xl font-black mb-8 tracking-tight leading-[1] ${isDarkMode ? 'text-white' : 'text-[#0f172a]'}`}>
              Refine your <br />AI craft.
            </h2>
            <p className={`text-lg md:text-xl ${isDarkMode ? 'text-zinc-400' : 'text-[#868686]'} leading-relaxed font-medium`}>
              EverPrompt is shaped by the principles that distinguish world-class AI workflows: 
              organization, speed, and collaborative intelligence.
            </p>
          </div>

          {/* Steps Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`group relative ${
                  isDarkMode 
                    ? 'bg-[#18181b]/40 border-white/[0.05] hover:border-[#8b5cf6]/50 shadow-[var(--shadow-floating)]' 
                    : 'bg-white border-slate-200/50 hover:border-[#111111]/20 shadow-[var(--shadow-floating)]'
                } border rounded-[2.5rem] p-10 transition-all duration-500 cursor-pointer overflow-hidden backdrop-blur-3xl flex flex-col h-full`}
                onClick={() => setSelectedStep(index)}
              >
                {/* Visual Element */}
                <div className="mb-12 relative h-40 flex items-center justify-center">
                  {step.visual === "account" && (
                    <div className="relative group-hover:scale-110 transition-transform duration-500">
                      <div className={`absolute inset-0 ${isDarkMode ? 'bg-[#8b5cf6]/20' : 'bg-blue-500/10'} blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity`} />
                      <div className={`relative ${isDarkMode ? 'bg-[#18181b]' : 'bg-white'} rounded-3xl border-2 ${isDarkMode ? 'border-[#8b5cf6]' : 'border-[#0f172a]'} p-8 w-28 h-28 flex items-center justify-center shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)]`}>
                        <Users className={`h-12 w-12 ${isDarkMode ? 'text-[#8b5cf6]' : 'text-[#0f172a]'}`} />
                      </div>
                    </div>
                  )}
                  
                  {step.visual === "speed" && (
                    <div className="relative w-full px-4 group-hover:scale-110 transition-transform duration-500">
                      <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ width: "30%" }}
                            animate={{ width: ["30%", "100%", "30%"] }}
                            transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity, ease: "easeInOut" }}
                            className={`h-1.5 rounded-full ${isDarkMode ? 'bg-gradient-to-r from-[#8b5cf6] to-transparent' : 'bg-gradient-to-r from-[#0f172a] to-transparent'} opacity-40`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {step.visual === "share" && (
                    <div className="relative group-hover:scale-110 transition-transform duration-500">
                      <div className="flex items-center justify-center">
                        <div className={`h-24 w-24 rounded-full ${isDarkMode ? 'bg-[#8b5cf6]/10 border-[#8b5cf6]/30' : 'bg-blue-600/10 border-blue-600/30'} border-2 flex items-center justify-center relative z-10 animate-pulse`}>
                          <Share2 className={`h-10 w-10 ${isDarkMode ? 'text-[#8b5cf6]' : 'text-blue-600'}`} />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {step.visual === "optimize" && (
                    <div className="relative group-hover:scale-110 transition-transform duration-500">
                      <div className={`${isDarkMode ? 'bg-[#18181b] border-white/10' : 'bg-white border-slate-200'} border-2 rounded-2xl px-10 py-6 flex items-center gap-4 shadow-2xl`}>
                        <TrendingUp className={`h-10 w-10 ${isDarkMode ? 'text-[#8b5cf6]' : 'text-[#0f172a]'}`} />
                        <div className={`h-8 w-[2px] ${isDarkMode ? 'bg-white/10' : 'bg-slate-200'}`} />
                        <Star className={`h-10 w-10 ${isDarkMode ? 'text-[#8b5cf6]' : 'text-[#0f172a]'}`} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Title */}
                <h3 className={`text-2xl font-black mb-4 leading-tight ${isDarkMode ? 'text-white' : 'text-[#0f172a]'}`}>
                  {step.title}
                </h3>
                
                <p className={`text-sm mb-8 flex-grow ${isDarkMode ? 'text-zinc-500' : 'text-slate-500'}`}>
                  {step.description}
                </p>

                {/* Arrow Link */}
                <div className="flex items-center gap-2 group/btn">
                   <div className={`h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300 ${isDarkMode ? 'bg-white/5 border-white/10 group-hover:bg-[#8b5cf6] text-white' : 'bg-slate-100 border-slate-200 group-hover:bg-[#0f172a] group-hover:text-white'} border`}>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                   </div>
                   <span className={`text-xs font-bold uppercase tracking-widest ${isDarkMode ? 'text-zinc-400' : 'text-slate-600'}`}>See Details</span>
                </div>
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
                    isDarkMode ? 'bg-[#8b5cf6]/10' : 'bg-[#8b5cf6]/10'
                  } flex items-center justify-center`}>
                    {React.createElement(steps[selectedStep].icon, {
                      className: `h-7 w-7 ${isDarkMode ? 'text-[#8b5cf6]' : 'text-[#111111]'}`
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
                        : 'bg-[#8b5cf6] hover:bg-[#7c3aed] text-white'
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
                        : 'text-[#868686] hover:bg-[#f6f7f8] hover:text-[#333333]'
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
      <section className="py-32 md:py-48 relative overflow-hidden flex items-center justify-center">
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] ${isDarkMode ? 'bg-[#8b5cf6]/5' : 'bg-blue-500/5'} rounded-full blur-[160px] pointer-events-none`} />
        
        <div className="max-w-6xl mx-auto px-6 text-center relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
            className={`${isDarkMode ? 'bg-[#09090b] border-white/[0.08] shadow-[var(--shadow-dramatic)]' : 'bg-white border-black/[0.03] shadow-[var(--shadow-dramatic)]'} border-2 rounded-[4rem] p-16 md:px-24 md:py-32 relative overflow-hidden group`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${isDarkMode ? 'from-white/[0.02] to-transparent' : 'from-black/[0.01] to-transparent'} pointer-events-none`} />
            
            {/* Ambient animated blobs inside CTA */}
            <motion.div 
              className={`absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[80px] pointer-events-none opacity-20 ${isDarkMode ? 'bg-[#8b5cf6]' : 'bg-slate-200'}`}
              animate={{
                scale: [1, 1.2, 1],
                x: [0, 50, 0],
                y: [0, 30, 0],
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className={`absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full blur-[80px] pointer-events-none opacity-20 ${isDarkMode ? 'bg-[#8b5cf6]' : 'bg-slate-100'}`}
              animate={{
                scale: [1.2, 1, 1.2],
                x: [0, -40, 0],
                y: [0, -20, 0],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
            
            <div className="relative z-10 max-w-4xl mx-auto">
              <h2 className={`text-6xl md:text-9xl font-black mb-10 leading-[0.9] tracking-tight ${isDarkMode ? 'text-white' : 'text-[#0f172a]'}`}>
                Your library,
                <br />
                <span className={isDarkMode ? 'text-[#8b5cf6]' : 'text-[#111111]'}>elevated.</span>
              </h2>
              <p className={`text-xl md:text-2xl mb-14 max-w-2xl mx-auto font-medium ${isDarkMode ? 'text-zinc-500' : 'text-slate-500'}`}>
                Join 10,000+ engineers crafting the future with EverPrompt.
                Started in seconds, used for years.
              </p>
              <div className="flex flex-wrap gap-6 justify-center">
                <Button
                  size="lg"
                  onClick={onGetStarted}
                  className={`h-16 px-10 rounded-full ${isDarkMode ? 'bg-white text-black hover:bg-zinc-200 shadow-2xl shadow-white/10' : 'bg-[#0f172a] text-white hover:bg-slate-900 shadow-2xl shadow-black/10'} transition-all duration-500 hover:scale-105 active:scale-95 font-bold text-lg group`}
                >
                  Create Your Library
                  <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button
                  size="lg"
                  variant="ghost"
                  onClick={onLogin}
                  className={`h-16 px-10 rounded-full ${isDarkMode 
                    ? 'text-zinc-400 hover:text-white hover:bg-white/[0.05]'
                    : 'text-slate-500 hover:text-[#111111] hover:bg-black/[0.03]'
                  } transition-all duration-300 font-bold text-lg border-2 border-transparent hover:border-current`}
                >
                  Sign In
                </Button>
              </div>
              
              <div className={`mt-16 pt-16 border-t ${isDarkMode ? 'border-white/[0.05]' : 'border-black/[0.05]'} flex flex-wrap items-center justify-center gap-x-12 gap-y-6 ${isDarkMode ? 'text-zinc-600' : 'text-slate-400'} text-[10px] font-black uppercase tracking-[0.3em]`}>
                 <div className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4" /> Free Forever Plan</div>
                 <div className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4" /> API First Architecture</div>
                 <div className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4" /> Team Collaboration</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`${isDarkMode ? 'bg-black border-white/[0.03]' : 'bg-slate-50 border-black/[0.03]'} border-t pt-32 pb-16 overflow-hidden`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-12 gap-24 mb-32">
            <div className="lg:col-span-5">
              <div className="flex items-center gap-3 mb-10 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <div className={`p-1.5 rounded-xl transition-all duration-500 ${isDarkMode 
                  ? 'bg-white/5 group-hover:bg-white/10 ring-1 ring-white/10' 
                  : 'bg-[#f6f7f8] shadow-[var(--shadow-elevated)] ring-1 ring-white'}`}>
                   <img src={logoSrc} alt="EverPrompt Logo" className="h-6 w-6" />
                </div>
                <span className={`text-2xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-[#0f172a]'}`}>EverPrompt</span>
              </div>
              <p className={`text-xl mb-10 leading-relaxed max-w-md ${isDarkMode ? 'text-zinc-500' : 'text-slate-500'}`}>
                The central hub for professional AI prompt engineering and management.
              </p>
              <div className="flex gap-4">
                 {[1,2,3,4].map(i => (
                    <div key={i} className={`h-11 w-11 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${isDarkMode ? 'bg-white/[0.02] border-white/[0.05] hover:border-white/20 text-white shadow-xl shadow-black/20' : 'bg-white border-black/[0.05] hover:border-black/20 text-slate-600 shadow-xl shadow-black/5'} hover:-translate-y-1`}>
                       <Share2 className="h-5 w-5" />
                    </div>
                 ))}
              </div>
            </div>
            
            <div className="lg:col-span-2">
              <h4 className={`text-xs uppercase tracking-[0.2em] font-black mb-10 ${isDarkMode ? 'text-white' : 'text-[#0f172a]'}`}>Product</h4>
              <ul className={`space-y-5 text-sm font-semibold ${isDarkMode ? 'text-zinc-500' : 'text-slate-500'}`}>
                <li><a href="#" className={`transition-colors ${isDarkMode ? 'hover:text-white' : 'hover:text-black'}`}>Features</a></li>
                <li><a href="#" className={`transition-colors ${isDarkMode ? 'hover:text-white' : 'hover:text-black'}`}>Pricing</a></li>
                <li><a href="#" className={`transition-colors ${isDarkMode ? 'hover:text-white' : 'hover:text-black'}`}>Integrations</a></li>
                <li><a href="#" className={`transition-colors ${isDarkMode ? 'hover:text-white' : 'hover:text-black'}`}>Changelog</a></li>
              </ul>
            </div>
            
            <div className="lg:col-span-2">
              <h4 className={`text-xs uppercase tracking-[0.2em] font-black mb-10 ${isDarkMode ? 'text-white' : 'text-[#0f172a]'}`}>Resources</h4>
              <ul className={`space-y-5 text-sm font-semibold ${isDarkMode ? 'text-zinc-500' : 'text-slate-500'}`}>
                <li><a href="#" className={`transition-colors ${isDarkMode ? 'hover:text-white' : 'hover:text-black'}`}>Documentation</a></li>
                <li><a href="#" className={`transition-colors ${isDarkMode ? 'hover:text-white' : 'hover:text-black'}`}>Guides</a></li>
                <li><a href="#" className={`transition-colors ${isDarkMode ? 'hover:text-white' : 'hover:text-black'}`}>Prompt Tips</a></li>
                <li><a href="#" className={`transition-colors ${isDarkMode ? 'hover:text-white' : 'hover:text-black'}`}>Community</a></li>
              </ul>
            </div>

            <div className="lg:col-span-3">
               <h4 className={`text-xs uppercase tracking-[0.2em] font-black mb-10 ${isDarkMode ? 'text-white' : 'text-[#0f172a]'}`}>Stay Inspired</h4>
               <p className={`text-sm mb-8 leading-relaxed ${isDarkMode ? 'text-zinc-500' : 'text-slate-500'}`}>Get the latest prompt engineering insights delivered to your inbox.</p>
               <div className="flex gap-2">
                  <input 
                    type="email" 
                    placeholder="email@example.com" 
                    className={`flex-1 h-12 px-5 rounded-xl text-sm border focus:outline-none transition-all ${isDarkMode ? 'bg-white/[0.03] border-white/[0.05] focus:border-white/20 text-white' : 'bg-white border-black/[0.05] focus:border-black/20 text-[#0f172a] shadow-sm'}`} 
                  />
                  <Button className={`h-12 w-12 rounded-xl flex items-center justify-center p-0 transition-all ${isDarkMode ? 'bg-white text-black hover:bg-zinc-200' : 'bg-[#0f172a] text-white hover:bg-slate-900'}`}>
                    <ArrowRight className="h-5 w-5" />
                  </Button>
               </div>
            </div>
          </div>
          
          <div className={`pt-12 border-t flex flex-col md:flex-row items-center justify-between gap-8 ${isDarkMode ? 'border-white/[0.03] text-zinc-600' : 'border-black/[0.03] text-slate-400'} text-[10px] font-bold uppercase tracking-[0.2em]`}>
            <p>© 2025 EverPrompt. Crafted for the future of AI.</p>
            <div className="flex gap-10">
              <a href="/privacy" className={`transition-colors ${isDarkMode ? 'hover:text-white' : 'hover:text-black'}`}>Privacy Policy</a>
              <a href="/terms" className={`transition-colors ${isDarkMode ? 'hover:text-white' : 'hover:text-black'}`}>Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
