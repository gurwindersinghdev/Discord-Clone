const hre = require("hardhat");

const tokens = (n) => {
  return ethers.parseUnits(n.toString(), "ether");
};

async function main() {
  [deployer] = await ethers.getSigners();
  const NAME = "Discordclone";
  const SYMBOL = "DC";

  const discord = await ethers.deployContract("Discord", ["NAME", "SYMBOL"]);
  await discord.waitForDeployment();

  console.log(await discord.getAddress());

  // Create 6 channels
  const CHANNEL_NAMES = ["general", "intro", "jobs"];

  const COSTS = [tokens(0.28), tokens(0.33), tokens(0.88)];

  for (let i = 0; i < 3; i++) {
    const transaction = await discord
      .connect(deployer)
      .createChannel(CHANNEL_NAMES[i], COSTS[i]);
    await transaction.wait();

    console.log(`Created text channel #${CHANNEL_NAMES[i]}`);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
