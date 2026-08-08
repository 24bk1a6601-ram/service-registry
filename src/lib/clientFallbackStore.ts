import { AgentIdentity, AgentService } from '../types';

export const SEED_AGENTS: AgentIdentity[] = [
  {
    id: '0xa987654321098765432109876543210987654321000000000000000000000001',
    name: 'WeatherGPT',
    did: 'did:pkh:eip155:8453:0xA987654321098765432109876543210987654321',
    owner: '0xA987654321098765432109876543210987654321',
    organization: 'Weather Corp',
    verified: true,
    reputationScore: 99,
    createdAt: Date.now() - 86400000 * 15,
    metadataURI: 'ipfs://bafybeiclimateweathergpt001hash',
    capabilities: ['Weather Forecast', 'Rain Prediction', 'Air Quality Index', 'Monsoon Alerts'],
    location: 'Hyderabad, India / Global',
  },
  {
    id: '0xb876543210987654321098765432109876543210000000000000000000000002',
    name: 'ClimateAI',
    did: 'did:pkh:eip155:8453:0xB876543210987654321098765432109876543210',
    owner: '0xB876543210987654321098765432109876543210',
    organization: 'EcoTech Foundation',
    verified: true,
    reputationScore: 95,
    createdAt: Date.now() - 86400000 * 12,
    metadataURI: 'ipfs://bafybeiclimateai002hash',
    capabilities: ['Weather Forecast', 'Solar Radiation', 'Storm Tracking'],
    location: 'Hyderabad, India',
  },
  {
    id: '0xc765678901234567890123456789012345678901000000000000000000000003',
    name: 'SkyAgent',
    did: 'did:pkh:eip155:8453:0xC765678901234567890123456789012345678901',
    owner: '0xC765678901234567890123456789012345678901',
    organization: 'SkyNet Geo Systems',
    verified: true,
    reputationScore: 92,
    createdAt: Date.now() - 86400000 * 9,
    metadataURI: 'ipfs://bafybeiskyagent003hash',
    capabilities: ['Air Quality', 'Rain Prediction', 'Satellite Radar'],
    location: 'Hyderabad, India / South Asia',
  },
  {
    id: '0xd1d1000000000000000000000000000000000000000000000000000000000004',
    name: 'TravelAgent AI',
    did: 'did:pkh:eip155:8453:0xD1D1000000000000000000000000000000000004',
    owner: '0xD1D1000000000000000000000000000000000004',
    organization: 'GlobeTrotter Autonomous DAO',
    verified: true,
    reputationScore: 97,
    createdAt: Date.now() - 86400000 * 20,
    metadataURI: 'ipfs://bafybeitravelagent004hash',
    capabilities: ['Flight Booking', 'Itinerary Optimization', 'Weather Integration'],
    location: 'Global',
  },
  {
    id: '0xe1e1000000000000000000000000000000000000000000000000000000000005',
    name: 'TaxPulse AI',
    did: 'did:pkh:eip155:8453:0xE1E1000000000000000000000000000000000005',
    owner: '0xE1E1000000000000000000000000000000000005',
    organization: 'AuditX Global',
    verified: true,
    reputationScore: 98,
    createdAt: Date.now() - 86400000 * 30,
    metadataURI: 'ipfs://bafybeitaxpulse005hash',
    capabilities: ['Tax Calculation', 'DeFi Portfolio Audit', 'Cost-Basis Accounting'],
    location: 'India & US Jurisdiction',
  },
  {
    id: '0xf1f1000000000000000000000000000000000000000000000000000000000006',
    name: 'MediScan AI',
    did: 'did:pkh:eip155:8453:0xF1F1000000000000000000000000000000000006',
    owner: '0xF1F1000000000000000000000000000000000006',
    organization: 'BioHealth Protocol',
    verified: true,
    reputationScore: 99,
    createdAt: Date.now() - 86400000 * 40,
    metadataURI: 'ipfs://bafybeimediscan006hash',
    capabilities: ['Medical Report Analysis', 'Biomarker Interpretation', 'Lab Report Insights'],
    location: 'Global / HIPAA Compliant',
  },
  {
    id: '0xa1a1000000000000000000000000000000000000000000000000000000000007',
    name: 'CyberGuard AI - Code Auditor',
    did: 'did:pkh:eip155:8453:0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    owner: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    organization: 'CyberGuard Security DAO',
    verified: true,
    reputationScore: 98,
    createdAt: Date.now() - 86400000 * 10,
    metadataURI: 'ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi',
    capabilities: ['Smart Contract Audit', 'Vulnerability Scanner', 'Gas Optimization'],
    location: 'Global',
  }
];

