import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ArchitectureView } from './components/ArchitectureView';
import { MarketplaceView } from './components/MarketplaceView';
import { AgentRegisterModal } from './components/AgentRegisterView';
import { X402SandboxView } from './components/X402SandboxView';
import { ContractExplorerView } from './components/ContractExplorerView';
import { IndexerLogView } from './components/IndexerLogView';
import { SecurityAndTestingView } from './components/SecurityAndTestingView';
import { DocsAndDeploymentView } from './components/DocsAndDeploymentView';
import { WalletModal } from './components/WalletModal';
import { NetworkName } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('architecture');
  const [network, setNetwork] = useState<NetworkName>(() => {
    const saved = localStorage.getItem('x402_network') as NetworkName;
    if (saved && ['algorand-testnet', 'base-sepolia', 'ethereum-sepolia', 'arbitrum-sepolia'].includes(saved)) {
      return saved;
    }
    return 'algorand-testnet';
  });
  const [walletAddress, setWalletAddressState] = useState<string>(() => {
    const saved = localStorage.getItem('x402_wallet_address');
    if (saved && saved !== '0xF1b0...10F3') {
      return saved;
    }
    return '';
  });
  const [isSiweAuthenticated, setIsSiweAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('x402_siwe_authed') === 'true';
  });
  const [blockNumber, setBlockNumber] = useState<number>(18942099);

  const setWalletAddress = (addr: string) => {
    setWalletAddressState(addr);
    if (addr) {
      localStorage.setItem('x402_wallet_address', addr);
    } else {
      localStorage.removeItem('x402_wallet_address');
      localStorage.removeItem('x402_siwe_authed');
      setIsSiweAuthenticated(false);
    }
  };

  const handleSetNetwork = (net: NetworkName) => {
    setNetwork(net);
    localStorage.setItem('x402_network', net);
  };
  
  // Modals & Cross-tab state
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [sandboxServiceId, setSandboxServiceId] = useState<string>('');
  const [refreshKey, setRefreshKey] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBlockNumber((prev) => prev + 1);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSelectServiceForSandbox = (serviceId: string) => {
    setSandboxServiceId(serviceId);
    setActiveTab('x402-sandbox');
  };

  return (
    <div className="min-h-screen bg-[#050508] text-slate-100 font-sans selection:bg-indigo-500 selection:text-white flex flex-col lg:flex-row">
      
      {/* Left Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        network={network}
        setNetwork={handleSetNetwork}
        walletAddress={walletAddress}
        isSiweAuthenticated={isSiweAuthenticated}
        onOpenWalletModal={() => setIsWalletModalOpen(true)}
        blockNumber={blockNumber}
      />

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <main className="w-full px-4 sm:px-8 lg:px-10 py-8 max-w-7xl mx-auto">
          
          {activeTab === 'architecture' && (
            <ArchitectureView
              onNavigateTab={setActiveTab}
              onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
              onSelectServiceForSandbox={handleSelectServiceForSandbox}
            />
          )}

          {activeTab === 'marketplace' && (
            <MarketplaceView
              onSelectServiceForSandbox={handleSelectServiceForSandbox}
              onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
              refreshKey={refreshKey}
              walletAddress={walletAddress}
            />
          )}

          {activeTab === 'x402-sandbox' && (
            <X402SandboxView
              selectedServiceId={sandboxServiceId}
              walletAddress={walletAddress}
            />
          )}

          {activeTab === 'contracts' && (
            <ContractExplorerView network={network} />
          )}

          {activeTab === 'indexer' && <IndexerLogView />}

          {activeTab === 'security' && <SecurityAndTestingView />}

          {activeTab === 'docs' && <DocsAndDeploymentView />}

        </main>

        {/* Footer */}
        <footer className="border-t border-white/5 bg-[#07070b] py-6 text-xs font-code text-slate-500 text-center">
          <div className="max-w-7xl mx-auto px-4 space-y-1.5">
            <p className="text-slate-400">AI Agent Service Registry & x402 Micropayment Protocol v1.0.0</p>
            <p className="text-slate-600 text-[11px]">Base L2 (8453) • EVM Smart Contracts • EIP-712 Signatures • Sign-In with Ethereum (EIP-4361)</p>
          </div>
        </footer>
      </div>

      {/* Modals */}
      <AgentRegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        walletAddress={walletAddress}
        onSuccess={() => setRefreshKey((prev) => prev + 1)}
      />

      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        walletAddress={walletAddress}
        setWalletAddress={setWalletAddress}
        isSiweAuthenticated={isSiweAuthenticated}
        setIsSiweAuthenticated={setIsSiweAuthenticated}
      />

    </div>
  );
}

