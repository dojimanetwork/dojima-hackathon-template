require('dotenv').config(); // Load environment variables from .env file

const { ethers } = require('hardhat');

async function main() {
  // Get the private key from environment variables
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    throw new Error('Private key not found in environment variables');
  }

  // Derive the signer's wallet from the private key
  const wallet = new ethers.Wallet(privateKey);

  // Get the contract factory
  const TestToken = await ethers.getContractFactory("TestToken");

  console.log("Wallet Address: ", wallet.address);

  // Deploy the contract with the wallet as the initial owner
  console.log("Deploying TestToken...");
  const testToken = await TestToken.deploy(wallet.address); // Use wallet address as initial owner

  // Wait for the contract to be mined
  const address = await testToken.getAddress();
  console.log("Test Token deployed to:", address);
}

// Execute the deployment script
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
