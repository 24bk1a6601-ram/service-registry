import { ethers } from 'ethers';
import { AgentIdentity, AgentService, BlockchainEvent, UsageLog, X402PaymentReceipt } from '../types';

export class BlockchainService {
  private currentBlockNumber: number = 18942000;
  private agents: Map<string, AgentIdentity> = new Map();
  private services: Map<string, AgentService> = new Map();
  private events: BlockchainEvent[] = [];
  private usageLogs: UsageLog[] = [];
  private usedNonces: Set<string> = new Set();
  private escrows: Map<string, { depositId: string; client: string; payTo: string; amountWei: string; serviceId: string; settled: boolean }> = new Map();

  constructor() {
    this.seedInitialData();
  }

  private seedInitialData() {
    // 1. Seed Agent 1: WeatherGPT (Weather Corp) - From User Specification
    const weatherAgentId = '0xa987654321098765432109876543210987654321000000000000000000000001';
    const weatherOwner = '0xA987654321098765432109876543210987654321';
    const weatherAgent: AgentIdentity = {
      id: weatherAgentId,
      name: 'WeatherGPT',
      did: `did:pkh:eip155:8453:${weatherOwner}`,
      owner: weatherOwner,
      organization: 'Weather Corp',
      verified: true,
      reputationScore: 99,
      createdAt: Date.now() - 86400000 * 15,
      metadataURI: 'ipfs://bafybeiclimateweathergpt001hash',
      capabilities: ['Weather Forecast', 'Rain Prediction', 'Air Quality Index', 'Monsoon Alerts'],
      location: 'Hyderabad, India / Global',
    };
    this.agents.set(weatherAgentId, weatherAgent);

    const weatherServiceId = '0x1000000000000000000000000000000000000000000000000000000000000001';
    const weatherService: AgentService = {
      id: weatherServiceId,
      agentId: weatherAgentId,
      name: "Today's Weather & Atmospheric Forecast API",
      description: 'Real-time microclimate predictions, precipitation radar, and air quality index for major global hubs including Hyderabad.',
      category: 'weather',
      endpointURI: '/api/gateway/invoke?serviceId=' + weatherServiceId,
      pricePerRequestWei: '3000000000000', // ~$0.01
      priceFormatted: '$0.01 (0.000003 ETH)',
      priceUsd: 0.01,
      acceptedTokens: ['USDC', 'ETH'],
      owner: weatherOwner,
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
    };
    this.services.set(weatherServiceId, weatherService);

    // 2. Seed Agent 2: ClimateAI (EcoTech Foundation) - For Discovery Engine Search Filter
    const climateAgentId = '0xb876543210987654321098765432109876543210000000000000000000000002';
    const climateOwner = '0xB876543210987654321098765432109876543210';
    const climateAgent: AgentIdentity = {
      id: climateAgentId,
      name: 'ClimateAI',
      did: `did:pkh:eip155:8453:${climateOwner}`,
      owner: climateOwner,
      organization: 'EcoTech Foundation',
      verified: true,
      reputationScore: 95,
      createdAt: Date.now() - 86400000 * 12,
      metadataURI: 'ipfs://bafybeiclimateai002hash',
      capabilities: ['Weather Forecast', 'Solar Radiation', 'Storm Tracking'],
      location: 'Hyderabad, India',
    };
    this.agents.set(climateAgentId, climateAgent);

    const climateServiceId = '0x2000000000000000000000000000000000000000000000000000000000000002';
    const climateService: AgentService = {
      id: climateServiceId,
      agentId: climateAgentId,
      name: 'Hyper-local Microclimate & Humidity Feed',
      description: 'Precision agricultural weather tracking, soil moisture sensors, and storm trajectory prediction.',
      category: 'weather',
      endpointURI: '/api/gateway/invoke?serviceId=' + climateServiceId,
      pricePerRequestWei: '10000000000000', // ~$0.03
      priceFormatted: '$0.03 (0.00001 ETH)',
      priceUsd: 0.03,
      acceptedTokens: ['USDC', 'ETH'],
      owner: climateOwner,
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
    };
    this.services.set(climateServiceId, climateService);

    // 3. Seed Agent 3: SkyAgent (SkyNet Geo)
    const skyAgentId = '0xc765678901234567890123456789012345678901000000000000000000000003';
    const skyOwner = '0xC765678901234567890123456789012345678901';
    const skyAgent: AgentIdentity = {
      id: skyAgentId,
      name: 'SkyAgent',
      did: `did:pkh:eip155:8453:${skyOwner}`,
      owner: skyOwner,
      organization: 'SkyNet Geo Systems',
      verified: true,
      reputationScore: 92,
      createdAt: Date.now() - 86400000 * 9,
      metadataURI: 'ipfs://bafybeiskyagent003hash',
      capabilities: ['Air Quality', 'Rain Prediction', 'Satellite Radar'],
      location: 'Hyderabad, India / South Asia',
    };
    this.agents.set(skyAgentId, skyAgent);

    const skyServiceId = '0x3000000000000000000000000000000000000000000000000000000000000003';
    const skyService: AgentService = {
      id: skyServiceId,
      agentId: skyAgentId,
      name: 'Doppler Radar & Precipitative AI Feed',
      description: 'Satellite-backed precipitation radar streams and cloud density analysis for South Asian logistics.',
      category: 'weather',
      endpointURI: '/api/gateway/invoke?serviceId=' + skyServiceId,
      pricePerRequestWei: '13000000000000', // ~$0.04
      priceFormatted: '$0.04 (0.000013 ETH)',
      priceUsd: 0.04,
      acceptedTokens: ['USDC', 'ETH'],
      owner: skyOwner,
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
    };
    this.services.set(skyServiceId, skyService);

    // 4. Seed Agent 4: TravelAgent AI (Autonomous Travel Agent)
    const travelAgentId = '0xd1d1000000000000000000000000000000000000000000000000000000000004';
    const travelOwner = '0xD1D1000000000000000000000000000000000004';
    const travelAgent: AgentIdentity = {
      id: travelAgentId,
      name: 'TravelAgent AI',
      did: `did:pkh:eip155:8453:${travelOwner}`,
      owner: travelOwner,
      organization: 'GlobeTrotter Autonomous DAO',
      verified: true,
      reputationScore: 97,
      createdAt: Date.now() - 86400000 * 20,
      metadataURI: 'ipfs://bafybeitravelagent004hash',
      capabilities: ['Flight Booking', 'Itinerary Optimization', 'Weather Integration', 'Hotel Concierge'],
      location: 'Global',
    };
    this.agents.set(travelAgentId, travelAgent);

    const travelServiceId = '0x4000000000000000000000000000000000000000000000000000000000000004';
    const travelService: AgentService = {
      id: travelServiceId,
      agentId: travelAgentId,
      name: 'Autonomous Flight & Itinerary Booking Engine',
      description: 'End-to-end trip planning AI that automatically queries weather, calculates layover delays, and books tickets.',
      category: 'travel',
      endpointURI: '/api/gateway/invoke?serviceId=' + travelServiceId,
      pricePerRequestWei: '6000000000000', // ~$0.02
      priceFormatted: '$0.02 (0.000006 ETH)',
      priceUsd: 0.02,
      acceptedTokens: ['USDC', 'ETH'],
      owner: travelOwner,
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
    };
    this.services.set(travelServiceId, travelService);

    // 5. Seed Agent 5: TaxPulse Finance AI
    const taxAgentId = '0xe1e1000000000000000000000000000000000000000000000000000000000005';
    const taxOwner = '0xE1E1000000000000000000000000000000000005';
    const taxAgent: AgentIdentity = {
      id: taxAgentId,
      name: 'TaxPulse AI',
      did: `did:pkh:eip155:8453:${taxOwner}`,
      owner: taxOwner,
      organization: 'AuditX Global',
      verified: true,
      reputationScore: 98,
      createdAt: Date.now() - 86400000 * 30,
      metadataURI: 'ipfs://bafybeitaxpulse005hash',
      capabilities: ['Tax Calculation', 'DeFi Portfolio Audit', 'Cost-Basis Accounting'],
      location: 'India & US Jurisdiction',
    };
    this.agents.set(taxAgentId, taxAgent);

    const taxServiceId = '0x5000000000000000000000000000000000000000000000000000000000000005';
    const taxService: AgentService = {
      id: taxServiceId,
      agentId: taxAgentId,
      name: 'Cross-Chain Crypto Tax & Cost-Basis Calculation Engine',
      description: 'Calculates real-time capital gains, staking rewards tax liability, and income deductions across 12 EVM chains.',
      category: 'finance',
      endpointURI: '/api/gateway/invoke?serviceId=' + taxServiceId,
      pricePerRequestWei: '4500000000000', // ~$0.015
      priceFormatted: '$0.015 (0.0000045 ETH)',
      priceUsd: 0.015,
      acceptedTokens: ['USDC', 'ETH'],
      owner: taxOwner,
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
    };
    this.services.set(taxServiceId, taxService);

    // 6. Seed Agent 6: MediScan Medical AI
    const mediAgentId = '0xf1f1000000000000000000000000000000000000000000000000000000000006';
    const mediOwner = '0xF1F1000000000000000000000000000000000006';
    const mediAgent: AgentIdentity = {
      id: mediAgentId,
      name: 'MediScan AI',
      did: `did:pkh:eip155:8453:${mediOwner}`,
      owner: mediOwner,
      organization: 'BioHealth Protocol',
      verified: true,
      reputationScore: 99,
      createdAt: Date.now() - 86400000 * 40,
      metadataURI: 'ipfs://bafybeimediscan006hash',
      capabilities: ['Medical Report Analysis', 'Biomarker Interpretation', 'Lab Report Insights'],
      location: 'Global / HIPAA Compliant',
    };
    this.agents.set(mediAgentId, mediAgent);

    const mediServiceId = '0x6000000000000000000000000000000000000000000000000000000000000006';
    const mediService: AgentService = {
      id: mediServiceId,
      agentId: mediAgentId,
      name: 'Clinical Medical Diagnostics & Lab Report Analyzer',
      description: 'Privacy-preserving AI that ingests blood tests, pathology metrics, and MRI reports to produce clinical summaries.',
      category: 'medical',
      endpointURI: '/api/gateway/invoke?serviceId=' + mediServiceId,
      pricePerRequestWei: '7500000000000', // ~$0.025
      priceFormatted: '$0.025 (0.0000075 ETH)',
      priceUsd: 0.025,
      acceptedTokens: ['USDC', 'ETH'],
      owner: mediOwner,
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
    };
    this.services.set(mediServiceId, mediService);

    // 7. Seed Agent 7: CyberGuard AI (Code Auditor)
    const agent1Id = '0xa1a1000000000000000000000000000000000000000000000000000000000007';
    const agent1Owner = '0x71C7656EC7ab88b098defB751B7401B5f6d8976F';
    const agent1: AgentIdentity = {
      id: agent1Id,
      name: 'CyberGuard AI - Code Auditor',
      did: `did:pkh:eip155:8453:${agent1Owner}`,
      owner: agent1Owner,
      organization: 'CyberGuard Security DAO',
      verified: true,
      reputationScore: 98,
      createdAt: Date.now() - 86400000 * 10,
      metadataURI: 'ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi',
      capabilities: ['Smart Contract Audit', 'Vulnerability Scanner', 'Gas Optimization'],
      location: 'Global',
    };
    this.agents.set(agent1Id, agent1);

    const service1Id = '0x7000000000000000000000000000000000000000000000000000000000000007';
    const service1: AgentService = {
      id: service1Id,
      agentId: agent1Id,
      name: 'Solidity & Move Smart Contract Auditor API',
      description: 'Automated deep-learning AST analyzer for reentrancy, overflow, access-control, and gas optimization vulnerabilities.',
      category: 'code-analysis',
      endpointURI: '/api/gateway/invoke?serviceId=' + service1Id,
      pricePerRequestWei: '100000000000000', // 0.0001 ETH (~$0.30)
      priceFormatted: '$0.30 (0.0001 ETH)',
      priceUsd: 0.30,
      acceptedTokens: ['ETH', 'USDC'],
      owner: agent1Owner,
      rating: 4.9,
      totalInvocations: 1420,
      currentVersion: '1.2.0',
      slaGuarantee: '99.9% Uptime, Max 1200ms latency',
      status: 'active',
      createdAt: Date.now() - 86400000 * 8,
      capabilities: ['Smart Contract Audit', 'Vulnerability Scanner', 'Gas Optimization'],
      latencyMs: 1200,
      locationCoverage: 'Global',
      versions: [
        { version: '1.0.0', releaseNotes: 'Initial v1 release with reentrancy detectors', createdAt: Date.now() - 86400000 * 8, deprecated: false, breakingChange: false },
        { version: '1.2.0', releaseNotes: 'Added Move bytecode & EIP-712 signature validation rules', createdAt: Date.now() - 86400000 * 2, deprecated: false, breakingChange: false }
      ]
    };
    this.services.set(service1Id, service1);

    // Emit Initial Blockchain Events
    this.emitEvent('AgentRegistered', weatherOwner, { agentId: weatherAgentId, name: weatherAgent.name, did: weatherAgent.did, owner: weatherOwner });
    this.emitEvent('ServicePublished', weatherOwner, { serviceId: weatherServiceId, agentId: weatherAgentId, name: weatherService.name, price: weatherService.pricePerRequestWei });
    this.emitEvent('AgentRegistered', climateOwner, { agentId: climateAgentId, name: climateAgent.name, did: climateAgent.did, owner: climateOwner });
    this.emitEvent('ServicePublished', climateOwner, { serviceId: climateServiceId, agentId: climateAgentId, name: climateService.name, price: climateService.pricePerRequestWei });
    this.emitEvent('AgentRegistered', skyOwner, { agentId: skyAgentId, name: skyAgent.name, did: skyAgent.did, owner: skyOwner });
    this.emitEvent('ServicePublished', skyOwner, { serviceId: skyServiceId, agentId: skyAgentId, name: skyService.name, price: skyService.pricePerRequestWei });
    this.emitEvent('AgentRegistered', travelOwner, { agentId: travelAgentId, name: travelAgent.name, did: travelAgent.did, owner: travelOwner });
    this.emitEvent('ServicePublished', travelOwner, { serviceId: travelServiceId, agentId: travelAgentId, name: travelService.name, price: travelService.pricePerRequestWei });
  }

