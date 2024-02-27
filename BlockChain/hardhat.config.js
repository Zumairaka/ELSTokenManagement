require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-etherscan");
require("@openzeppelin/hardhat-upgrades");
require("hardhat-gas-reporter");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.20"
      }
    ],
    settings: {
      optmizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.API_KEY}`,
      chainId: 11155111,
      accounts: [`0x${process.env.PRIVATE_KEY_SEPOLIA}`]
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_ETHEREUM
  },
  gasReporter: {
    currency: "ELS",
    gas: 21
  }
};
