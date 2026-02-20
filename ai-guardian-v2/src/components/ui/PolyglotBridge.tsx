import { motion } from "framer-motion";
import { ArrowRightLeft, Cpu, ShieldCheck } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface PolyglotProps {
  fromLang: string;
  toLang: string;
  progress: number;
  status: string;
}

export function PolyglotBridge({ fromLang, toLang, progress, status }: PolyglotProps) {
  return (
    <div className="p-8 bg-zinc-900/30 border border-zinc-800 rounded-2xl backdrop-blur-sm">
      <div className="flex flex-col md:flex-row items-center justify-around gap-8 mb-12">
        
        {/* Source Language */}
        <div className="flex flex-col items-center gap-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-24 h-24 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center shadow-lg"
          >
            <span className="text-2xl font-black text-zinc-500">{fromLang}</span>
          </motion.div>
          <Badge variant="outline" className="text-zinc-500 border-zinc-800">Source</Badge>
        </div>

        {/* The Animated Connector */}
        <div className="relative flex flex-col items-center flex-1 max-w-[200px]">
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="w-32 h-32 border-2 border-dashed border-cyan-500 rounded-full"
            />
          </div>
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="z-10 p-4 bg-zinc-950 rounded-full border border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
          >
            <ArrowRightLeft className="w-8 h-8 text-cyan-400" />
          </motion.div>
        </div>

        {/* Target Language */}
        <div className="flex flex-col items-center gap-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-24 h-24 rounded-2xl bg-cyan-600 flex items-center justify-center shadow-[0_0_40px_rgba(6,182,212,0.2)]"
          >
            <span className="text-2xl font-black text-white">{toLang}</span>
          </motion.div>
          <Badge className="bg-cyan-500 text-white border-none">Target</Badge>
        </div>
      </div>

      {/* Progress & Metrics */}
      <div className="max-w-md mx-auto space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Migration Progress</span>
            <span className="text-lg font-bold text-cyan-400">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2 bg-zinc-800" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-zinc-950/50 border border-zinc-800 rounded-xl">
            <p className="text-[10px] text-zinc-500 uppercase mb-1">Status</p>
            <p className="text-sm font-medium text-zinc-300 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-500" /> {status}
            </p>
          </div>
          <div className="p-4 bg-zinc-950/50 border border-zinc-800 rounded-xl">
            <p className="text-[10px] text-zinc-500 uppercase mb-1">Validation</p>
            <p className="text-sm font-medium text-emerald-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Passed 12/12
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}