import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
// FIXED: Import AppLayout only once
import AppLayout from '../../layout/AppLayout';
// FIXED: Removed .tsx extension from the import path
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumbs'; 

// --- Card Component for Stats ---
const CardDataStats: React.FC<{
  title: string;
  total: string;
  rate: string;
  levelUp?: boolean;
  levelDown?: boolean;
  children: React.ReactNode;
}> = ({ title, total, rate, levelUp, levelDown, children }) => {
  return (
    <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
        {children}
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <h4 className="text-title-md font-bold text-black dark:text-white">
            {total}
          </h4>
          <span className="text-sm font-medium">{title}</span>
        </div>

        <span className={`flex items-center gap-1 text-sm font-medium ${
          levelUp ? 'text-meta-3' : levelDown ? 'text-meta-1' : ''
        }`}>
          {rate}
          {levelUp && (
            <svg className="fill-meta-3" width="10" height="11" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.35716 2.47737L0.908974 5.82987L5.0443e-07 4.94612L5 0.0848689L10 4.94612L9.09103 5.82987L5.64284 2.47737L5.64284 10.0849L4.35716 10.0849L4.35716 2.47737Z" fill=""/>
            </svg>
          )}
          {levelDown && (
            <svg className="fill-meta-1" width="10" height="11" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5.64284 8.52263L9.09103 5.17013L10 6.05388L5 10.9151L-8.98482e-07 6.05388L0.908973 5.17013L4.35716 8.52263L4.35716 0.915131L5.64284 0.915131L5.64284 8.52263Z" fill=""/>
            </svg>
          )}
        </span>
      </div>
    </div>
  );
};

