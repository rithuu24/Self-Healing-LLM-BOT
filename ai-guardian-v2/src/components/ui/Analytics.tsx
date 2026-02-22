import React from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Activity, ShieldCheck, Clock, Terminal, TrendingUp } from "lucide-react";
import { AnimatedLogStream } from "@/components/ui/AnimatedLogStream"; 

export function Analytics({ logs }: { logs: any[] }) {
  return (
    <div className="space-y-6">
      {/* Analytics Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-zinc-950 border-zinc-800 shadow-xl">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">Total Executions</p>
              <p className="text-2xl font-bold text-zinc-100 mt-1">14,204</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-950 border-zinc-800 shadow-xl">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">Auto-Healed</p>
              <p className="text-2xl font-bold text-zinc-100 mt-1">892</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-950 border-zinc-800 shadow-xl">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">Avg Resolution</p>
              <p className="text-2xl font-bold text-zinc-100 mt-1">1.2s</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* NEW: Interactive Performance Graph */}
      <PerformanceGraph />

      {/* Live Log Stream */}
      <Card className="bg-zinc-950 border-zinc-800 overflow-hidden shadow-xl">
        <CardHeader className="bg-zinc-900/30 border-b border-zinc-900 py-4">
          <CardTitle className="flex items-center justify-between text-sm font-mono uppercase tracking-widest text-white">
            <div className="flex items-center gap-3">
              <Terminal className="w-4 h-4 text-cyan-500" /> Execution Stream
            </div>
            <div className="flex items-center gap-2 text-[10px] text-zinc-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              LIVE
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <AnimatedLogStream logs={logs} />
        </CardContent>
      </Card>
    </div>
  );
}

// --- Sub-Component: Custom Animated Bar Chart ---
function PerformanceGraph() {
  // Simulated data representing 24 hours of AI auto-healing events
  const hourlyData = [
    12, 18, 15, 25, 32, 45, 30, 50, 65, 55, 70, 85, 
    60, 45, 35, 40, 55, 75, 80, 95, 85, 70, 50, 40
  ];

  return (
    <Card className="bg-zinc-950 border-zinc-800 shadow-xl">
      <CardHeader className="pb-2 flex flex-row justify-between items-end">
        <div>
          <CardTitle className="text-sm font-mono uppercase tracking-widest text-zinc-400 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-500" /> Auto-Healing Events (24h)
          </CardTitle>
        </div>
        <div className="text-[10px] font-mono text-zinc-500 hidden sm:block">
          Peak: 95 events/hr
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="h-40 w-full flex items-end justify-between gap-1 sm:gap-2 pt-6">
          {hourlyData.map((val, i) => (
            <div key={i} className="w-full relative group h-full flex items-end">
              {/* Tooltip on Hover */}
              <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-800 text-[10px] py-1 px-2 rounded font-mono text-zinc-200 shadow-xl pointer-events-none transition-opacity z-10 whitespace-nowrap">
                {val} Heals
              </div>
              
              {/* Animated Bar */}
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: `${val}%`, opacity: 1 }}
                transition={{ 
                  duration: 0.8, 
                  delay: i * 0.03, // Creates a wave effect from left to right
                  ease: "easeOut" 
                }}
                className={`w-full rounded-t-sm transition-colors duration-300 relative cursor-pointer
                  ${val > 80 ? 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]' 
                  : val > 50 ? 'bg-cyan-500/50 hover:bg-cyan-400' 
                  : 'bg-zinc-800 hover:bg-cyan-500/50'}`}
              />
            </div>
          ))}
        </div>
        
        {/* X-Axis Labels */}
        <div className="flex justify-between items-center mt-3 text-[9px] font-mono text-zinc-600 uppercase tracking-widest">
          <span>00:00</span>
          <span>06:00</span>
          <span>12:00</span>
          <span>18:00</span>
          <span>Now</span>
        </div>
      </CardContent>
    </Card>
  );
}