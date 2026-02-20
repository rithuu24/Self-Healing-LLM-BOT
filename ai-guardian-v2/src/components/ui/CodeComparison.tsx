import { Check, ArrowRight, Code2 } from "lucide-react"; // ArrowRight is now used!

interface CodeComparisonProps {
  oldCode: string;
  newCode: string;
  explanation: string;
}

export function CodeComparison({ oldCode, newCode, explanation }: CodeComparisonProps) {
  return (
    <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* The Visual "Bridge" - Now using ArrowRight */}
      <div className="hidden md:flex absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="p-2 rounded-full bg-zinc-900 border border-zinc-800 shadow-xl shadow-black">
          <ArrowRight className="w-5 h-5 text-cyan-500 animate-pulse" />
        </div>
      </div>

      {/* Old/Broken Code */}
      <div className="rounded-lg bg-zinc-950 border border-rose-500/20 overflow-hidden opacity-80 hover:opacity-100 transition-opacity">
        <div className="bg-rose-500/10 px-4 py-2 border-b border-rose-500/20">
          <span className="text-[10px] font-mono text-rose-400 uppercase tracking-[0.2em]">Legacy Branch</span>
        </div>
        <pre className="p-4 font-mono text-[11px] text-zinc-500 overflow-x-auto leading-relaxed">
          <code>{oldCode}</code>
        </pre>
      </div>

      {/* New/Healed Code */}
      <div className="rounded-lg bg-zinc-950 border border-emerald-500/20 overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.05)]">
        <div className="bg-emerald-500/10 px-4 py-2 border-b border-emerald-500/20 flex justify-between items-center">
          <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-[0.2em]">Optimized Output</span>
          <Check className="w-3 h-3 text-emerald-400" />
        </div>
        <pre className="p-4 font-mono text-[11px] text-emerald-50/90 overflow-x-auto leading-relaxed">
          <code>{newCode}</code>
        </pre>
      </div>

      {/* Explanation Footer */}
      <div className="md:col-span-2 p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl flex items-start gap-4">
        <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20 shrink-0">
          <Code2 className="w-5 h-5 text-cyan-400" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-zinc-200 mb-1">AI Healing Analysis</h4>
          <p className="text-sm text-zinc-400 leading-relaxed italic">"{explanation}"</p>
        </div>
      </div>
    </div>
  );
}
