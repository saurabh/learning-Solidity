pragma solidity ^0.6.6;

contract StartStopUpdate {
    address owner;
    bool paused;

    constructor() public {
        owner = msg.sender;
    }

    function sendMoney() public payable {}

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function setPaused() public {
        require(msg.sender == owner, "Unauthorized!");
        paused = !paused;
    }

    function withdrawAllMoney(address payable _to) public {
        require(msg.sender == owner, "Unauthorized!");
        require(!paused, "Contract is currently paused.");
        _to.transfer(address(this).balance);
    }

    function destroySmartContract(address payable _to) public {
        require(msg.sender == owner, "Unauthorized!");
        selfdestruct(_to);
    }
}
