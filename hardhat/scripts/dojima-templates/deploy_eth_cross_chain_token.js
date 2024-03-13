'use strict';

const { ethers, upgrades } = require("hardhat");
const { printLog, printObj, confirm } = require('./utils')

async function deployEthCrossChainToken(deployerAccount, name, symbol, inboundStateSender, OmniChainERC20) {
	let EthCrossChainTokenContract = await ethers.getContractFactory('EthereumCrossChainToken');
	EthCrossChainTokenContract = await EthCrossChainTokenContract.connect(deployerAccount);
	const ethCrossChainTokenContract = await upgrades.deployProxy(EthCrossChainTokenContract, [name, symbol, inboundStateSender, OmniChainERC20], { initializer: 'initialize' });
	await ethCrossChainTokenContract.waitForDeployment();
	return ethCrossChainTokenContract;
}

async function deployEthCrossChainNFT(deployerAccount, name, symbol, inboundStateSender, omniChainNFTContract) {
	const EthCrossChainNFTContract = await ethers.getContractFactory('EthereumCrossChainNFT', deployerAccount);
	const ethCrossChainNFTContract = await upgrades.deployProxy(EthCrossChainNFTContract, [name, symbol, inboundStateSender, omniChainNFTContract], { initializer: 'initialize' });
	await ethCrossChainNFTContract.waitForDeployment();
	return ethCrossChainNFTContract;
}

module.exports = {
	deployEthCrossChainToken,
	deployEthCrossChainNFT,
}