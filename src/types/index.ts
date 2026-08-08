export type NetworkName = 
  | 'algorand-testnet'
  | 'base-sepolia' 
  | 'ethereum-sepolia' 
  | 'arbitrum-sepolia';

export interface AgentIdentity {
  id: string;
  name: string;
  did: string; // e.g. did:pkh:eip155:8453:0x123...
  owner: string;
  organization: string;
  verified: boolean;
  reputationScore: number; // 0 - 100
  createdAt: number;
  metadataURI: string;
  pubKey?: string;
  capabilities?: string[]; // e.g. ['Weather Forecast', 'Rain Prediction', 'Air Quality Index']
  location?: string; // e.g. 'Hyderabad, India / Global'
}

export interface ServiceVersion {
  version: string; // e.g. "1.0.0"
  releaseNotes: string;
  createdAt: number;
  deprecated: boolean;
  breakingChange: boolean;
  contractAddress?: string;
}

export interface AgentService {
  id: string;
  agentId: string;
  name: string;
  description: string;
  category: 'weather' | 'travel' | 'finance' | 'medical' | 'code-analysis' | 'data-analytics' | 'nlp-reasoning' | 'image-generation' | 'financial-audit' | 'web3-automation';
  endpointURI: string;
  pricePerRequestWei: string; // e.g. "100000000000000" (0.0001 ETH)
  priceFormatted: string; // "0.0001 ETH ($0.01)"
  priceUsd?: number; // 0.01
  acceptedTokens: string[]; // ['ETH', 'USDC']
  owner: string;
  rating: number; // 1-5
  totalInvocations: number;
  currentVersion: string;
  versions: ServiceVersion[];
  slaGuarantee: string; // "99.9% uptime, <120ms latency"
  status: 'active' | 'paused' | 'deprecated';
  createdAt: number;
  capabilities?: string[]; // e.g. ['Weather Forecast', 'Rain Prediction', 'Air Quality Index']
  latencyMs?: number; // e.g. 120
  locationCoverage?: string; // e.g. 'Hyderabad, India / Global'
}

export interface X402Challenge {
  status: 402;
  message: string;
  challenge: {
    protocol: 'x402-v1';
    payToAddress: string;
    amountWei: string;
    amountFormatted: string;
    tokenSymbol: string;
    nonce: string;
    serviceId: string;
    expiresAt: number;
    realm: string;
    chainId: number;
  };
}

export interface X402PaymentReceipt {
  paymentId: string;
  clientAddress: string;
  payToAddress: string;
  serviceId: string;
  amountWei: string;
  nonce: string;
  timestamp: number;
  txHash?: string;
  signature: string; // EIP-712 / EIP-191 signature over payment details
}

export interface SIWESession {
  address: string;
  chainId: number;
  nonce: string;
  issuedAt: string;
  expirationTime?: string;
  token?: string;
}

export interface BlockchainEvent {
  id: string;
  blockNumber: number;
  txHash: string;
  eventName: 'ServicePublished' | 'ServicePurchased' | 'ServiceUpdated' | 'ServiceInvoked' | 'PaymentCompleted' | 'RefundIssued' | 'OwnershipChanged' | 'AgentRegistered';
  contractAddress: string;
  parameters: Record<string, any>;
  timestamp: number;
}

export interface UsageLog {
  id: string;
  serviceId: string;
  agentId: string;
  clientAddress: string;
  timestamp: number;
  durationMs: number;
  costWei: string;
  status: 'success' | 'failed' | 'refunded';
  txHash: string;
  payloadHash: string;
}

export interface SmartContractInfo {
  name: string;
  address: string;
  description: string;
  solidityCode: string;
  abi: any[];
  readMethods: string[];
  writeMethods: string[];
}

export interface SecurityAuditReport {
  summary: {
    totalTests: number;
    passed: number;
    failed: number;
    securityScore: number;
  };
  vulnerabilities: {
    title: string;
    severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFORMATIONAL';
    status: 'PASSED' | 'MITIGATED' | 'ATTENTION';
    description: string;
    mitigation: string;
  }[];
  gasBenchmarks: {
    operation: string;
    gasUsed: number;
    estimatedCostUsd: string;
  }[];
}
