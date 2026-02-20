import { useState, useEffect } from "react";
import { 
  Terminal, Sparkles, BarChart3, Globe2, 
  ShieldCheck, Activity, Zap 
} from "lucide-react";

// shadcn components
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

// Custom components we built
import { AnimatedLogStream } from "@/components/ui/AnimatedLogStream";
import { CodeComparison } from "@/components/ui/CodeComparison";
import { PolyglotBridge } from "@/components/ui/PolyglotBridge";

export default function App() {
  const [logs, setLogs] = useState<any[]>([]);

  // 1. Simulation logic for the Live Logs
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
        setLogs(prev => [...prev, sequence[i]].slice(-8)); 
        i++;
      }
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans p-4 md:p-8">
      {/* HEADER SECTION */}
      <header className="max-w-6xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-cyan-500/10 rounded-xl border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
            <ShieldCheck className="w-8 h-8 text-cyan-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tighter">GUARDIAN V2</h1>
            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Self-Healing QA Engine</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/5 px-3 py-1 animate-pulse">
            <Activity className="w-3 h-3 mr-2" /> SYSTEM_ACTIVE
          </Badge>
          <div className="h-8 w-[1px] bg-zinc-800 mx-2 hidden md:block" />
          <p className="text-xs font-mono text-zinc-500">LATENCY: 142ms</p>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-6xl mx-auto">
        <Tabs defaultValue="optimizer" className="space-y-6">
          <TabsList className="bg-zinc-900/50 border border-zinc-800 p-1">
            <TabsTrigger value="optimizer" className="gap-2 px-6"><Sparkles className="w-4 h-4" /> Optimizer</TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2 px-6"><BarChart3 className="w-4 h-4" /> Live Analytics</TabsTrigger>
            <TabsTrigger value="polyglot" className="gap-2 px-6"><Globe2 className="w-4 h-4" /> Polyglot Bridge</TabsTrigger>
          </TabsList>

          {/* TAB 1: CODE OPTIMIZER */}
          <TabsContent value="optimizer" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <Card className="bg-zinc-950 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Healer Logic Visualization</CardTitle>
                <CardDescription>Real-time view of LLM repair operations on unit test selectors.</CardDescription>
              </CardHeader>
              <CardContent>
                <CodeComparison 
                  oldCode={`expect(await page.innerText('button#login-btn')).toBe('Sign In')`}
                  newCode={`expect(await page.locator('button[data-testid="submit-login"]')).toBe('Login Now')`}
                  explanation="The ID selector became stale due to a frontend framework update. The LLM identified the new data-testid attribute and updated the assertion message to match the new UI state."
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 2: LIVE ANALYTICS (With your Logs) */}
          <TabsContent value="analytics" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-2 bg-zinc-950 border-zinc-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-zinc-100">
                    <Terminal className="w-5 h-5 text-cyan-500" /> Execution Stream
                  </CardTitle>
                  <CardDescription>Live telemetry from the Self-Healing process</CardDescription>
                </CardHeader>
                <CardContent>
                  <AnimatedLogStream logs={logs} />
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card className="bg-zinc-950 border-zinc-800">
                  <CardHeader><CardTitle className="text-sm">Health Score</CardTitle></CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-cyan-500">98.2%</div>
                    <p className="text-[10px] text-zinc-500 mt-2 uppercase">Quality benchmark maintained</p>
                  </CardContent>
                </Card>
                <Card className="bg-cyan-600 border-none shadow-lg shadow-cyan-900/20">
                  <CardContent className="p-6">
                    <Zap className="w-8 h-8 text-white mb-4" />
                    <h3 className="font-bold text-white">Maintenance mode?</h3>
                    <p className="text-cyan-100 text-xs mb-4">Run a full recursive scan of your test suite.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* TAB 3: POLYGLOT BRIDGE */}
          <TabsContent value="polyglot" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <Card className="bg-zinc-950 border-zinc-800">
              <CardHeader>
                <CardTitle>Language Migration Engine</CardTitle>
                <CardDescription>Upgrading legacy testing logic to modern standards.</CardDescription>
              </CardHeader>
              <CardContent>
                <PolyglotBridge 
                  fromLang="JS" 
                  toLang="TS" 
                  progress={82} 
                  status="Injecting type definitions..." 
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}