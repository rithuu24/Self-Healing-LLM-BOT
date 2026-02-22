import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, Mail, ChevronRight, X, ShieldCheck, 
  Fingerprint, User, ShieldAlert, AtSign, Database, CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SignInModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function SignInModal({ onClose, onSuccess }: SignInModalProps) {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [step, setStep] = useState<"input" | "scanning">("input");
  
  // Form States
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Strength Logic
  const getStrength = (pass: string) => {
    let s = 0;
    if (pass.length > 7) s++;
    if (pass.match(/[A-Z]/)) s++;
    if (pass.match(/[0-9]/)) s++;
    if (pass.match(/[^A-Za-z0-9]/)) s++;
    return s;
  };

  const strength = getStrength(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  const strengthConfig = [
    { color: "bg-zinc-800", label: "Weak" },
    { color: "bg-rose-500", label: "Vulnerable" },
    { color: "bg-amber-500", label: "Scanning" },
    { color: "bg-emerald-500", label: "Secure" },
    { color: "bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]", label: "Neural Grade" },
  ];

  const handleAction = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("scanning");
    setTimeout(() => onSuccess(), 2800);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/90 backdrop-blur-md" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 30 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        exit={{ opacity: 0, scale: 0.9, y: 30 }} 
        className="relative w-full max-w-lg bg-[#0c0c0e] border border-zinc-800 rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,1)] overflow-hidden"
      >
        <div className="h-1.5 w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />
        
        <button onClick={onClose} aria-label="Close Terminal" className="absolute top-8 right-8 p-2 rounded-full hover:bg-zinc-900 text-zinc-600 transition-all z-20">
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 md:p-12">
          {/* TAB SWITCHER */}
          <div className="flex bg-zinc-900/50 p-1 rounded-2xl border border-zinc-800/50 mb-10 w-fit mx-auto">
            {["login", "signup"].map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab as any); setStep("input"); }}
                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === tab ? "bg-cyan-500/10 text-cyan-400 shadow-sm" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {tab === "login" ? "Login" : "Create Account"}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === "input" ? (
              <motion.form key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} onSubmit={handleAction} className="space-y-5">
                <header className="text-center mb-6">
                   <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
                     {activeTab === "login" ? "Guardian V2" : "Guardian Enrollment"}
                   </h2>
                </header>

                <div className="space-y-4">
                  {activeTab === "signup" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-zinc-600 uppercase ml-1">Full Name</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-700" />
                          <input type="text" required placeholder="John Doe" className="input-field" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-zinc-600 uppercase ml-1">Email Address</label>
                        <div className="relative">
                          <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-700" />
                          <input type="email" required placeholder="name@domain.com" className="input-field" />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-zinc-600 uppercase ml-1">Access ID</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-700" />
                      <input type="text" required placeholder="neural_id_772" className="input-field pl-12" />
                    </div>
                  </div>

                  <div className={`grid gap-4 ${activeTab === "signup" ? "md:grid-cols-2" : "grid-cols-1"}`}>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-zinc-600 uppercase ml-1">Secure Cipher</label>
                      <div className="relative">
                        <ShieldCheck className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${strength >= 3 ? 'text-emerald-500' : 'text-zinc-700'}`} />
                        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="input-field pl-12" />
                      </div>
                      
                      {activeTab === "signup" && password.length > 0 && (
                        <div className="px-1 pt-2 space-y-2">
                          <div className="flex gap-1 h-1">
                            {[1, 2, 3, 4].map((s) => (
                              <div key={s} className={`flex-1 rounded-full transition-all duration-500 ${strength >= s ? strengthConfig[strength].color : "bg-zinc-900"}`} />
                            ))}
                          </div>
                          <p className="text-[8px] font-mono uppercase text-zinc-500 tracking-tighter">Strength: {strengthConfig[strength].label}</p>
                        </div>
                      )}
                    </div>

                    {activeTab === "signup" && (
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-zinc-600 uppercase ml-1">Confirm Cipher</label>
                        <div className="relative">
                          <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${passwordsMatch ? 'text-cyan-400' : 'text-zinc-700'}`} />
                          <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" className={`input-field pl-12 transition-all ${passwordsMatch ? 'border-cyan-500/40 bg-cyan-500/5' : ''}`} />
                          {passwordsMatch && <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 text-cyan-400" />}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <Button type="submit" className="w-full h-14 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] mt-4">
                  {activeTab === "login" ? "Request Access" : "Initialize Enrollment"} <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.form>
            ) : (
              <motion.div key="scan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12 flex flex-col items-center space-y-8">
                <Fingerprint className="w-20 h-20 text-cyan-500 animate-pulse" />
                <div className="text-center">
                  <p className="text-sm font-mono text-zinc-200 uppercase tracking-[0.2em]">Processing Neural Signature...</p>
                  <div className="w-48 h-1 bg-zinc-900 rounded-full mt-4 overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 2.8 }} className="h-full bg-cyan-500" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <style>{`
        .input-field {
          width: 100%; background: rgba(24, 24, 27, 0.3); border: 1px solid #27272a; border-radius: 1rem;
          padding: 0.875rem 1rem 0.875rem 2.5rem; font-size: 0.875rem; color: #e4e4e7; outline: none; transition: all 0.2s;
        }
        .input-field:focus { border-color: rgba(6, 182, 212, 0.4); background: rgba(24, 24, 27, 0.6); }
        .input-field.pl-12 { padding-left: 3rem; }
      `}</style>
    </div>
  );
}