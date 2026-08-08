import React, { useState, useEffect } from 'react';
import { Cpu, Search, Filter, ShieldCheck, Star, Zap, ExternalLink, Plus, Layers, ArrowRight, Tag, MapPin, Clock, DollarSign, Bot, Sparkles } from 'lucide-react';
import { AgentIdentity, AgentService } from '../types';
import { InvokeServiceModal } from './InvokeServiceModal';

interface MarketplaceViewProps {
  onSelectServiceForSandbox: (serviceId: string) => void;
  onOpenRegisterModal: () => void;
  refreshKey?: number;
  walletAddress?: string;
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({
  onSelectServiceForSandbox,
  onOpenRegisterModal,
  refreshKey = 0,
  walletAddress = '',
}) => {
  const [agents, setAgents] = useState<AgentIdentity[]>([]);
  const [services, setServices] = useState<AgentService[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedPriceFilter, setSelectedPriceFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  // Invoke Modal State
  const [selectedServiceForInvoke, setSelectedServiceForInvoke] = useState<AgentService | null>(null);
  const [isInvokeModalOpen, setIsInvokeModalOpen] = useState(false);

  useEffect(() => {
    fetchMarketplaceData();
  }, [refreshKey]);

  const fetchMarketplaceData = async () => {
    setLoading(true);
    try {
      const [agentsRes, servicesRes] = await Promise.all([
        fetch('/api/blockchain/agents'),
        fetch('/api/blockchain/services')
      ]);
      const agentsData = await agentsRes.json();
      const servicesData = await servicesRes.json();
      setAgents(agentsData);
      setServices(servicesData);
    } catch (err) {
      console.error('Error fetching marketplace data:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = services.filter((svc) => {
    const agent = agents.find((a) => a.id === svc.agentId);
    
    // Search query matching
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery ||
      svc.name.toLowerCase().includes(searchLower) ||
      svc.description.toLowerCase().includes(searchLower) ||
      (svc.capabilities && svc.capabilities.some(c => c.toLowerCase().includes(searchLower))) ||
      (agent && agent.name.toLowerCase().includes(searchLower)) ||
      (agent && agent.organization.toLowerCase().includes(searchLower));

    // Category matching
    const matchesCategory = selectedCategory === 'all' || svc.category === selectedCategory;

    // Location matching
    const locationText = (svc.locationCoverage || agent?.location || '').toLowerCase();
    const matchesLocation = selectedLocation === 'all' ||
      (selectedLocation === 'hyderabad' && locationText.includes('hyderabad')) ||
      (selectedLocation === 'global' && locationText.includes('global'));

    // Price matching
    const priceUsd = svc.priceUsd || 0.01;
    const matchesPrice = selectedPriceFilter === 'all' ||
      (selectedPriceFilter === 'under-02' && priceUsd <= 0.02) ||
      (selectedPriceFilter === 'under-05' && priceUsd <= 0.05);

    return matchesSearch && matchesCategory && matchesLocation && matchesPrice;
  });

  // WeatherGPT service ID for direct shortcut demo
  const weatherGptService = services.find(s => s.category === 'weather');

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* Real-World Analogy Banner: Travel AI -> Weather AI */}
      <div className="relative overflow-hidden rounded-3xl glass-card p-6 sm:p-8 border border-white/10 shadow-2xl space-y-4">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full x402-tag">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Universal Agent-to-Agent (A2A) Micro-Economy</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-serif-display italic font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-indigo-200 tracking-tight">
              Autonomous AI Service Registry & x402 Marketplace
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              AI Agents don't work alone anymore. A <strong className="text-indigo-300 font-semibold">Travel AI Agent</strong> booking a flight can automatically search for <strong className="text-indigo-300 font-semibold">WeatherGPT ($0.01)</strong>, pay via x402 header, and consume real-time rainfall predictions without human intervention.
            </p>
          </div>

          {/* Interactive A2A Flow Diagram Shortcut */}
          <div className="bg-slate-900/80 p-4 rounded-2xl border border-white/10 space-y-3 w-full lg:w-auto font-code text-xs shadow-xl backdrop-blur-md">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center justify-between font-bold">
              <span>Example A2A Execution</span>
              <span className="text-emerald-400 font-bold">x402 Protocol</span>
            </div>
            <div className="flex items-center justify-between space-x-2 text-[11px]">
              <div className="flex items-center space-x-1.5 text-indigo-300 font-bold bg-indigo-950/60 px-3 py-1.5 rounded-xl border border-indigo-700/50 shadow-sm">
                <Bot className="w-3.5 h-3.5" />
                <span>Travel AI</span>
              </div>
              <span className="text-slate-500 text-[10px]">➜ discovery ➜</span>
              <div className="flex items-center space-x-1.5 text-amber-300 font-bold bg-amber-950/60 px-3 py-1.5 rounded-xl border border-amber-700/50 shadow-sm">
                <Zap className="w-3.5 h-3.5" />
                <span>WeatherGPT</span>
              </div>
            </div>
            {weatherGptService && (
              <button
                onClick={() => onSelectServiceForSandbox(weatherGptService.id)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-[11px] flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-lg shadow-indigo-950/50"
              >
                <span>Simulate Travel AI ➜ WeatherGPT Call ($0.01)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Top Header & Register Action */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 glass-card p-6 rounded-3xl border border-white/10 shadow-xl">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-indigo-300 block font-bold">AI Service Registry</span>
          <h2 className="text-xl font-serif-display italic font-bold text-white flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-indigo-400" />
            <span>Marketplace Discovery Engine</span>
          </h2>
          <p className="text-xs text-slate-400 font-code mt-0.5">Search by category, capability, price, or location (e.g. Hyderabad)</p>
        </div>

        <button
          onClick={onOpenRegisterModal}
          className="flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-600/60 text-indigo-200 hover:text-white font-medium text-xs shadow-lg shadow-indigo-950/40 transition-all cursor-pointer font-code"
        >
          <Plus className="w-4 h-4" />
          <span>Register Agent & Service</span>
        </button>
      </div>

      {/* Discovery Engine Controls: Search, Category, Location, Price Filters */}
      <div className="glass-card p-5 rounded-3xl border border-white/10 space-y-4 shadow-xl">
        
        {/* Search Input */}
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder="Search AI Agent services (e.g., Weather, WeatherGPT, Rain Prediction, Travel, Tax, Hyderabad)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-700/80 rounded-2xl pl-11 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-code shadow-inner"
          />
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-code pt-1">
          
          {/* Category Tabs */}
          <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
            <span className="text-slate-400 text-[10px] uppercase mr-1 font-bold">Category:</span>
            {[
              { id: 'all', label: 'All' },
              { id: 'weather', label: '🌤️ Weather' },
              { id: 'travel', label: '✈️ Travel' },
              { id: 'finance', label: '📈 Tax & Finance' },
              { id: 'medical', label: '🩺 Medical' },
              { id: 'code-analysis', label: '🛡️ Audit' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-code whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-indigo-950 text-white border border-indigo-500/60 font-bold shadow-md'
                    : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Location & Price Filters */}
          <div className="flex items-center space-x-2">
            
            {/* Location Selector */}
            <div className="flex items-center space-x-1.5 bg-slate-900/80 border border-slate-700/80 rounded-xl px-3 py-1.5">
              <MapPin className="w-3.5 h-3.5 text-indigo-400" />
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="bg-transparent text-xs text-slate-200 font-code focus:outline-none cursor-pointer"
              >
                <option value="all">All Locations</option>
                <option value="hyderabad">📍 Hyderabad</option>
                <option value="global">🌐 Global</option>
              </select>
            </div>

            {/* Price Filter Selector */}
            <div className="flex items-center space-x-1.5 bg-slate-900/80 border border-slate-700/80 rounded-xl px-3 py-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              <select
                value={selectedPriceFilter}
                onChange={(e) => setSelectedPriceFilter(e.target.value)}
                className="bg-transparent text-xs text-slate-200 font-code focus:outline-none cursor-pointer"
              >
                <option value="all">Any Price</option>
                <option value="under-02">Price &lt; $0.02</option>
                <option value="under-05">Price &lt; $0.05</option>
              </select>
            </div>

          </div>

        </div>

      </div>

      {/* Services Grid */}
      {loading ? (
        <div className="text-center py-12 text-slate-400 text-xs font-code animate-pulse">
          Querying Smart Contracts for Registered AI Services...
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="text-center py-12 glass-card rounded-3xl border border-white/10 space-y-3">
          <p className="text-slate-400 text-sm font-sans">No registered AI Agent services match your search filter criteria.</p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('all'); setSelectedLocation('all'); setSelectedPriceFilter('all'); }}
            className="text-indigo-400 text-xs font-code underline hover:text-indigo-300 cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredServices.map((svc) => {
            const agent = agents.find((a) => a.id === svc.agentId);
            return (
              <div
                key={svc.id}
                className="glass-card glass-card-hover rounded-3xl border border-white/10 p-6 flex flex-col justify-between space-y-5 transition-all shadow-xl group relative overflow-hidden"
              >
                <div className="space-y-3.5">
                  
                  {/* Category, Rating, Latency */}
                  <div className="flex items-center justify-between text-xs font-code">
                    <span className="px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-700/50 text-indigo-300 font-bold uppercase text-[10px] tracking-wider">
                      {svc.category}
                    </span>
                    
                    <div className="flex items-center space-x-3 text-slate-400">
                      <span className="flex items-center space-x-1 text-amber-300 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-300" />
                        <span>{svc.rating}</span>
                      </span>
                      <span className="flex items-center space-x-1 text-emerald-400 font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{svc.latencyMs || 120}ms</span>
                      </span>
                      <span>v{svc.currentVersion}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {svc.name}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-300 text-xs leading-relaxed line-clamp-2 font-sans">
                    {svc.description}
                  </p>

                  {/* Capabilities Badges */}
                  {svc.capabilities && svc.capabilities.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {svc.capabilities.map((cap, i) => (
                        <span key={i} className="px-2.5 py-0.5 rounded-lg bg-slate-900 text-slate-200 border border-slate-700/80 text-[10px] font-code">
                          {cap}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Agent Identity & Organization Info */}
                  {agent && (
                    <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/5 flex items-center justify-between text-xs font-code shadow-inner">
                      <div>
                        <div className="text-slate-200 font-semibold flex items-center space-x-1.5">
                          <Bot className="w-3.5 h-3.5 text-indigo-400" />
                          <span>{agent.name}</span>
                          <span className="text-[10px] text-slate-400">({agent.organization})</span>
                          {agent.verified && <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 inline" />}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">{agent.did}</div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-emerald-400 font-bold block">Rep: {agent.reputationScore}/100</span>
                      </div>
                    </div>
                  )}

                  {/* SLA & Location */}
                  <div className="flex items-center justify-between text-[11px] font-code text-slate-400 pt-1">
                    <span className="flex items-center space-x-1 text-indigo-300">
                      <MapPin className="w-3 h-3 text-indigo-400" />
                      <span>{svc.locationCoverage || agent?.location || 'Global'}</span>
                    </span>
                    <span>Invocations: {svc.totalInvocations.toLocaleString()}</span>
                  </div>
                </div>

                {/* Footer Pricing & Invoke Action */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-code block font-bold">Price Per Call</span>
                    <span className="x402-tag font-bold text-xs">{svc.priceFormatted}</span>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedServiceForInvoke(svc);
                      setIsInvokeModalOpen(true);
                    }}
                    className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-950 to-slate-900 hover:from-indigo-900 hover:to-slate-800 border border-indigo-600/50 text-indigo-200 hover:text-white font-code text-xs font-bold transition-all cursor-pointer shadow-lg shadow-indigo-950/40"
                  >
                    <span>Use Service</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Inline Service Invocation Modal */}
      <InvokeServiceModal
        isOpen={isInvokeModalOpen}
        onClose={() => {
          setIsInvokeModalOpen(false);
          setSelectedServiceForInvoke(null);
        }}
        service={selectedServiceForInvoke}
        agent={agents.find((a) => a.id === selectedServiceForInvoke?.agentId) || null}
        walletAddress={walletAddress}
      />

    </div>
  );
};

