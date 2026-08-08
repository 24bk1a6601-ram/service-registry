import React from 'react';
import { ShieldCheck, AlertCircle, CheckCircle2, X, Wallet, Zap, ArrowRight, Lock, Key, RefreshCw } from 'lucide-react';

interface WalletApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove: () => void;
  title?: string;
  serviceName?: string;
  amountFormatted?: string;
  amountWei?: string;
  payToAddress?: string;
  walletAddress?: string;
  walletType?: string;
  promptPayload?: string;
  isLoading?: boolean;
}

export const WalletApprovalModal: React.FC<WalletApprovalModalProps> = ({
  isOpen,
  onClose,
  onApprove,
  title = 'x402 Micropayment Approval Request',
  serviceName = 'AI Agent Autonomous Service',
  amountFormatted = '$0.01 (0.000003 ETH)',
  amountWei = '3000000000000',
  payToAddress = '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
  walletAddress = '',
  walletType = 'Trust Wallet',
  promptPayload = '',
  isLoading = false,
}) => {
  if (!isOpen) return null;

  const displayWalletName = localStorage.getItem('x402_wallet_type_name') || walletType || 'Trust Wallet';
  const networkName = localStorage.getItem('x402_network') || 'Base Sepolia (Testnet)';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in font-code text-xs">
      <div className="glass-card border border-indigo-500/40 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl relative bg-slate-950/95">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-indigo-950 text-indigo-400 border border-indigo-500/50 shadow-inner relative">
              <ShieldCheck className="w-6 h-6 animate-pulse" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-950" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest text-indigo-400 font-bold block">
                Wallet Transaction Signature Required
              </span>
              <h2 className="text-base font-serif-display italic font-bold text-white leading-tight">
                {title}
              </h2>
            </div>
          </div>
          <button 
            onClick={onClose} 
            disabled={isLoading}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wallet Badge & Network Banner */}
        <div className="p-3.5 rounded-2xl bg-indigo-950/50 border border-indigo-800/60 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Wallet className="w-4.5 h-4.5 text-cyan-400 shrink-0" />
            <div>
              <span className="text-slate-400 text-[10px] block font-semibold">Signer Wallet:</span>
              <span className="text-white font-bold text-xs">{displayWalletName}</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-slate-400 text-[10px] block font-semibold">Network:</span>
            <span className="text-indigo-300 font-bold text-xs">{networkName}</span>
          </div>
        </div>

        {/* Transaction Summary Card */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/10 space-y-3 shadow-inner">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <span className="text-slate-400 text-[11px]">Requested Service:</span>
            <span className="text-white font-bold text-xs truncate max-w-[220px] text-right">{serviceName}</span>
          </div>

          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <span className="text-slate-400 text-[11px]">Payment Amount (x402):</span>
            <span className="text-emerald-400 font-bold text-sm flex items-center space-x-1">
              <Zap className="w-4 h-4 fill-emerald-400" />
              <span>{amountFormatted}</span>
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <span className="text-slate-400 text-[11px]">PayTo Contract Recipient:</span>
            <span className="text-slate-300 font-mono text-[11px] font-bold">
              {payToAddress.substring(0, 8)}...{payToAddress.substring(payToAddress.length - 6)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-[11px]">Signing Wallet Address:</span>
            <span className="text-indigo-300 font-mono text-[11px] font-bold">
              {walletAddress ? `${walletAddress.substring(0, 8)}...${walletAddress.substring(walletAddress.length - 6)}` : '0x71C7...976F'}
            </span>
          </div>

          {promptPayload && (
            <div className="pt-2 border-t border-white/5">
              <span className="text-slate-400 text-[10px] block mb-1">Payload / Prompt Context:</span>
              <p className="text-slate-300 italic text-[11px] bg-slate-950 p-2.5 rounded-xl border border-white/5 font-sans leading-relaxed line-clamp-2">
                "{promptPayload}"
              </p>
            </div>
          )}
        </div>

        {/* EIP-191 Cryptographic Security Note */}
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-300 flex items-center space-x-2.5">
          <Lock className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>Approval Notice:</strong> By clicking approve below, your <strong>{displayWalletName}</strong> will sign an EIP-191 message payload to settle this payment receipt.
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3 pt-2">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white font-bold text-xs cursor-pointer transition-all text-center"
          >
            Reject / Cancel
          </button>

          <button
            onClick={onApprove}
            disabled={isLoading}
            className="flex-2 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-indigo-600 to-purple-600 hover:from-emerald-500 hover:to-purple-500 text-white font-bold shadow-xl shadow-indigo-950/60 flex items-center justify-center space-x-2 cursor-pointer transition-all text-xs"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>Signing in {displayWalletName}...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                <span>Approve & Sign in {displayWalletName}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
