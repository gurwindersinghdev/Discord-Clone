const { expect } = require("chai");
const hre = require("hardhat");

const tokens = (n) => {
  return ethers.parseUnits(n.toString(), "ether");
};

describe("Discord", function () {
  let contractAddr;
  let deployer, user;

  const NAME = "discordd";
  const SYMBOL = "DS";

  beforeEach(async () => {
    [deployer, user] = await ethers.getSigners();
    const discord = await ethers.deployContract("Discord", ["NAME", "SYMBOL"]);
    contractAddr = await discord.waitForDeployment();

    // Create a channel
    const transaction = await contractAddr
      .connect(deployer)
      .createChannel("general", tokens(1));
    await transaction.wait();
  });

  describe("Discord", function () {
    it("Sets the name", async () => {
      // fetch name
      let result = await contractAddr.name();

      expect(result).to.equal("NAME");
    });

    it("Sets the symbol", async () => {
      let result = await contractAddr.symbol();
      expect(result).to.equal("SYMBOL");
    });

    it("Sets the owner", async () => {
      const result = await contractAddr.owner();
      expect(result).to.equal(deployer.address);
    });
  });

  describe("Creating Channels", () => {
    it("Returns total channels", async () => {
      const result = await contractAddr.totalChannels();
      expect(result).to.be.equal(1);
    });

    it("Returns channel attributes", async () => {
      const channel = await contractAddr.getChannel(1);
      expect(channel.id).to.be.equal(1);
      expect(channel.name).to.be.equal("general");
      expect(channel.cost).to.be.equal(tokens(1));
    });
  });

  describe("Joining Channels", () => {
    const ID = 1;
    const AMOUNT = ethers.parseUnits("1", "ether");

    beforeEach(async () => {
      const transaction = await contractAddr
        .connect(user)
        .mint(ID, { value: AMOUNT });
      await transaction.wait();
    });

    it("Joins the user", async () => {
      const result = await contractAddr.hasJoined(ID, user.address);
      expect(result).to.be.equal(true);
    });

    it("Increases total supply", async () => {
      const result = await contractAddr.totalSupply();
      expect(result).to.be.equal(ID);
    });

    it("Updates the contract balance", async () => {
      const result = await ethers.provider.getBalance(
        contractAddr.getAddress()
      );
      expect(result).to.be.equal(AMOUNT);
    });
  });

  describe("Withdrawing", () => {
    const ID = 1;
    const AMOUNT = ethers.parseUnits("10", "ether");
    let balanceBefore;

    beforeEach(async () => {
      balanceBefore = await ethers.provider.getBalance(deployer.address);

      let transaction = await contractAddr
        .connect(user)
        .mint(ID, { value: AMOUNT });
      await transaction.wait();

      transaction = await contractAddr.connect(deployer).withdraw();
      await transaction.wait();
    });

    it("Updates the owner balance", async () => {
      const balanceAfter = await ethers.provider.getBalance(deployer.address);
      expect(balanceAfter).to.be.greaterThan(balanceBefore);
    });

    it("Updates the contract balance", async () => {
      const result = await ethers.provider.getBalance(
        contractAddr.getAddress()
      );
      expect(result).to.equal(0);
    });
  });
});
