pragma solidity ^0.6.6;

// SharedWallet Course solution using OpenZeppelin libraries for ownership and SafeMath.

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/math/SafeMath.sol";

contract Allowance is Ownable {
    using SafeMath for uint;
    
    event AllowanceChanged(address indexed _who, address indexed _byWho, uint _oldAmount, uint _newAmount);
    
    mapping(address => uint) public allowance;
    
    function addAllowanace(address _who, uint _amount) public onlyOwner {
        emit AllowanceChanged(_who, msg.sender, allowance[_who], _amount);
        allowance[_who] = _amount;
    }
    
    modifier ownerOrAllowed(uint _amount) {
        require(msg.sender == owner() || allowance[msg.sender] >= _amount, "Not allowed");
        _;
    }
    
    function reduceAllowance(address _who, uint _amount) internal {
        emit AllowanceChanged(_who, msg.sender, allowance[_who], allowance[_who].sub(_amount));
        allowance[_who] = allowance[_who].sub(_amount);
    }
}