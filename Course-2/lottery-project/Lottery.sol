pragma solidity ^0.6.6;

contract Lottery {
    address public manager;
    address[] public players;
    
    constructor() public {
        manager = msg.sender;
    }
    
    function enter() public payable {
        require(msg.value == 1 ether, "Lottery ticket costs 1 Ether, please send the exact amount");
        players.push(msg.sender);
    }
    
    function random() private view returns(uint) {
        return uint(keccak256(abi.encodePacked(block.difficulty, players, now)));
    }
    
    receive() payable external {
        enter();
    }
}