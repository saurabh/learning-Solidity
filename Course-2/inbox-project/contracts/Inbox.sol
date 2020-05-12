pragma solidity ^0.6.7;

contract Inbox {
  string public message;

  function setMessage(string memory _newMessage) public {
    message = _newMessage;
  }
}