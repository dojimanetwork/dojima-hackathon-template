// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

// Replace Your_Name with your name and Token_Symbol with 3 letters form you name
contract Your_Name is ERC20, ERC20Burnable, Ownable, ERC20Permit {
    constructor()
        ERC20("Your_Name", "Token_Symbol")
        Ownable(msg.sender)
        ERC20Permit("Your_Name")
    {
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
