import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, ArrowRight, Lightbulb, ShieldCheck } from "lucide-react";

interface CodeComparisonProps {
  oldCode: string;
  newCode: string;
  explanation: string;
}

export function CodeComparison({ oldCode, newCode, explanation }: CodeComparisonProps) {
  return (
    <div className="space-y-6">
      {/* HEADER: STATUS INDICATOR */}
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
            Code Optimized & Verified
          </span>
        </div>
        <div className="text-[10px] font-mono text-zinc-600">
          SUCCESS RATE: <span className="text-cyan-400">98.4%</span>
        </div>
      </div>

      {/* CODE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-zinc-800 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
        
        {/* OLD CODE (FAILED) */}
        <div className="bg-zinc-950 p-6 relative group">
          <div className="absolute top-4 right-4 flex items-center gap-2 px-2 py-1 rounded bg-rose-500/10 border border-rose-500/20">
            <X className="w-3 h-3 text-rose-500" />
            <span className="text-[9px] font-bold text-rose-500 uppercase">Broken Code</span>
          </div>
          <h4 className="text-[10px] font-mono text-zinc-600 uppercase mb-4 tracking-widest">Original Input</h4>
          <pre className="text-sm font-mono leading-relaxed text-zinc-400 overflow-x-auto">
            <code>
              {oldCode.split('').map((char, i) => (
                <motion.span 
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.005 }}
                >
                  {char}
                </motion.span>
              ))}
            </code>
          </pre>
          <div className="mt-4 pt-4 border-t border-zinc-900/50">
            <p className="text-[10px] text-zinc-500 italic">Error: Element not found causing test failure.</p>
          </div>
        </div>

        {/* NEW CODE (HEALED) */}
        <div className="bg-[#0c0c0e] p-6 relative group border-l border-zinc-800">
          <div className="absolute top-4 right-4 flex items-center gap-2 px-2 py-1 rounded bg-cyan-500/10 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
            <Check className="w-3 h-3 text-cyan-400" />
            <span className="text-[9px] font-bold text-cyan-400 uppercase">Fixed Code</span>
          </div>
          <h4 className="text-[10px] font-mono text-zinc-600 uppercase mb-4 tracking-widest">AI Optimized Output</h4>
          <pre className="text-sm font-mono leading-relaxed text-cyan-50/90 overflow-x-auto">
            <code>
              {newCode.split('').map((char, i) => (
                <motion.span 
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.005 + 0.2 }}
                >
                  {char}
                </motion.span>
              ))}
            </code>
          </pre>
          <div className="mt-4 pt-4 border-t border-zinc-900/50">
            <p className="text-[10px] text-cyan-500/80 font-bold uppercase tracking-tighter flex items-center gap-2">
              <ArrowRight className="w-3 h-3" /> Selector successfully updated
            </p>
          </div>
        </div>
      </div>

      {/* EXPLANATION CARD */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="p-5 rounded-2xl bg-zinc-900/30 border border-zinc-800 flex gap-4 items-start"
      >
        <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 shrink-0">
          <Lightbulb className="w-4 h-4 text-amber-500" />
        </div>
        <div>
          <h5 className="text-[11px] font-bold text-zinc-200 uppercase tracking-widest mb-1">Why this fix works</h5>
          <p className="text-sm text-zinc-500 leading-relaxed">
            {explanation}
          </p>
        </div>
      </motion.div>
    </div>
  );
}