  public getBlockNumber(): number {
    return this.currentBlockNumber;
  }

  public getAllAgents(): AgentIdentity[] {
    return Array.from(this.agents.values());
  }

  public getAgent(agentId: string): AgentIdentity | undefined {
    return this.agents.get(agentId);
  }

  public getAllServices(): AgentService[] {
    return Array.from(this.services.values());
  }

  public getService(serviceId: string): AgentService | undefined {
    return this.services.get(serviceId);
  }

  public registerAgent(data: { name: string; organization: string; metadataURI: string; owner: string; capabilities?: string[]; location?: string }): AgentIdentity {
    const id = ethers.keccak256(ethers.toUtf8Bytes(data.name + Date.now().toString() + data.owner));
    const did = `did:pkh:eip155:8453:${data.owner}`;
    const agent: AgentIdentity = {
      id,
      name: data.name,
      did,
      owner: data.owner,
      organization: data.organization || 'Independent Creator',
      verified: true,
      reputationScore: 85,
      createdAt: Date.now(),
      metadataURI: data.metadataURI || 'ipfs://QmDefaultAgentMetadataHash',
      capabilities: data.capabilities || ['AI API Service'],
      location: data.location || 'Global',
    };
    this.agents.set(id, agent);
    this.emitEvent('AgentRegistered', data.owner, { agentId: id, name: agent.name, owner: agent.owner, did });

    // Auto-create a default primary service endpoint for this registered agent so it instantly appears in the Marketplace!
    const serviceId = '0x' + id.substring(2, 62) + '0001';
    const primaryService: AgentService = {
      id: serviceId,
      agentId: id,
      name: `${data.name} Primary API Service`,
      description: `Autonomous Web3 AI Service provided by ${data.name} (${data.organization || 'Independent Creator'}). Accepts pay-per-call x402 micro-settlements.`,
      category: 'weather',
      endpointURI: '/api/gateway/invoke?serviceId=' + serviceId,
      pricePerRequestWei: '3000000000000', // ~$0.01
      priceFormatted: '$0.01 (0.000003 ETH)',
      priceUsd: 0.01,
      acceptedTokens: ['ETH', 'USDC'],
      owner: data.owner,
      rating: 5.0,
      totalInvocations: 0,
      currentVersion: '1.0.0',
      slaGuarantee: '99.9% SLA, <150ms Latency',
      status: 'active',
      createdAt: Date.now(),
      capabilities: data.capabilities || ['AI API Service'],
      latencyMs: 150,
      locationCoverage: data.location || 'Global',
      versions: [
        { version: '1.0.0', releaseNotes: 'Initial registered service endpoint', createdAt: Date.now(), deprecated: false, breakingChange: false }
      ]
    };
    this.services.set(serviceId, primaryService);
    this.emitEvent('ServicePublished', data.owner, { serviceId, agentId: id, name: primaryService.name, price: primaryService.pricePerRequestWei });

    return agent;
  }

