import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe2, ArrowRight, Code2, Cpu, 
  ChevronDown, Check, Copy, Sparkles
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

type SupportedLang = "Python" | "Java" | "TypeScript" | "JavaScript" | "C++" | "C#" | "Go" | "Rust";

interface LangSelectorProps {
  label: string;
  current: SupportedLang;
  onSelect: (val: SupportedLang) => void;
  highlight?: boolean;
}

interface MetricProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const LANGUAGES: SupportedLang[] = ["Python", "Java", "TypeScript", "JavaScript", "C++", "C#", "Go", "Rust"];

export function PolyglotBridge() {
  const [sourceLang, setSourceLang] = useState<SupportedLang>("Python");
  const [targetLang, setTargetLang] = useState<SupportedLang>("TypeScript");
  
  const [sourceCode, setSourceCode] = useState<string>(getMockCode("Python"));
  const [targetCode, setTargetCode] = useState<string>("// Awaiting translation...");
  
  const [isTranslating, setIsTranslating] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [copied, setCopied] = useState(false);

  const handleLangChange = (type: 'source' | 'target', val: SupportedLang) => {
    if ((type === 'source' && val === sourceLang) || 
        (type === 'target' && val === targetLang)) return;

    if (type === 'source') {
        setSourceLang(val);
        setSourceCode(getMockCode(val)); 
    } else {
        setTargetLang(val);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(targetCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const runTranslation = () => {
    if (!sourceCode.trim()) return;
    setIsTranslating(true);
    setProgress(30);
  };

  useEffect(() => {
    if (isTranslating) {
      let isMounted = true;

      const fetchTranslation = async () => {
        try {
          setTimeout(() => { if (isMounted) setProgress(60); }, 300);

          const response = await fetch("http://127.0.0.1:8000/api/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              source_language: sourceLang,
              target_language: targetLang,
              source_code: sourceCode
            })
          });

          if (response.ok && isMounted) {
            const data = await response.json();
            setTargetCode(data.translated_code);
            setProgress(100);
          } else {
            throw new Error(`Server returned ${response.status}`);
          }
        } catch (error) {
          if (isMounted) {
            setTargetCode(`// ❌ Error: Could not connect to local AI server.\n// Make sure uvicorn is running on port 8000.\n\n/* Here is what the target structure should look like: */\n${getMockCode(targetLang)}`);
            setProgress(100);
          }
        } finally {
          if (isMounted) {
            setTimeout(() => {
              setIsTranslating(false);
              setProgress(0); 
            }, 800);
          }
        }
      };

      fetchTranslation();

      return () => { isMounted = false; };
    }
  }, [isTranslating, sourceLang, targetLang, sourceCode]);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* CONTROL CENTER */}
      <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <LangSelector 
              label="Source Logic" 
              current={sourceLang} 
              onSelect={(val) => handleLangChange('source', val)} 
            />
            
            <div className="hidden md:flex p-2 rounded-full bg-zinc-900 border border-zinc-800">
              <ArrowRight 
                className={`w-4 h-4 text-zinc-500 transition-all duration-500 
                ${isTranslating ? 'translate-x-2 opacity-0' : 'opacity-100'}`} 
              />
            </div>

            <LangSelector 
              label="Target Architecture" 
              current={targetLang} 
              onSelect={(val) => handleLangChange('target', val)}
              highlight 
            />
          </div>

          <div className="flex flex-col items-end gap-2">
            <Badge 
              variant="outline" 
              className="bg-zinc-900/50 border-zinc-800 text-[10px] uppercase tracking-widest text-zinc-400"
            >
              Local RTX 2050 Engine
            </Badge>

            <div className="flex items-center gap-2">
              <div 
                className={`w-2 h-2 rounded-full 
                ${isTranslating ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'}`} 
              />
              <span className="text-xs font-mono font-medium text-zinc-200">
                {isTranslating ? "RESTRUCTURING_SYNTAX..." : "INTEROP_READY"}
              </span>
            </div>
          </div>
        </div>

        {/* PROGRESSBAR */}
        <div className="mt-8 relative h-1.5 bg-zinc-900 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-600 to-cyan-400"
          />
        </div>
      </div>

      {/* CODE VIEWPORT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* EDITABLE SOURCE SIDE */}
        <motion.div 
          key="source-panel"
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="space-y-3 flex flex-col"
        >
          <div className="flex justify-between items-center px-2">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
              {sourceLang} Input (Editable)
            </span>
            <button 
              onClick={runTranslation}
              disabled={isTranslating}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-zinc-900 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {isTranslating ? "Translating..." : "Translate via AI"}
            </button>
          </div>
          
          <div className="bg-zinc-950/50 border border-zinc-900 focus-within:border-zinc-700 transition-colors rounded-2xl p-6 min-h-[220px] flex-grow shadow-inner">
            <textarea 
              value={sourceCode}
              onChange={(e) => setSourceCode(e.target.value)}
              spellCheck={false}
              className="w-full h-full min-h-[180px] bg-transparent resize-none outline-none font-mono text-[13px] text-zinc-300 leading-relaxed"
              placeholder={`Paste your ${sourceLang} code here...`}
            />
          </div>
        </motion.div>

        {/* READ-ONLY TARGET SIDE */}
        <motion.div 
          key="target-panel"
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="space-y-3 flex flex-col"
        >
          <div className="flex items-center justify-between px-2">
            <span className="text-[10px] font-mono text-cyan-500 uppercase tracking-widest">
              {targetLang} Optimized
            </span>
            <button 
              type="button"
              title={copied ? "Code copied" : "Copy code"}
              onClick={handleCopy}
              className="text-zinc-500 hover:text-cyan-400 p-1.5 rounded focus:ring-1 focus:ring-cyan-500 transition-colors"
            >
              {copied 
                ? <Check className="w-4 h-4 text-emerald-500" /> 
                : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <div className="bg-[#0c0c0e] border border-cyan-500/20 rounded-2xl p-6 font-mono text-[13px] text-cyan-50/90 min-h-[220px] flex-grow overflow-auto">
            <pre className="whitespace-pre-wrap"><code>{targetCode}</code></pre>
          </div>
        </motion.div>

      </div>

      {/* METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <OptimizationMetric 
          icon={<Cpu className="w-4 h-4 text-amber-500" />} 
          label="Logic Mapping" 
          value={sourceLang === targetLang ? "Direct" : "Symbolic"} 
        />
        <OptimizationMetric 
          icon={<Globe2 className="w-4 h-4 text-emerald-500" />} 
          label="Cross-Runtime" 
          value="Native" 
        />
        <OptimizationMetric 
          icon={<Code2 className="w-4 h-4 text-cyan-500" />} 
          label="Type Safety" 
          value={targetLang === "TypeScript" || targetLang === "Java" || targetLang === "C++" || targetLang === "C#" || targetLang === "Rust" || targetLang === "Go" ? "Strict" : "Inferred"} 
        />
      </div>
    </div>
  );
}

/* ---------- SUB COMPONENTS ---------- */

function LangSelector({ label, current, onSelect, highlight = false }: LangSelectorProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <p className="text-[10px] font-bold text-zinc-600 uppercase mb-2 ml-1">
        {label}
      </p>
      
      <button 
        type="button"
        onClick={() => setOpen(prev => !prev)}
        className={`flex items-center justify-between gap-4 px-4 py-2.5 rounded-xl border min-w-[160px] transition-colors
        ${highlight 
          ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' 
          : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700'}`}
      >
        <span className="text-xs font-bold font-mono">{current}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setOpen(false)} 
            />
            
            <motion.div 
              initial={{ opacity: 0, y: 8 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: 8 }}
              className="absolute left-0 right-0 mt-2 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl z-50 p-1.5"
            >
              {/* MAGIC LINE FOR THE CUSTOM SCROLLBAR */}
              <ul className="list-none m-0 p-0 max-h-56 overflow-y-auto overflow-x-hidden pr-1
                [&::-webkit-scrollbar]:w-1.5
                [&::-webkit-scrollbar-track]:bg-transparent
                [&::-webkit-scrollbar-thumb]:bg-zinc-700
                [&::-webkit-scrollbar-thumb]:rounded-full
                hover:[&::-webkit-scrollbar-thumb]:bg-zinc-600"
              >
                {LANGUAGES.map((lang) => (
                  <li
                    key={lang}
                    tabIndex={0}
                    onClick={() => { onSelect(lang); setOpen(false); }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        onSelect(lang);
                        setOpen(false);
                      }
                    }}
                    className={`flex items-center justify-between px-3 py-2.5 mb-1 text-xs font-mono rounded-lg cursor-pointer outline-none focus:bg-zinc-800 transition-colors
                    ${current === lang 
                      ? 'bg-cyan-500/10 text-cyan-400 font-bold' 
                      : 'text-zinc-400 hover:bg-zinc-800/80 hover:text-zinc-200'}`}
                  >
                    {lang}
                    {current === lang && <Check className="w-3.5 h-3.5 inline ml-2 text-cyan-400" />}
                  </li>
                ))}
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function OptimizationMetric({ icon, label, value }: MetricProps) {
  return (
    <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-900 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-zinc-900 rounded-xl">{icon}</div>
        <span className="text-[10px] font-bold text-zinc-500 uppercase">
          {label}
        </span>
      </div>
      <span className="text-xs font-mono font-bold text-zinc-200">
        {value}
      </span>
    </div>
  );
}

