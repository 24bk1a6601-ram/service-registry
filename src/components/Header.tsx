import React from 'react';
import { Cpu, ShieldCheck, Wallet, RefreshCw, Key, Layers, Activity, BookOpen, Terminal, CheckCircle2, ExternalLink } from 'lucide-react';
import { NetworkName } from '../types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  network: NetworkName;
  setNetwork: (net: NetworkName) => void;
  walletAddress: string;
  isSiweAuthenticated: boolean;
  onOpenWalletModal: () => void;
  blockNumber: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  network,
  setNetwork,
  walletAddress,
  isSiweAuthenticated,
  onOpenWalletModal,
  blockNumber,
}) => {
  const walletType = typeof localStorage !== 'undefined' ? localStorage.getItem('x402_wallet_type') : null;
  let walletLabel = 'Wallet';
  if (walletType === 'trust') {
    walletLabel = 'Trust Wallet';
  } else if (walletType === 'pera') {
    walletLabel = 'Pera Wallet';
  } else if (walletType === 'metamask') {
    walletLabel = 'MetaMask';
  } else if (walletType === 'okto') {
    walletLabel = 'Okto';
  } else if (walletType === 'coinswitch') {
    walletLabel = 'CoinSwitch';
  } else if (walletAddress.toUpperCase().startsWith('ALGO')) {
    walletLabel = 'Pera/Algo';
  }

  const shortAddress = walletAddress
    ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`
    : 'Connect Wallet';

  return (
    <header className="sticky top-0 z-40 bg-[#060810]/85 backdrop-blur-xl border-b border-white/10 text-slate-100 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand & Badge */}
          <div className="flex items-center space-x-3.5 cursor-pointer group" onClick={() => setActiveTab('architecture')}>
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-transparent border border-indigo-500/30 text-indigo-400 group-hover:border-indigo-400/60 group-hover:text-indigo-300 transition-all shadow-lg shadow-indigo-950/50">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2.5">
                <span className="font-serif-display text-2xl italic font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-indigo-200">
                  Service Registry
                </span>
                <span className="x402-tag">
                  x402 Protocol
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block font-sans">Decentralized Web3 AI Agent Economy & Payment Middleware</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-3">
            
            {/* Network Selector */}
            <select
              value={network}
              onChange={(e) => setNetwork(e.target.value as NetworkName)}
              className="bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-xs text-slate-200 font-code rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer transition-all shadow-inner"
            >
              <option value="algorand-testnet">Algorand Testnet (ALGO)</option>
              <option value="base-sepolia">Base Sepolia (L2 Testnet)</option>
              <option value="ethereum-sepolia">Ethereum Sepolia (Testnet)</option>
              <option value="arbitrum-sepolia">Arbitrum Sepolia (Testnet)</option>
            </select>

            {/* Block Number Ticker */}
            <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] font-code text-slate-400 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
              <span className="text-slate-300 font-semibold">Block #{blockNumber}</span>
            </div>

            {/* Open in New Tab Button for Frame Bypass */}
            <button
              onClick={() => window.open(window.location.href, '_blank')}
              title="Open App in New Window (Required for Trust Wallet & Web3 extensions)"
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-800/60 hover:border-cyan-500/80 text-cyan-300 font-code text-xs transition-all cursor-pointer shadow-md"
            >
              <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
              <span>New Tab</span>
            </button>

            {/* Wallet & SIWE Button */}
            <button
              onClick={onOpenWalletModal}
              className={`flex items-center space-x-2 px-4 py-1.5 rounded-xl font-code text-xs font-semibold transition-all cursor-pointer shadow-md ${
                isSiweAuthenticated
                  ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-600/60 hover:bg-emerald-900/70 shadow-emerald-950/50'
                  : walletAddress
                  ? 'bg-indigo-950/60 text-indigo-200 border border-indigo-700/60 hover:bg-indigo-900/70 shadow-indigo-950/50'
                  : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white border border-indigo-400/50 shadow-lg shadow-indigo-900/50'
              }`}
            >
              <Wallet className={`w-4 h-4 ${!walletAddress ? 'text-white' : 'text-indigo-400'}`} />
              <span>
                {!walletAddress
                  ? 'Connect Wallet'
                  : `${walletLabel}: ${shortAddress}`}
              </span>
              {isSiweAuthenticated && (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-2 overflow-x-auto py-2.5 border-t border-white/5 scrollbar-none">
          {[
            { id: 'architecture', label: 'Home / Overview', icon: Layers },
            { id: 'marketplace', label: 'Agent Marketplace', icon: Cpu },
            { id: 'x402-sandbox', label: 'Live Service Tester', icon: Terminal },
            { id: 'contracts', label: 'Smart Contracts', icon: ShieldCheck },
            { id: 'indexer', label: 'Transaction History', icon: Activity },
            { id: 'docs', label: 'Developer Guide', icon: BookOpen },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-950/90 to-slate-900 text-white border border-indigo-500/40 shadow-lg shadow-indigo-950/60 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
