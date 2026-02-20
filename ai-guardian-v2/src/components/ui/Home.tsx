import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Zap, 
  BrainCircuit, 
  ChevronRight, 
  Code2, 
  Lock 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function Home({ onNavigate }: { onNavigate: (tab: string) => void }) {
  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-zinc-900/50 to-black p-8 md:p-16">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <BrainCircuit className="w-64 h-64 text-cyan-500" />
        </div>
        
        <div className="relative z-10 max-w-2xl">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
            <span className="text-[10px] font-mono text-cyan-500 uppercase tracking-[0.3em]">Quantum Protocol Enabled</span>
          </motion.div>
          
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 leading-tight">
            The Future of <br />
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
              className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 h-12 rounded-xl btn-highlight"
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

      {/* CORE MODULES GRID */}
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
          desc="Verified patches that maintain your existing security protocols."
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
        <div className="flex items-center gap-8">
          <div className="flex flex-col">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Neural Latency</span>
            <span className="text-sm font-mono text-zinc-200">142ms</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Active Nodes</span>
            <span className="text-sm font-mono text-zinc-200">12 / 12</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-500">
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