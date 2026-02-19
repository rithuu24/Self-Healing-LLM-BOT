import React, { useState } from 'react';
import axios from 'axios';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumbs';

const CodeOptimizer: React.FC = () => {
  const [inputCode, setInputCode] = useState(
`def find_duplicates(arr):
    duplicates = []
    for i in range(len(arr)):
        for j in range(i + 1, len(arr)):
            if arr[i] == arr[j] and arr[i] not in duplicates:
                duplicates.append(arr[i])
    return duplicates`
  );
  
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleOptimize = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await axios.post('http://127.0.0.1:8000/optimize', {
        code: inputCode
      });

      if (response.data.status === 'success') {
        setResult(response.data);
      } else {
        setError(response.data.message || 'Optimization failed.');
      }
    } catch (err) {
      setError('Could not connect to the Backend AI.');
    }
    
    setLoading(false);
  };

  return (
    <>
      <Breadcrumb pageName="Big-O Code Optimizer" />

      <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
        {/* LEFT COLUMN: Input */}
        <div className="flex flex-col gap-9">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark flex justify-between items-center">
              <label htmlFor="inputCode" className="font-medium text-black dark:text-white block cursor-pointer">
                Input Code (Slower)
              </label>
              <button 
                onClick={handleOptimize}
                disabled={loading}
                className={`inline-flex items-center justify-center rounded-md px-6 py-2 text-center font-medium text-white hover:bg-opacity-90 ${loading ? 'bg-gray-500' : 'bg-primary'}`}
              >
                {loading ? 'Analyzing...' : '⚡ Optimize Code'}
              </button>
            </div>
            <div className="p-6.5">
              <textarea
                id="inputCode"
                title="Input Code to Optimize"
                placeholder="Paste your slow Python code here..."
                rows={15}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-mono text-sm outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary custom-scrollbar"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
              ></textarea>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Output */}
        <div className="flex flex-col gap-9">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <label htmlFor="optimizedCode" className="font-medium text-black dark:text-white block">
                AI Optimized Result (Faster)
              </label>
            </div>
            <div className="p-6.5">
              {error && <div className="text-meta-1 mb-4">{error}</div>}
              
              {!result && !error && !loading && (
                <div className="flex h-[350px] items-center justify-center text-gray-500">
                  Click Optimize to analyze Data Structures & Algorithms.
                </div>
              )}

              {loading && (
                <div className="flex h-[350px] items-center justify-center text-primary animate-pulse">
                  Running Deep Logic Analysis...
                </div>
              )}

              {result && (
                <div className="flex flex-col gap-4">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4">
                     <div className="rounded border border-stroke p-3 dark:border-strokedark bg-meta-1 bg-opacity-10">
                        <span className="block text-xs font-medium text-meta-1 mb-1">Current Complexity</span>
                        <div className="text-sm">⏰ {result.current_time}</div>
                        <div className="text-sm">💾 {result.current_space}</div>
                     </div>
                     <div className="rounded border border-stroke p-3 dark:border-strokedark bg-meta-3 bg-opacity-10">
                        <span className="block text-xs font-medium text-meta-3 mb-1">Optimized Complexity</span>
                        <div className="text-sm text-meta-3 font-bold">⏰ {result.optimized_time}</div>
                        <div className="text-sm text-meta-3 font-bold">💾 {result.optimized_space}</div>
                     </div>
                  </div>

                  {/* Explanation */}
                  <div className="text-sm text-body dark:text-bodydark bg-gray-100 dark:bg-meta-4 p-3 rounded">
                    <strong>AI Note:</strong> {result.explanation}
                  </div>

                  {/* Code Output */}
                  <textarea
                    id="optimizedCode"
                    title="Optimized Output Code"
                    placeholder="AI optimized code will appear here..."
                    readOnly
                    rows={10}
                    className="w-full rounded border-[1.5px] border-stroke bg-[#1e1e1e] py-3 px-5 font-mono text-sm text-green-400 outline-none dark:border-form-strokedark custom-scrollbar"
                    value={result.optimized_code}
                  ></textarea>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CodeOptimizer;