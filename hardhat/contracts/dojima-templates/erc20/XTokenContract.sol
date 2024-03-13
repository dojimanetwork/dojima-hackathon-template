// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";


contract XTokenContract is ERC20Burnable, AccessControl {
    uint8 private _decimals;
    address public omniChainERC20Contract;
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    event OmniChainERC20ContractUpdated(address omniChainContract);

    constructor(string memory name, string memory symbol, uint8 decimals_) ERC20(name, symbol) {
        _decimals = decimals_;
        _mint(msg.sender, 10000000 * (10 ** uint256(decimals_)));
        _setupRole(ADMIN_ROLE, msg.sender);
    }

    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }

    function setOmniChainContract(address _omniChainToERC20Contract) external onlyRole(ADMIN_ROLE) {
        omniChainERC20Contract = _omniChainToERC20Contract;
        emit OmniChainERC20ContractUpdated(_omniChainToERC20Contract);
    }

    modifier onlyOmniChainContract() {
        require(msg.sender == omniChainERC20Contract, "XTokenContract: Unauthorized");
        _;
    }

    function burn(address account, uint256 amount) external onlyOmniChainContract {
        _burn(account, amount);
    }

    function mint(address account, uint256 amount) external onlyOmniChainContract{
        _mint(account, amount);
    }
}

