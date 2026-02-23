import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Bug, Sparkles, Wrench, ShieldAlert, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export function CodeHealer() {
  const [status, setStatus] = useState<"idle" | "scanning" | "repairing" | "fixed" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [aiExplanation, setAiExplanation] = useState<string>("");
  const [fixedCode, setFixedCode] = useState<string>("");
  
  // State to hold the code you paste into the UI
  const [inputCode, setInputCode] = useState<string>("");

  const startHealing = async () => {
    if (!inputCode.trim()) return; 

    setStatus("scanning");
    setProgress(10);
    setFixedCode("");
    
    setTimeout(() => setStatus("repairing"), 1000);

    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev < 85 ? prev + 5 : prev));
    }, 500);

    try {
      // Sending the code you pasted in the text box
      const payload = {
        language: "python", 
        error_message: "Fix syntax and logic errors.",
        source_code: inputCode
      };

      const response = await fetch("http://127.0.0.1:8000/api/heal-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      clearInterval(progressInterval);

      if (response.ok) {
        const data = await response.json();
        setAiExplanation(data.explanation);
        setFixedCode(data.fixed_code);
        setProgress(100);
        setStatus("fixed");
      } else {
        throw new Error("Server returned an error");
      }
    } catch (error) {
      clearInterval(progressInterval);
      setStatus("error");
      setAiExplanation("Connection failed. Is your FastAPI server running?");
    }
  };

  const resetHealer = () => {
    setStatus("idle");
    setProgress(0);
    setAiExplanation("");
    setFixedCode("");
    setInputCode("");
  };

  return (
    <div className="relative group overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/50 p-1">
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

      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div className="flex gap-4">
            <div className={`p-3 rounded-xl border transition-colors duration-500 ${
              status === 'fixed' ? 'bg-emerald-500/10 border-emerald-500/20' : 
              status === 'error' ? 'bg-rose-500/10 border-rose-500/20' : 'bg-zinc-900 border-zinc-800'
            }`}>
              {status === 'fixed' ? <Sparkles className="w-6 h-6 text-emerald-400 animate-pulse" /> : 
               <Bug className={`w-6 h-6 ${status === 'scanning' ? 'text-cyan-400' : 'text-rose-500'}`} />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold tracking-tight text-zinc-100">Guardian AI Healer</h3>
                <Badge variant="outline" className="text-[10px] uppercase font-mono border-zinc-800 text-zinc-500">
                  Status: {status === 'fixed' ? 'Healthy' : status === 'error' ? 'Offline' : 'Action Needed'}
                </Badge>
              </div>
              <p className="text-xs text-zinc-500 mt-1">Paste your broken code below and let the local AI fix it.</p>
            </div>
          </div>

          <div className="flex gap-2">
            {(status === 'fixed' || status === 'error') && (
              <Button onClick={resetHealer} variant="outline" className="border-zinc-800 text-zinc-400 hover:bg-zinc-900">
                Reset
              </Button>
            )}
            <Button 
              onClick={startHealing} 
              disabled={status !== "idle" || !inputCode.trim()}
              className="bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_15px_rgba(8,145,178,0.3)] transition-all disabled:opacity-50"
            >
              <Wrench className={`w-4 h-4 mr-2 ${status === 'scanning' || status === 'repairing' ? 'animate-spin' : ''}`} /> 
              {status === "idle" ? "Fix Code" : status === "error" ? "Failed" : "Fixing..."}
            </Button>
          </div>
        </div>

        {/* The New Input Area */}
        {status === "idle" && (
          <textarea
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            placeholder="Paste your broken code here..."
            className="w-full h-32 bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-zinc-300 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500/50 resize-none"
          />
        )}

        {/* Terminal Output */}
        {status !== "idle" && (
          <div className="relative rounded-xl bg-black border border-zinc-900 p-5 font-mono text-[13px] min-h-[160px] shadow-inner">
            <div className="absolute top-3 right-4 flex gap-1.5 opacity-30">
              <div className="w-2 h-2 rounded-full bg-zinc-700" />
              <div className="w-2 h-2 rounded-full bg-zinc-700" />
              <div className="w-2 h-2 rounded-full bg-zinc-700" />
            </div>

            <AnimatePresence mode="wait">
              {status === "scanning" && (
                <motion.div key="scan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
                  <p className="text-cyan-400 flex items-center gap-2">
                    <Activity className="w-4 h-4 animate-pulse" /> Connecting to Local GPU...
                  </p>
                  <p className="text-zinc-500 pl-6">Reading source code...</p>
                </motion.div>
              )}

              {status === "repairing" && (
                <motion.div key="repair" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-amber-400 flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4" /> Analyzing syntax and logic...
                    </p>
                    <span className="text-zinc-600">{progress}%</span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-zinc-400 pl-6">Generating optimal solution via Qwen2.5...</p>
                    <Progress value={progress} className="h-1 bg-zinc-900 ml-6 w-[calc(100%-24px)]" />
                  </div>
                </motion.div>
              )}

              {status === "fixed" && (
                <motion.div key="fixed" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold">
                    <Cpu className="w-4 h-4" /> REPAIR COMPLETE
                  </div>
                  <p className="text-zinc-400 pl-6 leading-relaxed border-l-2 border-zinc-800 ml-2 py-1">
                    {aiExplanation}
                  </p>
                  
                  {/* Shows the actual Fixed Code */}
                  <div className="mt-4 p-4 bg-zinc-950 rounded-lg border border-zinc-800 text-cyan-300 whitespace-pre-wrap overflow-x-auto">
                    {fixedCode}
                  </div>

                  <div className="mt-4 pt-4 border-t border-zinc-900 flex gap-4 pl-6">
                    <Badge className="bg-emerald-500/10 text-emerald-400 border-none">Syntax: Verified</Badge>
                    <Badge className="bg-emerald-500/10 text-emerald-400 border-none">VRAM: Flushed</Badge>
                  </div>
                </motion.div>
              )}

              {status === "error" && (
                <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                   <div className="flex items-center gap-2 text-rose-500 font-bold">
                    <ShieldAlert className="w-4 h-4" /> SYSTEM FAILURE
                  </div>
                  <p className="text-zinc-400 pl-6">{aiExplanation}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        <div className="flex items-center gap-6 text-[11px] font-mono text-zinc-500 border-t border-zinc-900 pt-6">
          <span className="flex items-center gap-1.5 underline decoration-cyan-500/50 underline-offset-4">
            ENGINE: QWEN-1.5B (LOCAL)
          </span>
          <span className="flex items-center gap-1.5">
            LATENCY: OPTIMIZED
          </span>
        </div>
      </div>
    </div>
  );
}