function getMockCode(lang: SupportedLang) {
  const snippets: Record<SupportedLang, string> = {
    Python: `def handle_click(user_id):\n    btn = driver.find_element(user_id)\n    btn.click()\n    return True`,
    Java: `public boolean handleClick(String userId) {\n    WebElement btn = driver.findElement(By.id(userId));\n    btn.click();\n    return true;\n}`,
    TypeScript: `async function handleClick(userId: string): Promise<boolean> {\n    const btn = await page.locator(\`#\${userId}\`);\n    await btn.click();\n    return true;\n}`,
    JavaScript: `const handleClick = async (userId) => {\n    const btn = document.getElementById(userId);\n    btn?.click();\n    return true;\n};`,
    "C++": `bool handleClick(std::string userId) {\n    auto btn = driver.findElement(By::id(userId));\n    btn.click();\n    return true;\n}`,
    "C#": `public bool HandleClick(string userId) {\n    var btn = driver.FindElement(By.Id(userId));\n    btn.Click();\n    return true;\n}`,
    Go: `func handleClick(userId string) bool {\n    btn := driver.FindElement(by.ID(userId))\n    btn.Click()\n    return true\n}`,
    Rust: `fn handle_click(user_id: &str) -> bool {\n    let btn = driver.find_element(By::Id(user_id));\n    btn.click();\n    true\n}`
  };

  return snippets[lang];
}