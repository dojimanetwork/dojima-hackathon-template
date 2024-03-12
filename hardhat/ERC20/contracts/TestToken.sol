// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.18;

// Import statements to include necessary OpenZeppelin contracts
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

// TestToken contract inheriting from multiple OpenZeppelin contracts
contract TestToken is ERC20, ERC20Burnable, ERC20Pausable, Ownable, ERC20Permit {
    // Constructor to initialize the token with a name, symbol, initial supply, and owner
    constructor(address initialOwner)
        ERC20("TestToken", "TEST")
        Ownable(initialOwner)
        ERC20Permit("TestToken")
    {
        // Mint initial supply of tokens and assign to the deployer
        _mint(msg.sender, 1000000000 * 10 ** decimals());
    }

    // Function to pause token transfers, accessible only by the owner
    function pause() public onlyOwner {
        _pause();
    }

    // Function to unpause token transfers, accessible only by the owner
    function unpause() public onlyOwner {
        _unpause();
    }

    // Function to mint new tokens, accessible only by the owner
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    // Internal function to update token balances, overriding functions from ERC20 and ERC20Pausable
    function _update(address from, address to, uint256 value)
        internal
        override(ERC20, ERC20Pausable)
    {
        super._update(from, to, value); // Call parent implementation
    }
}
