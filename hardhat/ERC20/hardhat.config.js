require('@nomicfoundation/hardhat-toolbox');
require('@nomicfoundation/hardhat-ethers');
require("@nomiclabs/hardhat-truffle5");
require("@nomicfoundation/hardhat-chai-matchers")
require("@openzeppelin/hardhat-upgrades");
// require('hardhat-ethernal');
// require("hardhat-tracer");
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  ethernal: {
    apiToken: process.env.ETHERNAL_API_TOKEN,
},
    solidity:  {
        compilers: [
          {
            version: '0.8.20',
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
        
        bsc: {
            url: "https://data-seed-prebsc-1-s1.bnbchain.org:8545/",
            chainId: 97,
            gasPrice: 20000000000,
            accounts: [
                process.env.PRIVATE_KEY,
            ],
        },
    },
};