export const SEED_SERVICES: AgentService[] = [
  {
    id: '0x1000000000000000000000000000000000000000000000000000000000000001',
    agentId: '0xa987654321098765432109876543210987654321000000000000000000000001',
    name: "Today's Weather & Atmospheric Forecast API",
    description: 'Real-time microclimate predictions, precipitation radar, and air quality index for major global hubs including Hyderabad.',
    category: 'weather',
    endpointURI: '/api/gateway/invoke?serviceId=0x1000000000000000000000000000000000000000000000000000000000000001',
    pricePerRequestWei: '3000000000000',
    priceFormatted: '$0.01 (0.000003 ETH)',
    priceUsd: 0.01,
    acceptedTokens: ['USDC', 'ETH'],
    owner: '0xA987654321098765432109876543210987654321',
    rating: 4.9,
    totalInvocations: 8420,
    currentVersion: '2.1.0',
    slaGuarantee: '99.99% Uptime, 120ms Latency',
    status: 'active',
    createdAt: Date.now() - 86400000 * 14,
    capabilities: ['Weather Forecast', 'Rain Prediction', 'Air Quality Index'],
    latencyMs: 120,
    locationCoverage: 'Hyderabad, India / Global',
    versions: [
      { version: '1.0.0', releaseNotes: 'Initial release', createdAt: Date.now() - 86400000 * 14, deprecated: false, breakingChange: false },
      { version: '2.1.0', releaseNotes: 'Added doppler precipitation radar & x402 auto-payment support', createdAt: Date.now() - 86400000 * 2, deprecated: false, breakingChange: false }
    ]
  },
  {
    id: '0x2000000000000000000000000000000000000000000000000000000000000002',
    agentId: '0xb876543210987654321098765432109876543210000000000000000000000002',
    name: 'Hyper-local Microclimate & Humidity Feed',
    description: 'Precision agricultural weather tracking, soil moisture sensors, and storm trajectory prediction.',
    category: 'weather',
    endpointURI: '/api/gateway/invoke?serviceId=0x2000000000000000000000000000000000000000000000000000000000000002',
    pricePerRequestWei: '10000000000000',
    priceFormatted: '$0.03 (0.00001 ETH)',
    priceUsd: 0.03,
    acceptedTokens: ['USDC', 'ETH'],
    owner: '0xB876543210987654321098765432109876543210',
    rating: 4.7,
    totalInvocations: 3120,
    currentVersion: '1.4.0',
    slaGuarantee: '99.5% Uptime, 180ms Latency',
    status: 'active',
    createdAt: Date.now() - 86400000 * 10,
    capabilities: ['Weather Forecast', 'Solar Radiation', 'Storm Tracking'],
    latencyMs: 180,
    locationCoverage: 'Hyderabad, India',
    versions: [
      { version: '1.4.0', releaseNotes: 'Added sensor telemetry', createdAt: Date.now() - 86400000 * 5, deprecated: false, breakingChange: false }
    ]
  },
  {
    id: '0x3000000000000000000000000000000000000000000000000000000000000003',
    agentId: '0xc765678901234567890123456789012345678901000000000000000000000003',
    name: 'Doppler Radar & Precipitative AI Feed',
    description: 'Satellite-backed precipitation radar streams and cloud density analysis for South Asian logistics.',
    category: 'weather',
    endpointURI: '/api/gateway/invoke?serviceId=0x3000000000000000000000000000000000000000000000000000000000000003',
    pricePerRequestWei: '13000000000000',
    priceFormatted: '$0.04 (0.000013 ETH)',
    priceUsd: 0.04,
    acceptedTokens: ['USDC', 'ETH'],
    owner: '0xC765678901234567890123456789012345678901',
    rating: 4.6,
    totalInvocations: 1890,
    currentVersion: '1.1.0',
    slaGuarantee: '99.0% Uptime, 210ms Latency',
    status: 'active',
    createdAt: Date.now() - 86400000 * 8,
    capabilities: ['Air Quality', 'Rain Prediction', 'Satellite Radar'],
    latencyMs: 210,
    locationCoverage: 'Hyderabad, India / South Asia',
    versions: [
      { version: '1.1.0', releaseNotes: 'Radar enhancement', createdAt: Date.now() - 86400000 * 3, deprecated: false, breakingChange: false }
    ]
  },
  {
    id: '0x4000000000000000000000000000000000000000000000000000000000000004',
    agentId: '0xd1d1000000000000000000000000000000000000000000000000000000000004',
    name: 'Autonomous Flight & Itinerary Booking Engine',
    description: 'End-to-end trip planning AI that automatically queries weather, calculates layover delays, and books tickets.',
    category: 'travel',
    endpointURI: '/api/gateway/invoke?serviceId=0x4000000000000000000000000000000000000000000000000000000000000004',
    pricePerRequestWei: '6000000000000',
    priceFormatted: '$0.02 (0.000006 ETH)',
    priceUsd: 0.02,
    acceptedTokens: ['USDC', 'ETH'],
    owner: '0xD1D1000000000000000000000000000000000004',
    rating: 4.8,
    totalInvocations: 5210,
    currentVersion: '3.0.0',
    slaGuarantee: '99.9% Uptime, 350ms Latency',
    status: 'active',
    createdAt: Date.now() - 86400000 * 18,
    capabilities: ['Flight Booking', 'Itinerary Optimization', 'Weather Integration'],
    latencyMs: 350,
    locationCoverage: 'Global',
    versions: [
      { version: '3.0.0', releaseNotes: 'Added WeatherGPT A2A auto-query payment protocol', createdAt: Date.now() - 86400000 * 1, deprecated: false, breakingChange: false }
    ]
  },
  {
    id: '0x5000000000000000000000000000000000000000000000000000000000000005',
    agentId: '0xe1e1000000000000000000000000000000000000000000000000000000000005',
    name: 'Cross-Chain Crypto Tax & Cost-Basis Calculation Engine',
    description: 'Calculates real-time capital gains, staking rewards tax liability, and income deductions across 12 EVM chains.',
    category: 'finance',
    endpointURI: '/api/gateway/invoke?serviceId=0x5000000000000000000000000000000000000000000000000000000000000005',
    pricePerRequestWei: '4500000000000',
    priceFormatted: '$0.015 (0.0000045 ETH)',
    priceUsd: 0.015,
    acceptedTokens: ['USDC', 'ETH'],
    owner: '0xE1E1000000000000000000000000000000000005',
    rating: 4.9,
    totalInvocations: 12400,
    currentVersion: '2.4.0',
    slaGuarantee: '99.9% Uptime, 250ms Latency',
    status: 'active',
    createdAt: Date.now() - 86400000 * 25,
    capabilities: ['Tax Calculation', 'DeFi Portfolio Audit', 'Cost-Basis Accounting'],
    latencyMs: 250,
    locationCoverage: 'India & US Jurisdiction',
    versions: [
      { version: '2.4.0', releaseNotes: 'Updated 2026 IT tax bracket rules', createdAt: Date.now() - 86400000 * 4, deprecated: false, breakingChange: false }
    ]
  },
  {
    id: '0x6000000000000000000000000000000000000000000000000000000000000006',
    agentId: '0xf1f1000000000000000000000000000000000000000000000000000000000006',
    name: 'Clinical Medical Diagnostics & Lab Report Analyzer',
    description: 'Privacy-preserving AI that ingests blood tests, pathology metrics, and MRI reports to produce clinical summaries.',
    category: 'medical',
    endpointURI: '/api/gateway/invoke?serviceId=0x6000000000000000000000000000000000000000000000000000000000000006',
    pricePerRequestWei: '7500000000000',
    priceFormatted: '$0.025 (0.0000075 ETH)',
    priceUsd: 0.025,
    acceptedTokens: ['USDC', 'ETH'],
    owner: '0xF1F1000000000000000000000000000000000006',
    rating: 4.9,
    totalInvocations: 9800,
    currentVersion: '1.8.0',
    slaGuarantee: '99.99% Uptime, 420ms Latency',
    status: 'active',
    createdAt: Date.now() - 86400000 * 35,
    capabilities: ['Medical Report Analysis', 'Biomarker Interpretation', 'Lab Report Insights'],
    latencyMs: 420,
    locationCoverage: 'Global / HIPAA Compliant',
    versions: [
      { version: '1.8.0', releaseNotes: 'Added ICD-11 coding standardization', createdAt: Date.now() - 86400000 * 6, deprecated: false, breakingChange: false }
    ]
  },
  {
    id: '0x7000000000000000000000000000000000000000000000000000000000000007',
    agentId: '0xa1a1000000000000000000000000000000000000000000000000000000000007',
    name: 'Solidity & Move Smart Contract Auditor API',
    description: 'Automated deep-learning AST analyzer for reentrancy, overflow, access-control, and gas optimization vulnerabilities.',
    category: 'code-analysis',
    endpointURI: '/api/gateway/invoke?serviceId=0x7000000000000000000000000000000000000000000000000000000000000007',
    pricePerRequestWei: '3000000000000',
    priceFormatted: '$0.01 (0.000003 ETH)',
    priceUsd: 0.01,
    acceptedTokens: ['USDC', 'ETH'],
    owner: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    rating: 4.95,
    totalInvocations: 14200,
    currentVersion: '2.0.1',
    slaGuarantee: '99.9% Uptime, 150ms Latency',
    status: 'active',
    createdAt: Date.now() - 86400000 * 9,
    capabilities: ['Smart Contract Audit', 'Vulnerability Scanner', 'Gas Optimization'],
    latencyMs: 150,
    locationCoverage: 'Global',
    versions: [
      { version: '1.0.0', releaseNotes: 'Initial release', createdAt: Date.now() - 86400000 * 9, deprecated: false, breakingChange: false },
      { version: '2.0.1', releaseNotes: 'Added Move language support and x402 payment header handler', createdAt: Date.now() - 86400000 * 1, deprecated: false, breakingChange: false }
    ]
  }
];

