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
                <h3 className="text-xl font-bold tracking-tight text-zinc-100">Code Check</h3>
                <Badge variant="outline" className="text-[10px] uppercase font-mono border-zinc-800 text-zinc-500">
                  Status: {status === 'fixed' ? 'Healthy' : 'Action Needed'}
                </Badge>
              </div>
              <p className="text-xs text-zinc-500 mt-1">
                {status === 'fixed' ? 'All systems running smoothly.' : 'Detect and fix hidden code errors.'}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            {status === 'fixed' && (
              <Button onClick={resetHealer} variant="outline" className="border-zinc-800 text-zinc-400 hover:bg-zinc-900">
                Scan Again
              </Button>
            )}
            <Button 
              onClick={startHealing} 
              disabled={status !== "idle"}
              className="bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_15px_rgba(8,145,178,0.3)] transition-all active:scale-95"
            >
              <Wrench className={`w-4 h-4 mr-2 ${status !== 'idle' ? 'animate-spin' : ''}`} /> 
              {status === "idle" ? "Fix Code Issues" : "Fixing..."}
            </Button>
          </div>
        </div>

        {/* Terminal Diagnostic Output */}
        <div className="relative rounded-xl bg-black border border-zinc-900 p-5 font-mono text-[13px] min-h-[160px] shadow-inner">
          {/* Decorative Terminal Dots */}
          <div className="absolute top-3 right-4 flex gap-1.5 opacity-30">
            <div className="w-2 h-2 rounded-full bg-zinc-700" />
            <div className="w-2 h-2 rounded-full bg-zinc-700" />
            <div className="w-2 h-2 rounded-full bg-zinc-700" />
          </div>

          <AnimatePresence mode="wait">
            {status === "idle" && (
              <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-zinc-500 italic">
                {">"} System ready. <br />
                {">"} Click "Fix Code Issues" to scan for performance bugs and visual errors.
              </motion.div>
            )}

            {status === "scanning" && (
              <motion.div key="scan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
                <p className="text-cyan-400 flex items-center gap-2">
                  <Activity className="w-4 h-4 animate-pulse" /> Scanning repository code...
                </p>
                <p className="text-zinc-500 pl-6">Checking code load speeds...</p>
                <p className="text-zinc-500 pl-6">Testing interactive charts and buttons...</p>
              </motion.div>
            )}

            {status === "repairing" && (
              <motion.div key="repair" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-amber-400 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4" /> Issue Detected: Page slowing down over time.
                  </p>
                  <span className="text-zinc-600">{progress}%</span>
                </div>
                <div className="space-y-2">
                  <p className="text-zinc-400 pl-6">Applying automated AI performance fix...</p>
                  <Progress value={progress} className="h-1 bg-zinc-900 ml-6 w-[calc(100%-24px)]" />
                </div>
              </motion.div>
            )}

            {status === "fixed" && (
              <motion.div key="fixed" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <Cpu className="w-4 h-4" /> AUTOMATED REPAIR COMPLETE
                </div>
                <p className="text-zinc-400 pl-6 leading-relaxed">
                  Fixed a background data issue. Your website's interactive charts will now load instantly without freezing the user's browser.
                </p>
                <div className="mt-4 pt-4 border-t border-zinc-900 flex gap-4 pl-6">
                  <Badge className="bg-emerald-500/10 text-emerald-400 border-none">Performance: Optimized</Badge>
                  <Badge className="bg-emerald-500/10 text-emerald-400 border-none">Security: Verified</Badge>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* System Breadcrumbs - Now featuring understandable metrics */}
        <div className="flex items-center gap-6 text-[11px] font-mono text-zinc-500 border-t border-zinc-900 pt-6">
          <span className="flex items-center gap-1.5 underline decoration-cyan-500/50 underline-offset-4">
            AI ENGINE: ACTIVE
          </span>
          <span className="flex items-center gap-1.5">
            SPEED SCORE: 98/100
          </span>
        </div>
      </div>
    </div>
  );
}