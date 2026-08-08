import express from 'express';
import { blockchainService } from '../src/server/blockchainService';
import { siweAuthService } from '../src/server/siweAuth';
import { x402PaymentVerificationMiddleware } from '../src/server/x402Middleware';
import { handleAgentApiInvocation } from '../src/server/apiGateway';
import { runSecurityAuditAndTests } from '../src/server/testRunner';

const app = express();
app.use(express.json());

// CORS headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-402-Payment-Receipt');
  res.setHeader('Access-Control-Expose-Headers', 'WWW-Authenticate, X-402-Payment-Receipt');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Health route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    protocol: 'x402-v1',
    blockNumber: blockchainService.getBlockNumber(),
    network: 'Base L2 (8453)',
    timestamp: new Date().toISOString()
  });
});

// Agents API
app.get('/api/blockchain/agents', (req, res) => {
  res.json(blockchainService.getAllAgents());
});

app.post('/api/blockchain/agents', (req, res) => {
  const { name, organization, metadataURI, owner, capabilities, location } = req.body;
  if (!name || !owner) {
    return res.status(400).json({ error: 'Missing name or owner address' });
  }
  const newAgent = blockchainService.registerAgent({ name, organization, metadataURI, owner, capabilities, location });
  res.json({ success: true, agent: newAgent });
});

// Services API
app.get('/api/blockchain/services', (req, res) => {
  res.json(blockchainService.getAllServices());
});

app.post('/api/blockchain/services', (req, res) => {
  const { agentId, name, description, category, pricePerRequestWei, priceFormatted, slaGuarantee, owner, capabilities, locationCoverage } = req.body;
  if (!agentId || !name || !pricePerRequestWei || !owner) {
    return res.status(400).json({ error: 'Missing required service parameters' });
  }
  const newService = blockchainService.registerService({
    agentId,
    name,
    description,
    category,
    pricePerRequestWei,
    priceFormatted,
    slaGuarantee,
    owner,
    capabilities,
    locationCoverage
  });
  res.json({ success: true, service: newService });
});

// Indexer & Event logs
app.get('/api/blockchain/events', (req, res) => {
  res.json(blockchainService.getEvents(100));
});

app.get('/api/blockchain/usage', (req, res) => {
  res.json(blockchainService.getUsageLogs(100));
});

// SIWE Authentication
app.get('/api/auth/siwe/nonce', (req, res) => {
  const address = req.query.address as string;
  if (!address) {
    return res.status(400).json({ error: 'Missing address query param' });
  }
  const nonce = siweAuthService.generateNonce(address);
  const message = siweAuthService.generateSIWEMessage(address, nonce);
  res.json({ nonce, message });
});

app.post('/api/auth/siwe/verify', async (req, res) => {
  const { address, message, signature } = req.body;
  if (!address || !message || !signature) {
    return res.status(400).json({ error: 'Missing parameters for SIWE verification' });
  }
  const result = await siweAuthService.verifySignature(address, message, signature);
  if (!result.success) {
    return res.status(401).json(result);
  }
  res.json(result);
});

// x402 Protected Pay-per-use API Gateway
app.post('/api/gateway/invoke', x402PaymentVerificationMiddleware, handleAgentApiInvocation);

// Security audit report & automated test runner
app.get('/api/testing/audit', (req, res) => {
  res.json(runSecurityAuditAndTests());
});

export default app;
