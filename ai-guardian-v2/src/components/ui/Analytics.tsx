import React from 'react'; // ADDED THIS IMPORT
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, ShieldCheck, Timer } from "lucide-react";

const performanceData = [
  { cycle: '01', accuracy: 82, latency: 450 },
  { cycle: '02', accuracy: 85, latency: 410 },
  { cycle: '03', accuracy: 84, latency: 430 },
  { cycle: '04', accuracy: 91, latency: 380 },
  { cycle: '05', accuracy: 89, latency: 390 },
  { cycle: '06', accuracy: 95, latency: 310 },
  { cycle: '07', accuracy: 98.2, latency: 280 },
];

export function Analytics() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard 
          title="Avg. Accuracy" 
          value="98.2%" 
          trend="+4.1%" 
          icon={<ShieldCheck className="w-4 h-4 text-emerald-400" />} 
        />
        <MetricCard 
          title="Mean Latency" 
          value="280ms" 
          trend="-15%" 
          icon={<Timer className="w-4 h-4 text-cyan-400" />} 
        />
        <MetricCard 
          title="Heal Energy" 
          value="Stable" 
          trend="OPTIMAL" 
          icon={<Zap className="w-4 h-4 text-amber-400" />} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Accuracy Area Chart */}
        <Card className="bg-zinc-950/50 border-zinc-800 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between border-b border-zinc-900/50 pb-4">
            <CardTitle className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-500">
              Accuracy Trajectory
            </CardTitle>
            <Badge className="bg-emerald-500/10 text-emerald-400 border-none text-[10px] px-2 py-0">LIVE_FEED</Badge>
          </CardHeader>
          <CardContent className="h-[300px] pt-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#18181b" vertical={false} />
                <XAxis dataKey="cycle" stroke="#3f3f46" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#3f3f46" fontSize={10} tickLine={false} axisLine={false} domain={[80, 100]} dx={-10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '8px' }}
                  itemStyle={{ color: '#10b981', fontSize: '10px' }}
                />
                <Area type="monotone" dataKey="accuracy" stroke="#10b981" fill="url(#colorAcc)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Latency Line Chart */}
        <Card className="bg-zinc-950/50 border-zinc-800 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between border-b border-zinc-900/50 pb-4">
            <CardTitle className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-500">
              Latency Response
            </CardTitle>
            <Badge className="bg-cyan-500/10 text-cyan-400 border-none text-[10px] px-2 py-0">STABLE</Badge>
          </CardHeader>
          <CardContent className="h-[300px] pt-6">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#18181b" vertical={false} />
                <XAxis dataKey="cycle" stroke="#3f3f46" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#3f3f46" fontSize={10} tickLine={false} axisLine={false} dx={-10} />
                <Tooltip 
                   contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '8px' }}
                   itemStyle={{ color: '#06b6d4', fontSize: '10px' }}
                />
                <Line type="monotone" dataKey="latency" stroke="#06b6d4" strokeWidth={2} dot={{ fill: '#06b6d4', r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Sub-component for individual metric cards
function MetricCard({ title, value, trend, icon }: { title: string, value: string, trend: string, icon: React.ReactNode }) {
  return (
    <Card className="bg-zinc-950/50 border-zinc-800 p-5 group hover:border-cyan-500/30 transition-all duration-300">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em]">{title}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-zinc-100">{value}</span>
            <span className={`text-[10px] font-bold ${trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
              {trend}
            </span>
          </div>
        </div>
        <div className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
      </div>
    </Card>
  );
}