export function getLocalAgents(): AgentIdentity[] {
  try {
    const saved = localStorage.getItem('x402_local_agents');
    const custom: AgentIdentity[] = saved ? JSON.parse(saved) : [];
    return [...SEED_AGENTS, ...custom];
  } catch {
    return SEED_AGENTS;
  }
}

export function saveLocalAgent(agent: Partial<AgentIdentity>): AgentIdentity {
  const newAgent: AgentIdentity = {
    id: agent.id || `0x${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}`.padEnd(66, '0'),
    name: agent.name || 'New AI Agent',
    did: agent.did || `did:pkh:eip155:8453:${agent.owner || '0xA987654321098765432109876543210987654321'}`,
    owner: agent.owner || '0xA987654321098765432109876543210987654321',
    organization: agent.organization || 'Independent Agent',
    verified: true,
    reputationScore: 90,
    createdAt: Date.now(),
    metadataURI: agent.metadataURI || 'ipfs://QmAgentMetadataDefaultHash',
    capabilities: agent.capabilities || ['AI Intelligence'],
    location: agent.location || 'Global',
  };

  try {
    const saved = localStorage.getItem('x402_local_agents');
    const existing: AgentIdentity[] = saved ? JSON.parse(saved) : [];
    existing.unshift(newAgent);
    localStorage.setItem('x402_local_agents', JSON.stringify(existing));
  } catch (e) {
    console.error('Failed to save agent to localStorage', e);
  }

  return newAgent;
}

