import React, { useState } from 'react';
import {
  FiUpload as Upload,
  FiFileText as FileText,
  FiAlertTriangle as AlertTriangle,
  FiCheckCircle as CheckCircle,
  FiCalendar as Calendar,
  FiArrowRight as ArrowRight,
  FiLoader as Loader2,
  FiShield as Shield
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const handleUpload = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);

    setLoading(true);
    setError(null);
    setData(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post(`${API_BASE_URL}/analyze`, formData);
      setData(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to analyze document. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0f172a] text-white p-4 md:p-8 font-sans">
      <header className="max-w-6xl mx-auto flex items-center justify-between mb-12">
        <div className="flex items-center gap-2">
          <Shield className="w-8 h-8 text-blue-500" />
          <h1 className="text-2xl font-bold tracking-tight">LexiBridge</h1>
        </div>
        <div className="hidden md:block text-slate-400 text-sm italic">
          Empowering the legally underserved with AI
        </div>
      </header>

      <main className="max-w-6xl mx-auto">
        {!data && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-slate-700 rounded-3xl bg-slate-800/20 backdrop-blur-xl"
          >
            <Upload className="w-16 h-16 text-slate-500 mb-6" />
            <h2 className="text-2xl font-semibold mb-2">Upload Your Legal Document</h2>
            <p className="text-slate-400 mb-8 max-w-md text-center">
              Our Multi-Agent system will analyze the text for risks,
              errors, and deadlines in seconds.
            </p>
            <label className="cursor-pointer bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-semibold transition-all shadow-lg hover:shadow-blue-500/20">
              Browse Files
              <input type="file" className="hidden" onChange={handleUpload} accept="image/*,.pdf" />
            </label>
          </motion.div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
            <p className="text-xl text-slate-400 animate-pulse">
              AI Agents are analyzing your document...
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl text-center mb-8">
            {error}
          </div>
        )}

        <AnimatePresence>
          {data && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Left Column: Summary & Risks */}
              <div className="lg:col-span-2 space-y-8">
                <section className="bg-slate-800/40 p-8 rounded-3xl border border-slate-700/50">
                  <div className="flex items-center gap-3 mb-4">
                    <FileText className="w-6 h-6 text-blue-400" />
                    <h3 className="text-xl font-bold">Document Summary</h3>
                  </div>
                  <div className="bg-blue-500/10 text-blue-300 px-4 py-1 rounded-full text-xs font-semibold inline-block mb-4 uppercase tracking-wider">
                    {data.document_type}
                  </div>
                  <p className="text-slate-300 leading-relaxed text-lg italic">
                    "{data.summary}"
                  </p>
                </section>

                <section className="bg-slate-800/40 p-8 rounded-3xl border border-slate-700/50">
                  <div className="flex items-center gap-3 mb-6">
                    <AlertTriangle className="w-6 h-6 text-orange-400" />
                    <h3 className="text-xl font-bold">Risk Assessment</h3>
                    <span className={`ml-auto px-4 py-1 rounded-full text-sm font-bold ${data.risk_score > 70 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                      }`}>
                      Risk Score: {data.risk_score}/100
                    </span>
                  </div>
                  <div className="space-y-4">
                    {data.risks.map((risk, i) => (
                      <div key={i} className="p-4 bg-slate-900/50 rounded-2xl border-l-4 border-orange-500">
                        <div className="font-semibold text-orange-200 mb-1">{risk.clause}</div>
                        <p className="text-slate-400 text-sm">{risk.threat}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="bg-slate-800/40 p-8 rounded-3xl border border-slate-700/50">
                  <div className="flex items-center gap-3 mb-6">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                    <h3 className="text-xl font-bold">Potential Corrections</h3>
                  </div>
                  <div className="space-y-4">
                    {data.corrections.map((corr, i) => (
                      <div key={i} className="p-4 bg-slate-900/50 rounded-2xl border-l-4 border-green-500">
                        <div className="font-semibold text-green-200 mb-1">Target: {corr.target}</div>
                        <p className="text-slate-400 text-sm">{corr.suggestion}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* Right Column: Deadlines & Actions */}
              <div className="space-y-8">
                <section className="bg-slate-800/40 p-8 rounded-3xl border border-slate-700/50 h-fit">
                  <div className="flex items-center gap-3 mb-6">
                    <Calendar className="w-6 h-6 text-purple-400" />
                    <h3 className="text-xl font-bold">Action Timeline</h3>
                  </div>
                  <div className="space-y-6 relative">
                    <div className="absolute left-4 top-2 bottom-2 w-px bg-slate-700"></div>
                    {data.deadlines.map((dl, i) => (
                      <div key={i} className="relative pl-10">
                        <div className="absolute left-[13px] top-1.5 w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]"></div>
                        <div className="font-bold text-slate-200">{dl.date}</div>
                        <p className="text-slate-400 text-sm">{dl.action}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="bg-blue-600 p-8 rounded-3xl shadow-xl shadow-blue-900/40">
                  <h3 className="text-xl font-bold mb-6">Strategic Plan</h3>
                  <div className="space-y-4">
                    {data.next_steps.map((step, i) => (
                      <div key={i} className="bg-white/10 p-4 rounded-xl flex items-start gap-3">
                        <ArrowRight className="w-5 h-5 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-semibold text-white">{step.action}</div>
                          <p className="text-blue-100 text-sm mt-1">{step.reason}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => window.location.reload()}
                    className="w-full mt-8 bg-white text-blue-600 font-bold py-3 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    Analyze New Document
                  </button>
                </section>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