// --- MAIN DASHBOARD COMPONENT ---
const Home: React.FC = () => {
  const [logs, setLogs] = useState<string[]>(["System Ready. Waiting for command..."]);
  const [loading, setLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [stats, setStats] = useState({ total: 0, passed: 0, healed: 0, failed: 0 });
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // --- 🗣️ VOICE ENGINE ---
  const speak = (text: string) => {
    if (!voiceEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const runHealer = async () => {
    setLoading(true);
    setLogs(["🚀 Connecting to Python Brain...", "⏳ Waiting for AI Analysis..."]);
    speak("Initiating diagnostics. Connecting to neural engine."); 
    
    try {
        const response = await axios.get('http://127.0.0.1:8000/run-healer');
        const newLogs = response.data.logs;
        setLogs((prev) => [...prev, ...newLogs]);

        if (response.data.status === "healed") {
            setStats(s => ({ ...s, healed: s.healed + 1, total: s.total + 1, passed: s.passed + 1 }));
            speak("Fix applied successfully. Saving to long term memory.");
        } else if (response.data.status === "success") {
            setLogs(prev => [...prev, "✅ Code was already correct."]);
            setStats(s => ({ ...s, total: s.total + 1, passed: s.passed + 1 }));
            speak("System healthy. No errors detected.");
        } else {
             setStats(s => ({ ...s, failed: s.failed + 1, total: s.total + 1 }));
             speak("Critical failure. AI could not generate a fix.");
        }
    } catch (error) {
        const errMsg = "Error: Could not connect to Backend.";
        setLogs((prev) => [...prev, "❌ " + errMsg]);
        speak(errMsg);
    }
    setLoading(false);
  };

  const resetDemo = async () => {
    setLoading(true);
    setLogs(prev => [...prev, "🔄 Resetting Demo Environment...", "💥 Breaking code on purpose..."]);
    speak("Resetting environment. Injecting bugs into the system.");
    try {
      await axios.get('http://127.0.0.1:8000/reset-demo');
      setLogs((prev) => [...prev, "✅ Reset Complete. The bug is back!"]);
      setStats({ total: 0, passed: 0, healed: 0, failed: 1 });
    } catch (error) {
      setLogs((prev) => [...prev, "❌ Error resetting demo."]);
    }
    setLoading(false);
  };

  return (
    // FIXED: Using AppLayout wrapper consistently
    <AppLayout>
      {/* FIXED: Breadcrumb usage */}
      <Breadcrumb pageName="Auto-Healer Dashboard" />

      {/* --- ACTION BAR --- */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
         <div>
            <h2 className="text-title-md2 font-semibold text-black dark:text-white">
               Status: {loading ? "Active Scan..." : "Standby"}
            </h2>
         </div>
         <div className="flex gap-4 items-center">
            {/* Voice Toggle */}
            <div 
               className="flex items-center gap-3 cursor-pointer" 
               onClick={() => setVoiceEnabled(!voiceEnabled)}
            >
               <div className={`relative w-12 h-6 rounded-full transition ${voiceEnabled ? 'bg-primary' : 'bg-gray-400'}`}>
                  <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition transform ${voiceEnabled ? 'translate-x-6' : ''}`}></div>
               </div>
               <span className="font-medium">Voice</span>
            </div>

            <button onClick={resetDemo} disabled={loading} className="inline-flex items-center justify-center rounded-md bg-meta-1 py-3 px-6 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10">
               Reset Demo
            </button>
            <button onClick={runHealer} disabled={loading} className={`inline-flex items-center justify-center rounded-md py-3 px-6 text-center font-medium text-white lg:px-8 xl:px-10 ${loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-primary hover:bg-opacity-90 shadow-lg'}`}>
               {loading ? 'Running...' : '▶ Run Diagnostics'}
            </button>
         </div>
      </div>

      {/* --- STATS GRID --- */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardDataStats title="Total Tests" total={stats.total.toString()} rate="100%" levelUp>
            <svg className="fill-primary dark:fill-white" width="22" height="16" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M11 0L0 6L11 12L22 6L11 0Z" />
            </svg>
        </CardDataStats>
        <CardDataStats title="Passed" total={stats.passed.toString()} rate={`${stats.total > 0 ? ((stats.passed/stats.total)*100).toFixed(0) : 0}%`} levelUp>
            <svg className="fill-meta-3" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
        </CardDataStats>
        <CardDataStats title="Auto-Healed" total={stats.healed.toString()} rate="Ai-Driven" levelUp>
            <svg className="fill-primary" width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                 <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-1.34-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
            </svg>
        </CardDataStats>
        <CardDataStats title="Failed" total={stats.failed.toString()} rate="Needs Attention" levelDown>
             <svg className="fill-meta-1" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
             </svg>
        </CardDataStats>
      </div>

      {/* --- TERMINAL --- */}
      <div className="mt-4 md:mt-6 2xl:mt-7.5 rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="border-b border-stroke py-4 px-4 dark:border-strokedark mb-4">
            <h4 className="text-xl font-semibold text-black dark:text-white">
               Live Execution Logs
            </h4>
        </div>
        
        <div className="h-[400px] overflow-y-auto rounded-lg bg-[#1e1e1e] p-6 font-mono text-sm text-gray-300 shadow-inner custom-scrollbar">
             {logs.map((log, index) => (
                <div key={index} className="mb-2 flex items-start">
                   <span className="mr-3 text-gray-500 shrink-0 select-none">[{new Date().toLocaleTimeString()}]</span>
                   <span className={`${
                      log.includes("FAILURE") || log.includes("Error") ? "text-meta-1 font-bold" : 
                      log.includes("SUCCESS") || log.includes("Passed") ? "text-meta-3 font-bold" : 
                      log.includes("Heal") || log.includes("Memory") ? "text-primary font-bold" : 
                      "text-white"
                   }`}>
                      {log}
                   </span>
                </div>
             ))}
             <div ref={terminalEndRef} />
             {loading && <span className="animate-pulse text-meta-3">_</span>}
        </div>
      </div>
    </AppLayout>
  );
};

export default Home;