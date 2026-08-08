import React, { useState } from 'react';
import { BookOpen, Terminal, Layers, Code, Copy, Check, Server, FileText } from 'lucide-react';

export const DocsAndDeploymentView: React.FC = () => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* Header */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-2 shadow-xl">
        <span className="text-[10px] uppercase tracking-widest text-indigo-300 block font-bold">Developer Guide</span>
        <h1 className="text-2xl sm:text-3xl font-serif-display italic font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-indigo-200 flex items-center space-x-3">
          <BookOpen className="w-6 h-6 text-indigo-400" />
          <span>Documentation, Deployment Scripts & x402 Integration Guide</span>
        </h1>
        <p className="text-xs text-slate-300 font-code">Complete technical documentation, Docker scripts, Hardhat/Foundry contracts deployment, and client SDK guides.</p>
      </div>

      {/* 1. x402 HTTP Specification */}
      <div className="glass-card rounded-3xl border border-white/10 p-6 sm:p-8 space-y-4 shadow-xl">
        <h2 className="text-lg font-bold text-white font-code flex items-center space-x-2">
          <Terminal className="w-5 h-5 text-indigo-400" />
          <span>x402 Protocol Specification (HTTP Headers)</span>
        </h2>
        <p className="text-xs text-slate-300 font-sans leading-relaxed">
          The x402 protocol builds on HTTP status 402 (Payment Required) to create machine-to-machine micropayments for autonomous AI Agent APIs.
        </p>

        <div className="space-y-3 font-code text-xs">
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/5 space-y-2 shadow-inner">
            <div className="text-amber-400 font-bold">1. Challenge Header (Server -&gt; Client)</div>
            <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-[11px] overflow-x-auto font-mono">
              WWW-Authenticate: x402 realm="ai-agent-registry", payTo="0x71C...", priceWei="100000000000000", nonce="0x8a91...", serviceId="0x1010..."
            </pre>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/5 space-y-2 shadow-inner">
            <div className="text-indigo-300 font-bold">2. Payment Receipt Header (Client -&gt; Server)</div>
            <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-[11px] overflow-x-auto font-mono">
              X-402-Payment-Receipt: &#123;"paymentId":"pay_123","clientAddress":"0x...","payToAddress":"0x...","amountWei":"100000000000000","nonce":"0x8a91...","signature":"0x..."&#125;
            </pre>
          </div>
        </div>
      </div>

      {/* 2. Deployment Scripts */}
      <div className="glass-card rounded-3xl border border-white/10 p-6 sm:p-8 space-y-4 shadow-xl">
        <h2 className="text-lg font-bold text-white font-code flex items-center space-x-2">
          <Server className="w-5 h-5 text-emerald-400" />
          <span>Hardhat / Foundry Deployment Script (deploy.ts)</span>
        </h2>

        <div className="relative">
          <pre className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-code text-indigo-300 overflow-x-auto max-h-72 leading-relaxed shadow-inner">
{`import { ethers } from "hardhat";

async function main() {
  console.log("Deploying AI Agent Registry smart contracts to Base L2...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  // 1. AgentRegistry
  const AgentRegistry = await ethers.getContractFactory("AgentRegistry");
  const agentRegistry = await AgentRegistry.deploy();
  await agentRegistry.waitForDeployment();
  console.log("AgentRegistry deployed to:", await agentRegistry.getAddress());

  // 2. ServiceRegistry
  const ServiceRegistry = await ethers.getContractFactory("ServiceRegistry");
  const serviceRegistry = await ServiceRegistry.deploy();
  await serviceRegistry.waitForDeployment();
  console.log("ServiceRegistry deployed to:", await serviceRegistry.getAddress());

  // 3. x402Escrow
  const x402Escrow = await ethers.getContractFactory("x402Escrow");
  const escrow = await x402Escrow.deploy(deployer.address);
  await escrow.waitForDeployment();
  console.log("x402Escrow deployed to:", await escrow.getAddress());

  // 4. UsageTracker
  const UsageTracker = await ethers.getContractFactory("UsageTracker");
  const usageTracker = await UsageTracker.deploy();
  await usageTracker.waitForDeployment();
  console.log("UsageTracker deployed to:", await usageTracker.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});`}
          </pre>
        </div>
      </div>

      {/* 3. Docker Containerization */}
      <div className="glass-card rounded-3xl border border-white/10 p-6 sm:p-8 space-y-4 shadow-xl">
        <h2 className="text-lg font-bold text-white font-code flex items-center space-x-2">
          <FileText className="w-5 h-5 text-indigo-400" />
          <span>Production Dockerfile</span>
        </h2>

        <pre className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-code text-slate-200 overflow-x-auto leading-relaxed shadow-inner">
{`FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/server.cjs"]`}
        </pre>
      </div>

    </div>
  );
};
