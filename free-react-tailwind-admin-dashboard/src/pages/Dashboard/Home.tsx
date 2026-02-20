import React, { useState, useEffect, useRef } from 'react';

const Home: React.FC = () => {
  const [status, setStatus] = useState('Standby');
  
  // State to hold our terminal messages
  const [logs, setLogs] = useState<string[]>([
    `[${new Date().toLocaleTimeString()}] System Ready. Waiting for command...`
  ]);

  // Reference for auto-scrolling the terminal
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const handleRunDiagnostics = async () => {
    // Prevent double-clicking
    if (status === 'Running...') return;

    setStatus('Running...');
    setLogs(prev => [
      ...prev, 
      `\n--------------------------------------------------`,
      `[${new Date().toLocaleTimeString()}] ⚡ Connecting to Live Python Backend...`
    ]);

    try {
      // 1. Call the new Python Streaming API
      const response = await fetch('http://127.0.0.1:8000/stream-diagnostics');
      
      if (!response.body) throw new Error("No response body");

      // 2. Read the incoming stream chunk by chunk
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      while (true) {
        const { value, done } = await reader.read();
        
        if (done) break; // Stream finished
        
        // Decode the binary data to text
        const chunk = decoder.decode(value, { stream: true }).trim();

        // Sometimes data arrives in batches, so we split by newlines just in case
        const lines = chunk.split('\n').filter(line => line.trim() !== '');

        for (const line of lines) {
          // If Python sends our secret "DONE" signal, stop the UI gracefully
          if (line === "DONE") {
            setStatus('Standby');
            setLogs(prev => [
              ...prev, 
              `[${new Date().toLocaleTimeString()}] ✓ Diagnostics complete. Connection closed.`
            ]);
            return; // Exit the loop and function
          } else {
            // Add the live log to the terminal
            setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${line}`]);
          }
        }
      }
      
      // Failsafe in case stream drops without sending "DONE"
      if (status === 'Running...') setStatus('Standby');

    } catch (error) {
      console.error("Backend connection failed:", error);
      setStatus('Standby');
      setLogs(prev => [
        ...prev, 
        `[${new Date().toLocaleTimeString()}] ERROR: Could not connect to Python backend. Is FastAPI running?`
      ]);
    }
  };

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Auto-Healer Dashboard
        </h2>
        <nav>
          <ol className="flex items-center gap-2">
            <li>
              <span className="font-medium">Dashboard /</span>
            </li>
            <li className="font-medium text-primary">Auto-Healer Dashboard</li>
          </ol>
        </nav>
      </div>

      {/* Header Controls */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h4 className="text-title-sm font-semibold text-black dark:text-white">
            Status: <span className={status === 'Running...' ? 'text-meta-3 animate-pulse' : 'text-primary'}>{status}</span>
          </h4>
        </div>
        
        <div className="flex items-center gap-4">
          <label className="flex cursor-pointer select-none items-center gap-2">
            <div className="relative">
              <input type="checkbox" className="sr-only" />
              <div className="block h-6 w-10 rounded-full bg-stroke dark:bg-strokedark"></div>
              <div className="dot absolute left-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white transition"></div>
            </div>
            <span className="font-medium text-black dark:text-white">Voice</span>
          </label>

          <button 
            onClick={() => setLogs([`[${new Date().toLocaleTimeString()}] Logs cleared. System Ready.`])}
            className="rounded-md bg-gray-100 px-6 py-2 font-medium text-gray-500 hover:bg-gray-200 dark:bg-meta-4 dark:text-gray-300 dark:hover:bg-meta-3 transition-colors"
          >
            Clear Logs
          </button>

          <button 
            onClick={handleRunDiagnostics}
            disabled={status === 'Running...'}
            className={`flex items-center gap-2 rounded-md px-6 py-2 font-medium transition-colors ${
              status === 'Running...' 
                ? 'bg-gray-500 text-white cursor-not-allowed' 
                : 'bg-primary text-white hover:bg-opacity-90'
            }`}
          >
            <svg
              className={`fill-current ${status === 'Running...' ? 'animate-spin' : ''}`}
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.5522 7.10427L4.40905 2.01526C3.76618 1.61338 2.91669 2.07542 2.91669 2.83151V13.1685C2.91669 13.9246 3.76618 14.3866 4.40905 13.9847L12.5522 8.89573C13.1493 8.52256 13.1493 7.47744 12.5522 7.10427Z"
                fill="currentColor"
              />
            </svg>
            {status === 'Running...' ? 'Diagnosing...' : 'Run Diagnostics'}
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <div className="rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="mt-4 flex items-end justify-between">
            <div>
              <h4 className="text-title-xl font-bold text-black dark:text-white">24</h4>
              <span className="text-sm font-medium">Total Tests</span>
            </div>
            <span className="flex items-center gap-1 text-sm font-medium">100%</span>
          </div>
        </div>

        <div className="rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="mt-4 flex items-end justify-between">
            <div>
              <h4 className="text-title-xl font-bold text-black dark:text-white">23</h4>
              <span className="text-sm font-medium">Passed</span>
            </div>
            <span className="flex items-center gap-1 text-sm font-medium text-meta-5">95%</span>
          </div>
        </div>

        <div className="rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="mt-4 flex items-end justify-between">
            <div>
              <h4 className="text-title-xl font-bold text-black dark:text-white">1</h4>
              <span className="text-sm font-medium">Auto-Healed</span>
            </div>
            <span className="flex items-center gap-1 text-sm font-medium text-meta-3">Ai-Driven</span>
          </div>
        </div>

        <div className="rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="mt-4 flex items-end justify-between">
            <div>
              <h4 className="text-title-xl font-bold text-black dark:text-white">0</h4>
              <span className="text-sm font-medium">Failed</span>
            </div>
            <span className="flex items-center gap-1 text-sm font-medium text-meta-1">Needs Attention</span>
          </div>
        </div>
      </div>

      {/* Live Execution Logs */}
      <div className="mt-4 md:mt-6 2xl:mt-7.5">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-6">
          <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
            Live Execution Logs
          </h4>
          <div className="bg-[#1e1e1e] rounded-md p-5 h-[300px] font-mono text-sm text-gray-300 overflow-y-auto custom-scrollbar">
            {logs.map((log, index) => (
              <p 
                key={index} 
                className={`whitespace-pre-wrap ${log.includes('WARNING') || log.includes('ERROR') ? 'text-meta-1' : log.includes('✓') ? 'text-meta-3' : ''}`}
              >
                {log}
              </p>
            ))}
            {/* Anchor for auto-scroll */}
            <div ref={logsEndRef} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;