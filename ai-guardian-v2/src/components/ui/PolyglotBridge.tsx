import React from 'react';
import { motion } from 'framer-motion';
import { 
  Globe2, 
  ArrowRight, 
  Code2, 
  Cpu, 
  Zap, 
  Terminal 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PolyglotBridgeProps {
  fromLang: string;
  toLang: string;
  progress: number;
  status: string;
  sourceCode?: string;
  targetCode?: string;
}

export function PolyglotBridge({ 
  fromLang, 
  toLang, 
  progress, 
  status,
  sourceCode = "def find_element(selector):\n  # Legacy Python Search\n  return driver.find_element(selector)",
  targetCode = "async findElement(selector: string): Promise<Element> {\n  // Healed TypeScript Logic\n  return await this.page.locator(selector).first();\n}"
}: PolyglotBridgeProps) {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* BRIDGE HEADER: PROGRESS & STATUS */}
      <div className="bg-zinc-900/30 border border-zinc-800 p-6 rounded-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-zinc-950 border-zinc-800 text-zinc-400 font-mono text-[10px] px-3">
                {fromLang}
              </Badge>
              <ArrowRight className="w-3 h-3 text-zinc-600" />
              <Badge variant="outline" className="bg-cyan-500/10 border-cyan-500/20 text-cyan-400 font-mono text-[10px] px-3 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
                {toLang}
              </Badge>
            </div>
            <div className="h-4 w-[1px] bg-zinc-800 hidden md:block" />
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
              <Terminal className="w-3.5 h-3.5" />
              {status}
            </div>
          </div>
          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
            Transfer Load: <span className="text-zinc-200">{progress}%</span>
          </div>
        </div>

        {/* HUD PROGRESS BAR */}
        <div className="relative h-1.5 w-full bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "circOut" }}
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-600 to-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.5)]"
          />
        </div>
      </div>

      {/* CODE TRANSLATION VIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
        
        {/* Connection Animation Overlay */}
        <div className="hidden lg:flex absolute inset-0 items-center justify-center pointer-events-none z-10">
          <motion.div 
            animate={{ 
              opacity: [0.1, 0.5, 0.1],
              scale: [1, 1.05, 1]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="p-3 rounded-full bg-zinc-900 border border-zinc-800 shadow-2xl"
          >
            <Zap className="w-5 h-5 text-cyan-500" />
          </motion.div>
        </div>

        {/* Source Card */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 ml-2">
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Legacy Source</span>
          </div>
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 font-mono text-xs text-zinc-500 leading-relaxed overflow-hidden relative">
            <pre><code>{sourceCode}</code></pre>
          </div>
        </div>

        {/* Target Card */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 ml-2">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
            <span className="text-[10px] font-mono text-cyan-500 uppercase tracking-widest">Neural Target</span>
          </div>
          <div className="bg-[#0c0c0e] border border-cyan-500/10 rounded-2xl p-6 font-mono text-xs text-cyan-50/90 leading-relaxed overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.02] to-transparent pointer-events-none" />
            <pre className="relative z-10"><code>{targetCode}</code></pre>
            
            {/* Animated Scanning Line */}
            <motion.div 
              animate={{ top: ['0%', '100%', '0%'] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute left-0 right-0 h-[1px] bg-cyan-500/20 z-0"
            />
          </div>
        </div>
      </div>

      {/* FOOTER: PERFORMANCE METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <OptimizationMetric 
          icon={<Cpu className="w-3.5 h-3.5 text-amber-500" />} 
          label="Logic Refactoring" 
          value="O(n) → O(1)" 
        />
        <OptimizationMetric 
          icon={<Globe2 className="w-3.5 h-3.5 text-emerald-500" />} 
          label="Environment Sync" 
          value="Synchronized" 
        />
        <OptimizationMetric 
          icon={<Code2 className="w-3.5 h-3.5 text-cyan-500" />} 
          label="Type Safety" 
          value="Strict-Injected" 
        />
      </div>
    </div>
  );
}

function OptimizationMetric({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 flex items-center justify-between group hover:border-zinc-800 transition-colors">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-zinc-900 rounded-lg group-hover:scale-110 transition-transform">{icon}</div>
        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">{label}</span>
      </div>
      <span className="text-xs font-mono text-zinc-200">{value}</span>
    </div>
  );
}