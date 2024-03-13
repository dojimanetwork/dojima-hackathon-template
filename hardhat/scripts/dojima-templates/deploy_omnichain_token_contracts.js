require('dotenv').config();

const { printLog, writeContractAddresses,printObj,writeRootContractAddresses, confirm, writeChildContractAddresses } = require('./utils');
const { ethers, upgrades } = require('hardhat');
const {deployEthCrossChainToken} = require('./deploy_eth_cross_chain_token.js');
const fileName = 'OmniChainERC20ContractConfig'

// these environment variables should be defined in an '.env' file
// deployer account private keys
const omniChainDeployerAccPrvKey = process.env.OMNI_CHAIN_DEPLOYER_ACC_PRIVATE_KEY;
const ethCrossChainTokenDeployerAccPrvKey = process.env.ETH_CROSS_CHAIN_TOKEN_DEPLOYER_PRIVATE_KEY;

// State Contracts
const inboundStateSenderContract = process.env.INBOUND_STATE_SENDER_CONTRACT_ADDRESS;
const outboundStateSenderContract = process.env.OUTBOUND_STATE_SENDER_CONTRACT_ADDRESS;
const stateSyncerVerifierContract = process.env.STATE_SYNCER_VERIFIER_CONTRACT_ADDRESS;

// network config
const ethURL = process.env.ETH_URL;
const dojimaURL = process.env.DOJIMA_URL;

// token config
const dojXTokenName = process.env.DOJ_X_OMNI_TOKEN_NAME;
const dojXTokenSymbol = process.env.DOJ_X_OMNI_TOKEN_SYMBOL;
const dojXTokenDecimal = process.env.DOJ_X_OMNI_TOKEN_DECIMAL;

const ethXERC20TokenName = process.env.ETH_X_ERC20__TOKEN_NAME;
const ethXERC20TokenSymbol = process.env.ETH_X_ERC20_TOKEN_SYMBOL;

const skipConfirm = process.env.SKIP_CONFIRMATION;
confirm(
	{
		ETH_URL: ethURL || null,
		DOJIMA_URL: dojimaURL || null,
		OMNI_CHAIN_DEPLOYER_ACC_PRIVATE_KEY: omniChainDeployerAccPrvKey || null,
		ETH_CROSS_CHAIN_TOKEN_DEPLOYER_PRIVATE_KEY: ethCrossChainTokenDeployerAccPrvKey || null,
		INBOUND_STATE_SENDER_CONTRACT_ADDRESS: inboundStateSenderContract || null,
		OUTBOUND_STATE_SENDER_CONTRACT_ADDRESS: outboundStateSenderContract || null,
		STATE_SYNCER_VERIFIER_CONTRACT_ADDRESS: stateSyncerVerifierContract || null,
		DOJ_X_OMNI_TOKEN_NAME: dojXTokenName || null,
		DOJ_X_OMNI_TOKEN_SYMBOL: dojXTokenSymbol || null,
		DOJ_X_OMNI_TOKEN_DECIMAL: dojXTokenDecimal || null,
		SKIP_CONFIRMATION: skipConfirm || null,
		ETH_X_ERC20__TOKEN_NAME: ethXERC20TokenName || null,
		ETH_X_ERC20_TOKEN_SYMBOL: ethXERC20TokenSymbol || null,
	},
	 ethURL && dojimaURL && omniChainDeployerAccPrvKey && inboundStateSenderContract && outboundStateSenderContract &&
		stateSyncerVerifierContract && dojXTokenName && dojXTokenSymbol && dojXTokenDecimal && skipConfirm && ethCrossChainTokenDeployerAccPrvKey &&
		ethXERC20TokenName && ethXERC20TokenSymbol,
);

const dojimaProvider = new ethers.JsonRpcProvider(dojimaURL);
const omniChainDeployerWallet = new ethers.Wallet(omniChainDeployerAccPrvKey, dojimaProvider);

const ethProvider = new ethers.JsonRpcProvider(ethURL);
const ethCrossChainTokenDeployerWallet = new ethers.Wallet(ethCrossChainTokenDeployerAccPrvKey, ethProvider);

async function main() {
	const initialDOJBalance = await dojimaProvider.getBalance(omniChainDeployerWallet.address)
	console.log(`Omni chain deployer address: ${omniChainDeployerWallet.address} balance: ${initialDOJBalance}`);

	// deploy cross-chain token 'contract
	const xTokenContract = await ethers.deployContract("XTokenContract", [dojXTokenName, dojXTokenSymbol,dojXTokenDecimal], omniChainDeployerWallet);
	await xTokenContract.waitForDeployment();
	printLog(`XTokenContract deployed to: ${xTokenContract.target}`);

	const OmniChainERC20 = await ethers.getContractFactory("OmniChainERC20");
	const omniChainERC20 = await OmniChainERC20.connect(omniChainDeployerWallet);
	const omniChainContract = await upgrades.deployProxy(
		omniChainERC20,
		[xTokenContract.target, outboundStateSenderContract, stateSyncerVerifierContract],
		{ initializer: 'initialize',kind: "uups" },
	);
	await omniChainContract.waitForDeployment();
	printLog(`OmniChainContract deployed to: ${await omniChainContract.target}`);

	printLog(`Deployer account: ${ethCrossChainTokenDeployerWallet.address} balance: ${await ethProvider.getBalance(ethCrossChainTokenDeployerWallet.address)} on ETH Chain`);
	const ethCrossChainTokenContract = await deployEthCrossChainToken(ethCrossChainTokenDeployerWallet, ethXERC20TokenName, ethXERC20TokenSymbol, inboundStateSenderContract, omniChainContract.target);
	printLog(`EthCrossChainTokenContract address: ${ethCrossChainTokenContract.target}`);

	writeContractAddresses({
		StateContracts: {
			OutboundStateSender: inboundStateSenderContract,
			InboundStateSender: outboundStateSenderContract,
			StateSyncerVerifier: stateSyncerVerifierContract,
		},
		OmniChainERC20: omniChainContract.target,
		XTokenContract: xTokenContract.target,
		EthCrossChainTokenContract: ethCrossChainTokenContract.target,
	}, fileName)

	// Exit the process
	process.exit(0);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});