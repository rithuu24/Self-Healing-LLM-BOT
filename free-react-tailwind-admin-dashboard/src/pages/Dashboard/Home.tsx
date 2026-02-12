import React, { useState, useRef, useEffect } from "react";
import PageMeta from "../../components/common/PageMeta";

export default function Home() {
  // State for the bot logic
  const [logs, setLogs] = useState<string[]>(["System Ready. Waiting for command..."]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ total: 24, passed: 22, healed: 2, failed: 0 });
  
  // Auto-scroll to bottom of terminal
  const terminalEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // Simulation of the Healer Bot (Replace with real API call later)
  const runHealer = () => {
    setLoading(true);
    setLogs((prev) => [...prev, "🚀 Initializing Test Suite...", "running pytest..."]);

    setTimeout(() => {
      setLogs((prev) => [...prev, "⚠️ FAILURE DETECTED: test_auth_login.py"]);
    }, 1000);

    setTimeout(() => {
      setLogs((prev) => [...prev, "🧠 Analyzing stack trace with LLM...", "🔍 Context: AuthToken mismatch detected."]);
    }, 2500);

    setTimeout(() => {
      setLogs((prev) => [...prev, "🩹 Generating Fix...", "📝 Patching file: src/auth/login.py"]);
      setStats(s => ({ ...s, healed: s.healed + 1 }));
    }, 4500);

    setTimeout(() => {
      setLogs((prev) => [...prev, "✅ Re-running tests...", "✨ SUCCESS: All tests passed!"]);
      setLoading(false);
    }, 6000);
  };

  return (
    <>
      <PageMeta
        title="Self-Healing Bot | Dashboard"
        description="Autonomous Unit Test Repair System"
      />

      <div className="grid grid-cols-12 gap-4 md:gap-6">
        
        {/* --- SECTION 1: HEADER & CONTROLS --- */}
        <div className="col-span-12 flex flex-col md:flex-row justify-between items-center mb-4">
            <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                    Auto-Healer Control Center
                </h2>
                <p className="text-sm text-gray-500">Autonomous Test Maintenance System</p>
            </div>
            <button
                onClick={runHealer}
                disabled={loading}
                className={`mt-4 md:mt-0 px-8 py-3 rounded-lg text-white font-medium transition-all shadow-lg ${
                    loading 
                    ? "bg-gray-500 cursor-not-allowed" 
                    : "bg-blue-600 hover:bg-blue-700 hover:shadow-blue-500/30"
                }`}
            >
                {loading ? "Healing in Progress..." : "▶ Run Diagnostics"}
            </button>
        </div>

        {/* --- SECTION 2: STATUS CARDS (Replaces EcommerceMetrics) --- */}
        <div className="col-span-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Total Tests" value={stats.total} color="text-blue-600" />
            <StatCard title="Tests Passed" value={stats.passed} color="text-green-500" />
            <StatCard title="Auto-Healed" value={stats.healed} color="text-purple-600" />
            <StatCard title="Failed" value={stats.failed} color="text-red-500" />
        </div>

        {/* --- SECTION 3: LIVE TERMINAL (Replaces Charts) --- */}
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
                                    log.includes("FAILURE") ? "text-red-400 font-bold" :
                                    log.includes("SUCCESS") ? "text-green-400 font-bold" :
                                    log.includes("Heal") ? "text-purple-400" :
                                    "text-gray-300"
                                }`}>
                                    {log.includes("test_") ? `> ${log}` : log}
                                </span>
                            </div>
                        ))}
                        <div ref={terminalEndRef} />
                        {loading && <span className="animate-pulse text-green-500">_</span>}
                    </div>
                </div>
            </div>
        </div>

        {/* --- SECTION 4: RECENT ACTIVITY (Replaces RecentOrders) --- */}
        <div className="col-span-12 xl:col-span-4">
            <div className="rounded-xl border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="border-b border-stroke py-4 px-6 dark:border-strokedark">
                    <h3 className="font-semibold text-black dark:text-white">
                        Recent Fixes
                    </h3>
                </div>
                <div className="p-4 flex flex-col gap-3">
                    <FixItem file="tests/login_test.py" status="Fixed" time="2 mins ago" />
                    <FixItem file="src/utils/calc.py" status="Fixed" time="1 hour ago" />
                    <FixItem file="api/endpoints.py" status="Pending" time="3 hours ago" />
                </div>
            </div>
        </div>

      </div>
    </>
  );
}

/* --- HELPER COMPONENTS (Internal for simplicity) --- */

const StatCard = ({ title, value, color }: { title: string, value: number, color: string }) => (
    <div className="rounded-xl border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <h4 className="text-sm font-medium text-gray-500 uppercase">{title}</h4>
        <h2 className={`mt-2 text-3xl font-bold ${color}`}>{value}</h2>
    </div>
);

const FixItem = ({ file, status, time }: { file: string, status: string, time: string }) => (
    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-meta-4">
        <div>
            <h5 className="text-sm font-medium text-black dark:text-white">{file}</h5>
            <span className="text-xs text-gray-500">{time}</span>
        </div>
        <span className={`px-2 py-1 text-xs rounded ${
            status === "Fixed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
        }`}>
            {status}
        </span>
    </div>
);