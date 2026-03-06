import React, { useState, useEffect } from "react";

import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

import {
  Activity,
  Cpu,
  ServerCrash,
  Clock,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Wrench,
  Loader2,
} from "lucide-react";

import { motion } from "framer-motion";

/* ---------------- LOCAL UI COMPONENTS ---------------- */
// Replacing external imports from "@/components/ui/card" to work in this single-file environment

const Card = ({ className, children }: { className?: string, children: React.ReactNode }) => (
  <div className={`rounded-xl border shadow-sm ${className || ''}`}>
    {children}
  </div>
);

const CardHeader = ({ className, children }: { className?: string, children: React.ReactNode }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className || ''}`}>
    {children}
  </div>
);

const CardTitle = ({ className, children }: { className?: string, children: React.ReactNode }) => (
  <h3 className={`font-semibold leading-none tracking-tight ${className || ''}`}>
    {children}
  </h3>
);

const CardDescription = ({ className, children }: { className?: string, children: React.ReactNode }) => (
  <p className={`text-sm ${className || ''}`}>
    {children}
  </p>
);

const CardContent = ({ className, children }: { className?: string, children: React.ReactNode }) => (
  <div className={`p-6 pt-0 ${className || ''}`}>
    {children}
  </div>
);

/* ---------------- TYPESCRIPT INTERFACES ---------------- */
// These exactly match the JSON structure returned by FastAPI

interface LatencyPoint {
  time: string;
  latency: number;
}

interface RepairPoint {
  day: string;
  fixes: number;
}

interface StatMetrics {
  total_repairs: number;
  avg_healing_time: number;
  system_uptime: number;
  unresolved_errors: number;
}

interface HealthNodeData {
  name: string;
  status: string;
  load: number;
  color: string;
}

interface DashboardResponse {
  latency_data: LatencyPoint[];
  repair_data: RepairPoint[];
  stats: StatMetrics;
  health_nodes: HealthNodeData[];
}

/* ---------------- MAIN COMPONENT ---------------- */

// Must be the default export and named App for the environment
export default function App() {
  const [activeMetric, setActiveMetric] = useState<"latency" | "repairs">("latency");
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch function to grab live data from FastAPI
  const fetchAnalytics = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/analytics");
      if (!response.ok) throw new Error("Network response was not ok");
      
      const data: DashboardResponse = await response.json();
      setDashboardData(data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch analytics:", err);
      // For demonstration in the preview environment, we'll set mock data if the fetch fails
      setDashboardData({
        latency_data: [
          { time: "00:00", latency: 120 }, { time: "04:00", latency: 110 },
          { time: "08:00", latency: 135 }, { time: "12:00", latency: 180 },
          { time: "16:00", latency: 150 }, { time: "20:00", latency: 125 },
          { time: "24:00", latency: 115 },
        ],
        repair_data: [
          { day: "Mon", fixes: 12 }, { day: "Tue", fixes: 18 },
          { day: "Wed", fixes: 15 }, { day: "Thu", fixes: 24 },
          { day: "Fri", fixes: 20 }, { day: "Sat", fixes: 8 },
          { day: "Sun", fixes: 10 },
        ],
        stats: {
          total_repairs: 1492,
          avg_healing_time: 1.2,
          system_uptime: 99.9,
          unresolved_errors: 24,
        },
        health_nodes: [
          { name: "Qwen 2.5 Inference", status: "Online", load: 42, color: "bg-emerald-500" },
          { name: "DOM Snapshot API", status: "Online", load: 18, color: "bg-emerald-500" },
          { name: "Polyglot Translator", status: "Degraded", load: 89, color: "bg-amber-500" },
          { name: "Security Auditor", status: "Offline", load: 0, color: "bg-rose-500" },
        ]
      });
      setError("Using mock data. Backend engine not reachable.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchAnalytics();
    
    // Poll the backend every 5 seconds for that "live" animated dashboard effect
    const interval = setInterval(fetchAnalytics, 5000);
    return () => clearInterval(interval);
  }, []);

  // Loading State
  if (isLoading && !dashboardData) {
    return (
      <div className="flex h-[500px] w-full flex-col items-center justify-center text-cyan-500 space-y-4 animate-in fade-in bg-slate-900">
        <Loader2 className="w-10 h-10 animate-spin" />
        <p className="font-mono text-sm uppercase tracking-widest text-zinc-400">Initializing Telemetry...</p>
      </div>
    );
  }

  // Safe fallback just in case data is null
  if (!dashboardData) return null;

  return (
    <div className="min-h-screen bg-zinc-950 p-8">
      <div className="space-y-6 max-w-6xl mx-auto w-full animate-in fade-in duration-700">
        
        {error && (
          <div className="flex items-center gap-3 bg-amber-500/10 p-4 rounded-xl border border-amber-500/20 text-amber-500 mb-6">
            <AlertTriangle className="w-5 h-5" />
            <p className="font-semibold text-sm">{error}</p>
          </div>
        )}

        {/* HEADER STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Repairs"
            value={dashboardData.stats.total_repairs.toLocaleString()}
            icon={<Wrench className="w-5 h-5 text-cyan-400" />}
            trend="+12%"
            trendUp={true}
          />
          <StatCard
            title="Avg. Healing Time"
            value={`${dashboardData.stats.avg_healing_time.toFixed(1)}s`}
            icon={<Clock className="w-5 h-5 text-emerald-400" />}
            trend="-0.3s"
            trendUp={true}
          />
          <StatCard
            title="System Uptime"
            value={`${dashboardData.stats.system_uptime}%`}
            icon={<ServerCrash className="w-5 h-5 text-indigo-400" />}
            trend="+0.1%"
            trendUp={true}
          />
          <StatCard
            title="Unresolved Errors"
            value={dashboardData.stats.unresolved_errors.toString()}
            icon={<AlertTriangle className="w-5 h-5 text-rose-400" />}
            trend="+5"
            trendUp={false}
          />
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* CHART */}
          <Card className="bg-zinc-950 border-zinc-800 shadow-2xl lg:col-span-2">
            <CardHeader className="border-b border-zinc-900 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-cyan-500" />
                  System Telemetry
                </CardTitle>
                <CardDescription className="text-zinc-500 text-xs mt-1">
                  Real-time engine performance metrics.
                </CardDescription>
              </div>

              {/* Toggle */}
              <div className="flex bg-zinc-900 border border-zinc-800 rounded-lg p-1 self-start sm:self-auto">
                <button
                  onClick={() => setActiveMetric("latency")}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${
                    activeMetric === "latency"
                      ? "bg-cyan-500/20 text-cyan-400"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  Latency
                </button>
                <button
                  onClick={() => setActiveMetric("repairs")}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${
                    activeMetric === "repairs"
                      ? "bg-indigo-500/20 text-indigo-400"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  Repairs
                </button>
              </div>
            </CardHeader>

            <CardContent className="pt-6 h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                {activeMetric === "latency" ? (
                  <AreaChart data={dashboardData.latency_data}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#27272a"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="time"
                      stroke="#52525b"
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#52525b"
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => `${v}ms`}
                    />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', color: '#fff' }}
                      itemStyle={{ color: '#06b6d4' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="latency"
                      stroke="#06b6d4"
                      fill="#06b6d4"
                      fillOpacity={0.2}
                      isAnimationActive={true}
                      animationDuration={1500}
                    />
                  </AreaChart>
                ) : (
                  <AreaChart data={dashboardData.repair_data}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#27272a"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="day"
                      stroke="#52525b"
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#52525b"
                      tickLine={false}
                      axisLine={false}
                    />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', color: '#fff' }}
                      itemStyle={{ color: '#6366f1' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="fixes"
                      stroke="#6366f1"
                      fill="#6366f1"
                      fillOpacity={0.2}
                      isAnimationActive={true}
                      animationDuration={1500}
                    />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* HEALTH PANEL */}
          <Card className="bg-zinc-950 border-zinc-800 shadow-2xl">
            <CardHeader className="border-b border-zinc-900 pb-4">
              <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                <Cpu className="w-5 h-5 text-emerald-400" />
                Engine Health
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {dashboardData.health_nodes.map((node, index) => (
                <HealthNode 
                  key={index}
                  name={node.name} 
                  status={node.status} 
                  load={node.load} 
                  color={node.color} 
                />
              ))}
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}

/* ---------------- SUB COMPONENTS ---------------- */

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend: string;
  trendUp: boolean;
}

function StatCard({ title, value, icon, trend, trendUp }: StatCardProps) {
  return (
    <Card className="bg-zinc-950 border-zinc-800 shadow-xl relative overflow-hidden group">
      {/* Subtle hover glow effect */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 ${trendUp ? 'bg-emerald-500' : 'bg-rose-500'}`} />
      
      <CardContent className="p-6">
        <div className="flex justify-between">
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">{title}</p>
            <p className="text-3xl font-black text-white mt-1">{value}</p>
          </div>
          <div className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg shadow-inner flex items-center justify-center">
            {icon}
          </div>
        </div>
        <div className="mt-4 flex items-center gap-1.5">
          {trendUp ? (
            <ArrowUpRight className="w-4 h-4 text-emerald-500" />
          ) : (
            <ArrowDownRight className="w-4 h-4 text-rose-500" />
          )}
          <span
            className={`text-xs font-bold ${
              trendUp ? "text-emerald-500" : "text-rose-500"
            }`}
          >
            {trend}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

interface HealthNodeProps {
  name: string;
  status: string;
  load: number;
  color: string;
}

function HealthNode({ name, status, load, color }: HealthNodeProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-bold text-zinc-200">{name}</span>
        <span className={`text-xs font-semibold ${status === 'Offline' ? 'text-rose-500' : status === 'Degraded' ? 'text-amber-500' : 'text-emerald-500'}`}>
          {status}
        </span>
      </div>
      <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden flex items-center">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${load}%` }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className={`h-full ${color}`}
        />
      </div>
    </div>
  );
}