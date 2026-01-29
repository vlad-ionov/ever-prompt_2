import { useMemo, useEffect, useState } from "react";
import { motion, animate, useMotionValue, useTransform } from "motion/react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { 
  SquaresFour, 
  Heart, 
  Flame, 
  BookmarkSimple, 
  GlobeHemisphereEast, 
  ChartLineUp,
  FileText,
  VideoCamera,
  SpeakerHifi,
  Image as ImageIcon,
  Calendar
} from "@phosphor-icons/react";
import type { Prompt } from "@/lib/types";

interface AnalyticsDashboardProps {
  prompts: Prompt[];
  isDarkMode: boolean;
}

export function AnalyticsDashboard({ prompts, isDarkMode }: AnalyticsDashboardProps) {
  const stats = useMemo(() => {
    const total = prompts.length;
    const likesCount = prompts.filter((p) => p.isLiked).length;
    const totalLikes = prompts.reduce((sum, p) => sum + p.likes, 0);
    const saved = prompts.filter((p) => p.isSaved).length;
    const publicCount = prompts.filter((p) => p.isPublic).length;
    const avgLikes = Math.round(totalLikes / total) || 0;

    // Type distribution
    const types = prompts.reduce((acc: any, p) => {
      acc[p.type] = (acc[p.type] || 0) + 1;
      return acc;
    }, {});

    const typeData = Object.entries(types).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
    }));

    // Model distribution
    const models = prompts.reduce((acc: any, p) => {
      acc[p.model] = (acc[p.model] || 0) + 1;
      return acc;
    }, {});

    const modelData = Object.entries(models)
      .map(([name, value]) => ({ name, value }))
      .sort((a: any, b: any) => b.value - a.value)
      .slice(0, 5);

    // Activity over time
    const activityMap = prompts.reduce((acc: any, p) => {
      const date = new Date(p.createdAt);
      if (isNaN(date.getTime())) return acc;
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const activityData = Object.entries(activityMap)
      .sort(([a]: any, [b]: any) => a.localeCompare(b))
      .map(([key, value]: any) => {
        const [year, month] = key.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1);
        return {
          name: date.toLocaleString('default', { month: 'short' }),
          prompts: value,
        };
      });

    return {
      total,
      likes: likesCount,
      totalLikes,
      saved,
      publicCount,
      avgLikes,
      typeData,
      modelData,
      activityData,
    };
  }, [prompts]);

  const COLORS = ["#8b5cf6", "#ec4899", "#3b82f6", "#10b981", "#f59e0b"];

  const summaryCards = [
    { id: "total", label: "Total Prompts", value: stats.total, icon: SquaresFour, color: "text-purple-500", bg: "bg-purple-500/10" },
    { id: "favorites", label: "Liked", value: stats.likes, icon: Heart, color: "text-rose-500", bg: "bg-rose-500/10" },
    { id: "likes", label: "Total Likes", value: stats.totalLikes, icon: Flame, color: "text-orange-500", bg: "bg-orange-500/10" },
    { id: "saved", label: "Saved Items", value: stats.saved, icon: BookmarkSimple, color: "text-blue-500", bg: "bg-blue-500/10" },
    { id: "public", label: "Public Share", value: stats.publicCount, icon: GlobeHemisphereEast, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { id: "avg", label: "Avg Likes", value: stats.avgLikes, icon: ChartLineUp, color: "text-cyan-500", bg: "bg-cyan-500/10" },
  ];

  function StatCounter({ value }: { value: number }) {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
      const controls = animate(0, value, {
        duration: 1.5,
        ease: "easeOut",
        onUpdate: (latest) => setDisplayValue(Math.round(latest)),
      });
      return () => controls.stop();
    }, [value]);

    return <>{displayValue}</>;
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {summaryCards.map((card) => (
          <div 
            key={card.id} 
            className={`group relative p-5 rounded-[28px] border transition-all duration-500 overflow-hidden ${
              isDarkMode 
                ? "bg-[#0f0f12]/40 backdrop-blur-2xl border-white/5 hover:border-violet-500/40 shadow-2xl" 
                : "bg-white/80 border-slate-200/50 hover:border-violet-500/20 shadow-sm"
            }`}
          >
            {/* Liquid Background Glow */}
            <div className={`absolute -right-2 -bottom-2 w-16 h-16 rounded-full blur-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-700 ${card.bg.replace('/10', '')}`} />
            
            <div className="flex flex-col gap-6 relative z-10">
              <div className="flex items-start justify-between">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 ${card.bg}`}>
                  <card.icon className={`h-4.5 w-4.5 ${card.color}`} weight="duotone" />
                </div>
                
                <h3 className={`text-2xl font-bold tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                  <StatCounter value={card.value} />
                </h3>
              </div>
              
              <div>
                <p className={`text-[10px] font-bold uppercase tracking-[0.15em] ${isDarkMode ? "text-zinc-600" : "text-slate-400"}`}>
                  {card.label}
                </p>
              </div>
            </div>

            {/* Subtle Top Shine */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent border-t border-white/[0.02]" />
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Chart */}
        <div className={`p-8 rounded-[32px] border transition-all duration-500 ${
          isDarkMode 
            ? "bg-[#0f0f12]/60 backdrop-blur-2xl border-white/5 shadow-2xl" 
            : "bg-white border-slate-200/60 shadow-xl shadow-slate-200/20"
        }`}>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl ${isDarkMode ? "bg-violet-500/10" : "bg-violet-50"}`}>
                <Calendar className="h-6 w-6 text-violet-500" weight="duotone" />
              </div>
              <div>
                <h3 className={`text-xl font-bold tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>Activity Volume</h3>
                <p className={`text-xs font-medium ${isDarkMode ? "text-zinc-500" : "text-slate-400"}`}>Prompt creation velocity over time</p>
              </div>
            </div>
          </div>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.activityData}>
                <defs>
                  <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: isDarkMode ? "#52525b" : "#94a3b8", fontSize: 11, fontWeight: 600 }}
                  dy={15}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: isDarkMode ? "#52525b" : "#94a3b8", fontSize: 11, fontWeight: 600 }} 
                />
                <Tooltip 
                  cursor={{ stroke: '#8b5cf6', strokeWidth: 2, strokeDasharray: '5 5' }}
                  contentStyle={{ 
                    backgroundColor: isDarkMode ? "rgba(15, 15, 18, 0.9)" : "rgba(255, 255, 255, 0.9)",
                    backdropFilter: "blur(12px)",
                    borderColor: isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
                    borderRadius: "20px",
                    padding: "12px 16px",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
                  }}
                  itemStyle={{ color: "#8b5cf6", fontWeight: 700 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="prompts" 
                  stroke="#8b5cf6" 
                  strokeWidth={4} 
                  dot={{ r: 0 }}
                  activeDot={{ r: 6, fill: "#8b5cf6", strokeWidth: 4, stroke: "#fff" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Type Distribution */}
        <div className={`p-8 rounded-[32px] border transition-all duration-500 ${
          isDarkMode 
            ? "bg-[#0f0f12]/60 backdrop-blur-2xl border-white/5 shadow-2xl" 
            : "bg-white border-slate-200/60 shadow-xl shadow-slate-200/20"
        }`}>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl ${isDarkMode ? "bg-blue-500/10" : "bg-blue-50"}`}>
                <SquaresFour className="h-6 w-6 text-blue-500" weight="duotone" />
              </div>
              <div>
                <h3 className={`text-xl font-bold tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>Format Mix</h3>
                <p className={`text-xs font-medium ${isDarkMode ? "text-zinc-500" : "text-slate-400"}`}>Distribution by prompt type</p>
              </div>
            </div>
          </div>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.typeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={85}
                  outerRadius={110}
                  paddingAngle={10}
                  dataKey="value"
                  stroke="none"
                >
                  {stats.typeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="hover:opacity-80 transition-opacity cursor-pointer focus:outline-none" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: isDarkMode ? "rgba(15, 15, 18, 0.9)" : "rgba(255, 255, 255, 0.9)",
                    backdropFilter: "blur(12px)",
                    borderColor: isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
                    borderRadius: "16px"
                  }}
                />
                <Legend 
                  verticalAlign="middle" 
                  align="right" 
                  layout="vertical"
                  iconType="circle"
                  formatter={(value) => <span className={`text-xs font-bold uppercase tracking-widest ${isDarkMode ? "text-zinc-400" : "text-slate-500"}`}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Model Usage */}
        <div className={`p-8 rounded-[32px] border transition-all duration-500 ${
          isDarkMode 
            ? "bg-[#0f0f12]/60 backdrop-blur-2xl border-white/5 shadow-2xl" 
            : "bg-white border-slate-200/60 shadow-xl shadow-slate-200/20"
        }`}>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl ${isDarkMode ? "bg-emerald-500/10" : "bg-emerald-50"}`}>
                <ImageIcon className="h-6 w-6 text-emerald-500" weight="duotone" />
              </div>
              <div>
                <h3 className={`text-xl font-bold tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>Top Platforms</h3>
                <p className={`text-xs font-medium ${isDarkMode ? "text-zinc-500" : "text-slate-400"}`}>Most used AI models \u0026 LLMs</p>
              </div>
            </div>
          </div>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.modelData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke={isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: isDarkMode ? "#fafafa" : "#1e293b", fontSize: 11, fontWeight: 600, textAnchor: 'start' }}
                  width={120}
                  dx={-110}
                />
                <Tooltip 
                  cursor={{ fill: isDarkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }}
                  contentStyle={{ 
                    backgroundColor: isDarkMode ? "rgba(15, 15, 18, 0.9)" : "rgba(255, 255, 255, 0.9)",
                    backdropFilter: "blur(12px)",
                    borderRadius: "16px",
                    border: "none",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
                  }}
                />
                <Bar 
                  dataKey="value" 
                  fill="#8b5cf6" 
                  radius={[0, 12, 12, 0]} 
                  barSize={24}
                >
                  {stats.modelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Content Type Breakdown Detail */}
        <div className={`p-8 rounded-[32px] border transition-all duration-500 ${
          isDarkMode 
            ? "bg-[#0f0f12]/60 backdrop-blur-2xl border-white/5 shadow-2xl" 
            : "bg-white border-slate-200/60 shadow-xl shadow-slate-200/20"
        }`}>
          <div className="flex items-center justify-between mb-8">
            <h3 className={`text-xl font-bold tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>Metric Details</h3>
          </div>
          <div className="space-y-3">
             {[
               { icon: FileText, label: "Text Elements", value: prompts.filter(p => p.type === 'text').length, color: "text-blue-500", bg: "bg-blue-500/10" },
               { icon: ImageIcon, label: "Visual Assets", value: prompts.filter(p => p.type === 'image').length, color: "text-pink-500", bg: "bg-pink-500/10" },
               { icon: VideoCamera, label: "Motion Clips", value: prompts.filter(p => p.type === 'video').length, color: "text-purple-500", bg: "bg-purple-500/10" },
               { icon: SpeakerHifi, label: "Audio Waves", value: prompts.filter(p => p.type === 'audio').length, color: "text-emerald-500", bg: "bg-emerald-500/10" },
             ].map((item) => (
               <div key={item.label} className={`group flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${
                 isDarkMode ? "bg-white/[0.02] border-white/5 hover:border-white/10" : "bg-slate-50/50 border-slate-100 hover:border-slate-200"
               }`}>
                 <div className="flex items-center gap-4">
                   <div className={`p-2.5 rounded-xl transition-transform duration-300 group-hover:scale-110 ${item.bg}`}>
                     <item.icon className={`h-5 w-5 ${item.color}`} weight="duotone" />
                   </div>
                   <div className="flex flex-col">
                     <span className={`text-sm font-bold tracking-tight ${isDarkMode ? "text-zinc-200" : "text-slate-800"}`}>{item.label}</span>
                     <span className={`text-[10px] font-bold opacity-50 uppercase tracking-[0.1em] ${isDarkMode ? "text-zinc-400" : "text-slate-500"}`}>{Math.round((item.value / prompts.length) * 100) || 0}% SHARE</span>
                   </div>
                 </div>
                 <div className="flex items-center gap-6">
                   <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden hidden sm:block">
                     <div 
                        className={`h-full transition-all duration-1000 ${item.bg.replace('/10', '')}`} 
                        style={{ width: `${(item.value / prompts.length) * 100}%` }} 
                     />
                   </div>
                   <span className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>{item.value}</span>
                 </div>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}
