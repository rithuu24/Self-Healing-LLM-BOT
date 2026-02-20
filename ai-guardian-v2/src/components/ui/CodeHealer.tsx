import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Bug, Sparkles, Wrench, ShieldAlert, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export function CodeHealer() {
  const [status, setStatus] = useState<"idle" | "scanning" | "repairing" | "fixed">("idle");
  const [progress, setProgress] = useState(0);

  const startHealing = () => {
    setStatus("scanning");
    setProgress(0);
    
    // Phase 1: Diagnostic Scan
    setTimeout(() => {
      setProgress(40);
      setStatus("repairing");
    }, 2000);

    // Phase 2: AI Logic Synthesis
    setTimeout(() => {
      setProgress(100);
      setStatus("fixed");
    }, 5000);
  };

  const resetHealer = () => {
    setStatus("idle");
    setProgress(0);
  };

  return (
    <div className="relative group overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/50 p-1">
      {/* Dynamic Scanning Line */}
      <AnimatePresence>
        {status === "scanning" && (
          <motion.div 
            initial={{ top: "-10%" }}
            animate={{ top: "110%" }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_rgba(34,211,238,0.8)] z-20 pointer-events-none"
          />
        )}
      </AnimatePresence>

      <div className="p-6 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div className="flex gap-4">
            <div className={`p-3 rounded-xl border transition-colors duration-500 ${
              status === 'fixed' 
                ? 'bg-emerald-500/10 border-emerald-500/20' 
                : 'bg-zinc-900 border-zinc-800'
            }`}>
              {status === 'fixed' ? (
                <Sparkles className="w-6 h-6 text-emerald-400 animate-pulse" />
              ) : (
                <Bug className={`w-6 h-6 ${status === 'scanning' ? 'text-cyan-400' : 'text-rose-500'}`} />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold tracking-tight">Logic Diagnostic</h3>
                <Badge variant="outline" className="text-[10px] uppercase font-mono border-zinc-800 text-zinc-500">
                  Node: {status === 'fixed' ? 'Stable' : 'Unstable'}
                </Badge>
              </div>
              <p className="text-xs text-zinc-500 font-mono mt-1">Ref: {status === 'fixed' ? 'SUCCESS-01' : 'ERR_SIG_404'}</p>
            </div>
          </div>

          <div className="flex gap-2">
            {status === 'fixed' && (
              <Button onClick={resetHealer} variant="outline" className="border-zinc-800 text-zinc-400 hover:bg-zinc-900">
                Reset
              </Button>
            )}
            <Button 
              onClick={startHealing} 
              disabled={status !== "idle"}
              className="bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_15px_rgba(8,145,178,0.3)] transition-all active:scale-95"
            >
              <Wrench className={`w-4 h-4 mr-2 ${status !== 'idle' ? 'animate-spin' : ''}`} /> 
              {status === "idle" ? "Execute Repair" : "Agent Active"}
            </Button>
          </div>
        </div>

        {/* Terminal Diagnostic Output */}
        <div className="relative rounded-xl bg-black border border-zinc-900 p-5 font-mono text-[11px] min-h-[160px] shadow-inner">
          <div className="absolute top-3 right-4 flex gap-1.5 opacity-30">
            <div className="w-2 h-2 rounded-full bg-zinc-700" />
            <div className="w-2 h-2 rounded-full bg-zinc-700" />
            <div className="w-2 h-2 rounded-full bg-zinc-700" />
          </div>

          <AnimatePresence mode="wait">
            {status === "idle" && (
              <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-zinc-600 italic">
                {">"} Awaiting input stream... <br />
                {">"} System ready for logic injection.
              </motion.div>
            )}

            {status === "scanning" && (
              <motion.div key="scan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-1">
                <p className="text-cyan-400 flex items-center gap-2">
                  <Activity className="w-3 h-3 animate-pulse" /> Scanning abstract syntax trees...
                </p>
                <p className="text-zinc-500 pl-5">Analyzing node dependencies...</p>
                <p className="text-zinc-500 pl-5">Tracing execution path in ChartComponent.tsx...</p>
              </motion.div>
            )}

            {status === "repairing" && (
              <motion.div key="repair" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-amber-400 flex items-center gap-2">
                    <ShieldAlert className="w-3 h-3" /> Regression Found: Memory Leak in useEffect()
                  </p>
                  <span className="text-zinc-600">{progress}%</span>
                </div>
                <div className="space-y-1">
                  <p className="text-zinc-400">Synthesizing patch logic...</p>
                  <Progress value={progress} className="h-1 bg-zinc-900" />
                </div>
              </motion.div>
            )}

            {status === "fixed" && (
              <motion.div key="fixed" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <Cpu className="w-4 h-4" /> REPAIR_PROTOCOL_COMPLETE
                </div>
                <p className="text-zinc-400 pl-6 leading-relaxed">
                  Clean-up executed for Chart component. Unsubscribed from stale observers and implemented a cleanup function to prevent memory leaks during rapid dashboard transitions.
                </p>
                <div className="mt-4 pt-4 border-t border-zinc-900 flex gap-4">
                  <Badge className="bg-emerald-500/10 text-emerald-400 border-none">Logic: 100%</Badge>
                  <Badge className="bg-emerald-500/10 text-emerald-400 border-none">Safety: Verified</Badge>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* System Breadcrumbs */}
        <div className="flex items-center gap-6 text-[10px] font-mono text-zinc-500 border-t border-zinc-900 pt-6">
          <span className="flex items-center gap-1.5 underline decoration-cyan-500/50 underline-offset-4">
            TS_CONFIG: STRICT
          </span>
          <span className="flex items-center gap-1.5">
            NODE_ENV: DEVELOPMENT
          </span>
        </div>
      </div>
    </div>
  );
}