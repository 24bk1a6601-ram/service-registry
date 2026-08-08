import React, { useState } from 'react';
import { 
  Hexagon, 
  Layers, 
  Building2, 
  Terminal, 
  ShieldCheck, 
  Activity, 
  Key, 
  BookOpen, 
  Wallet, 
  ExternalLink, 
  CheckCircle2, 
  Menu, 
  X 
} from 'lucide-react';
import { NetworkName } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  network: NetworkName;
  setNetwork: (net: NetworkName) => void;
  walletAddress: string;
  isSiweAuthenticated: boolean;
  onOpenWalletModal: () => void;
  blockNumber: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  network,
  setNetwork,
  walletAddress,
  isSiweAuthenticated,
  onOpenWalletModal,
  blockNumber,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const shortAddress = walletAddress
    ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`
    : 'Connect Wallet';

  const navItems = [
    { id: 'architecture', label: 'Home / Overview', icon: Layers },
    { id: 'marketplace', label: 'Agent Marketplace', icon: Building2 },
    { id: 'x402-sandbox', label: 'Live Service Tester', icon: Terminal },
    { id: 'contracts', label: 'Smart Contracts', icon: ShieldCheck },
    { id: 'indexer', label: 'Transaction History', icon: Activity },
    { id: 'docs', label: 'Developer Guide', icon: BookOpen },
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Top Header */}
      <div className="lg:hidden sticky top-0 z-40 bg-[#09090e]/90 backdrop-blur-md border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleTabClick('architecture')}>
          <div className="p-2 rounded-xl bg-indigo-950/80 border border-indigo-700/50 text-indigo-400">
            <Hexagon className="w-5 h-5 stroke-[1.75]" />
          </div>
          <div>
            <h1 className="font-serif-display italic font-bold text-white text-base leading-none">Service Registry</h1>
            <p className="text-[10px] tracking-widest text-slate-400 font-code uppercase mt-0.5">X402 PROTOCOL</p>
          </div>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Desktop Persistent Sidebar & Mobile Drawer */}
      <aside className={`
        fixed lg:sticky top-0 left-0 z-50 h-screen w-64 xl:w-72 bg-[#09090e] border-r border-white/10 p-5 flex flex-col justify-between shrink-0 transition-transform duration-300 ease-in-out
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="space-y-6">
          
          {/* Logo Brand Section */}
          <div 
            onClick={() => handleTabClick('architecture')}
            className="flex items-center space-x-3.5 cursor-pointer group pt-1"
          >
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-indigo-900/60 to-purple-900/40 border border-indigo-600/50 text-indigo-400 group-hover:border-indigo-400 shadow-lg shadow-indigo-950/50 transition-all">
              <Hexagon className="w-6 h-6 stroke-[1.75]" />
            </div>
            <div>
              <h1 className="font-serif-display italic font-bold text-white text-lg leading-tight tracking-tight">
                Service Registry
              </h1>
              <p className="text-[10px] tracking-widest text-slate-400 font-code uppercase mt-0.5">
                X402 PROTOCOL
              </p>
            </div>
          </div>

          {/* Wallet Button */}
          <div className="pt-1">
            <button
              onClick={onOpenWalletModal}
              className={`w-full py-2.5 px-3.5 rounded-xl font-code text-xs font-semibold flex items-center justify-between transition-all cursor-pointer shadow-md border ${
                isSiweAuthenticated
                  ? 'bg-emerald-950/50 text-emerald-300 border-emerald-600/50 hover:bg-emerald-900/60'
                  : walletAddress
                  ? 'bg-indigo-950/50 text-indigo-200 border-indigo-700/50 hover:bg-indigo-900/60'
                  : 'bg-indigo-950/60 hover:bg-indigo-900/80 text-indigo-200 border-indigo-600/60'
              }`}
            >
              <div className="flex items-center space-x-2.5 truncate">
                <Wallet className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="truncate">{shortAddress}</span>
              </div>
              {isSiweAuthenticated && (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-1" />
              )}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 pt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-code transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#18182b] text-white border border-indigo-500/40 shadow-lg shadow-indigo-950/60 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                  <span className="capitalize">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar Widgets */}
        <div className="space-y-3 pt-4 border-t border-white/10 font-code text-xs">
          
          {/* Live Block Number */}
          <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-950/80 border border-white/5 text-[11px] text-slate-400 shadow-inner">
            <span className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
              <span>Block #{blockNumber}</span>
            </span>
          </div>

          {/* Network Selector */}
          <div>
            <select
              value={network}
              onChange={(e) => setNetwork(e.target.value as NetworkName)}
              className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-300 font-code rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer shadow-inner"
            >
              <option value="algorand-testnet">Algorand Testnet</option>
              <option value="base-sepolia">Base Sepolia</option>
              <option value="ethereum-sepolia">Ethereum Sepolia</option>
              <option value="arbitrum-sepolia">Arbitrum Sepolia</option>
            </select>
          </div>

          {/* Open in New Tab Action */}
          <button
            onClick={() => window.open(window.location.href, '_blank')}
            className="w-full py-2 px-3 rounded-xl bg-cyan-950/30 hover:bg-cyan-900/50 border border-cyan-800/40 text-cyan-300 text-[11px] font-code flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-sm"
          >
            <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
            <span>Open in New Tab</span>
          </button>

        </div>
      </aside>

      {/* Overlay for mobile drawer */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)} 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}
    </>
  );
};
