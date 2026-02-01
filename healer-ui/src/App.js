import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const startHealing = async () => {
    setLoading(true);
    setLogs(["⏳ Connecting to Healer Bot..."]);
    
    try {
      // Call your Python Backend
      const response = await axios.get('http://127.0.0.1:8000/run-healer');
      setLogs(response.data.logs);
    } catch (error) {
      setLogs(["❌ Error connecting to server."]);
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <h1>🏥 Self-Healing Test Bot</h1>
      <p>Autonomous AI Agent for Code Maintenance</p>
      
      <button onClick={startHealing} disabled={loading} className="heal-btn">
        {loading ? "Healing in progress..." : "🩹 Run Self-Heal"}
      </button>

      <div className="terminal-window">
        {logs.map((log, index) => (
          <p key={index} className="log-line">
            {log.includes("❌") ? <span className="error">{log}</span> : 
             log.includes("✅") ? <span className="success">{log}</span> : log}
          </p>
        ))}
      </div>
    </div>
  );
}

export default App;