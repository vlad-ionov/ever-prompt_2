import { 
  Sparkles, 
  Zap, 
  Shield, 
  Users, 
  Heart, 
  Share2, 
  TrendingUp, 
  Video, 
  Search, 
  Star 
} from "lucide-react";
import { useState } from "react";
import * as React from "react";

import { Navbar } from "./landing/Navbar";
import { Hero } from "./landing/Hero";
import { Features } from "./landing/Features";
import { HowItWorks } from "./landing/HowItWorks";
import { CTA } from "./landing/CTA";
import { Footer } from "./landing/Footer";

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
  onDemo: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export function LandingPage({ onGetStarted, onLogin, onDemo, isDarkMode, onToggleDarkMode }: LandingPageProps) {
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

  return (
    <div className="min-h-screen">
      <Navbar 
        isDarkMode={isDarkMode} 
        onToggleDarkMode={onToggleDarkMode} 
        onLogin={onLogin} 
        onGetStarted={onGetStarted} 
      />
      
      <main>
        <Hero 
          isDarkMode={isDarkMode} 
          onGetStarted={onGetStarted} 
          onDemo={onDemo} 
        />
        
        <Features 
          isDarkMode={isDarkMode} 
          features={features} 
          onGetStarted={onGetStarted} 
        />
        
        <HowItWorks 
          isDarkMode={isDarkMode} 
          steps={steps} 
          onGetStarted={onGetStarted} 
        />
        
        <CTA 
          isDarkMode={isDarkMode} 
          onGetStarted={onGetStarted} 
          onLogin={onLogin} 
        />
      </main>

      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}
