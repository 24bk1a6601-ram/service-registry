// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title UsageTracker
 * @notice On-chain immutable record of AI Agent API invocations and cryptographic state proofs
 */
contract UsageTracker {
    struct UsageRecord {
        bytes32 usageId;
        bytes32 serviceId;
        address client;
        uint256 timestamp;
        uint256 costWei;
        bytes32 payloadHash; // Keccak256 hash of API request/response payload
        uint32 durationMs;
        bool verified;
    }

    mapping(bytes32 => UsageRecord) private usageRecords;
    bytes32[] private usageIds;
    mapping(bytes32 => uint256) public serviceInvocationCount;

    event UsageLogged(bytes32 indexed usageId, bytes32 indexed serviceId, address indexed client, uint256 costWei, bytes32 payloadHash, uint32 durationMs);

    function logUsage(
        bytes32 serviceId,
        address client,
        uint256 costWei,
        bytes32 payloadHash,
        uint32 durationMs
    ) external returns (bytes32 usageId) {
        usageId = keccak256(abi.encodePacked(serviceId, client, block.timestamp, payloadHash, durationMs));
        
        usageRecords[usageId] = UsageRecord({
            usageId: usageId,
            serviceId: serviceId,
            client: client,
            timestamp: block.timestamp,
            costWei: costWei,
            payloadHash: payloadHash,
            durationMs: durationMs,
            verified: true
        });

        usageIds.push(usageId);
        serviceInvocationCount[serviceId] += 1;

        emit UsageLogged(usageId, serviceId, client, costWei, payloadHash, durationMs);
    }

    function getUsageRecord(bytes32 usageId) external view returns (UsageRecord memory) {
        require(usageRecords[usageId].timestamp > 0, "UsageTracker: Record not found");
        return usageRecords[usageId];
    }

    function getTotalInvocations(bytes32 serviceId) external view returns (uint256) {
        return serviceInvocationCount[serviceId];
    }
}
