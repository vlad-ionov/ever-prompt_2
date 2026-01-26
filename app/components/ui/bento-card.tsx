import * as React from "react";
import { motion } from "motion/react";
import { useState, useRef } from "react";

interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  isDarkMode: boolean;
}

export function BentoCard({ children, className = "", isDarkMode }: BentoCardProps) {
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
