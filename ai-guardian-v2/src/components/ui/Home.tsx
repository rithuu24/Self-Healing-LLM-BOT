import React from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronRight, 
  BrainCircuit, 
  Search, 
  RefreshCcw, 
  Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface HomeProps {
  onNavigate: (tab: string) => void;
}

export function Home({ onNavigate }: HomeProps) {
  return (
    <div className="space-y-16 px-6 md:px-16 py-12 animate-in fade-in duration-700">
      
      {/* HERO SECTION */}
      <section className="relative rounded-3xl bg-gradient-to-br from-zinc-950 via-zinc-900/50 to-black p-12 md:p-20 overflow-hidden border border-zinc-800">
        {/* Large Background Icon */}
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
          <BrainCircuit className="w-96 h-96 text-cyan-500" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl relative z-10 text-center md:text-left"
        >
          <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20 mb-6 uppercase tracking-[0.2em] text-[10px]">
            AI-Powered Maintenance Engine
          </Badge>
          
          <h1 className="text-4xl md:text-7xl font-black mb-6 leading-[1.1] tracking-tighter">
            Stop Fixing <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
              Broken Tests.
            </span>
          </h1>
          
          <p className="text-zinc-400 text-lg md:text-xl mb-10 max-w-xl leading-relaxed">
            Guardian V2 automatically repairs your software tests when the UI changes, 
            eliminating manual maintenance and "flaky" failures.
          </p>

          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <Button
              onClick={() => onNavigate("healer")}
              className="bg-cyan-600 hover:bg-cyan-500 text-white px-10 h-14 rounded-2xl font-bold shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center gap-2 group transition-all"
            >
              Start Healing <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            {/* High Contrast Documentation Button */}
            <Button
              variant="outline"
              className="border-zinc-800 bg-zinc-100 hover:bg-white text-black h-14 px-10 rounded-2xl font-bold shadow-xl transition-all"
            >
              View Documentation
            </Button>
          </div>
        </motion.div>
      </section>

      {/* PROCESS SECTION */}
      <section className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold tracking-tight text-white">How Guardian Protects You</h2>
          <p className="text-zinc-500 max-w-2xl mx-auto">Three steps to a self-healing codebase.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-zinc-800 to-transparent -z-10" />
          
          <Step 
            icon={<Search className="text-cyan-400" />} 
            number="01" 
            title="Detect" 
            desc="Guardian monitors your test suite. When a button ID or UI element changes, it spots the failure instantly." 
          />
          <Step 
            icon={<BrainCircuit className="text-amber-400" />} 
            number="02" 
            title="Diagnose" 
            desc="The AI analyzes your code history and the new UI to understand what changed and why it broke." 
          />
          <Step 
            icon={<RefreshCcw className="text-emerald-400" />} 
            number="03" 
            title="Repair" 
            desc="It automatically generates and applies a code fix, allowing your tests to pass without manual intervention." 
          />
        </div>
      </section>

      {/* METRICS SECTION */}
      <section className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <MetricCard label="Success Rate" value="99.2%" sub="Verified repairs" />
        <MetricCard label="Time Saved" value="124 hrs" sub="Per project/mo" />
        <MetricCard label="Repair Latency" value="142ms" sub="Avg. fix speed" />
        <MetricCard label="Active Nodes" value="Stable" sub="System health" />
      </section>

      {/* SECURITY CALLOUT */}
      <section className="rounded-3xl bg-zinc-950 border border-zinc-800 p-10 flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
            <Lock className="w-8 h-8 text-emerald-500" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Zero-Trust Security</h3>
            <p className="text-zinc-500 text-sm max-w-md mt-1">
              Every AI-generated fix is scanned against your existing security protocols to ensure no vulnerabilities are introduced.
            </p>
          </div>
        </div>
        <Button 
          onClick={() => onNavigate("healer")}
          className="w-full lg:w-auto bg-zinc-900 border border-zinc-800 hover:border-cyan-500/50 text-zinc-300 hover:text-white px-8 h-12 rounded-xl transition-all"
        >
          Initialize System Audit
        </Button>
      </section>

    </div>
  );
}

// Sub-components
function Step({ icon, number, title, desc }: { icon: React.ReactNode, number: string, title: string, desc: string }) {
  return (
    <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-2xl hover:border-zinc-700 transition-colors relative group">
      <span className="absolute top-4 right-6 text-4xl font-black text-zinc-900 group-hover:text-zinc-800 transition-colors">{number}</span>
      <div className="p-3 bg-zinc-900 rounded-xl w-fit mb-6">{icon}</div>
      <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
      <p className="text-sm text-zinc-500 leading-relaxed">{desc}</p>
    </div>
  );
}

function MetricCard({ label, value, sub }: { label: string, value: string, sub: string }) {
  return (
    <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 text-center">
      <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1">{label}</p>
      <p className="text-2xl font-black text-white">{value}</p>
      <p className="text-[10px] text-zinc-600 mt-1">{sub}</p>
    </div>
  );
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={`inline-block px-3 py-1 rounded-full border text-[10px] font-bold ${className}`}>
      {children}
    </span>
  );
}