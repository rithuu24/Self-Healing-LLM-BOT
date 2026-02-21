import React, { useState, useEffect } from "react";
import { 
  Terminal, Sparkles, BarChart3, Globe2, 
  ShieldCheck, Activity, Zap, Wrench, Home as HomeIcon 
} from "lucide-react";

// shadcn components
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Custom components
import { AnimatedLogStream } from "@/components/ui/AnimatedLogStream";
import { CodeComparison } from "@/components/ui/CodeComparison";
import { PolyglotBridge } from "@/components/ui/PolyglotBridge";
import { CodeHealer } from "@/components/ui/CodeHealer";
import { Analytics } from "@/components/ui/Analytics";
import { Home } from "@/components/ui/Home";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
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
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans p-4 md:p-8 selection:bg-cyan-500/30">
      
      {/* HEADER SECTION */}
      <header className="max-w-6xl mx-auto mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5 cursor-pointer group" onClick={() => setActiveTab("home")}>
          <div className="p-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/20 shadow-[0_0_25px_rgba(6,182,212,0.15)] group-hover:border-cyan-400 transition-colors">
            <ShieldCheck className="w-10 h-10 text-cyan-500" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tighter bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">
              GUARDIAN V2
            </h1>
            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.3em]">Self-Healing QA Engine</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/5 px-4 py-1.5 animate-pulse rounded-full text-[10px] tracking-widest font-bold">
            <Activity className="w-3 h-3 mr-2" /> SYSTEM_ACTIVE
          </Badge>
          <div className="h-10 w-[1px] bg-zinc-800 mx-2 hidden md:block" />
          <Button className="btn-highlight bg-zinc-900 border border-zinc-800 hover:border-cyan-500/50 text-zinc-400 hover:text-cyan-400 transition-all duration-300 shadow-xl h-10">
            <Zap className="w-4 h-4 mr-2" /> Manual Scan
          </Button>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-6xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          
          {/* TACTICAL NAVIGATION */}
          <TabsList className="bg-zinc-900/40 border border-zinc-800/50 p-1.5 rounded-xl backdrop-blur-md shadow-2xl flex w-full max-w-4xl mx-auto overflow-x-auto no-scrollbar">
            {[
              { id: "home", label: "Home", icon: <HomeIcon className="w-3.5 h-3.5" /> },
              { id: "optimizer", label: "Optimizer", icon: <Sparkles className="w-3.5 h-3.5" /> },
              { id: "analytics", label: "Analytics", icon: <BarChart3 className="w-3.5 h-3.5" /> },
              { id: "healer", label: "Healer", icon: <Wrench className="w-3.5 h-3.5" /> },
              { id: "polyglot", label: "Polyglot", icon: <Globe2 className="w-3.5 h-3.5" /> },
            ].map((tab) => (
              <TabsTrigger 
                key={tab.id}
                value={tab.id} 
                className="flex-1 relative px-4 py-2.5 gap-2.5 rounded-lg transition-all duration-300
                           data-[state=active]:bg-cyan-500/10 
                           data-[state=active]:text-cyan-400 
                           data-[state=active]:shadow-[0_0_20px_rgba(6,182,212,0.1)]
                           data-[state=active]:border-cyan-500/20
                           border border-transparent
                           text-zinc-500 hover:text-zinc-300"
              >
                {tab.icon}
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* TAB 0: HOME PAGE */}
          <TabsContent value="home" className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Home onNavigate={(target) => setActiveTab(target)} />
          </TabsContent>

          {/* TAB 1: OPTIMIZER */}
          <TabsContent value="optimizer" className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Card className="bg-zinc-950 border-zinc-800 shadow-2xl">
              <CardHeader className="border-b border-zinc-900 pb-8">
                <CardTitle className="text-xl font-bold tracking-tight">Logic Visualization</CardTitle>
                <CardDescription className="text-zinc-500">LLM-driven repair operations on stale unit test selectors.</CardDescription>
              </CardHeader>
              <CardContent className="pt-8">
                <CodeComparison 
                  oldCode={`expect(await page.innerText('button#login-btn')).toBe('Sign In')`}
                  newCode={`expect(await page.locator('button[data-testid="submit-login"]')).toBe('Login Now')`}
                  explanation="The ID selector became stale due to a UI refactor. Guardian auto-identified the new data-testid attribute."
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 2: ANALYTICS */}
          <TabsContent value="analytics" className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
            <Analytics />
            <Card className="bg-zinc-950 border-zinc-800 overflow-hidden">
              <CardHeader className="bg-zinc-900/30 border-b border-zinc-900 py-4">
                <CardTitle className="flex items-center gap-3 text-sm font-mono uppercase tracking-widest">
                  <Terminal className="w-4 h-4 text-cyan-500" /> Execution Stream
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <AnimatedLogStream logs={logs} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 3: HEALER */}
          <TabsContent value="healer" className="animate-in fade-in slide-in-from-bottom-4 duration-700">
             <CodeHealer />
          </TabsContent>

          {/* TAB 4: POLYGLOT */}
          <TabsContent value="polyglot" className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Card className="bg-zinc-950 border-zinc-800 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Migration Bridge</CardTitle>
                <CardDescription className="text-zinc-500 text-xs">Transforming legacy syntax into modern, type-safe standards.</CardDescription>
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

      {/* FOOTER */}
      <footer className="max-w-6xl mx-auto mt-20 pb-10 border-t border-zinc-900 pt-8 flex justify-between items-center opacity-40 hover:opacity-100 transition-opacity">
        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500">Guardian Protocol v2.0.4-Alpha</p>
        <div className="flex gap-6 text-[10px] font-mono text-zinc-500">
          <span>LATENCY: 142MS</span>
          <span>UPTIME: 99.9%</span>
        </div>
      </footer>
    </div>
  );
}