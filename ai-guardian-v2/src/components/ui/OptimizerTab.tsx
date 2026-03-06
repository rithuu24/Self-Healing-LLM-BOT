import { useState } from "react";
import axios from "axios";

export default function OptimizerTab() {

  const [code, setCode] = useState("");
  const [optimizedCode, setOptimizedCode] = useState("");
  const [loading, setLoading] = useState(false);

  const optimizeCode = async () => {
    if (!code) return;

    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8000/api/optimizer", {
        code: code
      });

      setOptimizedCode(res.data.optimized_code);

    } catch (error) {
      console.error(error);
      setOptimizedCode("Error optimizing code.");
    }

    setLoading(false);
  };

  return (
    <div className="p-6 space-y-6">

      <h2 className="text-2xl font-bold">
        AI Code Optimizer
      </h2>

      {/* Input Code */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="code-input"
          className="font-semibold"
        >
          Paste Your Code
        </label>

        <textarea
          id="code-input"
          placeholder="Paste your code here..."
          value={code}
          onChange={(e) => setCode(e.target.value)}
          rows={10}
          className="border rounded-lg p-3 font-mono"
        />
      </div>

      {/* Button */}
      <button
        onClick={optimizeCode}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        {loading ? "Optimizing..." : "Optimize Code"}
      </button>

      {/* Output */}
      {optimizedCode && (
        <div className="flex flex-col gap-2">

          <label
            htmlFor="optimized-output"
            className="font-semibold"
          >
            Optimized Code
          </label>

          <textarea
            id="optimized-output"
            value={optimizedCode}
            readOnly
            rows={10}
            className="border rounded-lg p-3 font-mono bg-gray-100"
          />
        </div>
      )}

    </div>
  );
}