export function getLocalServices(): AgentService[] {
  try {
    const saved = localStorage.getItem('x402_local_services');
    const custom: AgentService[] = saved ? JSON.parse(saved) : [];
    return [...SEED_SERVICES, ...custom];
  } catch {
    return SEED_SERVICES;
  }
}

export function saveLocalService(service: Partial<AgentService>): AgentService {
  const newId = `0x${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}`.padEnd(66, '0');
  const priceEth = (parseFloat(service.pricePerRequestWei || '3000000000000') / 1e18).toFixed(6);
  const newService: AgentService = {
    id: newId,
    agentId: service.agentId || SEED_AGENTS[0].id,
    name: service.name || 'Custom AI Service',
    description: service.description || 'Autonomous AI Service registered on x402 marketplace',
    category: service.category || 'weather',
    endpointURI: `/api/gateway/invoke?serviceId=${newId}`,
    pricePerRequestWei: service.pricePerRequestWei || '3000000000000',
    priceFormatted: service.priceFormatted || `$0.01 (${priceEth} ETH)`,
    priceUsd: service.priceUsd || 0.01,
    acceptedTokens: ['USDC', 'ETH'],
    owner: service.owner || '0xA987654321098765432109876543210987654321',
    rating: 5.0,
    totalInvocations: 1,
    currentVersion: '1.0.0',
    slaGuarantee: service.slaGuarantee || '99.9% Uptime, 150ms Latency',
    status: 'active',
    createdAt: Date.now(),
    capabilities: service.capabilities || ['AI Inference'],
    latencyMs: service.latencyMs || 120,
    locationCoverage: service.locationCoverage || 'Hyderabad, India / Global',
    versions: [
      { version: '1.0.0', releaseNotes: 'Initial release on x402', createdAt: Date.now(), deprecated: false, breakingChange: false }
    ]
  };

  try {
    const saved = localStorage.getItem('x402_local_services');
    const existing: AgentService[] = saved ? JSON.parse(saved) : [];
    existing.unshift(newService);
    localStorage.setItem('x402_local_services', JSON.stringify(existing));
  } catch (e) {
    console.error('Failed to save service to localStorage', e);
  }

  return newService;
}

