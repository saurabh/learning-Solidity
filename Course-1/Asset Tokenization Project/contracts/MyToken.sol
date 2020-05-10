pragma solidity ^0.6.6;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("Cappucino Token", "CAPPA") public {
        _setupDecimals(0);
        _mint(msg.sender, initialSupply);
    }
}