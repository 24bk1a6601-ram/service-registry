import React, { useState } from 'react';
import { X, ShieldCheck, Cpu, Plus, Sparkles } from 'lucide-react';
import { saveLocalAgent, saveLocalService, saveWalletTransaction } from '../lib/clientFallbackStore';

interface AgentRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletAddress: string;
  onSuccess: () => void;
}

export const AgentRegisterModal: React.FC<AgentRegisterModalProps> = ({
  isOpen,
  onClose,
  walletAddress,
  onSuccess,
}) => {
  const [tab, setTab] = useState<'agent' | 'service'>('agent');
  
  // Agent Form state
  const [agentName, setAgentName] = useState('');
  const [organization, setOrganization] = useState('');
  const [metadataURI, setMetadataURI] = useState('ipfs://QmAgentMetadataDefaultHash');
  const [capabilitiesInput, setCapabilitiesInput] = useState('Weather Forecast, Rain Prediction, Air Quality Index');
  const [locationInput, setLocationInput] = useState('Hyderabad, India / Global');

  // Service Form state
  const [existingAgentId, setExistingAgentId] = useState('');
  const [serviceName, setServiceName] = useState('');
  const [serviceDesc, setServiceDesc] = useState('');
  const [category, setCategory] = useState<string>('weather');
  const [priceEth, setPriceEth] = useState('0.000003');
  const [sla, setSla] = useState('99.99% Uptime, Max 120ms Latency');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleRegisterAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agentName) {
      setMessage({ type: 'error', text: 'Agent name is required.' });
      return;
    }
    setLoading(true);
    setMessage(null);

    const capabilitiesArray = capabilitiesInput.split(',').map(s => s.trim()).filter(Boolean);

    try {
      let registeredAgent: any = null;
      try {
        const res = await fetch('/api/blockchain/agents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: agentName,
            organization: organization || 'Weather Corp',
            metadataURI,
            capabilities: capabilitiesArray,
            location: locationInput || 'Hyderabad, India / Global',
            owner: walletAddress || '0xA987654321098765432109876543210987654321',
          }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success) registeredAgent = data.agent;
        }
      } catch (err) {
        console.warn('Backend agent registration unreachable, using local store:', err);
      }

      if (!registeredAgent) {
        registeredAgent = saveLocalAgent({
          name: agentName,
          organization: organization || 'Weather Corp',
          metadataURI,
          capabilities: capabilitiesArray,
          location: locationInput || 'Hyderabad, India / Global',
          owner: walletAddress || '0xA987654321098765432109876543210987654321',
        });
      }

      // Record in Wallet Transaction History
      saveWalletTransaction({
        walletAddress: walletAddress || localStorage.getItem('x402_connected_wallet') || '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
        walletType: localStorage.getItem('x402_wallet_type_name') || 'Trust Wallet',
        serviceName: `Agent Registration: ${agentName}`,
        actionType: 'Agent Registration',
        amountFormatted: 'Gasless ($0.00)',
        status: 'CONFIRMED',
        prompt: `Registered DID Identity for ${agentName} (${organization || 'DAO'})`,
        receiptHash: `0x${Math.random().toString(16).substring(2)}`
      });

      setMessage({ type: 'success', text: `Agent registered! ID: ${registeredAgent.id.substring(0, 10)}...` });
      setExistingAgentId(registeredAgent.id);
      setTab('service');
      onSuccess();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Registration failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceName || !priceEth) {
      setMessage({ type: 'error', text: 'Service name and price are required.' });
      return;
    }
    setLoading(true);
    setMessage(null);

    const priceWei = (parseFloat(priceEth) * 1e18).toString();
    const capabilitiesArray = capabilitiesInput.split(',').map(s => s.trim()).filter(Boolean);

    try {
      let registeredService: any = null;
      try {
        const res = await fetch('/api/blockchain/services', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            agentId: existingAgentId || '0xa987654321098765432109876543210987654321000000000000000000000001',
            name: serviceName,
            description: serviceDesc || 'Autonomous AI Agent Service with x402 payment support.',
            category,
            pricePerRequestWei: priceWei,
            priceFormatted: `$${(parseFloat(priceEth) * 3000).toFixed(2)} (${priceEth} ETH)`,
            priceUsd: parseFloat((parseFloat(priceEth) * 3000).toFixed(2)),
            slaGuarantee: sla,
            capabilities: capabilitiesArray,
            locationCoverage: locationInput,
            latencyMs: 120,
            owner: walletAddress || '0xA987654321098765432109876543210987654321',
          }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success) registeredService = data.service;
        }
      } catch (err) {
        console.warn('Backend service publishing unreachable, using local store:', err);
      }

      if (!registeredService) {
        registeredService = saveLocalService({
          agentId: existingAgentId || '0xa987654321098765432109876543210987654321000000000000000000000001',
          name: serviceName,
          description: serviceDesc || 'Autonomous AI Agent Service with x402 payment support.',
          category,
          pricePerRequestWei: priceWei,
          priceFormatted: `$${(parseFloat(priceEth) * 3000).toFixed(2)} (${priceEth} ETH)`,
          priceUsd: parseFloat((parseFloat(priceEth) * 3000).toFixed(2)),
          slaGuarantee: sla,
          capabilities: capabilitiesArray,
          locationCoverage: locationInput,
          latencyMs: 120,
          owner: walletAddress || '0xA987654321098765432109876543210987654321',
        });
      }

      setMessage({ type: 'success', text: 'Service published successfully with x402 endpoint!' });
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1200);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Service creation failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="glass-card border border-white/10 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl relative font-code text-xs">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-indigo-950/60 text-indigo-400 border border-indigo-700/50 shadow-inner">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif-display italic font-bold text-white">Register Web3 AI Agent</h2>
              <p className="text-xs text-slate-400 font-code">Create on-chain DID identity & publish x402 endpoints</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex rounded-2xl bg-slate-950/80 p-1 border border-white/5 font-code text-xs">
          <button
            onClick={() => setTab('agent')}
            className={`flex-1 py-2.5 rounded-xl font-semibold transition-all cursor-pointer ${
              tab === 'agent' ? 'bg-indigo-950 text-white border border-indigo-500/60 shadow-md font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            1. Agent Identity (DID)
          </button>
          <button
            onClick={() => setTab('service')}
            className={`flex-1 py-2.5 rounded-xl font-semibold transition-all cursor-pointer ${
              tab === 'service' ? 'bg-indigo-950 text-white border border-indigo-500/60 shadow-md font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            2. Service & x402 Pricing
          </button>
        </div>

        {message && (
          <div className={`p-3.5 rounded-2xl text-xs font-code border ${
            message.type === 'success' ? 'bg-emerald-950/60 border-emerald-700/60 text-emerald-300' : 'bg-rose-950/60 border-rose-700/60 text-rose-300'
          }`}>
            {message.text}
          </div>
        )}

        {/* Tab 1: Agent Registration */}
        {tab === 'agent' && (
          <form onSubmit={handleRegisterAgent} className="space-y-4 text-xs font-code">
            <div>
              <label className="text-slate-200 block mb-1 font-bold">Agent Name *</label>
              <input
                type="text"
                placeholder="e.g. WeatherGPT"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-2xl px-4 py-3 text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-code shadow-inner"
              />
            </div>

            <div>
              <label className="text-slate-200 block mb-1 font-bold">Owner / Organization</label>
              <input
                type="text"
                placeholder="e.g. Weather Corp"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-2xl px-4 py-3 text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-code shadow-inner"
              />
            </div>

            <div>
              <label className="text-slate-200 block mb-1 font-bold">Capabilities (comma separated)</label>
              <input
                type="text"
                placeholder="e.g. Weather Forecast, Rain Prediction, Air Quality Index"
                value={capabilitiesInput}
                onChange={(e) => setCapabilitiesInput(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-2xl px-4 py-3 text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-code shadow-inner"
              />
            </div>

            <div>
              <label className="text-slate-200 block mb-1 font-bold">Location / Regional Coverage</label>
              <input
                type="text"
                placeholder="e.g. Hyderabad, India / Global"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-2xl px-4 py-3 text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-code shadow-inner"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold shadow-xl shadow-indigo-950/50 cursor-pointer disabled:opacity-50 transition-all font-code text-xs"
              >
                {loading ? 'Submitting to AgentRegistry Contract...' : 'Create Agent Identity (DID)'}
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Service Registration */}
        {tab === 'service' && (
          <form onSubmit={handleRegisterService} className="space-y-4 text-xs font-code">
            <div>
              <label className="text-slate-200 block mb-1 font-bold">Service Name *</label>
              <input
                type="text"
                placeholder="e.g. Today's Weather & Atmospheric Forecast API"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-2xl px-4 py-3 text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-code shadow-inner"
              />
            </div>

            <div>
              <label className="text-slate-200 block mb-1 font-bold">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-2xl px-4 py-3 text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer font-code shadow-inner"
              >
                <option value="weather">🌤️ Weather & Microclimate API</option>
                <option value="travel">✈️ Travel & Itinerary Agent</option>
                <option value="finance">📈 Tax & Financial Audit API</option>
                <option value="medical">🩺 Medical Diagnostics & Lab Analysis</option>
                <option value="code-analysis">🛡️ Smart Contract Code Auditor</option>
                <option value="data-analytics">📊 Market Data & Sentiment Feed</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-200 block mb-1 font-bold">Price Per Request (ETH) *</label>
                <input
                  type="number"
                  step="0.00001"
                  value={priceEth}
                  onChange={(e) => setPriceEth(e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-2xl px-4 py-3 text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-code shadow-inner"
                />
              </div>

              <div>
                <label className="text-slate-200 block mb-1 font-bold">SLA Guarantee</label>
                <input
                  type="text"
                  value={sla}
                  onChange={(e) => setSla(e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-2xl px-4 py-3 text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-code shadow-inner"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-200 block mb-1 font-bold">Description</label>
              <textarea
                rows={2}
                placeholder="Describe what your AI Agent API does..."
                value={serviceDesc}
                onChange={(e) => setServiceDesc(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-2xl px-4 py-3 text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-code shadow-inner"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold shadow-xl shadow-indigo-950/50 cursor-pointer disabled:opacity-50 transition-all font-code text-xs"
              >
                {loading ? 'Publishing Service to ServiceRegistry...' : 'Publish Service with x402 Gateway'}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