export interface WalletTransactionRecord {
  id: string;
  txHash: string;
  walletAddress: string;
  walletType: string;
  serviceId?: string;
  serviceName: string;
  actionType: 'x402 Micropayment' | 'Agent Registration' | 'Service Publishing' | 'SIWE Authentication';
  amountFormatted: string;
  amountWei?: string;
  status: 'SETTLED' | 'CONFIRMED';
  timestamp: number;
  blockNumber: number;
  network: string;
  prompt?: string;
  receiptHash: string;
}

export const SEED_TRANSACTIONS: WalletTransactionRecord[] = [
  {
    id: 'tx_seed_101',
    txHash: '0x8f7a3b9c2d1e0f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a',
    walletAddress: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    walletType: 'Trust Wallet',
    serviceId: '0x1000000000000000000000000000000000000000000000000000000000000001',
    serviceName: "Today's Weather & Atmospheric Forecast API",
    actionType: 'x402 Micropayment',
    amountFormatted: '$0.01 (0.000003 ETH)',
    amountWei: '3000000000000',
    status: 'SETTLED',
    timestamp: Date.now() - 3600000 * 2,
    blockNumber: 18942105,
    network: 'Base Sepolia',
    prompt: 'Current temperature & rainfall probability forecast for Hyderabad, Telangana',
    receiptHash: '0x3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b'
  },
  {
    id: 'tx_seed_102',
    txHash: '0x2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b',
    walletAddress: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    walletType: 'Trust Wallet',
    serviceId: '0x7000000000000000000000000000000000000000000000000000000000000007',
    serviceName: 'Solidity & Move Smart Contract Auditor API',
    actionType: 'x402 Micropayment',
    amountFormatted: '$0.01 (0.000003 ETH)',
    amountWei: '3000000000000',
    status: 'SETTLED',
    timestamp: Date.now() - 3600000 * 6,
    blockNumber: 18941980,
    network: 'Base Sepolia',
    prompt: 'Audit Solidity vault contract for reentrancy and access control',
    receiptHash: '0x9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e'
  },
  {
    id: 'tx_seed_103',
    txHash: '0x11223344556677889900aabbccddeeff11223344556677889900aabbccddeeff',
    walletAddress: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    walletType: 'Trust Wallet',
    serviceName: 'Sign-In with Ethereum (SIWE EIP-4361)',
    actionType: 'SIWE Authentication',
    amountFormatted: 'Gasless ($0.00)',
    amountWei: '0',
    status: 'CONFIRMED',
    timestamp: Date.now() - 3600000 * 12,
    blockNumber: 18941500,
    network: 'Base Sepolia',
    prompt: 'SIWE EIP-4361 challenge signature verification',
    receiptHash: '0x554433221100fefdccbbaa0099887766554433221100fefdccbbaa0099887766'
  }
];

