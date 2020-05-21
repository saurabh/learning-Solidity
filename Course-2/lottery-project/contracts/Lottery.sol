pragma solidity ^0.6.6;

contract Lottery {
    address public manager;
    address payable[] public players;
    
    modifier restricted() {
        require(msg.sender == manager, 'You are not the contract manager.');
        _;
    }
    
    constructor() public {
        manager = msg.sender;
    }
    
    function enter() public payable {
        require(msg.value == 1 ether, "Lottery ticket costs 1 Ether, please send the exact amount");
        players.push(msg.sender);
    }
    
    function psuedoRandom() private view returns(uint) {
        return uint(keccak256(abi.encodePacked(block.difficulty, players, now)));
    }
    
    function pickWinner() public restricted {
        uint index = psuedoRandom() % players.length;
        players[index].transfer(address(this).balance);
        players = new address payable[](0);
    }
    
    function getPlayers() public view returns(address payable[] memory) {
        return players;
    }
    
    receive() payable external {
        enter();
    }
}