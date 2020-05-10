pragma solidity ^0.6.6;

contract ExceptionExample {
  mapping(address => uint64) public balanceReceived;
  
  function receiveMoney() public payable {
      assert(balanceReceived[msg.sender] + uint64(msg.value) >= balanceReceived[msg.sender]);
      balanceReceived[msg.sender] += uint64(msg.value);
  }
  
  function withdrawMoney(address payable _to, uint64 _amount) public {
      require(_amount <= balanceReceived[msg.sender], "Insufficient funds.");
      assert(balanceReceived[msg.sender] >= balanceReceived[msg.sender] - _amount);
      balanceReceived[msg.sender] -= _amount;
      _to.transfer(_amount);
  }
}
