// This is an example test file. Hardhat will run every *.js file in `test/`,
// so feel free to add new ones.

// Hardhat tests are normally written with Mocha and Chai.

// We import Chai to use its asserting functions here.
const { expect } = require("chai");
const { BigNumber } = require("@ethersproject/bignumber");

// We use `loadFixture` to share common setups (or fixtures) between tests.
// Using this simplifies your tests and makes them run faster, by taking
// advantage of Hardhat Network's snapshot functionality.
const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");

// `describe` is a Mocha function that allows you to organize your tests.
// Having your tests organized makes debugging them easier. All Mocha
// functions are available in the global scope.
//
// `describe` receives the name of a section of your test suite, and a
// callback. The callback must define the tests of that section. This callback
// can't be an async function.

describe("TestToken", function () {
  let TestToken;
  let testToken;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    TestToken = await ethers.getContractFactory("TestToken");
    testToken = await TestToken.deploy(owner.address);
  });

  it("Should have correct name, symbol, and initial supply", async function () {
    expect(await testToken.name()).to.equal("TestToken");
    expect(await testToken.symbol()).to.equal("TEST");
    const ownerBalance = await testToken.balanceOf(owner.address);
    expect(await testToken.totalSupply()).to.equal(ownerBalance);
  });

  it("Should mint tokens to specified address", async function () {
    await testToken.mint(addr1.address, 1000);
    expect(await testToken.balanceOf(addr1.address)).to.equal(1000);
  });

  it("Should allow owner to pause and unpause the contract", async function () {
    await testToken.pause();
    expect(await testToken.paused()).to.equal(true);

    await testToken.unpause();
    expect(await testToken.paused()).to.equal(false);
  });

  it("Should transfer tokens between accounts when not paused", async function () {
    await testToken.transfer(addr1.address, 1000);
    expect(await testToken.balanceOf(addr1.address)).to.equal(1000);

    await testToken.connect(addr1).transfer(addr2.address, 500);
    expect(await testToken.balanceOf(addr2.address)).to.equal(500);
  });

  it("Should not transfer tokens when paused", async function () {
    await testToken.pause();

    await expect(testToken.transfer(addr1.address, 1000)).to.be.revertedWith(
      "ERC20Pausable: token transfer while paused"
    );
  });
});
