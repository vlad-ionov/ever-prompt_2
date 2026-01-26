import { motion } from "motion/react";

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

export function BeamsBackground({ isDarkMode }: { isDarkMode: boolean }) {
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
          className="absolute left-[-60%] right-[-60%]"
          initial={{ x: "-120%" }}
          animate={{ x: "120%" }}
          transition={{
            duration: beam.duration,
            repeat: Infinity,
            delay: beam.delay,
            ease: "linear",
          }}
          style={{
            top: beam.top,
            height: beam.height,
            opacity: beam.opacity,
            filter: `blur(${beam.blur}px)`,
            transform: `rotate(${beam.rotate}deg)`,
            width: "160%",
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
            filter: "blur(70px)",
          }}
          animate={{
            opacity: [0, 0.6, 0],
            scale: [1, 1.15, 1],
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
