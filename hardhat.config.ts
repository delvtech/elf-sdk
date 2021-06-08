import "@nomiclabs/hardhat-waffle";
import "hardhat-typechain";
import "hardhat-gas-reporter";

import { HardhatUserConfig } from "hardhat/config";

const MAINNET_PROVIDER_URL = process.env.MAINNET_PROVIDER_URL || "";
const GOERLI_PROVIDER_URL = process.env.GOERLI_PROVIDER_URL || "";
const PRIVATE_KEY =
  process.env.PRIVATE_KEY ||
  "0000000000000000000000000000000000000000000000000000000000000000";

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  solidity: {
    compilers: [
      {
        version: "0.7.1",
        settings: {
          optimizer: {
            enabled: true,
            runs: 10000,
          },
        },
      },
      {
        version: "0.8.0",
        settings: {
          optimizer: {
            enabled: true,
            runs: 7500,
          },
        },
      },
    ],
    overrides: {
      "contracts/balancer-core-v2/vault/Vault.sol": {
        version: "0.7.1",
        settings: {
          optimizer: {
            enabled: true,
            runs: 400,
          },
        },
      },
      "contracts/balancer-core-v2/pools/weighted/WeightedPoolFactory.sol": {
        version: "0.7.1",
        settings: {
          optimizer: {
            enabled: true,
            runs: 800,
          },
        },
      },
    },
  },
  mocha: { timeout: 0 },
  networks: {
    goerli: {
      url: `${GOERLI_PROVIDER_URL}`,
      accounts: [`0x${PRIVATE_KEY}`],
    },
    mainnet: {
      url: `${MAINNET_PROVIDER_URL}`,
      accounts: [`0x${PRIVATE_KEY}`],
    },
  },
};

export default config;
