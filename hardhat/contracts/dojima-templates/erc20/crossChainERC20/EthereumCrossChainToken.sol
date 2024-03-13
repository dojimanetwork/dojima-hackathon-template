// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import '@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol';
import '@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol';
import '@dojimanetwork/dojima-contracts/contracts/interfaces/IInboundStateSender.sol';
import {IStateExecutor} from '@dojimanetwork/dojima-contracts/contracts/interfaces/IStateReceiver.sol';

contract EthereumCrossChainToken is IStateExecutor, Initializable, ERC20Upgradeable, UUPSUpgradeable, AccessControlUpgradeable, ReentrancyGuardUpgradeable {
    bytes32 public constant EXECUTE_STATE_ROLE = keccak256("EXECUTE_STATE_ROLE");

    IInboundStateSender public inboundStateSender;
    address public omniChainContractAddress;

    event TokenDeposited(
        address indexed user,
        address token,
        uint256 amount,
        uint256 indexed depositId
    );

    // Initialize replaces the constructor for upgradeable contracts
    function initialize(
        string memory name,
        string memory symbol,
        address _inboundStateSender,
        address _omniChainContractAddress
    ) public initializer {
        require(_inboundStateSender != address(0), "EthereumCrossChainToken: InboundStateSender address cannot be zero");
        require(_omniChainContractAddress != address(0), "EthereumCrossChainToken: OmniChain contract address cannot be zero");

        __ERC20_init(name, symbol);
        __AccessControl_init();
        __UUPSUpgradeable_init();

        // Grant the deployer the default admin role: they can grant/revoke any roles
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);

        inboundStateSender = IInboundStateSender(_inboundStateSender);
        omniChainContractAddress = _omniChainContractAddress;
        _setupRole(EXECUTE_STATE_ROLE, _inboundStateSender);
    }

    function assignExecuteStateRole(address _account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _setupRole(EXECUTE_STATE_ROLE, _account);
    }

    function transferToOmniChain(bytes memory user, uint256 amount) external nonReentrant {
        _burn(msg.sender, amount);
        inboundStateSender.transferPayload(omniChainContractAddress, abi.encode(user, amount, 0));
    }

    function executeState(uint256 /*depositID*/, bytes calldata stateData) external nonReentrant onlyRole(EXECUTE_STATE_ROLE) {
        (bytes memory userBytes, uint256 amount, uint256 depositId) = abi.decode(stateData, (bytes, uint256, uint256));
        // Ensure the bytes array for the address is of the correct length
        require(userBytes.length == 20, "EthereumCrossChainToken: Invalid address length");

        address userAddress;
        assembly {
            userAddress := mload(add(userBytes, 20))
        }

        // Additional validation for the address can go here if needed
        require(userAddress != address(0), "EthereumCrossChainToken: Invalid address");

        _mint(userAddress, amount);
        emit TokenDeposited(userAddress, address(this), amount, depositId);
    }

    // Ensure only admin can upgrade the contract
    function _authorizeUpgrade(address newImplementation) internal override onlyRole(DEFAULT_ADMIN_ROLE) {
        // Upgrade authorization logic
    }
}