  public registerService(data: {
    agentId: string;
    name: string;
    description: string;
    category: AgentService['category'];
    pricePerRequestWei: string;
    priceFormatted: string;
    slaGuarantee: string;
    owner: string;
    capabilities?: string[];
    locationCoverage?: string;
    priceUsd?: number;
    latencyMs?: number;
  }): AgentService {
    const id = ethers.keccak256(ethers.toUtf8Bytes(data.name + Date.now().toString() + data.agentId));
    const service: AgentService = {
      id,
      agentId: data.agentId,
      name: data.name,
      description: data.description,
      category: data.category,
      endpointURI: '/api/gateway/invoke?serviceId=' + id,
      pricePerRequestWei: data.pricePerRequestWei,
      priceFormatted: data.priceFormatted || `$${data.priceUsd || 0.01}`,
      priceUsd: data.priceUsd || 0.01,
      acceptedTokens: ['ETH', 'USDC'],
      owner: data.owner,
      rating: 5.0,
      totalInvocations: 0,
      currentVersion: '1.0.0',
      slaGuarantee: data.slaGuarantee || '99.9% SLA, <200ms Latency',
      status: 'active',
      createdAt: Date.now(),
      capabilities: data.capabilities || ['AI Service Endpoint'],
      latencyMs: data.latencyMs || 150,
      locationCoverage: data.locationCoverage || 'Global',
      versions: [
        { version: '1.0.0', releaseNotes: 'Initial service release', createdAt: Date.now(), deprecated: false, breakingChange: false }
      ]
    };
    this.services.set(id, service);
    this.emitEvent('ServicePublished', data.owner, { serviceId: id, agentId: data.agentId, name: service.name, price: data.pricePerRequestWei });
    return service;
  }

