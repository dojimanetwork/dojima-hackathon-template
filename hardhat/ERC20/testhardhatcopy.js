require('@nomicfoundation/hardhat-toolbox');
require('@nomicfoundation/hardhat-ethers');
require("@nomiclabs/hardhat-truffle5");
require("@nomicfoundation/hardhat-chai-matchers")
require("@openzeppelin/hardhat-upgrades");
// require('hardhat-ethernal');
require("hardhat-tracer");
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  ethernal: {
    apiToken: process.env.ETHERNAL_API_TOKEN,
},
    solidity:  {
        compilers: [
          {
            version: '0.8.19',
            settings: {
                optimizer: {
                    enabled: true,
                    runs: 200,
                },
                viaIR: true,
            },
          },
        ],
  },

  defaultNetwork: "",
    networks: {
        dojima_chain_devnet: {
            url: 'https://api-dev.d11k.dojima.network/',
            chainId: 1001,
            // gas: 5000000, //units of gas you are willing to pay, aka gas limit
            gasPrice: 2000000000, // gas is typically in units of gwei, but you must enter it as wei here
            accounts: [
                process.env.PRIVATE_KEY,
            ],
        },
        sepolia_ethereum: {
          url: 'https://1rpc.io/sepolia',
          chainId: 11155111 ,
          accounts: [
              process.env.PRIVATE_KEY,
          ],
      },
        goerli_ethereum: {
            url: 'https://eth-goerli.g.alchemy.com/v2/TIMeEU-fdUdyD-YijUoB_AbdtlVfEcl2',
            chainId: 1337,
            // gas: 5000000, //units of gas you are willing to pay, aka gas limit
            gasPrice: 2000000000, // gas is typically in units of gwei, but you must enter it as wei here
            accounts: [
                process.env.PRIVATE_KEY,
            ],
        },
        holesky_ethereum: {
            url: 'https://eth-dev.h4s.dojima.network/',
            chainId: 17000,
            // gas: 5000000, //units of gas you are willing to pay, aka gas limit
            gasPrice: 2000000000, // gas is typically in units of gwei, but you must enter it as wei here
            accounts: [
                process.env.PRIVATE_KEY,
            ],
        },
        bsc: {
            url: "https://data-seed-prebsc-1-s1.bnbchain.org:8545/",
            chainId: 97,
            gasPrice: 20000000000,
            accounts: [
                process.env.PRIVATE_KEY,
            ],
        },
        dojimachain: {
            url: "http://localhost:8545",
            chainId: 1401,
            // gas: 5000000, //units of gas you are willing to pay, aka gas limit
            gasPrice: 2000000000, // gas is typically in units of gwei, but you must enter it as wei here
            accounts: [
                "e6cf2a965c8a79c93a6e788a5d9925b9be33e4700da91122866a55051a24e1cc",
            ],
        },
        ganache: {
            url: "http://127.0.0.1:7545",
            account:[
                "unfair nut proud struggle kind online trim same artwork assault swim anchor",
            ],
        },
        holesky: {
            url: "https://ethereum-holesky.publicnode.com",
            chainId: 17000,
        },
        fuji:{
            url: "https://ava-testnet.public.blastapi.io/ext/bc/C/rpc",
            chainId: 43113,
        },
        ethereum: {
            url: "https://ethereum.publicnode.com",
            chainId: 1,
        },
        avalanche: {
            url: "https://avax-pokt.nodies.app/ext/bc/C/rpc",
            chainId: 43114,
        },
    },
};