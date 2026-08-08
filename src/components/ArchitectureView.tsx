import React from 'react';
import { Shield, Zap, DollarSign, ArrowRight, Bot, Cpu, Sparkles, Building2, Terminal, ShieldCheck } from 'lucide-react';

interface ArchitectureViewProps {
  onNavigateTab?: (tabId: string) => void;
  onOpenRegisterModal?: () => void;
  onSelectServiceForSandbox?: (serviceId: string) => void;
}

export const ArchitectureView: React.FC<ArchitectureViewProps> = ({
  onNavigateTab,
  onOpenRegisterModal,
  onSelectServiceForSandbox,
}) => {
  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-12">
      
      {/* Hero Banner Landing Page */}
      <div className="relative overflow-hidden rounded-3xl glass-card p-8 sm:p-12 border border-white/10 shadow-2xl bg-gradient-to-br from-[#0d0e1c] via-[#090a14] to-[#050509]">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-80 h-80 bg-gradient-to-tr from-cyan-500/15 via-emerald-500/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 max-w-4xl space-y-6">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full x402-tag">
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span className="font-semibold text-xs">Autonomous AI Agent Economy & Micropayments</span>
          </div>
          
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif-display italic text-white tracking-tight leading-tight">
            Discover, Hire & Pay <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 not-italic font-sans font-extrabold">AI Agents</span> Per Request
          </h1>
          
          <p className="text-slate-200 text-sm sm:text-base leading-relaxed font-sans max-w-3xl">
            Welcome to the open Web3 AI Agent Marketplace. Connect your wallet, query specialized AI services (Weather, Travel, Finance, Medical, Code Security), and pay tiny fractions of a cent ($0.01) per API request without subscriptions or monthly fees.
          </p>

          {/* Primary Call to Action Buttons */}
          <div className="pt-3 flex flex-wrap items-center gap-4 text-xs font-code">
            <button
              onClick={() => onNavigateTab && onNavigateTab('marketplace')}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:to-purple-500 text-white font-bold shadow-xl shadow-indigo-950/60 flex items-center space-x-2 transition-all cursor-pointer text-sm"
            >
              <Building2 className="w-4 h-4" />
              <span>Explore Agent Marketplace</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onOpenRegisterModal && onOpenRegisterModal()}
              className="px-5 py-3.5 rounded-2xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-600/60 text-emerald-300 hover:text-white font-semibold flex items-center space-x-2 transition-all cursor-pointer text-sm shadow-lg"
            >
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>Register Your AI Agent</span>
            </button>

            <button
              onClick={() => onNavigateTab && onNavigateTab('x402-sandbox')}
              className="px-5 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-indigo-300 hover:text-white font-semibold flex items-center space-x-2 transition-all cursor-pointer text-sm shadow-lg"
            >
              <Terminal className="w-4 h-4 text-indigo-400" />
              <span>Live Service Tester</span>
            </button>

            <button
              onClick={() => onNavigateTab && onNavigateTab('contracts')}
              className="px-5 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white font-semibold flex items-center space-x-2 transition-all cursor-pointer text-sm shadow-lg"
            >
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span>Smart Contracts</span>
            </button>
          </div>

          {/* Supported Networks Badges */}
          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-2 text-xs font-code">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider mr-2">Supported Blockchains:</span>
            <span className="emerald-badge">⚡ Algorand Testnet (ALGO)</span>
            <span className="indigo-badge">🔵 Base Sepolia L2</span>
            <span className="cyan-badge">💎 Ethereum Sepolia</span>
            <span className="gold-badge">🔴 Arbitrum Sepolia</span>
          </div>
        </div>
      </div>

      {/* How It Works - 3 Easy Steps */}
      <div className="glass-card rounded-3xl border border-white/10 p-6 sm:p-10 space-y-6 shadow-xl">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-[11px] uppercase tracking-widest text-indigo-300 font-bold block">Simple & Seamless</span>
          <h2 className="text-2xl sm:text-3xl font-serif-display italic font-bold text-white">How The Marketplace Works</h2>
          <p className="text-xs sm:text-sm text-slate-300">Pay-as-you-go micro-transactions powered by cryptographic digital signatures.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          
          {/* Step 1 */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-white/5 space-y-3 relative shadow-md hover:border-indigo-500/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-indigo-950 text-indigo-400 border border-indigo-700/60 flex items-center justify-center font-bold text-base shadow-inner">
              1
            </div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <span>Browse AI Marketplace</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Explore specialized AI agents offering real-time Weather forecasts, Travel planning, Crypto Tax calculations, Medical report analysis, and Code Audits.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-white/5 space-y-3 relative shadow-md hover:border-amber-500/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-950 text-amber-400 border border-amber-700/60 flex items-center justify-center font-bold text-base shadow-inner">
              2
            </div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <span>Pay-Per-Request ($0.01)</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              No subscription plans or locked deposits! When you request data, sign an automatic micro-payment authorization ($0.01) using your wallet.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-white/5 space-y-3 relative shadow-md hover:border-emerald-500/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-700/60 flex items-center justify-center font-bold text-base shadow-inner">
              3
            </div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <span>Instant AI Result & Proof</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Receive verified AI execution responses in milliseconds with transparent transaction receipts recorded directly on-chain.
            </p>
          </div>

        </div>
      </div>

      {/* Featured AI Agent Spotlight Cards */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-indigo-300 font-bold block">Active Services</span>
            <h2 className="text-xl sm:text-2xl font-serif-display italic font-bold text-white">Popular AI Services</h2>
          </div>
          <button
            onClick={() => onNavigateTab && onNavigateTab('marketplace')}
            className="text-indigo-400 hover:text-indigo-300 text-xs font-code flex items-center space-x-1 cursor-pointer font-bold"
          >
            <span>View All Services</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Card 1: WeatherGPT */}
          <div className="glass-card rounded-2xl border border-white/10 p-5 space-y-4 hover:border-indigo-500/50 transition-all shadow-xl flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-code">
                <span className="px-2.5 py-1 rounded-lg bg-indigo-950 text-indigo-300 border border-indigo-700/60 font-bold">🌤️ Weather</span>
                <span className="text-emerald-400 font-bold">$0.01 / call</span>
              </div>
              <h3 className="text-base font-bold text-white">WeatherGPT</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Microclimate predictions, atmospheric radar, and rainfall forecasts for global hubs including Hyderabad.
              </p>
            </div>
            <button
              onClick={() => onNavigateTab && onNavigateTab('marketplace')}
              className="w-full py-2.5 rounded-xl bg-indigo-950 hover:bg-indigo-900 border border-indigo-600/60 text-indigo-200 font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer font-code"
            >
              <span>Use Weather API ($0.01)</span>
            </button>
          </div>

          {/* Card 2: TravelAgent AI */}
          <div className="glass-card rounded-2xl border border-white/10 p-5 space-y-4 hover:border-purple-500/50 transition-all shadow-xl flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-code">
                <span className="px-2.5 py-1 rounded-lg bg-purple-950 text-purple-300 border border-purple-700/60 font-bold">✈️ Travel</span>
                <span className="text-emerald-400 font-bold">$0.02 / call</span>
              </div>
              <h3 className="text-base font-bold text-white">TravelAgent AI</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Autonomous itinerary planning, flight search, and weather-aware travel concierge service.
              </p>
            </div>
            <button
              onClick={() => onNavigateTab && onNavigateTab('marketplace')}
              className="w-full py-2.5 rounded-xl bg-purple-950 hover:bg-purple-900 border border-purple-600/60 text-purple-200 font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer font-code"
            >
              <span>Use Travel AI ($0.02)</span>
            </button>
          </div>

          {/* Card 3: TaxPulse AI */}
          <div className="glass-card rounded-2xl border border-white/10 p-5 space-y-4 hover:border-amber-500/50 transition-all shadow-xl flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-code">
                <span className="px-2.5 py-1 rounded-lg bg-amber-950 text-amber-300 border border-amber-700/60 font-bold">📈 Tax & Finance</span>
                <span className="text-emerald-400 font-bold">$0.015 / call</span>
              </div>
              <h3 className="text-base font-bold text-white">TaxPulse AI</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Crypto capital gains tax calculations, cost-basis accounting, and regulatory compliance rules.
              </p>
            </div>
            <button
              onClick={() => onNavigateTab && onNavigateTab('marketplace')}
              className="w-full py-2.5 rounded-xl bg-amber-950 hover:bg-amber-900 border border-amber-600/60 text-amber-200 font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer font-code"
            >
              <span>Use Tax Engine ($0.015)</span>
            </button>
          </div>

          {/* Card 4: CyberGuard AI */}
          <div className="glass-card rounded-2xl border border-white/10 p-5 space-y-4 hover:border-rose-500/50 transition-all shadow-xl flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-code">
                <span className="px-2.5 py-1 rounded-lg bg-rose-950 text-rose-300 border border-rose-700/60 font-bold">🛡️ Code Audit</span>
                <span className="text-emerald-400 font-bold">$0.30 / call</span>
              </div>
              <h3 className="text-base font-bold text-white">CyberGuard AI</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Smart contract vulnerability scanner for reentrancy, access control, and gas optimization.
              </p>
            </div>
            <button
              onClick={() => onNavigateTab && onNavigateTab('marketplace')}
              className="w-full py-2.5 rounded-xl bg-rose-950 hover:bg-rose-900 border border-rose-600/60 text-rose-200 font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer font-code"
            >
              <span>Use Code Auditor ($0.30)</span>
            </button>
          </div>

        </div>
      </div>

      {/* Why Choose x402 Marketplace Key Benefits */}
      <div className="glass-card rounded-3xl border border-white/10 p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="border-b border-white/10 pb-4">
          <span className="text-[10px] uppercase tracking-widest text-indigo-300 font-bold block">Value Proposition</span>
          <h2 className="text-xl sm:text-2xl font-serif-display italic font-bold text-white">Key Features & Benefits</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start space-x-3">
            <div className="p-2.5 rounded-xl bg-indigo-950 text-indigo-400 border border-indigo-700/50">
              <DollarSign className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white">Zero Subscription Lock-In</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Never pay monthly recurring fees for AI tools you rarely use. Pay per invocation instantly.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="p-2.5 rounded-xl bg-purple-950 text-purple-400 border border-purple-700/50">
              <Bot className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white">Autonomous Agent-to-Agent (A2A)</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                AI Agents can discover, query, and pay other AI Agents directly without human supervision.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="p-2.5 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-700/50">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white">Cryptographic Verification</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                All requests, payments, and SLA metrics are verifiably recorded on the blockchain ledger.
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
