import * as React from "react";
import { useMemo } from "react";
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

  return (
    <div className="space-y-8 pb-10">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {summaryCards.map((card) => (
          <div 
            key={card.id} 
            className={`p-4 rounded-2xl border transition-all duration-300 hover:shadow-lg ${
              isDarkMode 
                ? "bg-[#111113] border-[#27272a] hover:border-[#8b5cf6]/30" 
                : "bg-white border-[#e5e7eb] hover:border-purple-200"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-xl ${card.bg}`}>
                <card.icon className={`h-5 w-5 ${card.color}`} weight="bold" />
              </div>
            </div>
            <div>
              <p className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "text-zinc-500" : "text-slate-500"}`}>
                {card.label}
              </p>
              <h3 className={`text-2xl font-bold mt-1 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                {card.value}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Chart */}
        <div className={`p-6 rounded-3xl border ${isDarkMode ? "bg-[#111113] border-[#27272a]" : "bg-white border-[#e5e7eb]"} shadow-sm`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${isDarkMode ? "bg-purple-500/10" : "bg-purple-50"}`}>
                <Calendar className="h-5 w-5 text-purple-500" weight="bold" />
              </div>
              <h3 className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>Activity Overview</h3>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.activityData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "#27272a" : "#e5e7eb"} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: isDarkMode ? "#71717a" : "#64748b", fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: isDarkMode ? "#71717a" : "#64748b", fontSize: 12 }} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: isDarkMode ? "#18181b" : "#ffffff",
                    borderColor: isDarkMode ? "#27272a" : "#e5e7eb",
                    borderRadius: "12px",
                    color: isDarkMode ? "#fafafa" : "#0f172a"
                  }}
                  itemStyle={{ color: "#8b5cf6" }}
                />
                <Line 
                  type="monotone" 
                  dataKey="prompts" 
                  stroke="#8b5cf6" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: "#8b5cf6", strokeWidth: 2, stroke: isDarkMode ? "#111113" : "#fff" }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Type Distribution */}
        <div className={`p-6 rounded-3xl border ${isDarkMode ? "bg-[#111113] border-[#27272a]" : "bg-white border-[#e5e7eb]"} shadow-sm`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${isDarkMode ? "bg-blue-500/10" : "bg-blue-50"}`}>
                <SquaresFour className="h-5 w-5 text-blue-500" weight="bold" />
              </div>
              <h3 className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>Format Distribution</h3>
            </div>
          </div>
          <div className="h-[300px] w-full flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.typeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {stats.typeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend 
                  verticalAlign="middle" 
                  align="right" 
                  layout="vertical"
                  iconType="circle"
                  formatter={(value) => <span className={`text-sm font-medium ${isDarkMode ? "text-zinc-400" : "text-slate-600"}`}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Model Usage */}
        <div className={`p-6 rounded-3xl border ${isDarkMode ? "bg-[#111113] border-[#27272a]" : "bg-white border-[#e5e7eb]"} shadow-sm`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${isDarkMode ? "bg-emerald-500/10" : "bg-emerald-50"}`}>
                <ImageIcon className="h-5 w-5 text-emerald-500" weight="bold" />
              </div>
              <h3 className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>Top Models</h3>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.modelData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke={isDarkMode ? "#27272a" : "#e5e7eb"} />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: isDarkMode ? "#fafafa" : "#1e293b", fontSize: 13, fontWeight: 500 }}
                  width={100}
                />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ 
                    backgroundColor: isDarkMode ? "#18181b" : "#ffffff",
                    borderColor: isDarkMode ? "#27272a" : "#e5e7eb",
                    borderRadius: "12px"
                  }}
                />
                <Bar 
                  dataKey="value" 
                  fill="#8b5cf6" 
                  radius={[0, 8, 8, 0]} 
                  barSize={32}
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
        <div className={`p-6 rounded-3xl border ${isDarkMode ? "bg-[#111113] border-[#27272a]" : "bg-white border-[#e5e7eb]"} shadow-sm`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>Stats Breakdown</h3>
          </div>
          <div className="space-y-4">
             {[
               { icon: FileText, label: "Text Prompts", value: prompts.filter(p => p.type === 'text').length, color: "text-blue-500", bg: "bg-blue-500/10" },
               { icon: ImageIcon, label: "Image Prompts", value: prompts.filter(p => p.type === 'image').length, color: "text-pink-500", bg: "bg-pink-500/10" },
               { icon: VideoCamera, label: "Video Prompts", value: prompts.filter(p => p.type === 'video').length, color: "text-purple-500", bg: "bg-purple-500/10" },
               { icon: SpeakerHifi, label: "Audio Prompts", value: prompts.filter(p => p.type === 'audio').length, color: "text-emerald-500", bg: "bg-emerald-500/10" },
             ].map((item) => (
               <div key={item.label} className="flex items-center justify-between p-3 rounded-2xl border border-transparent hover:border-zinc-800 transition-all duration-300">
                 <div className="flex items-center gap-3">
                   <div className={`p-2 rounded-xl ${item.bg}`}>
                     <item.icon className={`h-5 w-5 ${item.color}`} weight="bold" />
                   </div>
                   <span className={`font-medium ${isDarkMode ? "text-zinc-300" : "text-slate-700"}`}>{item.label}</span>
                 </div>
                 <div className="flex items-center gap-4">
                   <div className="w-32 h-2 bg-muted rounded-full overflow-hidden hidden sm:block">
                     <div 
                        className={`h-full ${item.bg.replace('/10', '')}`} 
                        style={{ width: `${(item.value / prompts.length) * 100}%` }} 
                     />
                   </div>
                   <span className={`text-sm font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>{item.value}</span>
                 </div>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}
