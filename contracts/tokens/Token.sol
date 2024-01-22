pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract PornCoin is ERC20 {
    constructor() ERC20("PornCoin", "DTC") {
        _mint(msg.sender, 100 * 10 ** uint(decimals()));
    }
}
