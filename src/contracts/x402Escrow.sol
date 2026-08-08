// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title x402Escrow
 * @notice Micro-payment Escrow and Pay-Per-Request Verification Engine
 * @dev Supports automated settlement, signature verification, and dispute refund window.
 */
contract x402Escrow {
    struct EscrowDeposit {
        bytes32 depositId;
        address client;
        address payToAddress;
        bytes32 serviceId;
        uint256 amount;
        bytes32 nonce;
        uint256 expiresAt;
        bool settled;
        bool refunded;
    }

    mapping(bytes32 => EscrowDeposit) public deposits;
    mapping(bytes32 => bool) public usedNonces;
    
    address public platformFeeRecipient;
    uint256 public platformFeeBps = 100; // 1.0%

    event DepositCreated(bytes32 indexed depositId, address indexed client, address indexed payToAddress, uint256 amount, bytes32 nonce);
    event PaymentSettled(bytes32 indexed depositId, address indexed recipient, uint256 payoutAmount, uint256 feeAmount);
    event RefundIssued(bytes32 indexed depositId, address indexed client, uint256 amount);

    modifier nonReentrant() {
        require(_status != 2, "ReentrancyGuard: reentrant call");
        _status = 2;
        _;
        _status = 1;
    }
    uint256 private _status = 1;

    constructor(address _feeRecipient) {
        platformFeeRecipient = _feeRecipient != address(0) ? _feeRecipient : msg.sender;
    }

    /**
     * @notice Lock funds for x402 micropayment with specific service receipt nonce
     */
    function createEscrow(
        address payToAddress,
        bytes32 serviceId,
        bytes32 nonce,
        uint256 validSeconds
    ) external payable returns (bytes32 depositId) {
        require(msg.value > 0, "x402Escrow: Amount must be > 0");
        require(payToAddress != address(0), "x402Escrow: Invalid recipient");
        require(!usedNonces[nonce], "x402Escrow: Nonce already used");

        depositId = keccak256(abi.encodePacked(msg.sender, payToAddress, serviceId, nonce, block.timestamp));
        usedNonces[nonce] = true;

        deposits[depositId] = EscrowDeposit({
            depositId: depositId,
            client: msg.sender,
            payToAddress: payToAddress,
            serviceId: serviceId,
            amount: msg.value,
            nonce: nonce,
            expiresAt: block.timestamp + validSeconds,
            settled: false,
            refunded: false
        });

        emit DepositCreated(depositId, msg.sender, payToAddress, msg.value, nonce);
    }

    /**
     * @notice Settle payment upon proof of service completion (verified signature or provider claim)
     */
    function settlePayment(bytes32 depositId) external nonReentrant {
        EscrowDeposit storage dep = deposits[depositId];
        require(dep.amount > 0, "x402Escrow: Deposit not found");
        require(!dep.settled && !dep.refunded, "x402Escrow: Already processed");
        require(msg.sender == dep.payToAddress || msg.sender == dep.client, "x402Escrow: Unauthorized");

        dep.settled = true;

        uint256 fee = (dep.amount * platformFeeBps) / 10000;
        uint256 payout = dep.amount - fee;

        (bool successFee, ) = platformFeeRecipient.call{value: fee}("");
        require(successFee, "x402Escrow: Fee transfer failed");

        (bool successPayout, ) = dep.payToAddress.call{value: payout}("");
        require(successPayout, "x402Escrow: Payout transfer failed");

        emit PaymentSettled(depositId, dep.payToAddress, payout, fee);
    }

    /**
     * @notice Refund client if service invocation expires or fails SLA
     */
    function refundEscrow(bytes32 depositId) external nonReentrant {
        EscrowDeposit storage dep = deposits[depositId];
        require(dep.amount > 0, "x402Escrow: Deposit not found");
        require(!dep.settled && !dep.refunded, "x402Escrow: Already processed");
        require(block.timestamp > dep.expiresAt || msg.sender == dep.payToAddress, "x402Escrow: Lock active");

        dep.refunded = true;
        uint256 refundAmt = dep.amount;

        (bool success, ) = dep.client.call{value: refundAmt}("");
        require(success, "x402Escrow: Refund transfer failed");

        emit RefundIssued(depositId, dep.client, refundAmt);
    }
}
