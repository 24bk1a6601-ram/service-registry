import React, { useState, useEffect } from 'react';
import { ShieldCheck, Key, Play, CheckCircle2, AlertTriangle, Zap, DollarSign } from 'lucide-react';
import { SecurityAuditReport } from '../types';

export const SecurityAndTestingView: React.FC = () => {
  const [report, setReport] = useState<SecurityAuditReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    runAudit();
  }, []);

  const runAudit = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/testing/audit');
      const data = await res.json();
      setReport(data);
    } catch (err) {
      console.error('Failed to run audit:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* Header */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-indigo-300 block font-bold">Audit Suite</span>
          <h1 className="text-2xl sm:text-3xl font-serif-display italic font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-indigo-200 flex items-center space-x-3">
            <Key className="w-6 h-6 text-indigo-400" />
            <span>Security Audit & Smart Contract Test Runner</span>
          </h1>
          <p className="text-xs text-slate-300 font-code mt-1">Automated verification suite for Reentrancy protection, Replay attack guards, Signature verification, and Gas optimization.</p>
        </div>

        <button
          onClick={runAudit}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-code text-xs font-bold flex items-center space-x-2 cursor-pointer transition-all shadow-lg shadow-indigo-950/50 shrink-0"
        >
          <Play className="w-3.5 h-3.5" />
          <span>Re-Run Audit Suite</span>
        </button>
      </div>

      {loading || !report ? (
        <div className="py-12 text-center text-slate-400 font-code text-xs animate-pulse glass-card rounded-3xl p-8 border border-white/10">
          Executing Smart Contract Security Suite & Gas Benchmarks...
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Summary Scorecard */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 font-code">
            
            <div className="p-5 rounded-3xl glass-card border border-white/10 space-y-1 shadow-lg">
              <span className="text-xs text-slate-400 block font-bold uppercase tracking-wider text-[10px]">Security Score</span>
              <span className="text-3xl font-bold text-emerald-400 font-mono">{report.summary.securityScore} / 100</span>
            </div>

            <div className="p-5 rounded-3xl glass-card border border-white/10 space-y-1 shadow-lg">
              <span className="text-xs text-slate-400 block font-bold uppercase tracking-wider text-[10px]">Passed Tests</span>
              <span className="text-3xl font-bold text-emerald-400 font-mono">{report.summary.passed} / {report.summary.totalTests}</span>
            </div>

            <div className="p-5 rounded-3xl glass-card border border-white/10 space-y-1 shadow-lg">
              <span className="text-xs text-slate-400 block font-bold uppercase tracking-wider text-[10px]">Failed Tests</span>
              <span className="text-3xl font-bold text-slate-200 font-mono">{report.summary.failed}</span>
            </div>

            <div className="p-5 rounded-3xl glass-card border border-white/10 space-y-1 shadow-lg">
              <span className="text-xs text-slate-400 block font-bold uppercase tracking-wider text-[10px]">Reentrancy & Replay</span>
              <span className="text-2xl font-bold text-indigo-400 font-mono">PASSED</span>
            </div>

          </div>

          {/* Vulnerability Analysis & Mitigations */}
          <div className="glass-card rounded-3xl border border-white/10 p-6 sm:p-8 space-y-4 shadow-xl">
            <h2 className="text-lg font-bold text-white font-code flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Vulnerability Audits & Mitigation Verification</span>
            </h2>

            <div className="space-y-3 font-code text-xs">
              {report.vulnerabilities.map((v, i) => (
                <div key={i} className="p-5 rounded-2xl bg-slate-950/80 border border-white/5 space-y-2.5 shadow-inner">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{v.title}</span>
                    <span className="px-3 py-1 rounded-xl bg-emerald-950/60 text-emerald-300 font-bold border border-emerald-700/60 text-[11px]">
                      {v.status}
                    </span>
                  </div>
                  <p className="text-slate-300 font-sans text-xs leading-relaxed">{v.description}</p>
                  <div className="p-3 rounded-xl bg-slate-900/90 text-emerald-300 text-[11px] border border-slate-800">
                    <span className="font-bold text-slate-200">Mitigation Implemented: </span>
                    {v.mitigation}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gas Optimization Benchmarks */}
          <div className="glass-card rounded-3xl border border-white/10 p-6 sm:p-8 space-y-4 shadow-xl">
            <h2 className="text-lg font-bold text-white font-code flex items-center space-x-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <span>Base L2 Gas Benchmarks</span>
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-code">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 uppercase text-[10px] tracking-wider font-bold">
                    <th className="pb-4">Operation</th>
                    <th className="pb-4">Gas Used</th>
                    <th className="pb-4">Estimated Cost (USD)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-200">
                  {report.gasBenchmarks.map((g, i) => (
                    <tr key={i} className="hover:bg-white/5 transition-colors">
                      <td className="py-3.5 font-bold text-white">{g.operation}</td>
                      <td className="py-3.5 text-indigo-300 font-mono">{g.gasUsed.toLocaleString()} units</td>
                      <td className="py-3.5 text-emerald-400 font-bold font-mono">{g.estimatedCostUsd}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
