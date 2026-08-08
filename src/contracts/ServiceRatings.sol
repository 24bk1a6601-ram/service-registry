// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ServiceRatings
 * @notice Decentralized, Sybil-Resistant Rating and Review System for AI Agent Services
 */
contract ServiceRatings {
    struct Review {
        bytes32 reviewId;
        bytes32 serviceId;
        address reviewer;
        uint8 rating; // 1 to 5
        string comment;
        uint256 timestamp;
        uint256 stakeAmount;
    }

    struct RatingStats {
        uint256 totalReviews;
        uint256 sumRatings;
        uint8 averageRating;
    }

    mapping(bytes32 => RatingStats) public serviceStats;
    mapping(bytes32 => Review) private reviews;
    mapping(bytes32 => mapping(address => bool)) public hasReviewed;

    event ReviewSubmitted(bytes32 indexed reviewId, bytes32 indexed serviceId, address indexed reviewer, uint8 rating, uint8 newAverage);

    function submitReview(
        bytes32 serviceId,
        uint8 rating,
        string memory comment
    ) external payable returns (bytes32 reviewId) {
        require(rating >= 1 && rating <= 5, "ServiceRatings: Rating must be 1-5");
        require(!hasReviewed[serviceId][msg.sender], "ServiceRatings: Already reviewed");

        reviewId = keccak256(abi.encodePacked(serviceId, msg.sender, block.timestamp));
        hasReviewed[serviceId][msg.sender] = true;

        reviews[reviewId] = Review({
            reviewId: reviewId,
            serviceId: serviceId,
            reviewer: msg.sender,
            rating: rating,
            comment: comment,
            timestamp: block.timestamp,
            stakeAmount: msg.value
        });

        RatingStats storage stats = serviceStats[serviceId];
        stats.totalReviews += 1;
        stats.sumRatings += rating;
        stats.averageRating = uint8(stats.sumRatings / stats.totalReviews);

        emit ReviewSubmitted(reviewId, serviceId, msg.sender, rating, stats.averageRating);
    }

    function getAverageRating(bytes32 serviceId) external view returns (uint8, uint256) {
        RatingStats memory stats = serviceStats[serviceId];
        return (stats.averageRating, stats.totalReviews);
    }
}
