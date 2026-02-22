import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe2, ArrowRight, Code2, Cpu, 
  ChevronDown, Check, Copy
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

type SupportedLang = "Python" | "Java" | "TypeScript" | "JavaScript";

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

const LANGUAGES: SupportedLang[] = ["Python", "Java", "TypeScript", "JavaScript"];

export function PolyglotBridge() {
  const [sourceLang, setSourceLang] = useState<SupportedLang>("Python");
  const [targetLang, setTargetLang] = useState<SupportedLang>("TypeScript");
  const [isTranslating, setIsTranslating] = useState(false);
  const [progress, setProgress] = useState<number>(100);
  const [copied, setCopied] = useState(false);

  const handleLangChange = (type: 'source' | 'target', val: SupportedLang) => {
    if ((type === 'source' && val === sourceLang) || 
        (type === 'target' && val === targetLang)) return;

    if (type === 'source') setSourceLang(val);
    else setTargetLang(val);

    setIsTranslating(true);
    setProgress(0);
  };

  const handleCopy = () => {
    const code = getMockCode(targetLang);
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    if (isTranslating) {
      const timeout = setTimeout(() => setProgress(100), 50);
      const endTimeout = setTimeout(() => setIsTranslating(false), 1200);

      return () => {
        clearTimeout(timeout);
        clearTimeout(endTimeout);
      };
    }
  }, [isTranslating, sourceLang, targetLang]);

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
              System Engine v4.0
            </Badge>

            <div className="flex items-center gap-2">
              <div 
                className={`w-2 h-2 rounded-full 
                ${isTranslating ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'}`} 
              />
              <span className="text-xs font-mono font-medium text-zinc-200">
                {isTranslating ? "SYNTAX_RESTRUCTURING..." : "INTEROP_READY"}
              </span>
            </div>
          </div>
        </div>

        {/* PROGRESSBAR */}
        <div className="mt-8 relative h-1.5 bg-zinc-900 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: "100%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: isTranslating ? 1.2 : 0, ease: "circOut" }}
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-600 to-cyan-400"
          />
        </div>
      </div>

      {/* CODE VIEWPORT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatePresence mode="wait">
          <motion.div 
            key={`source-${sourceLang}`}
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            <div className="px-2">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                {sourceLang} Input
              </span>
            </div>
            <div className="bg-zinc-950/50 border border-zinc-900 rounded-2xl p-6 font-mono text-[13px] text-zinc-400 min-h-[180px]">
              <pre><code>{getMockCode(sourceLang)}</code></pre>
            </div>
          </motion.div>

          <motion.div 
            key={`target-${targetLang}`}
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -10 }}
            transition={{ delay: 0.1 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between px-2">
              <span className="text-[10px] font-mono text-cyan-500 uppercase tracking-widest">
                {targetLang} Optimized
              </span>
              <button 
                type="button"
                title={copied ? "Code copied" : "Copy code"}
                onClick={handleCopy}
                className="text-zinc-600 hover:text-cyan-400 p-1 rounded focus:ring-1 focus:ring-cyan-500"
              >
                {copied 
                  ? <Check className="w-3.5 h-3.5 text-emerald-500" /> 
                  : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="bg-[#0c0c0e] border border-cyan-500/20 rounded-2xl p-6 font-mono text-[13px] text-cyan-50/90 min-h-[180px]">
              <pre><code>{getMockCode(targetLang)}</code></pre>
            </div>
          </motion.div>
        </AnimatePresence>
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
          value={targetLang === "TypeScript" || targetLang === "Java" ? "Strict" : "Inferred"} 
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
        <ChevronDown className={`w-4 h-4 ${open ? 'rotate-180' : ''}`} />
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
              className="absolute left-0 right-0 mt-2 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl z-50 p-1"
            >
              <ul className="list-none m-0 p-0">
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
                    className={`flex items-center justify-between px-3 py-2 text-xs font-mono rounded-lg cursor-pointer outline-none focus:bg-zinc-800
                    ${current === lang 
                      ? 'bg-cyan-500/20 text-cyan-400' 
                      : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'}`}
                  >
                    {lang}
                    {current === lang && <Check className="w-3.5 h-3.5 inline ml-2" />}
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
    Python: `def handle_click(user_id):
    btn = driver.find_element(user_id)
    btn.click()
    return True`,

    Java: `public boolean handleClick(String userId) {
    WebElement btn = driver.findElement(By.id(userId));
    btn.click();
    return true;
}`,

    TypeScript: `async function handleClick(userId: string): Promise<boolean> {
    const btn = await page.locator(\`#\${userId}\`);
    await btn.click();
    return true;
}`,

    JavaScript: `const handleClick = async (userId) => {
    const btn = document.getElementById(userId);
    btn?.click();
    return true;
};`
  };

  return snippets[lang];
}