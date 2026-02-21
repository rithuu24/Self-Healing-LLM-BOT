import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Zap, 
  BrainCircuit, 
  ChevronRight, 
  Code2, 
  Lock, 
  Activity 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface HomeProps {
  onNavigate: (tab: string) => void;
}

export function Home({ onNavigate }: HomeProps) {
  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-zinc-900/50 to-black p-8 md:p-16">
        {/* Decorative Background Icon */}
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <BrainCircuit className="w-64 h-64 text-cyan-500" />
        </div>
        
        <div className="relative z-10 max-w-2xl">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
            <span className="text-[10px] font-mono text-cyan-500 uppercase tracking-[0.3em]">Neural Protocol Active</span>
          </motion.div>
          
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 leading-tight">
            Autonomous <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
              Self-Healing Code.
            </span>
          </h1>
          
          <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
            Guardian V2 utilizes advanced LLM logic to detect, diagnose, and repair 
            unit test regressions before they reach production. 
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Button 
              onClick={() => onNavigate('healer')}
              className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 h-12 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-all"
            >
              Launch Healer <ChevronRight className="ml-2 w-4 h-4" />
            </Button>
            
            <Button 
              variant="outline" 
              className="border-zinc-800 bg-zinc-100 hover:bg-white text-black h-12 px-8 rounded-xl font-bold transition-all"
            >
              View Documentation
            </Button>
          </div>
        </div>
      </section>

      {/* SYSTEM MONITORING METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "LLM Load", value: "12%", color: "bg-cyan-500" },
          { label: "Memory Depth", value: "High", color: "bg-emerald-500" },
          { label: "Logic Drift", value: "0.02%", color: "bg-amber-500" },
          { label: "Queue Status", value: "Idle", color: "bg-zinc-500" }
        ].map((metric) => (
          <div key={metric.label} className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 flex items-center gap-4">
            <div className={`w-1.5 h-1.5 rounded-full ${metric.color} animate-pulse`} />
            <div>
              <p className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold">{metric.label}</p>
              <p className="text-sm font-mono text-zinc-200">{metric.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* INTELLIGENCE DEEP-DIVE */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Tactical Strategy Overview */}
        <Card className="bg-zinc-950 border-zinc-800 p-8 relative overflow-hidden group">
          <div className="absolute -right-12 -bottom-12 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity pointer-events-none">
            <BrainCircuit className="w-64 h-64" />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20">
                <Activity className="w-5 h-5 text-amber-500" />
              </div>
              <h3 className="text-xl font-bold tracking-tight">Autonomous Strategy</h3>
            </div>
            
            <p className="text-sm text-zinc-400 mb-8 leading-relaxed">
              The engine employs a **Recursive Tree-Traversal** algorithm to map DOM snapshots. 
              When a failure is detected, it triggers a heuristic search to find the most probable 
              selector match with **O(log n)** efficiency.
            </p>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/50 border border-zinc-800">
                <span className="text-xs font-mono text-zinc-500 uppercase">Heuristic Depth</span>
                <span className="text-xs font-mono text-emerald-400">Level 4 (Strict)</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/50 border border-zinc-800">
                <span className="text-xs font-mono text-zinc-500 uppercase">Conflict Resolution</span>
                <span className="text-xs font-mono text-cyan-400">Automatic (LLM)</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Right: Active Neural Nodes */}
        <Card className="bg-zinc-950 border-zinc-800 p-8 flex flex-col justify-center">
          <h3 className="text-sm font-mono text-zinc-500 uppercase tracking-widest mb-8">Active Neural Nodes</h3>
          
          <div className="grid grid-cols-2 gap-6">
            {[
              { name: "Parser_A", status: "Active", load: "24%" },
              { name: "Logic_Synth", status: "Active", load: "12%" },
              { name: "DOM_Diff", status: "Idle", load: "0%" },
              { name: "Heal_Verify", status: "Standby", load: "0%" }
            ].map((node) => (
              <div key={node.name} className="p-4 rounded-xl bg-black border border-zinc-900 group hover:border-zinc-700 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-mono text-zinc-400">{node.name}</span>
                  <div className={`w-1.5 h-1.5 rounded-full ${node.status === 'Active' ? 'bg-emerald-500' : 'bg-zinc-700'}`} />
                </div>
                <div className="text-lg font-bold text-zinc-200">{node.load}</div>
                <div className="w-full h-1 bg-zinc-900 rounded-full mt-2 overflow-hidden">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: node.load }}
                     className="h-full bg-cyan-500"
                   />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* CORE MODULES QUICK-LINKS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FeatureCard 
          icon={<Zap className="text-amber-400" />}
          title="Instant Repair"
          desc="Auto-correct stale selectors and logic drifts in milliseconds."
          onClick={() => onNavigate('optimizer')}
        />
        <FeatureCard 
          icon={<ShieldCheck className="text-emerald-400" />}
          title="Security First"
          desc="Verified patches that maintain existing security protocols."
          onClick={() => onNavigate('analytics')}
        />
        <FeatureCard 
          icon={<Code2 className="text-cyan-400" />}
          title="Polyglot Support"
          desc="Seamless migration between TS, Python, and Java environments."
          onClick={() => onNavigate('polyglot')}
        />
      </section>

      {/* SYSTEM STATUS BAR */}
      <footer className="p-6 rounded-2xl bg-zinc-950 border border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-8 text-zinc-400">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest mb-1 opacity-50">Neural Latency</span>
            <span className="text-sm font-mono">142ms</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest mb-1 opacity-50">Active Nodes</span>
            <span className="text-sm font-mono text-emerald-500">12 / 12</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-500/80">
          <Lock className="w-3 h-3" /> ENCRYPTED_CONNECTION_ESTABLISHED
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc, onClick }: { icon: React.ReactNode, title: string, desc: string, onClick: () => void }) {
  return (
    <Card 
      onClick={onClick}
      className="group bg-zinc-950 border-zinc-800 p-6 hover:border-cyan-500/50 cursor-pointer transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.05)]"
    >
      <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 w-fit mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-lg font-bold mb-2 group-hover:text-cyan-400 transition-colors">{title}</h3>
      <p className="text-sm text-zinc-500 leading-relaxed">{desc}</p>
    </Card>
  );
}
