// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title AgentRegistry
 * @notice Decentralized Identity and Verification Registry for Autonomous AI Agents
 * @dev Manages DID bindings, metadata URIs, owner verification, and agent status.
 */
contract AgentRegistry {
    struct Agent {
        bytes32 agentId;
        string name;
        string did; // Decentralized Identifier (e.g. did:pkh:eip155:8453:0x...)
        address owner;
        string organization;
        string metadataURI;
        bool isVerified;
        bool isActive;
        uint256 createdAt;
    }

    address public admin;
    mapping(bytes32 => Agent) private agents;
    bytes32[] private agentIds;
    mapping(address => bytes32[]) private ownerAgents;

    event AgentRegistered(bytes32 indexed agentId, string name, address indexed owner, string did);
    event AgentUpdated(bytes32 indexed agentId, string metadataURI, bool isActive);
    event AgentVerificationSet(bytes32 indexed agentId, bool isVerified);
    event AgentOwnershipTransferred(bytes32 indexed agentId, address indexed previousOwner, address indexed newOwner);

    modifier onlyAdmin() {
        require(msg.sender == admin, "AgentRegistry: Caller is not admin");
        _;
    }

    modifier onlyAgentOwner(bytes32 agentId) {
        require(agents[agentId].owner == msg.sender, "AgentRegistry: Caller is not agent owner");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function registerAgent(
        string memory name,
        string memory did,
        string memory organization,
        string memory metadataURI
    ) external returns (bytes32 agentId) {
        require(bytes(name).length > 0, "AgentRegistry: Name required");
        
        agentId = keccak256(abi.encodePacked(msg.sender, name, block.timestamp, block.prevrandao));
        require(agents[agentId].createdAt == 0, "AgentRegistry: Agent ID collision");

        Agent memory newAgent = Agent({
            agentId: agentId,
            name: name,
            did: did,
            owner: msg.sender,
            organization: organization,
            metadataURI: metadataURI,
            isVerified: false,
            isActive: true,
            createdAt: block.timestamp
        });

        agents[agentId] = newAgent;
        agentIds.push(agentId);
        ownerAgents[msg.sender].push(agentId);

        emit AgentRegistered(agentId, name, msg.sender, did);
    }

    function updateAgent(
        bytes32 agentId,
        string memory metadataURI,
        bool isActive
    ) external onlyAgentOwner(agentId) {
        agents[agentId].metadataURI = metadataURI;
        agents[agentId].isActive = isActive;

        emit AgentUpdated(agentId, metadataURI, isActive);
    }

    function setVerification(bytes32 agentId, bool isVerified) external onlyAdmin {
        require(agents[agentId].createdAt > 0, "AgentRegistry: Agent does not exist");
        agents[agentId].isVerified = isVerified;

        emit AgentVerificationSet(agentId, isVerified);
    }

    function transferOwnership(bytes32 agentId, address newOwner) external onlyAgentOwner(agentId) {
        require(newOwner != address(0), "AgentRegistry: Invalid new owner");
        address prevOwner = agents[agentId].owner;
        agents[agentId].owner = newOwner;
        ownerAgents[newOwner].push(agentId);

        emit AgentOwnershipTransferred(agentId, prevOwner, newOwner);
    }

    function getAgent(bytes32 agentId) external view returns (Agent memory) {
        require(agents[agentId].createdAt > 0, "AgentRegistry: Agent not found");
        return agents[agentId];
    }

    function getAllAgentIds() external view returns (bytes32[] memory) {
        return agentIds;
    }

    function getAgentsByOwner(address owner) external view returns (bytes32[] memory) {
        return ownerAgents[owner];
    }
}
