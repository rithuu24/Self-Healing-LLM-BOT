import { motion, AnimatePresence } from "framer-motion";
import { Terminal, CheckCircle2, AlertCircle, Zap } from "lucide-react";

interface Log {
  id: number;
  message: string;
  type: 'info' | 'error' | 'success' | 'healing';
}

export function AnimatedLogStream({ logs }: { logs: Log[] }) {
  return (
    <div className="flex flex-col gap-2 font-mono text-sm h-[400px] overflow-hidden">
      <AnimatePresence mode="popLayout">
        {logs.map((log) => (
          <motion.div
            key={log.id}
            initial={{ opacity: 0, x: -20, filter: "blur(10px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            className="flex items-start gap-3 p-2 rounded bg-zinc-900/50 border border-zinc-800/50"
          >
            <LogIcon type={log.type} />
            <div className="flex-1">
              <span className="text-zinc-500 mr-2 text-[10px]">[{new Date().toLocaleTimeString()}]</span>
              <span className={getMessageColor(log.type)}>{log.message}</span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function LogIcon({ type }: { type: Log['type'] }) {
  switch (type) {
    case 'error': return <AlertCircle className="w-4 h-4 text-rose-500 mt-0.5" />;
    case 'success': return <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5" />;
    case 'healing': return <Zap className="w-4 h-4 text-cyan-400 animate-pulse mt-0.5" />;
    default: return <Terminal className="w-4 h-4 text-zinc-500 mt-0.5" />;
  }
}

function getMessageColor(type: Log['type']) {
  const colors = {
    info: "text-zinc-300",
    error: "text-rose-400 font-bold",
    success: "text-emerald-400",
    healing: "text-cyan-300 italic",
  };
  return colors[type];
}