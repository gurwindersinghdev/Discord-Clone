require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: ".env" });

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
//const POLYGONSCAN_KEY = process.env.POLYGONSCAN_KEY;

module.exports = {
  solidity: "0.8.9",
  networks: {
    mumbai: {
      url: ALCHEMY_API_KEY,
      accounts: [PRIVATE_KEY],
    },
  },
  // etherscan: {
  //   apiKey: {
  //     polygonMumbai: POLYGONSCAN_KEY,
  //   },
  // },
};
