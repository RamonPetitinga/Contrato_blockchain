// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract StatusRegistry {
    string private status;
    address public owner;
    address public lastUpdater;
    uint256 public lastUpdatedAt;
    uint256 public updateCount;

    event StatusUpdated(
        address indexed updater,
        string newStatus,
        uint256 updatedAt,
        uint256 updateCount
    );

    constructor() {
        owner = msg.sender;
        status = "Aguardando registro";
        lastUpdater = msg.sender;
        lastUpdatedAt = block.timestamp;
    }

    function setStatus(string calldata newStatus) external {
        uint256 len = bytes(newStatus).length;
        require(len > 0, "Status vazio");
        require(len <= 120, "Status muito grande");

        status = newStatus;
        lastUpdater = msg.sender;
        lastUpdatedAt = block.timestamp;
        updateCount += 1;

        emit StatusUpdated(msg.sender, newStatus, block.timestamp, updateCount);
    }

    function getStatus() external view returns (string memory) {
        return status;
    }
}
