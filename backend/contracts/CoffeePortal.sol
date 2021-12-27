// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract CoffeePortal {
    uint256 totalCoffee;

     uint256 private seed;


event NewCoffee(address indexed from, uint256 timestamp, string message);

  
    struct Coffee {
        address sender; 
        string message; 
        uint256 timestamp; 
    }

    Coffee[] coffees;

    mapping(address => uint256) public lastCoffeeAt;


    constructor() payable {
        console.log("I am a Smart Contract");
        /*
         * Set the initial seed
         */
        seed = (block.timestamp + block.difficulty) % 100;
    }

    function coffee(string memory _message) public {
           require(
            lastCoffeeAt[msg.sender] + 20 seconds < block.timestamp,
            "Wait 2m"
        );
        lastCoffeeAt[msg.sender] = block.timestamp;

        totalCoffee += 1;
        console.log("%s bought Coffee w/ message %s", msg.sender, _message);

      
        coffees.push(Coffee(msg.sender, _message, block.timestamp));

          seed = (block.difficulty + block.timestamp + seed) % 100;
        
        console.log("Random # generated: %d", seed);


        emit NewCoffee(msg.sender, block.timestamp, _message);  
        uint256 prizeAmount = 0.0001 ether;
        if (seed <= 60) {
            console.log("%s won!", msg.sender);
        require(
            prizeAmount <= address(this).balance,
            "Trying to withdraw more money than the contract has."
        );
        (bool success, ) = (msg.sender).call{value: prizeAmount}("");
        require(success, "Failed to withdraw money from contract.");
        }
        emit NewCoffee(msg.sender, block.timestamp, _message);

    }

    function getAllCoffees() public view returns (Coffee[] memory) {
        return coffees;
    }
    
    function getTotalCoffee() public view returns (uint256) {
        console.log("We have %d total Coffee!", totalCoffee);
        return totalCoffee;
    }

}