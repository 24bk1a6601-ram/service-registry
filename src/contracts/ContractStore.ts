import { SmartContractInfo } from '../types';

export const CONTRACT_DEPLOYMENTS = {
  'algorand-testnet': {
    chainId: 416002,
    rpcUrl: 'https://testnet-api.algonode.cloud',
    explorer: 'https://testnet.explorer.perawallet.app',
    agentRegistry: 'APP-720194810 (Algorand AVM App)',
    serviceRegistry: 'APP-720194811 (Algorand AVM App)',
    x402Escrow: 'APP-720194812 (Algorand ASA Escrow)',
    usageTracker: 'APP-720194813 (Algorand State Proof)',
    serviceRatings: 'APP-720194814 (Algorand Rating App)',
  },
  'base-sepolia': {
    chainId: 84532,
    rpcUrl: 'https://sepolia.base.org',
    explorer: 'https://sepolia.basescan.org',
    agentRegistry: '0x845320000000000000000000000000000000A1A1',
    serviceRegistry: '0x845320000000000000000000000000000000S2S2',
    x402Escrow: '0x845320000000000000000000000000000000E402',
    usageTracker: '0x845320000000000000000000000000000000U5U5',
    serviceRatings: '0x845320000000000000000000000000000000R6R6',
  },
  'ethereum-sepolia': {
    chainId: 11155111,
    rpcUrl: 'https://rpc.sepolia.org',
    explorer: 'https://sepolia.etherscan.io',
    agentRegistry: '0x11155111000000000000000000000000000A1A1',
    serviceRegistry: '0x11155111000000000000000000000000000S2S2',
    x402Escrow: '0x11155111000000000000000000000000000E402',
    usageTracker: '0x11155111000000000000000000000000000U5U5',
    serviceRatings: '0x11155111000000000000000000000000000R6R6',
  },
  'arbitrum-sepolia': {
    chainId: 421614,
    rpcUrl: 'https://sepolia-rollup.arbitrum.io/rpc',
    explorer: 'https://sepolia.arbiscan.io',
    agentRegistry: '0x421614000000000000000000000000000000A1A1',
    serviceRegistry: '0x421614000000000000000000000000000000S2S2',
    x402Escrow: '0x421614000000000000000000000000000000E402',
    usageTracker: '0x421614000000000000000000000000000000U5U5',
    serviceRatings: '0x421614000000000000000000000000000000R6R6',
  }
};

