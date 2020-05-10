pragma solidity ^0.6.6;

// My solution to the Shared Wallet assignment.
// Contract owner can set allowances for other addresses which they can withdraw. 
// Owner can withdraw all funds.

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/math/SafeMath.sol";

contract Owned {
    address owner;
    
    constructor() public {
        owner = msg.sender;
    }   
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Unauthorized!");
        _;
    }
}

contract SharedWallet is Owned {
    uint balance;
    using SafeMath for uint;
    mapping(address => uint) public allowance;

    function checkBalance() public view returns(uint) {
        if (msg.sender == owner) return balance;
        else return allowance[msg.sender];
    }
    
    function changeAllowance(address _to, uint _amount) public onlyOwner {
        require(_amount <= balance, "Allowance exceeds contract balance");
        allowance[_to] = _amount;
    }
    
    function withdrawFunds(address payable _to, uint _amount) internal onlyOwner {
        balance = balance.sub(_amount);
        allowance[owner] = balance;
        _to.transfer(_amount);
    }
    
    function withdrawAllowance(address payable _to, uint _amount) public {
        if (msg.sender == owner) withdrawFunds(_to, _amount);
        else {
            require(_amount <= allowance[_to], "Amount exceeds your allowance");
            allowance[_to] = allowance[_to].sub(_amount);
            balance = balance.sub(_amount);
            _to.transfer(_amount);
        }
    }
    
    receive() external payable {
        balance += msg.value;
        allowance[owner] = balance;
    }
}




