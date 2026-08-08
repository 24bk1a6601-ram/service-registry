// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ServiceRegistry
 * @notice Service catalog and endpoint registry for AI Agents
 */
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
        string slaTerms;
        uint256 createdAt;
    }

    mapping(bytes32 => Service) private services;
    bytes32[] private serviceIds;
    mapping(bytes32 => bytes32[]) private agentServices;

    event ServicePublished(bytes32 indexed serviceId, bytes32 indexed agentId, string name, uint256 pricePerRequestWei, address indexed owner);
    event ServiceUpdated(bytes32 indexed serviceId, string endpointURI, uint256 pricePerRequestWei, ServiceStatus status);
    event ServiceVersionBumped(bytes32 indexed serviceId, string newVersion);

    modifier onlyServiceOwner(bytes32 serviceId) {
        require(services[serviceId].owner == msg.sender, "ServiceRegistry: Caller is not service owner");
        _;
    }

    function registerService(
        bytes32 agentId,
        string memory name,
        string memory category,
        string memory endpointURI,
        uint256 pricePerRequestWei,
        string memory initialVersion,
        string memory slaTerms
    ) external returns (bytes32 serviceId) {
        require(bytes(name).length > 0, "ServiceRegistry: Service name required");
        require(pricePerRequestWei > 0, "ServiceRegistry: Price must be > 0");

        serviceId = keccak256(abi.encodePacked(msg.sender, agentId, name, block.timestamp));
        require(services[serviceId].createdAt == 0, "ServiceRegistry: Service collision");

        services[serviceId] = Service({
            serviceId: serviceId,
            agentId: agentId,
            name: name,
            category: category,
            endpointURI: endpointURI,
            pricePerRequestWei: pricePerRequestWei,
            owner: msg.sender,
            status: ServiceStatus.Active,
            currentVersion: bytes(initialVersion).length > 0 ? initialVersion : "1.0.0",
            slaTerms: slaTerms,
            createdAt: block.timestamp
        });

        serviceIds.push(serviceId);
        agentServices[agentId].push(serviceId);

        emit ServicePublished(serviceId, agentId, name, pricePerRequestWei, msg.sender);
    }

    function updateService(
        bytes32 serviceId,
        string memory endpointURI,
        uint256 pricePerRequestWei,
        ServiceStatus status
    ) external onlyServiceOwner(serviceId) {
        services[serviceId].endpointURI = endpointURI;
        services[serviceId].pricePerRequestWei = pricePerRequestWei;
        services[serviceId].status = status;

        emit ServiceUpdated(serviceId, endpointURI, pricePerRequestWei, status);
    }

    function bumpVersion(bytes32 serviceId, string memory newVersion) external onlyServiceOwner(serviceId) {
        services[serviceId].currentVersion = newVersion;
        emit ServiceVersionBumped(serviceId, newVersion);
    }

    function getService(bytes32 serviceId) external view returns (Service memory) {
        require(services[serviceId].createdAt > 0, "ServiceRegistry: Service not found");
        return services[serviceId];
    }

    function getAllServices() external view returns (bytes32[] memory) {
        return serviceIds;
    }

    function getServicesByAgent(bytes32 agentId) external view returns (bytes32[] memory) {
        return agentServices[agentId];
    }
}
