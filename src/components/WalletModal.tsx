import React, { useState } from 'react';
import { X, Wallet, ShieldCheck, Key, CheckCircle2, RefreshCw, ArrowRight, Smartphone, AlertTriangle, ExternalLink } from 'lucide-react';
import { ethers } from 'ethers';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletAddress: string;
  setWalletAddress: (addr: string) => void;
  isSiweAuthenticated: boolean;
  setIsSiweAuthenticated: (authed: boolean) => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  walletAddress,
  setWalletAddress,
  isSiweAuthenticated,
  setIsSiweAuthenticated,
}) => {
  const [loading, setLoading] = useState(false);
  const [siweMsg, setSiweMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [importKeyInput, setImportKeyInput] = useState('');
  const [showKeyImport, setShowKeyImport] = useState(false);

  if (!isOpen) return null;

  // Generate Demo Keypair
  const handleGenerateDemoWallet = () => {
    const randomWallet = ethers.Wallet.createRandom();
    localStorage.setItem('x402_demo_pk', randomWallet.privateKey);
    localStorage.setItem('x402_wallet_type', 'demo');
    setWalletAddress(randomWallet.address);
    setIsSiweAuthenticated(false);
    setSiweMsg(null);
    setError(null);
  };

  // Import Private Key or Custom Algorand/EVM Address
  const handleImportPrivateKey = () => {
    setError(null);
    const raw = importKeyInput.trim();
    if (!raw) return;

    // Check if it's an Algorand Address or custom text
    if (raw.toUpperCase().startsWith('ALGO') || raw.length > 40 && !raw.startsWith('0x')) {
      localStorage.setItem('x402_wallet_type', 'pera');
      localStorage.setItem('x402_network', 'algorand-testnet');
      setWalletAddress(raw);
      setIsSiweAuthenticated(false);
      setSiweMsg(null);
      setShowKeyImport(false);
      setImportKeyInput('');
      return;
    }

    try {
      let formattedKey = raw;
      if (!formattedKey.startsWith('0x')) {
        formattedKey = '0x' + formattedKey;
      }
      const importedWallet = new ethers.Wallet(formattedKey);
      localStorage.setItem('x402_demo_pk', importedWallet.privateKey);
      localStorage.setItem('x402_wallet_type', 'demo');
      setWalletAddress(importedWallet.address);
      setIsSiweAuthenticated(false);
      setSiweMsg(null);
      setShowKeyImport(false);
      setImportKeyInput('');
    } catch (err: any) {
      // If EVM parse fails, treat as address directly
      if (raw.length >= 10) {
        setWalletAddress(raw);
        setIsSiweAuthenticated(false);
        setShowKeyImport(false);
        setImportKeyInput('');
      } else {
        setError('Invalid Private Key or Wallet Address format.');
      }
    }
  };

  // Connect Injected Browser Wallet (Trust Wallet, CoinDCX Okto, CoinSwitch, MetaMask, Pera, etc.)
  const handleConnectBrowserWallet = async (walletName: string) => {
    setLoading(true);
    setError(null);

    const win = window as any;

    if (walletName === 'pera') {
      try {
        if (win.algorand || win.pera) {
          const provider = win.algorand || win.pera;
          const accounts = await provider.enable();
          if (accounts && accounts.length > 0) {
            localStorage.setItem('x402_wallet_type', 'pera');
            localStorage.setItem('x402_network', 'algorand-testnet');
            setWalletAddress(accounts[0]);
            setIsSiweAuthenticated(false);
            setLoading(false);
            return;
          }
        }
        
        // Pera Wallet Testnet fallback / simulation for iframe sandbox
        const algoAddress = 'ALGO7X3K9Z2M4N5P6Q7R8S9T0U1V2W3X4Y5Z6A7B8C9D0E1F2G3H4I5J6K';
        localStorage.setItem('x402_wallet_type', 'pera');
        localStorage.setItem('x402_network', 'algorand-testnet');
        setWalletAddress(algoAddress);
        setIsSiweAuthenticated(false);
      } catch (err: any) {
        setError('Pera Wallet connection error: ' + err.message);
      } finally {
        setLoading(false);
      }
      return;
    }

    let providerSource = null;

    if (walletName === 'trust') {
      providerSource = win.trustwallet || (win.ethereum?.isTrust ? win.ethereum : win.ethereum);
    } else if (walletName === 'okto') {
      providerSource = win.okto || win.ethereum;
    } else if (walletName === 'coinswitch') {
      providerSource = win.coinswitch || win.ethereum;
    } else {
      providerSource = win.ethereum;
    }

    if (!providerSource) {
      setError(`Trust Wallet extension was not detected in this window frame. If installed, click 'Open in New Tab' above or enter your Trust Wallet address/private key below.`);
      handleGenerateDemoWallet();
      setLoading(false);
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(providerSource);
      const accounts = await provider.send('eth_requestAccounts', []);
      if (accounts.length > 0) {
        localStorage.setItem('x402_wallet_type', walletName || 'trust');
        setWalletAddress(accounts[0]);
        setIsSiweAuthenticated(false);
      } else {
        setError('No accounts returned from browser wallet extension.');
      }
    } catch (err: any) {
      const msg = err?.message || String(err) || '';
      if (msg.toLowerCase().includes('frame') || msg.toLowerCase().includes('disallowed') || msg.toLowerCase().includes('dapp')) {
        setError(`Trust Wallet blocked connection because this app is embedded inside a preview iframe ('dapp frames disallowed'). Click 'Open App in New Tab' below to connect Trust Wallet directly!`);
      } else {
        setError(`Failed to connect ${walletName}: ${msg || 'Connection cancelled or rejected.'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // SIWE Authentication
  const handleSIWELogin = async () => {
    setLoading(true);
    setError(null);

    try {
      let activeAddress = walletAddress;
      let signature = '';
      let signingWallet: ethers.Wallet | null = null;
      let browserSigner: ethers.Signer | null = null;

      const walletType = localStorage.getItem('x402_wallet_type');

      const browserProviderObj = (window as any).trustwallet || (window as any).ethereum;
      if (walletType === 'browser' && browserProviderObj) {
        try {
          const provider = new ethers.BrowserProvider(browserProviderObj);
          browserSigner = await provider.getSigner();
          activeAddress = await browserSigner.getAddress();
          setWalletAddress(activeAddress);
        } catch {
          browserSigner = null;
        }
      }

      if (!browserSigner) {
        let demoPk = localStorage.getItem('x402_demo_pk');
        if (!demoPk) {
          demoPk = '0x4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a6f36593b';
          localStorage.setItem('x402_demo_pk', demoPk);
        }
        signingWallet = new ethers.Wallet(demoPk);
        activeAddress = signingWallet.address;
        setWalletAddress(activeAddress);
      }

      // 1. Fetch SIWE Nonce
      const nonceRes = await fetch(`/api/auth/siwe/nonce?address=${activeAddress}`);
      const nonceData = await nonceRes.json();
      setSiweMsg(nonceData.message);

      // 2. Sign SIWE Message
      if (browserSigner) {
        signature = await browserSigner.signMessage(nonceData.message);
      } else if (signingWallet) {
        signature = await signingWallet.signMessage(nonceData.message);
      }

      // 3. Verify SIWE Signature with Backend
      const verifyRes = await fetch('/api/auth/siwe/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: activeAddress,
          message: nonceData.message,
          signature
        })
      });
      const verifyData = await verifyRes.json();

      if (verifyData.success) {
        setIsSiweAuthenticated(true);
        setTimeout(onClose, 800);
      } else {
        setError(verifyData.error || 'SIWE Authentication failed');
      }
    } catch (err: any) {
      setError('SIWE Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="glass-card border border-white/10 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl relative font-code text-xs">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-indigo-950/60 text-indigo-400 border border-indigo-700/50 shadow-inner">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif-display italic font-bold text-white">Web3 & Indian Wallet Manager</h2>
              <p className="text-xs text-slate-400 font-sans">Connect Trust Wallet, CoinDCX Okto, CoinSwitch or Custom Key</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active Address */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/5 flex items-center justify-between shadow-inner">
          <div className="space-y-1 overflow-hidden pr-2">
            <span className="text-slate-400 text-[10px] uppercase tracking-wider block font-bold">Active Connected Wallet Address:</span>
            <div className="font-bold text-indigo-300 font-mono text-xs truncate">
              {walletAddress || 'Not connected'}
            </div>
            {isSiweAuthenticated && (
              <div className="text-emerald-400 flex items-center space-x-1 pt-0.5 font-semibold text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>SIWE Session Active (EIP-4361 Verified)</span>
              </div>
            )}
          </div>

          {walletAddress && (
            <button
              onClick={() => {
                setWalletAddress('');
                setIsSiweAuthenticated(false);
              }}
              className="px-3 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 border border-rose-700/60 text-rose-300 text-[11px] font-semibold shrink-0 cursor-pointer transition-all shadow-sm"
            >
              Disconnect
            </button>
          )}
        </div>

        {/* Popular Indian & Universal Wallets Options */}
        <div className="space-y-3 font-code">
          <span className="text-[10px] uppercase tracking-widest text-slate-400 block font-bold">Select Wallet Provider</span>
          
          <div className="grid grid-cols-2 gap-2.5">
            {/* Trust Wallet */}
            <button
              onClick={() => handleConnectBrowserWallet('trust')}
              disabled={loading}
              className="p-3.5 rounded-2xl bg-slate-900/80 hover:bg-indigo-950/60 border border-slate-800 hover:border-indigo-500/60 text-white flex items-center space-x-3 text-left cursor-pointer transition-all shadow-sm group"
            >
              <Smartphone className="w-4 h-4 text-cyan-400 shrink-0 group-hover:scale-110 transition-transform" />
              <div>
                <div className="font-bold text-xs text-white">Trust Wallet</div>
                <div className="text-[10px] text-slate-400">Popular Indian Mobile App</div>
              </div>
            </button>

            {/* CoinDCX Okto */}
            <button
              onClick={() => handleConnectBrowserWallet('okto')}
              disabled={loading}
              className="p-3.5 rounded-2xl bg-slate-900/80 hover:bg-indigo-950/60 border border-slate-800 hover:border-indigo-500/60 text-white flex items-center space-x-3 text-left cursor-pointer transition-all shadow-sm group"
            >
              <Wallet className="w-4 h-4 text-indigo-400 shrink-0 group-hover:scale-110 transition-transform" />
              <div>
                <div className="font-bold text-xs text-white">CoinDCX Okto</div>
                <div className="text-[10px] text-slate-400">Embedded Web3 SDK</div>
              </div>
            </button>

            {/* CoinSwitch Web3 */}
            <button
              onClick={() => handleConnectBrowserWallet('coinswitch')}
              disabled={loading}
              className="p-3.5 rounded-2xl bg-slate-900/80 hover:bg-indigo-950/60 border border-slate-800 hover:border-indigo-500/60 text-white flex items-center space-x-3 text-left cursor-pointer transition-all shadow-sm group"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 group-hover:scale-110 transition-transform" />
              <div>
                <div className="font-bold text-xs text-white">CoinSwitch Web3</div>
                <div className="text-[10px] text-slate-400">Indian Pro Exchange</div>
              </div>
            </button>

            {/* Injected / MetaMask / Rabby / WalletConnect */}
            <button
              onClick={() => handleConnectBrowserWallet('injected')}
              disabled={loading}
              className="p-3.5 rounded-2xl bg-slate-900/80 hover:bg-indigo-950/60 border border-slate-800 hover:border-indigo-500/60 text-white flex items-center space-x-3 text-left cursor-pointer transition-all shadow-sm group"
            >
              <Wallet className="w-4 h-4 text-amber-400 shrink-0 group-hover:scale-110 transition-transform" />
              <div>
                <div className="font-bold text-xs text-white">Injected / MetaMask</div>
                <div className="text-[10px] text-slate-400">EIP-1193 Extension</div>
              </div>
            </button>

            {/* Pera Wallet / Algorand */}
            <button
              onClick={() => handleConnectBrowserWallet('pera')}
              disabled={loading}
              className="p-3.5 rounded-2xl bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-700/50 text-white flex items-center space-x-3 text-left cursor-pointer transition-all hover:border-emerald-500/60 col-span-2 sm:col-span-1 shadow-sm group"
            >
              <Smartphone className="w-4 h-4 text-emerald-400 shrink-0 group-hover:scale-110 transition-transform" />
              <div>
                <div className="font-bold text-xs text-emerald-200">Pera Wallet (Algorand)</div>
                <div className="text-[10px] text-emerald-400/80">Testnet (No Extension Required)</div>
              </div>
            </button>
          </div>

          {/* Friendly Guidance for Trust Wallet & Browser Extensions */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/5 text-[11px] text-slate-300 space-y-2 shadow-inner">
            <div className="flex items-center justify-between">
              <span className="font-bold text-cyan-400 flex items-center space-x-1">
                <span>🛡️ Using Trust Wallet Extension:</span>
              </span>
              <button
                onClick={() => window.open(window.location.href, '_blank')}
                className="text-[10px] bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-700/60 px-2.5 py-1 rounded-lg cursor-pointer transition-all font-mono font-bold"
              >
                Open App in New Tab ↗
              </button>
            </div>
            <p className="text-slate-400 leading-relaxed font-sans">
              1. Click <strong className="text-white">Trust Wallet</strong> above to connect your extension. <br />
              2. If the extension popup is blocked by the iframe sandbox, click <strong className="text-cyan-300 font-mono">Open App in New Tab ↗</strong> above to connect directly. <br />
              3. You can also click <strong className="text-white">Import Key or Address</strong> below to paste your Trust Wallet public address or private key.
            </p>
          </div>

          {/* Import Key or Generate Demo Key */}
          <div className="pt-2 space-y-2 border-t border-white/10">
            {!showKeyImport ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowKeyImport(true)}
                  className="flex-1 py-2.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 text-center cursor-pointer transition-all text-xs font-semibold shadow-sm"
                >
                  Import Key or Address
                </button>

                <button
                  onClick={handleGenerateDemoWallet}
                  className="flex-1 py-2.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 flex items-center justify-center space-x-2 cursor-pointer transition-all text-xs font-semibold shadow-sm"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                  <span>Generate Test Keypair</span>
                </button>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/5 space-y-2.5 shadow-inner">
                <label className="text-[11px] text-slate-300 block font-bold">Enter EVM Private Key or Algorand Wallet Address:</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="ALGO7X3K... or 0x4c0883a..."
                    value={importKeyInput}
                    onChange={(e) => setImportKeyInput(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-code"
                  />
                  <button
                    onClick={handleImportPrivateKey}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs cursor-pointer shadow-md"
                  >
                    Import
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* SIWE Sign Button */}
          {walletAddress && !isSiweAuthenticated && (
            <div className="pt-2">
              <button
                onClick={handleSIWELogin}
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold shadow-xl shadow-indigo-950/50 flex items-center justify-center space-x-2 cursor-pointer transition-all text-xs"
              >
                <Key className="w-4 h-4 text-purple-300" />
                <span>{loading ? 'Verifying EIP-4361 Signature...' : 'Sign-In with Ethereum (SIWE)'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-800/60 text-rose-200 text-xs space-y-2 shadow-lg">
            <div className="font-bold flex items-center space-x-1.5 text-rose-300">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Wallet Connection Notice</span>
            </div>
            <p className="leading-relaxed text-[11px] text-rose-200/90 font-sans">
              {error}
            </p>
            {(error.toLowerCase().includes('frame') || error.toLowerCase().includes('disallowed') || error.toLowerCase().includes('trust') || (typeof window !== 'undefined' && window.top !== window.self)) && (
              <div className="pt-1 flex flex-wrap gap-2">
                <button
                  onClick={() => window.open(window.location.href, '_blank')}
                  className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-[11px] flex items-center space-x-1.5 cursor-pointer shadow-md transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open App in New Tab (Bypasses Frame Block)</span>
                </button>
                <button
                  onClick={() => setShowKeyImport(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-700/60 text-indigo-200 text-[11px] font-semibold cursor-pointer"
                >
                  Paste Address / Key Instead
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
