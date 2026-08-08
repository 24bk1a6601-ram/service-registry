import React, { useState } from 'react';
import { ShieldCheck, Code, Play, CheckCircle2, Copy, ExternalLink, Database, Layers } from 'lucide-react';
import { CONTRACT_STORE, CONTRACT_DEPLOYMENTS } from '../contracts/ContractStore';
import { NetworkName } from '../types';

interface ContractExplorerViewProps {
  network: NetworkName;
}

export const ContractExplorerView: React.FC<ContractExplorerViewProps> = ({ network }) => {
  const [selectedContractKey, setSelectedContractKey] = useState<string>('AgentRegistry');
  const [activeTab, setActiveTab] = useState<'code' | 'abi' | 'playground'>('code');
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [methodOutput, setMethodOutput] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const contractInfo = CONTRACT_STORE[selectedContractKey];
  const deployments = CONTRACT_DEPLOYMENTS[network];

  const handleExecuteSimulatedRead = (method: string) => {
    setSelectedMethod(method);
    setLoading(true);
    setMethodOutput(null);

    setTimeout(() => {
      setLoading(false);
      if (method.includes('getAgent')) {
        setMethodOutput(JSON.stringify({
          agentId: '0xa1a1000000000000000000000000000000000000000000000000000000000001',
          name: 'CyberGuard AI - Code Auditor',
          did: 'did:pkh:eip155:8453:0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
          owner: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
          organization: 'CyberGuard Security DAO',
          isVerified: true,
          isActive: true,
          createdAt: 1722900000
        }, null, 2));
      } else if (method.includes('getService')) {
        setMethodOutput(JSON.stringify({
          serviceId: '0x1010000000000000000000000000000000000000000000000000000000000001',
          name: 'Solidity & Move Smart Contract Auditor API',
          pricePerRequestWei: '100000000000000',
          owner: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
          status: 'Active',
          currentVersion: '1.2.0'
        }, null, 2));
      } else if (method.includes('deposits')) {
        setMethodOutput(JSON.stringify({
          depositId: '0x9990000000000000000000000000000000000000000000000000000000000000',
          amountWei: '100000000000000',
          settled: true,
          refunded: false
        }, null, 2));
      } else {
        setMethodOutput(JSON.stringify({ status: 'success', result: 'Query executed successfully against ' + network }, null, 2));
      }
    }, 400);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* Header */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-2 shadow-xl">
        <span className="text-[10px] uppercase tracking-widest text-indigo-300 block font-bold">On-Chain Verification</span>
        <h1 className="text-2xl sm:text-3xl font-serif-display italic font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-indigo-200 flex items-center space-x-3">
          <ShieldCheck className="w-6 h-6 text-indigo-400" />
          <span>Smart Contracts Explorer & Method Inspector</span>
        </h1>
        <p className="text-xs text-slate-300 font-code">Inspect verified Solidity source code, ABI interfaces, NatSpec documentation, and simulate EVM state calls.</p>
      </div>

      {/* Contract Selector Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none font-code text-xs">
        {Object.keys(CONTRACT_STORE).map((key) => (
          <button
            key={key}
            onClick={() => {
              setSelectedContractKey(key);
              setMethodOutput(null);
            }}
            className={`px-4 py-2.5 rounded-2xl whitespace-nowrap transition-all cursor-pointer ${
              selectedContractKey === key
                ? 'bg-indigo-950 text-white border border-indigo-500/60 font-bold shadow-lg shadow-indigo-950/50'
                : 'glass-card text-slate-400 border border-white/5 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            {key}.sol
          </button>
        ))}
      </div>

      {/* Selected Contract Info Card */}
      {contractInfo && (
        <div className="glass-card rounded-3xl border border-white/10 p-6 sm:p-8 space-y-6 shadow-xl">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <h2 className="text-lg font-bold text-white font-code flex items-center space-x-2">
                <span className="text-indigo-400 font-serif-display italic">{contractInfo.name}.sol</span>
              </h2>
              <p className="text-xs text-slate-300 font-sans mt-0.5">{contractInfo.description}</p>
            </div>

            <div className="px-3.5 py-2 rounded-xl bg-slate-950/80 border border-white/10 font-code text-xs text-slate-200 flex items-center space-x-2 shadow-inner">
              <span className="text-slate-400 font-bold">Deployed Address:</span>
              <span className="text-indigo-300 font-mono font-bold">
                {(() => {
                  const keyMap: Record<string, string> = {
                    AgentRegistry: 'agentRegistry',
                    ServiceRegistry: 'serviceRegistry',
                    x402Escrow: 'x402Escrow',
                    UsageTracker: 'usageTracker',
                    ServiceRatings: 'serviceRatings'
                  };
                  const key = keyMap[selectedContractKey] || selectedContractKey;
                  return (deployments as any)?.[key] || contractInfo.address;
                })()}
              </span>
            </div>
          </div>

          {/* Code vs ABI vs Playground Tabs */}
          <div className="flex space-x-2 border-b border-white/10 pb-3 font-code text-xs">
            <button
              onClick={() => setActiveTab('code')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${activeTab === 'code' ? 'bg-indigo-950 text-white border border-indigo-500/60 font-bold shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Solidity Source Code
            </button>
            <button
              onClick={() => setActiveTab('abi')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${activeTab === 'abi' ? 'bg-indigo-950 text-white border border-indigo-500/60 font-bold shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
            >
              ABI Interface
            </button>
            <button
              onClick={() => setActiveTab('playground')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${activeTab === 'playground' ? 'bg-indigo-950 text-white border border-indigo-500/60 font-bold shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Read / Write Simulator
            </button>
          </div>

          {/* Content Tab 1: Code */}
          {activeTab === 'code' && (
            <div className="relative">
              <pre className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-code text-indigo-300 overflow-x-auto max-h-96 leading-relaxed shadow-inner">
                {contractInfo.solidityCode}
              </pre>
            </div>
          )}

          {/* Content Tab 2: ABI */}
          {activeTab === 'abi' && (
            <pre className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-code text-slate-200 overflow-x-auto max-h-96 leading-relaxed shadow-inner">
              {JSON.stringify(contractInfo.abi, null, 2)}
            </pre>
          )}

          {/* Content Tab 3: Read/Write Playground */}
          {activeTab === 'playground' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-code text-xs">
              
              {/* Read Methods */}
              <div className="space-y-3 bg-slate-950/80 p-5 rounded-2xl border border-white/5 shadow-inner">
                <h4 className="font-bold text-indigo-300 flex items-center space-x-2">
                  <Database className="w-4 h-4 text-indigo-400" />
                  <span>View & Read Contract Methods</span>
                </h4>
                <div className="space-y-2">
                  {contractInfo.readMethods.map((m) => (
                    <button
                      key={m}
                      onClick={() => handleExecuteSimulatedRead(m)}
                      className="w-full text-left p-3 rounded-xl bg-slate-900/90 hover:bg-indigo-950/60 border border-slate-800 hover:border-indigo-500/60 text-slate-300 hover:text-white flex items-center justify-between transition-all cursor-pointer shadow-sm group"
                    >
                      <span className="font-mono">{m}</span>
                      <Play className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition-transform" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Method Execution Result */}
              <div className="space-y-3 bg-slate-950/80 p-5 rounded-2xl border border-white/5 flex flex-col justify-between shadow-inner">
                <div>
                  <h4 className="font-bold text-emerald-400 flex items-center space-x-2">
                    <Code className="w-4 h-4 text-emerald-400" />
                    <span>EVM Execution Output</span>
                  </h4>

                  {loading ? (
                    <div className="py-8 text-center text-slate-400 animate-pulse font-code text-xs">
                      Executing call on {network}...
                    </div>
                  ) : methodOutput ? (
                    <pre className="mt-3 p-4 rounded-xl bg-slate-950 border border-slate-800 text-emerald-300 text-[11px] overflow-x-auto leading-relaxed shadow-inner">
                      {methodOutput}
                    </pre>
                  ) : (
                    <div className="py-8 text-center text-slate-400 text-[11px]">
                      Select a read method on the left to simulate query execution.
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
};
