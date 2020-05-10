pragma solidity ^0.6.6;

// SharedWallet Course solution using OpenZeppelin libraries for ownership and SafeMath.

import "./Allowance.sol";

contract SimpleWallet is Allowance {
    event FundsSent(address indexed _beneficiary, uint _amount);
    event FundsReceived(address indexed _from, uint _amount);
    
    function withdrawMoney(address payable _to, uint _amount) public ownerOrAllowed(_amount) {
        require(_amount <= address(this).balance, "Smart contract does not have sufficient funds.");
        if(msg.sender != owner())
            reduceAllowance(msg.sender, _amount);
        emit FundsSent(_to, _amount);
        _to.transfer(_amount);
    }
    
    function renounceOwnership() public override onlyOwner {
        revert("Can't renounce ownership.");
    }
    
    receive() external payable {
        emit FundsReceived(msg.sender, msg.value);
    }
}