export function getWalletTransactions(walletAddress?: string): WalletTransactionRecord[] {
  try {
    const saved = localStorage.getItem('x402_tx_history');
    let custom: WalletTransactionRecord[] = saved ? JSON.parse(saved) : [];
    if (!saved) {
      custom = SEED_TRANSACTIONS;
      localStorage.setItem('x402_tx_history', JSON.stringify(SEED_TRANSACTIONS));
    }
    if (walletAddress) {
      const filtered = custom.filter(t => t.walletAddress.toLowerCase() === walletAddress.toLowerCase() || t.walletAddress === '0x71C7656EC7ab88b098defB751B7401B5f6d8976F');
      return filtered.length > 0 ? filtered : custom;
    }
    return custom;
  } catch {
    return SEED_TRANSACTIONS;
  }
}

export function saveWalletTransaction(record: Partial<WalletTransactionRecord>): WalletTransactionRecord {
  const currentAddr = record.walletAddress || localStorage.getItem('x402_connected_wallet') || '0x71C7656EC7ab88b098defB751B7401B5f6d8976F';
  const currentWalletType = record.walletType || localStorage.getItem('x402_wallet_type_name') || localStorage.getItem('x402_wallet_type') || 'Trust Wallet';
  const network = record.network || localStorage.getItem('x402_network') || 'Base Sepolia';

  const newTx: WalletTransactionRecord = {
    id: record.id || `tx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    txHash: record.txHash || `0x${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}`.padEnd(66, '0'),
    walletAddress: currentAddr,
    walletType: currentWalletType === 'trust' ? 'Trust Wallet' : currentWalletType === 'pera' ? 'Pera Wallet' : currentWalletType === 'okto' ? 'CoinDCX Okto' : currentWalletType === 'coinswitch' ? 'CoinSwitch' : currentWalletType,
    serviceId: record.serviceId,
    serviceName: record.serviceName || 'x402 Autonomous AI Agent Service',
    actionType: record.actionType || 'x402 Micropayment',
    amountFormatted: record.amountFormatted || '$0.01 (0.000003 ETH)',
    amountWei: record.amountWei || '3000000000000',
    status: record.status || 'SETTLED',
    timestamp: record.timestamp || Date.now(),
    blockNumber: record.blockNumber || (18942200 + Math.floor(Math.random() * 100)),
    network: network,
    prompt: record.prompt || 'Agent Service Invocation Payload',
    receiptHash: record.receiptHash || `0x${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}`.padEnd(66, '0'),
  };

  try {
    const saved = localStorage.getItem('x402_tx_history');
    const existing: WalletTransactionRecord[] = saved ? JSON.parse(saved) : [...SEED_TRANSACTIONS];
    existing.unshift(newTx);
    localStorage.setItem('x402_tx_history', JSON.stringify(existing));
  } catch (e) {
    console.error('Failed to save wallet transaction to localStorage', e);
  }

  return newTx;
}

export function simulateAgentInvocation(serviceId: string, prompt: string, walletAddress?: string, walletType?: string) {
  const services = getLocalServices();
  const service = services.find(s => s.id === serviceId) || services[0];
  const isWeatherQuery = service.category === 'weather' ||
    prompt.toLowerCase().includes('weather') ||
    prompt.toLowerCase().includes('hyd') ||
    prompt.toLowerCase().includes('temperature') ||
    prompt.toLowerCase().includes('forecast') ||
    prompt.toLowerCase().includes('rain');

  let result: any;

  if (isWeatherQuery) {
    result = {
      location: {
        city: 'Hyderabad',
        state: 'Telangana',
        country: 'India'
      },
      weather: {
        condition: 'Partly Cloudy',
        temperature_celsius: {
          current: 34,
          high: 37,
          low: 25
        },
        humidity_percent: 52,
        rainfall_probability_percent: 20
      },
      air_quality: {
        aqi: 128,
        category: 'Moderate / Unhealthy for Sensitive Groups'
      },
      web3_risk_assessment: {
        weather_risk_score: '38/100 (LOW)',
        depin_node_impact: 'Low rainfall probability ensures optimal operation for DePIN climate sensors and satellite blockchain node infrastructure in Hyderabad.',
        actionable_insight: 'Optimal execution window for outdoor DePIN telemetry deployment in Hyderabad.'
      },
      agentOutput: "Today's Weather Forecast for Hyderabad, Telangana, India:\n• Temperature: 34°C (High 37°C / Low 25°C)\n• Condition: Partly Cloudy\n• Humidity: 52%\n• Rainfall Probability: 20%\n• Air Quality Index: 128 (Moderate)",
      executionEngine: 'WeatherGPT Atmospheric Intelligence Agent v2.1'
    };
  } else if (service.category === 'code-analysis') {
    result = {
      auditSummary: {
        score: 96,
        status: 'PASSED',
        criticalVulnerabilities: 0,
        highVulnerabilities: 0,
        mediumVulnerabilities: 1,
        lowVulnerabilities: 2
      },
      agentOutput: "Code Audit & Security Scan Report:\n• AST Analysis: 0 Reentrancy risks detected.\n• Gas Optimization: Unchecked math loop bound saves ~420 gas/iteration.\n• Access Control: Owner modifier verified on setVerification().",
      executionEngine: 'CyberGuard AI Solidity & Move Auditor'
    };
  } else {
    result = {
      summary: `Successfully executed ${service.name} prompt: "${prompt}"`,
      agentOutput: `Response from ${service.name}: Execution complete. Output validated against x402 SLA terms (${service.slaGuarantee}).`,
      executionEngine: service.name
    };
  }

  const receiptHash = `0x${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}`;
  const blockNumber = 18942099 + Math.floor(Math.random() * 50);

  const receipt = {
    protocol: 'x402-v1',
    receiptHash,
    status: 'SETTLED',
    amountPaidWei: service.pricePerRequestWei,
    amountPaidUsd: `$${service.priceUsd}`,
    blockNumber,
    timestamp: new Date().toISOString()
  };

  // Automatically record transaction in Wallet History!
  saveWalletTransaction({
    walletAddress: walletAddress || localStorage.getItem('x402_connected_wallet') || '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    walletType: walletType || localStorage.getItem('x402_wallet_type_name') || 'Trust Wallet',
    serviceId: service.id,
    serviceName: service.name,
    actionType: 'x402 Micropayment',
    amountFormatted: service.priceFormatted,
    amountWei: service.pricePerRequestWei,
    status: 'SETTLED',
    timestamp: Date.now(),
    blockNumber,
    prompt,
    receiptHash
  });

  return {
    status: 200,
    message: 'x402 Micropayment Verified & Settled',
    x402Receipt: receipt,
    result
  };
}
