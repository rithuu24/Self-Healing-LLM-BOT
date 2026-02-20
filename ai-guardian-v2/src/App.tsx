import { useState, useEffect } from "react";
import { AnimatedLogStream } from "@/components/AnimatedLogStream";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Terminal } from "lucide-react";

export default function App() {
  const [logs, setLogs] = useState<any[]>([]);

  // Simulation of Self-Healing activity
  useEffect(() => {
    const sequence = [
      { id: 1, type: 'info', message: 'Initializing Test Suite: auth.spec.ts' },
      { id: 2, type: 'error', message: 'Test Failed: Selector #login-btn not found.' },
      { id: 3, type: 'healing', message: 'LLM analyzing DOM snapshot... Attempting repair.' },
      { id: 4, type: 'healing', message: 'Patching: Updated selector to [data-testid="submit-login"]' },
      { id: 5, type: 'success', message: 'Retry successful. Test Passed.' },
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < sequence.length) {
        setLogs(prev => [...prev, sequence[i]].slice(-8)); // Keep last 8 logs
        i++;
      } else {
        clearInterval(interval);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black p-10 flex items-center justify-center">
      <Card className="w-full max-w-2xl bg-zinc-950 border-zinc-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-zinc-100">
            <Terminal className="text-cyan-500" /> System Execution Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AnimatedLogStream logs={logs} />
        </CardContent>
      </Card>
    </div>
  );
}