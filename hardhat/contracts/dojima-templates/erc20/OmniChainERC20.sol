// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import '@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol';
import '@openzeppelin/contracts/access/AccessControl.sol';
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import '@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol';
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import '@dojimanetwork/dojima-contracts/contracts/interfaces/IOutboundStateSender.sol';
import '@dojimanetwork/dojima-contracts/contracts/interfaces/IStateReceiver.sol';
import '@dojimanetwork/dojima-contracts/contracts/dojimachain/StateSyncerVerifier.sol';
import "./XTokenContract.sol";

contract OmniChainERC20 is  Initializable, UUPSUpgradeable, ReentrancyGuardUpgradeable, AccessControl, IStateReceiver {
    XTokenContract public xToken;
    StateSyncerVerifier private _stateVerifier;

    IOutboundStateSender public outboundStateSender;
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    // Mapping of chain names to their contract addresses in bytes format
    mapping(bytes32 => bytes) public chainContractMappings;

    event ChainContractMappingUpdated(bytes32 chainName, bytes contractAddress);
    event TokensTransferredToChain(bytes32 destinationChain, bytes user, uint256 amount);

    modifier onlyStateSyncer() {
        require(msg.sender == address(_stateVerifier.stateSyncer()), "OmniChainERC20: Caller is not the state syncer");
        _;
    }

    // Initializer replaces the constructor
    function initialize(address _xTokenAddress, address _outboundStateSender, address _stateSyncerVerifier) public initializer {
        require(_xTokenAddress != address(0), "OmniChainERC20: XToken address cannot be zero");
        require(_outboundStateSender != address(0), "OmniChainERC20: OutboundStateSender address cannot be zero");
        require(_stateSyncerVerifier != address(0), "OmniChainERC20: Invalid state syncer verifier address");
        __UUPSUpgradeable_init();
        __ReentrancyGuard_init();

        _setupRole(ADMIN_ROLE, msg.sender);

        xToken = XTokenContract(_xTokenAddress);
        outboundStateSender = IOutboundStateSender(_outboundStateSender);
        _stateVerifier = StateSyncerVerifier(_stateSyncerVerifier);
    }

    // Function to authorize upgrades
    function _authorizeUpgrade(address newImplementation) internal override onlyRole(ADMIN_ROLE) {
        // Upgrade authorization logic
    }

    function updateChainContractMapping(bytes32 chainName, bytes memory contractAddress) external onlyRole(ADMIN_ROLE) {
        chainContractMappings[chainName] = contractAddress;
        emit ChainContractMappingUpdated(chainName, contractAddress);
    }

    function transferToChain(
        bytes32 destinationChain,
        bytes memory user,
        uint256 amount,
        bytes memory destinationContractAddress
    ) external nonReentrant {
        require(
            keccak256(destinationContractAddress) == keccak256(chainContractMappings[destinationChain]),
            "OmniChainERC20: Destination contract address does not match"
        );

        xToken.burn(msg.sender, amount);
        outboundStateSender.transferPayload(
            destinationChain,
            destinationContractAddress,
            msg.sender,
            abi.encode(user, amount, 0) // TODO: add depositId
        );
        emit TokensTransferredToChain(destinationChain, user, amount);
    }

    function onStateReceive(uint256 /* id */, bytes calldata data) external onlyStateSyncer {
        (bytes memory userBytes, uint256 amount, uint256 depositId ) = abi.decode(data, (bytes, uint256, uint256));

        // Ensure the bytes array for the address is of the correct length
        require(userBytes.length == 20, "OmniChainERC20: Invalid address length");

        address userAddress;
        assembly {
            userAddress := mload(add(userBytes, 20))
        }

        // Additional validation for the address can go here if needed
        require(userAddress != address(0), "OmniChainERC20: Invalid address");

        xToken.mint(userAddress, amount);
    }
}