export const CONTRACT_STORE: Record<string, SmartContractInfo> = {
  AgentRegistry: {
    name: 'AgentRegistry',
    address: CONTRACT_DEPLOYMENTS['base-sepolia'].agentRegistry,
    description: 'Manages decentralized agent identities, DID bindings, organization verifications, and owner controls.',
    solidityCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AgentRegistry {
    struct Agent {
        bytes32 agentId;
        string name;
        string did;
        address owner;
        string organization;
        string metadataURI;
        bool isVerified;
        bool isActive;
        uint256 createdAt;
    }

    address public admin;
    mapping(bytes32 => Agent) private agents;

    event AgentRegistered(bytes32 indexed agentId, string name, address indexed owner, string did);
    event AgentUpdated(bytes32 indexed agentId, string metadataURI, bool isActive);

    function registerAgent(string memory name, string memory did, string memory organization, string memory metadataURI) external returns (bytes32);
    function updateAgent(bytes32 agentId, string memory metadataURI, bool isActive) external;
    function getAgent(bytes32 agentId) external view returns (Agent memory);
}`,
    abi: [
      {
        type: 'function',
        name: 'registerAgent',
        inputs: [
          { name: 'name', type: 'string' },
          { name: 'did', type: 'string' },
          { name: 'organization', type: 'string' },
          { name: 'metadataURI', type: 'string' }
        ],
        outputs: [{ name: 'agentId', type: 'bytes32' }],
        stateMutability: 'nonpayable'
      },
      {
        type: 'function',
        name: 'getAgent',
        inputs: [{ name: 'agentId', type: 'bytes32' }],
        outputs: [{ name: 'agent', type: 'tuple' }],
        stateMutability: 'view'
      },
      {
        type: 'function',
        name: 'setVerification',
        inputs: [
          { name: 'agentId', type: 'bytes32' },
          { name: 'isVerified', type: 'bool' }
        ],
        outputs: [],
        stateMutability: 'nonpayable'
      }
    ],
    readMethods: ['getAgent(bytes32)', 'getAllAgentIds()', 'getAgentsByOwner(address)', 'admin()'],
    writeMethods: ['registerAgent(string,string,string,string)', 'updateAgent(bytes32,string,bool)', 'setVerification(bytes32,bool)', 'transferOwnership(bytes32,address)']
  },

  ServiceRegistry: {
    name: 'ServiceRegistry',
    address: CONTRACT_DEPLOYMENTS['base-sepolia'].serviceRegistry,
    description: 'Catalog of AI Agent API services, price-per-request configuration in Wei/USDC, SLA parameters, and endpoint routes.',
    solidityCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ServiceRegistry {
    enum ServiceStatus { Active, Paused, Deprecated }

    struct Service {
        bytes32 serviceId;
        bytes32 agentId;
        string name;
        string category;
        string endpointURI;
        uint256 pricePerRequestWei;
        address owner;
        ServiceStatus status;
        string currentVersion;
    }

    event ServicePublished(bytes32 indexed serviceId, bytes32 indexed agentId, string name, uint256 pricePerRequestWei, address indexed owner);

    function registerService(bytes32 agentId, string memory name, string memory category, string memory endpointURI, uint256 pricePerRequestWei, string memory initialVersion, string memory slaTerms) external returns (bytes32);
    function getService(bytes32 serviceId) external view returns (Service memory);
}`,
    abi: [
      {
        type: 'function',
        name: 'registerService',
        inputs: [
          { name: 'agentId', type: 'bytes32' },
          { name: 'name', type: 'string' },
          { name: 'category', type: 'string' },
          { name: 'endpointURI', type: 'string' },
          { name: 'pricePerRequestWei', type: 'uint256' },
          { name: 'initialVersion', type: 'string' },
          { name: 'slaTerms', type: 'string' }
        ],
        outputs: [{ name: 'serviceId', type: 'bytes32' }],
        stateMutability: 'nonpayable'
      },
      {
        type: 'function',
        name: 'getService',
        inputs: [{ name: 'serviceId', type: 'bytes32' }],
        outputs: [{ name: 'service', type: 'tuple' }],
        stateMutability: 'view'
      }
    ],
    readMethods: ['getService(bytes32)', 'getAllServices()', 'getServicesByAgent(bytes32)'],
    writeMethods: ['registerService(bytes32,string,string,string,uint256,string,string)', 'updateService(bytes32,string,uint256,uint8)', 'bumpVersion(bytes32,string)']
  },

  x402Escrow: {
    name: 'x402Escrow',
    address: CONTRACT_DEPLOYMENTS['base-sepolia'].x402Escrow,
    description: 'Core x402 payment verification engine. Handles pay-per-request funds locking, cryptographic receipt verification, automated fee split, and instant settlement.',
    solidityCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract x402Escrow {
    struct EscrowDeposit {
        bytes32 depositId;
        address client;
        address payToAddress;
        bytes32 serviceId;
        uint256 amount;
        bytes32 nonce;
        bool settled;
        bool refunded;
    }

    event DepositCreated(bytes32 indexed depositId, address indexed client, address indexed payToAddress, uint256 amount, bytes32 nonce);
    event PaymentSettled(bytes32 indexed depositId, address indexed recipient, uint256 payoutAmount, uint256 feeAmount);

    function createEscrow(address payToAddress, bytes32 serviceId, bytes32 nonce, uint256 validSeconds) external payable returns (bytes32);
    function settlePayment(bytes32 depositId) external;
    function refundEscrow(bytes32 depositId) external;
}`,
    abi: [
      {
        type: 'function',
        name: 'createEscrow',
        inputs: [
          { name: 'payToAddress', type: 'address' },
          { name: 'serviceId', type: 'bytes32' },
          { name: 'nonce', type: 'bytes32' },
          { name: 'validSeconds', type: 'uint256' }
        ],
        outputs: [{ name: 'depositId', type: 'bytes32' }],
        stateMutability: 'payable'
      },
      {
        type: 'function',
        name: 'settlePayment',
        inputs: [{ name: 'depositId', type: 'bytes32' }],
        outputs: [],
        stateMutability: 'nonpayable'
      }
    ],
    readMethods: ['deposits(bytes32)', 'usedNonces(bytes32)', 'platformFeeRecipient()', 'platformFeeBps()'],
    writeMethods: ['createEscrow(address,bytes32,bytes32,uint256)', 'settlePayment(bytes32)', 'refundEscrow(bytes32)']
  },

  UsageTracker: {
    name: 'UsageTracker',
    address: CONTRACT_DEPLOYMENTS['base-sepolia'].usageTracker,
    description: 'Immutable ledger for API invocations, recording payload cryptographic hashes, latencies, payment costs, and verification status.',
    solidityCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract UsageTracker {
    struct UsageRecord {
        bytes32 usageId;
        bytes32 serviceId;
        address client;
        uint256 timestamp;
        uint256 costWei;
        bytes32 payloadHash;
        uint32 durationMs;
        bool verified;
    }

    event UsageLogged(bytes32 indexed usageId, bytes32 indexed serviceId, address indexed client, uint256 costWei, bytes32 payloadHash, uint32 durationMs);

    function logUsage(bytes32 serviceId, address client, uint256 costWei, bytes32 payloadHash, uint32 durationMs) external returns (bytes32);
    function getUsageRecord(bytes32 usageId) external view returns (UsageRecord memory);
}`,
    abi: [
      {
        type: 'function',
        name: 'logUsage',
        inputs: [
          { name: 'serviceId', type: 'bytes32' },
          { name: 'client', type: 'address' },
          { name: 'costWei', type: 'uint256' },
          { name: 'payloadHash', type: 'bytes32' },
          { name: 'durationMs', type: 'uint32' }
        ],
        outputs: [{ name: 'usageId', type: 'bytes32' }],
        stateMutability: 'nonpayable'
      }
    ],
    readMethods: ['getUsageRecord(bytes32)', 'getTotalInvocations(bytes32)'],
    writeMethods: ['logUsage(bytes32,address,uint256,bytes32,uint32)']
  },

  ServiceRatings: {
    name: 'ServiceRatings',
    address: CONTRACT_DEPLOYMENTS['base-sepolia'].serviceRatings,
    description: 'Sybil-resistant rating and review protocol with optional anti-spam staking.',
    solidityCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ServiceRatings {
    function submitReview(bytes32 serviceId, uint8 rating, string memory comment) external payable returns (bytes32);
    function getAverageRating(bytes32 serviceId) external view returns (uint8, uint256);
}`,
    abi: [
      {
        type: 'function',
        name: 'submitReview',
        inputs: [
          { name: 'serviceId', type: 'bytes32' },
          { name: 'rating', type: 'uint8' },
          { name: 'comment', type: 'string' }
        ],
        outputs: [{ name: 'reviewId', type: 'bytes32' }],
        stateMutability: 'payable'
      }
    ],
    readMethods: ['getAverageRating(bytes32)', 'hasReviewed(bytes32,address)'],
    writeMethods: ['submitReview(bytes32,uint8,string)']
  }
};
