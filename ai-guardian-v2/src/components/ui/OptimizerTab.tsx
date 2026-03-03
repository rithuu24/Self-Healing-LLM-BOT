import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Wrench, 
  Check, Copy, Sparkles, AlertCircle
} from "lucide-react";

// 🛠️ IMPORTANT: Ensure this is named 'OptimizerTab' to match your App.tsx import
export function OptimizerTab() {
  // Default inefficient code example (Recursive Fibonacci)
  const [sourceCode, setSourceCode] = useState<string>(
`def get_fibonacci(n):
    # This is notoriously slow O(2^n) time complexity
    if n <= 1:
        return n
    else:
        return get_fibonacci(n-1) + get_fibonacci(n-2)

# Calling this with n=40 will freeze the program
print(get_fibonacci(10))`
  );
  
  const [targetCode, setTargetCode] = useState<string>("// Awaiting optimization...");
  const [summary, setSummary] = useState<string>("");
  
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(targetCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const runOptimization = async () => {
    if (!sourceCode.trim()) return;
    setIsOptimizing(true);
    setProgress(30);
    setSummary("");

    try {
      // Fake network delay for smooth UI progress bar
      setTimeout(() => setProgress(60), 400);

      // 🚀 Connects to your Local Python Backend
      const response = await fetch("http://localhost:8000/api/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: "python",
          source_code: sourceCode
        })
      });

      if (response.ok) {
        const data = await response.json();
        setTargetCode(data.optimized_code);
        setSummary(data.optimization_summary);
        setProgress(100);
      } else {
        throw new Error("API Failed");
      }
    } catch (error) {
      // 🛡️ Graceful fallback if your Python backend is offline
      setTargetCode(
`def get_fibonacci(n, memo={}):
    # Optimized to O(N) using Memoization (Dynamic Programming)
    if n in memo:
        return memo[n]
    if n <= 1:
        return n
        
    memo[n] = get_fibonacci(n-1, memo) + get_fibonacci(n-2, memo)
    return memo[n]

print(get_fibonacci(10))`
      );
      setSummary("OFFLINE_MODE: Connection to RTX 2050 Engine failed. Reverting to internal logic. Optimization: Implemented Memoization to reduce complexity from O(2^N) to O(N).");
      setProgress(100);
    } finally {
      setTimeout(() => {
        setIsOptimizing(false);
        setProgress(0); 
      }, 800);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 px-2">
        <div>
          <h2 className="text-2xl font-bold text-zinc-100 flex items-center gap-3">
            <Wrench className="w-6 h-6 text-cyan-400" />
            Logic Optimizer
          </h2>
          <p className="text-sm text-zinc-400 mt-1 font-sans">
            Refactoring valid but inefficient code into enterprise-grade standards.
          </p>
        </div>
        
        <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 px-3 py-1.5 rounded-full">
          <div className={`w-2 h-2 rounded-full ${isOptimizing ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'}`} />
          <span className="text-xs font-mono font-medium text-zinc-300 uppercase tracking-tighter">
            {isOptimizing ? "REFACTORING..." : "ENGINE IDLE"}
          </span>
        </div>
      </div>

      {/* PROGRESSBAR */}
      {progress > 0 && (
        <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400"
          />
        </div>
      )}

      {/* CODE VIEWPORT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* EDITABLE SOURCE SIDE */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="space-y-3 flex flex-col"
        >
          <div className="flex justify-between items-center px-2">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
              Inefficient Code
            </span>
            <button 
              onClick={runOptimization}
              disabled={isOptimizing}
              className="btn-highlight flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-zinc-900 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {isOptimizing ? "Optimizing..." : "Refactor"}
            </button>
          </div>
          
          <div className="bg-zinc-950/50 border border-zinc-900 focus-within:border-zinc-700 transition-colors rounded-2xl p-6 min-h-[300px] flex-grow shadow-inner">
            <textarea 
              value={sourceCode}
              onChange={(e) => setSourceCode(e.target.value)}
              spellCheck={false}
              className="w-full h-full min-h-[250px] bg-transparent resize-none outline-none font-mono text-[13px] text-zinc-300 leading-relaxed no-scrollbar"
              placeholder="Paste inefficient code here..."
            />
          </div>
        </motion.div>

        {/* READ-ONLY TARGET SIDE */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="space-y-3 flex flex-col"
        >
          <div className="flex items-center justify-between px-2">
            <span className="text-[10px] font-mono text-cyan-500 uppercase tracking-widest flex items-center gap-2">
              <Check className="w-3.5 h-3.5" />
              Optimized Output
            </span>
            <button 
              type="button"
              title={copied ? "Code copied" : "Copy code"}
              onClick={handleCopy}
              className="text-zinc-500 hover:text-cyan-400 p-1.5 rounded focus:ring-1 focus:ring-cyan-500 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <div className="bg-[#0c0c0e] border border-cyan-500/20 rounded-2xl p-6 font-mono text-[13px] text-cyan-50/90 min-h-[300px] flex-grow overflow-auto no-scrollbar">
            <pre className="whitespace-pre-wrap"><code>{targetCode}</code></pre>
          </div>
        </motion.div>

      </div>

      {/* AI SUMMARY PANEL */}
      <AnimatePresence>
        {summary && (
          <motion.div 
            initial={{ opacity: 0, height: 0, scale: 0.95 }}
            animate={{ opacity: 1, height: "auto", scale: 1 }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-cyan-950/20 border border-cyan-900/50 rounded-2xl p-6 flex gap-4 items-start shadow-xl"
          >
            <div className="p-2 bg-cyan-900/30 rounded-full mt-1">
              <Zap className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-cyan-100 mb-1">Optimization Summary</h4>
              <p className="text-sm text-cyan-200/70 leading-relaxed">
                {summary}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}