import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, User, LogOut, Settings, ChevronDown, CreditCard, 
  Sparkles, BarChart3, Globe2, Wrench, Home as HomeIcon, Zap,
  Activity, Cpu, X, Edit3, Mail, ChevronRight, Calendar, MapPin,
  Github, Key, Lock, Save, ShieldAlert
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// shadcn UI Components
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

// Research Modules & Custom Components
import { Home } from "@/components/ui/Home";
import { SignInModal } from "@/components/ui/SignInModal";
import {Analytics }from "@/components/ui/Analytics";
import { CodeHealer } from "@/components/ui/CodeHealer";
import { CodeComparison } from "@/components/ui/CodeComparison";
import { PolyglotBridge } from "@/components/ui/PolyglotBridge";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [profileSubTab, setProfileSubTab] = useState("overview"); // <-- Tracks the active profile view
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);

  // Live Telemetry Simulation logic
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

  // NEW: Smart Navigation Handler for Profile Menu
  const handleProfileNav = (subTab: string) => {
    setProfileSubTab(subTab);
    setActiveTab("profile");
    setShowProfileMenu(false);
  };

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
            <div>
              {/* Profile Trigger Button */}
              <button 
                onClick={() => setShowProfileMenu(true)} 
                aria-label="Open User Menu"
                className="flex items-center gap-3 p-1.5 pr-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-all group"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-[11px] font-bold text-zinc-200 leading-none">Admin_User</p>
                  <p className="text-[9px] font-mono text-cyan-500 uppercase mt-0.5 tracking-tighter">Pro Plan</p>
                </div>
              </button>

              {/* SLIDE-OUT PROFILE SIDEBAR */}
              <AnimatePresence>
                {showProfileMenu && (
                  <>
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" 
                      onClick={() => setShowProfileMenu(false)} 
                    />
                    
                    <motion.div 
                      initial={{ x: "100%" }} 
                      animate={{ x: 0 }} 
                      exit={{ x: "100%" }} 
                      transition={{ type: "spring", damping: 25, stiffness: 200 }}
                      className="fixed top-0 right-0 h-full w-full max-w-sm bg-[#09090b] border-l border-zinc-800 shadow-2xl z-50 flex flex-col"
                    >
                      <div className="flex items-center justify-between p-6 border-b border-zinc-800/50">
                        <h2 className="text-lg font-bold text-zinc-100 tracking-tight">Account</h2>
                        <button 
                          onClick={() => setShowProfileMenu(false)} 
                          className="p-2 bg-zinc-900 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 hover:text-white"
                          title="Close menu"
                          aria-label="Close menu"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="p-6 border-b border-zinc-800/50 bg-zinc-900/20">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 shrink-0">
                            <User className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-white">Admin_User</h3>
                            <p className="text-xs text-zinc-400 flex items-center gap-1.5 mt-1">
                              <Mail className="w-3 h-3" /> admin@guardian.dev
                            </p>
                            <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                              Pro Plan
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Menu Options - Wired to handleProfileNav */}
                      <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        <p className="px-3 text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-2 mt-2">Manage</p>
                        <DrawerMenuButton 
                          icon={<User />} title="Account Profile" subtitle="View your public profile & stats" 
                          onClick={() => handleProfileNav("overview")} 
                        />
                        <DrawerMenuButton 
                          icon={<Edit3 />} title="Edit Profile" subtitle="Change name, avatar & bio" 
                          onClick={() => handleProfileNav("edit")} 
                        />
                        <DrawerMenuButton 
                          icon={<Settings />} title="Profile Settings" subtitle="Passwords & security" 
                          onClick={() => handleProfileNav("settings")} 
                        />
                        
                        <p className="px-3 text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-2 mt-6">Billing</p>
                        <DrawerMenuButton 
                          icon={<CreditCard />} title="Subscription" subtitle="Manage payment methods" 
                          onClick={() => handleProfileNav("overview")} 
                        />
                      </div>

                      <div className="p-6 border-t border-zinc-800/50 bg-zinc-950">
                        <button 
                          onClick={() => { setIsLoggedIn(false); setShowProfileMenu(false); setActiveTab("home"); }} 
                          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all font-bold text-sm shadow-lg shadow-rose-500/5"
                        >
                          <LogOut className="w-4 h-4" /> Sign Out
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

          <TabsContent value="analytics" className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-6">
            <Analytics logs={logs} />
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

          {/* HIDDEN TAB: ACCOUNT PROFILE (Now passes the subTab state down) */}
          <TabsContent value="profile" className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <ProfileView currentTab={profileSubTab} onTabChange={setProfileSubTab} />
          </TabsContent>

        </Tabs>
      </main>

      {/* GLOBAL MODALS & FOOTER */}
      <AnimatePresence>
        {showLoginModal && (
          <SignInModal 
            onClose={() => setShowLoginModal(false)} 
            onSuccess={() => { setIsLoggedIn(true); setShowLoginModal(false); }} 
          />
        )}
      </AnimatePresence>

      <footer className="max-w-6xl mx-auto mt-20 pb-10 border-t border-zinc-900 pt-8 flex justify-between items-center opacity-40 hover:opacity-100 transition-opacity">
        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 hidden sm:block">Guardian Protocol v2.0.4-Alpha</p>
        <div className="flex gap-6 text-[10px] font-mono text-zinc-500">
          <span className="flex items-center gap-1.5"><Activity className="w-3 h-3 text-emerald-500" /> LATENCY: 142MS</span>
          <span className="flex items-center gap-1.5"><Cpu className="w-3 h-3 text-cyan-500" /> UPTIME: 99.9%</span>
        </div>
      </footer>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function DrawerMenuButton({ icon, title, subtitle, onClick }: { icon: React.ReactNode, title: string, subtitle: string, onClick?: () => void }) {
  return (
    <button onClick={onClick} className="w-full flex items-center justify-between p-3 rounded-xl border border-transparent hover:border-zinc-800 hover:bg-zinc-900/50 group transition-all text-left">
      <div className="flex items-center gap-4">
        <div className="p-2 rounded-lg bg-zinc-900 text-zinc-400 group-hover:text-cyan-400 group-hover:bg-cyan-500/10 transition-colors">
          {React.cloneElement(icon as React.ReactElement, { className: "w-4 h-4" } as React.HTMLAttributes<SVGElement>)}
        </div>
        <div>
          <p className="text-sm font-bold text-zinc-200 group-hover:text-white transition-colors">{title}</p>
          <p className="text-[10px] text-zinc-500 mt-0.5">{subtitle}</p>
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-cyan-400 transition-colors opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0" />
    </button>
  );
}

// --- UPDATED PROFILE VIEW WITH INTERNAL TABS ---
function ProfileView({ currentTab, onTabChange }: { currentTab: string, onTabChange: (v: string) => void }) {
  return (
    <div className="space-y-8">
      
      {/* Profile Header (Always visible) */}
      <Card className="bg-zinc-950 border-zinc-800 overflow-hidden shadow-2xl relative">
        <div className="h-32 bg-gradient-to-r from-cyan-600 via-blue-700 to-indigo-900 w-full absolute top-0 left-0">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay"></div>
        </div>
        <CardContent className="pt-20 pb-8 px-6 sm:px-10 relative z-10 flex flex-col sm:flex-row items-center sm:items-end gap-6">
          <div className="w-28 h-28 rounded-2xl bg-zinc-900 border-4 border-zinc-950 flex items-center justify-center shadow-xl shrink-0 mt-4 sm:mt-0">
            <User className="w-12 h-12 text-cyan-400" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-3xl font-black text-white tracking-tight">Admin_User</h2>
            <p className="text-sm text-zinc-400 mt-1 flex items-center justify-center sm:justify-start gap-4">
              <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> admin@guardian.dev</span>
              <span className="flex items-center gap-1.5 hidden sm:flex"><MapPin className="w-3.5 h-3.5" /> San Francisco, CA</span>
            </p>
          </div>
        </CardContent>
      </Card>

      <Tabs value={currentTab} onValueChange={onTabChange} className="space-y-6">
        
        {/* Internal Profile Navigation */}
        <TabsList className="bg-zinc-950 border border-zinc-800 p-1.5 rounded-xl w-full sm:w-auto overflow-x-auto no-scrollbar justify-start inline-flex">
          <TabsTrigger value="overview" className="px-6 py-2 text-xs font-bold data-[state=active]:bg-zinc-900 data-[state=active]:text-white text-zinc-400 rounded-lg">Account Profile</TabsTrigger>
          <TabsTrigger value="edit" className="px-6 py-2 text-xs font-bold data-[state=active]:bg-zinc-900 data-[state=active]:text-white text-zinc-400 rounded-lg">Edit Profile</TabsTrigger>
          <TabsTrigger value="settings" className="px-6 py-2 text-xs font-bold data-[state=active]:bg-zinc-900 data-[state=active]:text-white text-zinc-400 rounded-lg">Profile Settings</TabsTrigger>
        </TabsList>

        {/* 1. ACCOUNT PROFILE (Overview) */}
        <TabsContent value="overview" className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-500">
          <div className="space-y-6 md:col-span-1">
            <Card className="bg-zinc-950 border-zinc-800">
              <CardHeader className="border-b border-zinc-900 pb-4">
                <CardTitle className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                  <User className="w-4 h-4 text-cyan-500" /> About Me
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-1">
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Role</p>
                  <p className="text-sm text-zinc-300">Lead QA Automation Engineer</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Joined</p>
                  <p className="text-sm text-zinc-300 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-zinc-500" /> October 24, 2023
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Bio</p>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    Building the future of self-healing test automation. Obsessed with clean code and unbreakable CI/CD pipelines.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6 md:col-span-2">
            <Card className="bg-zinc-950 border-zinc-800">
              <CardHeader className="border-b border-zinc-900 pb-4">
                <CardTitle className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-500" /> Current Plan Usage
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-8">
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-sm font-bold text-zinc-200">AI Code Repairs (Monthly)</p>
                      <p className="text-xs text-zinc-500">892 of 1,000 quota used</p>
                    </div>
                    <span className="text-xs font-mono text-cyan-400">89%</span>
                  </div>
                  <Progress value={89} className="h-2 bg-zinc-900 [&>div]:bg-gradient-to-r [&>div]:from-cyan-600 [&>div]:to-cyan-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 2. EDIT PROFILE */}
        <TabsContent value="edit" className="max-w-3xl animate-in fade-in duration-500">
          <Card className="bg-zinc-950 border-zinc-800">
            <CardHeader className="border-b border-zinc-900 pb-4">
              <CardTitle className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-cyan-500" /> Edit Profile Details
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="displayName" className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Display Name</label>
                  <input id="displayName" type="text" defaultValue="Admin_User" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-cyan-500 transition-colors" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="emailAddress" className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Email Address</label>
                  <input id="emailAddress" type="email" defaultValue="admin@guardian.dev" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-cyan-500 transition-colors" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="jobTitle" className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Role / Job Title</label>
                  <input id="jobTitle" type="text" defaultValue="Lead QA Automation Engineer" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-cyan-500 transition-colors" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="location" className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Location</label>
                  <input id="location" type="text" defaultValue="San Francisco, CA" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-cyan-500 transition-colors" />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="bio" className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Bio</label>
                <textarea id="bio" rows={4} defaultValue="Building the future of self-healing test automation. Obsessed with clean code and unbreakable CI/CD pipelines." className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-zinc-100 focus:outline-none focus:border-cyan-500 transition-colors resize-none" />
              </div>
              <div className="pt-4 flex justify-end">
                <Button className="bg-cyan-600 hover:bg-cyan-500 text-white px-8">
                  <Save className="w-4 h-4 mr-2" /> Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 3. PROFILE SETTINGS (Security) */}
        <TabsContent value="settings" className="max-w-3xl animate-in fade-in duration-500">
          <Card className="bg-zinc-950 border-zinc-800">
            <CardHeader className="border-b border-zinc-900 pb-4">
              <CardTitle className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                <Lock className="w-4 h-4 text-cyan-500" /> Security & Passwords
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-8">
              {/* Change Password */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-zinc-200">Change Password</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="currentPassword" className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Current Password</label>
                    <input id="currentPassword" type="password" placeholder="••••••••" className="w-full md:w-2/3 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-cyan-500 transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="newPassword" className="text-xs font-bold text-zinc-400 uppercase tracking-wider">New Password</label>
                    <input id="newPassword" type="password" placeholder="Enter new password" className="w-full md:w-2/3 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-cyan-500 transition-colors" />
                  </div>
                  <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800">
                    Update Password
                  </Button>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="pt-6 border-t border-zinc-900 space-y-4">
                <h3 className="text-sm font-bold text-rose-500 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4" /> Danger Zone
                </h3>
                <p className="text-xs text-zinc-500">Once you delete your account, there is no going back. Please be certain.</p>
                <Button variant="outline" className="border-rose-500/30 text-rose-500 hover:bg-rose-500/10">
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}