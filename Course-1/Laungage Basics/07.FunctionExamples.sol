pragma solidity ^0.6.6;


contract FunctionsExample {
    mapping(address => uint256) public balanceReceived;

    address payable owner;

    constructor() public {
        owner = msg.sender;
    }

    // view function can only read state variables and can only call other view or pure functions, not regular functions that change the state.
    // view/pure functions are reader functions and don't need to be mined, they will call the local blockchain node to read the data (free)
    function getOwner() public view returns (address) {
        return owner;
    }

    // pure functions don't interact with state variables like the ones declared above, the scope of the pure function is just within itself.
    // a pure function can call other pure functions but not view functions or regular functions
    function converWeiToEther(uint256 _amountInWei)
        public
        pure
        returns (uint256)
    {
        return _amountInWei / 1 ether;
    }

    function destroySmartContract() public {
        require(msg.sender == owner, "Not authorized");
        selfdestruct(owner);
    }

    function receiveMoney() public payable {
        assert(
            balanceReceived[msg.sender] + msg.value >=
                balanceReceived[msg.sender]
        );
        balanceReceived[msg.sender] += uint64(msg.value);
    }

    function withdrawMoney(address payable _to, uint256 _amount) public {
        require(_amount <= balanceReceived[msg.sender], "Insufficient funds.");
        assert(
            balanceReceived[msg.sender] >= balanceReceived[msg.sender] - _amount
        );
        balanceReceived[msg.sender] -= _amount;
        _to.transfer(_amount);
    }

    // the 'fallback' function is called when no other function matches and no money is sent along
    // the 'receive' function is called when no other function matches and money is sent along
    receive() external payable {
        receiveMoney();
    }
}
