require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config()
require("@nomiclabs/hardhat-etherscan");

const { PRIVATE_KEY, POLYGON_API } = process.env || ""

module.exports = {
  solidity: "0.8.18",
  networks: {
    mumbai: {
      url: "https://polygon-mumbai.blockpi.network/v1/rpc/public",
      accounts: [PRIVATE_KEY],
    }
  },
  etherscan: {
    apiKey: POLYGON_API
  }
};