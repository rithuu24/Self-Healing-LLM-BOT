import React, { useState, useRef, useEffect } from "react";
import axios from "axios"; // Import Axios to talk to Python
import PageMeta from "../../components/common/PageMeta";

export default function Home() {
  const [logs, setLogs] = useState<string[]>(["System Ready. Waiting for command..."]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ total: 0, passed: 0, healed: 0, failed: 0 });
  
  // Auto-scroll to bottom of terminal
  const terminalEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // --- FUNCTION 1: CALL REAL PYTHON BACKEND ---
  const runHealer = async () => {
    setLoading(true);
    setLogs(["🚀 Connecting to Python Brain...", "⏳ Waiting for AI Analysis..."]);
    
    try {
        // Call your FastAPI Server
        const response = await axios.get('http://127.0.0.1:8000/run-healer');
        
        // The backend returns { status: "...", logs: [...] }
        const newLogs = response.data.logs;
        
        // Show logs one by one for effect (optional) or all at once
        setLogs((prev) => [...prev, ...newLogs]);

        // Update stats based on result
        if (response.data.status === "healed") {
            setStats(s => ({ ...s, healed: s.healed + 1, total: s.total + 1, passed: s.passed + 1 }));
        } else if (response.data.status === "success") {
            setLogs(prev => [...prev, "✅ Code was already correct."]);
             setStats(s => ({ ...s, total: s.total + 1, passed: s.passed + 1 }));
        } else {
             setStats(s => ({ ...s, failed: s.failed + 1, total: s.total + 1 }));
        }

    } catch (error) {
        console.error(error);
        setLogs((prev) => [...prev, "❌ Error: Could not connect to Backend.", "Make sure 'uvicorn server:app' is running!"]);
    }
    
    setLoading(false);
  };

  // --- FUNCTION 2: RESET DEMO ---
  const resetDemo = async () => {
    setLoading(true);
    setLogs(prev => [...prev, "🔄 Resetting Demo Environment...", "💥 Breaking code on purpose..."]);
    
    try {
      await axios.get('http://127.0.0.1:8000/reset-demo');
      setLogs((prev) => [...prev, "✅ Reset Complete. The bug is back!"]);
      setStats({ total: 0, passed: 0, healed: 0, failed: 1 }); // Reset stats visuals
    } catch (error) {
      setLogs((prev) => [...prev, "❌ Error resetting demo."]);
    }
    setLoading(false);
  };

  return (
    <>
      <PageMeta
        title="Self-Healing Bot | Dashboard"
        description="Autonomous Unit Test Repair System"
      />

      <div className="grid grid-cols-12 gap-4 md:gap-6">
        
        {/* --- HEADER --- */}
        <div className="col-span-12 flex flex-col md:flex-row justify-between items-center mb-4">
            <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                    Auto-Healer Control Center
                </h2>
                <p className="text-sm text-gray-500">Autonomous Test Maintenance System</p>
            </div>
            
            <div className="flex gap-4 mt-4 md:mt-0">
                {/* RESET BUTTON */}
                <button
                    onClick={resetDemo}
                    disabled={loading}
                    className="px-6 py-3 rounded-lg text-white font-medium bg-red-500 hover:bg-red-600 shadow-lg transition-all"
                >
                    ↺ Reset Demo
                </button>

                {/* RUN BUTTON */}
                <button
                    onClick={runHealer}
                    disabled={loading}
                    className={`px-8 py-3 rounded-lg text-white font-medium transition-all shadow-lg ${
                        loading 
                        ? "bg-gray-500 cursor-not-allowed" 
                        : "bg-blue-600 hover:bg-blue-700 hover:shadow-blue-500/30"
                    }`}
                >
                    {loading ? "Healing..." : "▶ Run Diagnostics"}
                </button>
            </div>
        </div>

        {/* --- STATS --- */}
        <div className="col-span-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Total Tests" value={stats.total} color="text-blue-600" />
            <StatCard title="Tests Passed" value={stats.passed} color="text-green-500" />
            <StatCard title="Auto-Healed" value={stats.healed} color="text-purple-600" />
            <StatCard title="Failed" value={stats.failed} color="text-red-500" />
        </div>

        {/* --- TERMINAL --- */}
        <div className="col-span-12 xl:col-span-8">
            <div className="rounded-xl border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="border-b border-stroke py-4 px-6 dark:border-strokedark">
                    <h3 className="font-semibold text-black dark:text-white">
                        Live Execution Logs
                    </h3>
                </div>
                <div className="p-6">
                    <div className="h-[400px] overflow-y-auto rounded-lg bg-[#0d1117] p-4 font-mono text-sm shadow-inner custom-scrollbar">
                        {logs.map((log, index) => (
                            <div key={index} className="mb-2 flex items-start">
                                <span className="mr-2 text-gray-500 shrink-0">
                                    [{new Date().toLocaleTimeString()}]
                                </span>
                                <span className={`${
                                    log.includes("FAILURE") || log.includes("Error") ? "text-red-400 font-bold" :
                                    log.includes("SUCCESS") || log.includes("Passed") ? "text-green-400 font-bold" :
                                    log.includes("Heal") || log.includes("Memory") ? "text-purple-400" :
                                    "text-gray-300"
                                }`}>
                                    {log}
                                </span>
                            </div>
                        ))}
                        <div ref={terminalEndRef} />
                        {loading && <span className="animate-pulse text-green-500">_</span>}
                    </div>
                </div>
            </div>
        </div>
      </div>
    </>
  );
}

const StatCard = ({ title, value, color }: { title: string, value: number, color: string }) => (
    <div className="rounded-xl border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <h4 className="text-sm font-medium text-gray-500 uppercase">{title}</h4>
        <h2 className={`mt-2 text-3xl font-bold ${color}`}>{value}</h2>
    </div>
);