  public verifyNonce(nonce: string): boolean {
    if (this.usedNonces.has(nonce)) return false;
    this.usedNonces.add(nonce);
    return true;
  }

  public recordUsage(log: Omit<UsageLog, 'id' | 'timestamp'>): UsageLog {
    const usageLog: UsageLog = {
      ...log,
      id: '0x' + Math.random().toString(16).substring(2, 10) + Math.random().toString(16).substring(2, 10),
      timestamp: Date.now(),
    };
    this.usageLogs.unshift(usageLog);

    // Update service invocation metrics
    const svc = this.services.get(log.serviceId);
    if (svc) {
      svc.totalInvocations += 1;
    }

    this.emitEvent('ServiceInvoked', log.clientAddress, {
      serviceId: log.serviceId,
      client: log.clientAddress,
      costWei: log.costWei,
      payloadHash: log.payloadHash,
      durationMs: log.durationMs
    });

    this.emitEvent('PaymentCompleted', log.clientAddress, {
      serviceId: log.serviceId,
      client: log.clientAddress,
      amountWei: log.costWei,
      txHash: log.txHash
    });

    return usageLog;
  }

  public emitEvent(eventName: BlockchainEvent['eventName'], caller: string, parameters: Record<string, any>): BlockchainEvent {
    this.currentBlockNumber += 1;
    const event: BlockchainEvent = {
      id: 'evt_' + Math.random().toString(36).substring(2, 9),
      blockNumber: this.currentBlockNumber,
      txHash: ethers.keccak256(ethers.toUtf8Bytes(eventName + Date.now().toString() + caller)),
      eventName,
      contractAddress: '0x845320000000000000000000000000000000E402',
      parameters,
      timestamp: Date.now(),
    };
    this.events.unshift(event);
    return event;
  }

  public getEvents(limit: number = 50): BlockchainEvent[] {
    return this.events.slice(0, limit);
  }

  public getUsageLogs(limit: number = 50): UsageLog[] {
    return this.usageLogs.slice(0, limit);
  }
}

export const blockchainService = new BlockchainService();
