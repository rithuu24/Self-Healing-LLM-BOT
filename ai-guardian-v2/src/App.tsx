import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, User, LogOut, Settings, ChevronDown, CreditCard, 
  Sparkles, BarChart3, Globe2, Wrench, Home as HomeIcon, Terminal, Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// shadcn UI Components
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

// Research Modules & Custom Components
import { Home } from "@/components/ui/Home";
import { SignInModal } from "@/components/ui/SignInModal";
import { Analytics } from "@/components/ui/Analytics";
import { CodeHealer } from "@/components/ui/CodeHealer";
import { AnimatedLogStream } from "@/components/ui/AnimatedLogStream";
import { CodeComparison } from "@/components/ui/CodeComparison";
import { PolyglotBridge } from "@/components/ui/PolyglotBridge";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);

  // 1. Live Telemetry Simulation logic
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
      
      {/* GLOBAL HEADER SECTION */}
      <header className="max-w-6xl mx-auto mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div 
          className="flex items-center gap-5 cursor-pointer group" 
          onClick={() => setActiveTab("home")}
          aria-label="Navigate to Home"
        >
          <div className="p-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/20 shadow-[0_0_25px_rgba(6,182,212,0.15)] group-hover:border-cyan-400 transition-colors">
            <ShieldCheck className="w-10 h-10 text-cyan-500" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tighter bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent uppercase">
              Guardian V2
            </h1>
            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.3em]">Neural QA Engine</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 relative">
          {!isLoggedIn ? (
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                onClick={() => setShowLoginModal(true)} 
                className="text-zinc-400 hover:text-white font-bold px-6 h-10 rounded-xl transition-all"
              >
                Login
              </Button>
              <div className="h-6 w-[1px] bg-zinc-800 hidden md:block" />
              <Button 
                onClick={() => setShowLoginModal(true)} 
                className="bg-zinc-100 hover:bg-white text-black font-bold px-6 h-10 rounded-xl shadow-lg transition-all active:scale-95"
              >
                Sign Up
              </Button>
            </div>
          ) : (
            <div className="relative">
              {/* Profile Trigger (The Drag Box Trigger) */}
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)} 
                aria-label="Open User Menu"
                title="Account Settings"
                className="flex items-center gap-3 p-1.5 pr-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-all group"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/10">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-[11px] font-bold text-zinc-200 leading-none">Admin_User</p>
                  <p className="text-[9px] font-mono text-zinc-500 uppercase mt-0.5 tracking-tighter">Tier: Enterprise</p>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-zinc-500 transition-transform duration-300 ${showProfileMenu ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showProfileMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)} />
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }} 
                      animate={{ opacity: 1, y: 0, scale: 1 }} 
                      exit={{ opacity: 0, y: 10, scale: 0.95 }} 
                      className="absolute right-0 mt-3 w-56 bg-[#0c0c0e] border border-zinc-800 rounded-2xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl"
                    >
                      <div className="p-4 border-b border-zinc-800/50 bg-zinc-900/20">
                        <p className="text-xs font-bold text-zinc-100">User Settings</p>
                        <p className="text-[10px] text-zinc-500 font-mono">ID: 882-QX-4</p>
                      </div>
                      <div className="p-2">
                        <MenuButton icon={<User className="w-4 h-4" />} label="Profile" />
                        <MenuButton icon={<CreditCard className="w-4 h-4" />} label="Billing" />
                        <MenuButton icon={<Settings className="w-4 h-4" />} label="System Config" />
                      </div>
                      <div className="p-2 border-t border-zinc-800/50 bg-zinc-900/10">
                        <button 
                          onClick={() => { setIsLoggedIn(false); setShowProfileMenu(false); }} 
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-all font-bold text-xs"
                        >
                          <LogOut className="w-4 h-4" /> Log out
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </header>

      {/* TACTICAL NAVIGATION & MAIN CONTENT */}
      <main className="max-w-6xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          
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
                className="flex-1 relative px-4 py-2.5 gap-2.5 rounded-lg transition-all 
                           data-[state=active]:bg-cyan-500/10 
                           data-[state=active]:text-cyan-400 
                           data-[state=active]:shadow-[0_0_20px_rgba(6,182,212,0.1)]
                           data-[state=active]:border-cyan-500/20
                           border border-transparent 
                           text-zinc-500 uppercase text-[10px] font-bold tracking-widest"
              >
                {tab.icon} {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="home" className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Home onNavigate={(target) => setActiveTab(target)} />
          </TabsContent>

          <TabsContent value="optimizer" className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Card className="bg-zinc-950 border-zinc-800 shadow-2xl">
              <CardHeader className="border-b border-zinc-900 pb-8">
                <CardTitle className="text-xl font-bold text-white tracking-tight flex items-center gap-3">
                  <Zap className="w-5 h-5 text-amber-400" /> Logic Visualization
                </CardTitle>
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

          <TabsContent value="analytics" className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
            <Analytics />
            <Card className="bg-zinc-950 border-zinc-800 overflow-hidden">
              <CardHeader className="bg-zinc-900/30 border-b border-zinc-900 py-4">
                <CardTitle className="flex items-center gap-3 text-sm font-mono uppercase tracking-widest text-white">
                  <Terminal className="w-4 h-4 text-cyan-500" /> Execution Stream
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <AnimatedLogStream logs={logs} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="healer" className="animate-in fade-in slide-in-from-bottom-4 duration-700">
             <CodeHealer />
          </TabsContent>

          <TabsContent value="polyglot" className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Card className="bg-zinc-950 border-zinc-800 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white tracking-tight flex items-center gap-3">
                  <Globe2 className="w-5 h-5 text-cyan-400" /> Migration Bridge
                </CardTitle>
                <CardDescription className="text-zinc-500 text-xs">Transforming legacy syntax into modern standards.</CardDescription>
              </CardHeader>
              <CardContent>
                <PolyglotBridge />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* GLOBAL MODALS */}
      <AnimatePresence>
        {showLoginModal && (
          <SignInModal 
            onClose={() => setShowLoginModal(false)} 
            onSuccess={() => { 
              setIsLoggedIn(true); 
              setShowLoginModal(false); 
            }} 
          />
        )}
      </AnimatePresence>

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

// Helper component for dropdown items
function MenuButton({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <button 
      title={label}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-zinc-400 hover:bg-zinc-800/50 hover:text-cyan-400 transition-all text-xs font-bold"
    >
      <div className="text-current" aria-hidden="true">{icon}</div>
      <span className="text-xs">{label}</span>
    </button>
  );
}