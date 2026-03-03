import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

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
} from "lucide-react";

import { motion } from "framer-motion";

/* ---------------- MOCK DATA ---------------- */

const latencyData = [
  { time: "00:00", latency: 120 },
  { time: "04:00", latency: 110 },
  { time: "08:00", latency: 135 },
  { time: "12:00", latency: 180 },
  { time: "16:00", latency: 150 },
  { time: "20:00", latency: 125 },
  { time: "24:00", latency: 115 },
];

const repairData = [
  { day: "Mon", fixes: 12 },
  { day: "Tue", fixes: 18 },
  { day: "Wed", fixes: 15 },
  { day: "Thu", fixes: 24 },
  { day: "Fri", fixes: 20 },
  { day: "Sat", fixes: 8 },
  { day: "Sun", fixes: 10 },
];

/* ---------------- MAIN COMPONENT ---------------- */

export function Analytics() {
  const [activeMetric, setActiveMetric] =
    useState<"latency" | "repairs">("latency");

  return (
    <div className="space-y-6 w-full animate-in fade-in duration-700">

      {/* HEADER STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Repairs"
          value="1,492"
          icon={<Wrench className="w-5 h-5 text-cyan-400" />}
          trend="+12%"
          trendUp
        />
        <StatCard
          title="Avg. Healing Time"
          value="1.2s"
          icon={<Clock className="w-5 h-5 text-emerald-400" />}
          trend="-0.3s"
          trendUp
        />
        <StatCard
          title="System Uptime"
          value="99.9%"
          icon={<ServerCrash className="w-5 h-5 text-indigo-400" />}
          trend="+0.1%"
          trendUp
        />
        <StatCard
          title="Unresolved Errors"
          value="24"
          icon={<AlertTriangle className="w-5 h-5 text-rose-400" />}
          trend="+5"
          trendUp={false}
        />
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* CHART */}
        <Card className="bg-zinc-950 border-zinc-800 shadow-2xl lg:col-span-2">
          <CardHeader className="border-b border-zinc-900 pb-4 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-cyan-500" />
                System Telemetry
              </CardTitle>
              <CardDescription className="text-zinc-500 text-xs mt-1">
                Real-time performance metrics.
              </CardDescription>
            </div>

            {/* Toggle */}
            <div className="flex bg-zinc-900 border border-zinc-800 rounded-lg p-1">
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
                <AreaChart data={latencyData}>
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
                  <RechartsTooltip />
                  <Area
                    type="monotone"
                    dataKey="latency"
                    stroke="#06b6d4"
                    fill="#06b6d4"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              ) : (
                <AreaChart data={repairData}>
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
                  <RechartsTooltip />
                  <Area
                    type="monotone"
                    dataKey="fixes"
                    stroke="#6366f1"
                    fill="#6366f1"
                    fillOpacity={0.2}
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
            <HealthNode name="Qwen 2.5 Inference" status="Online" load={42} color="bg-emerald-500" />
            <HealthNode name="DOM Snapshot API" status="Online" load={18} color="bg-emerald-500" />
            <HealthNode name="Polyglot Translator" status="Degraded" load={89} color="bg-amber-500" />
            <HealthNode name="Security Auditor" status="Offline" load={0} color="bg-rose-500" />
          </CardContent>
        </Card>

      </div>
    </div>
  );
}

/* ---------------- SUB COMPONENTS ---------------- */

function StatCard({
  title,
  value,
  icon,
  trend,
  trendUp,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: string;
  trendUp: boolean;
}) {
  return (
    <Card className="bg-zinc-950 border-zinc-800 shadow-xl">
      <CardContent className="p-6">
        <div className="flex justify-between">
          <div>
            <p className="text-xs text-zinc-500 uppercase">{title}</p>
            <p className="text-3xl font-black text-white">{value}</p>
          </div>
          <div className="p-2 bg-zinc-900 rounded-lg">{icon}</div>
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

function HealthNode({
  name,
  status,
  load,
  color,
}: {
  name: string;
  status: string;
  load: number;
  color: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-bold text-zinc-200">{name}</span>
        <span className="text-xs text-zinc-500">{status}</span>
      </div>
      <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${load}%` }}
          transition={{ duration: 1 }}
          className={`h-full ${color}`}
        />
      </div>
    </div>
  );
}