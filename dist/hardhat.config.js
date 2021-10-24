"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("@nomiclabs/hardhat-waffle");
require("hardhat-typechain");
require("hardhat-gas-reporter");
var MAINNET_PROVIDER_URL = process.env.MAINNET_PROVIDER_URL || "";
var GOERLI_PROVIDER_URL = process.env.GOERLI_PROVIDER_URL || "";
var PRIVATE_KEY = process.env.PRIVATE_KEY ||
    "0000000000000000000000000000000000000000000000000000000000000000";
var config = {
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
            url: "" + GOERLI_PROVIDER_URL,
            accounts: ["0x" + PRIVATE_KEY],
        },
        mainnet: {
            url: "" + MAINNET_PROVIDER_URL,
            accounts: ["0x" + PRIVATE_KEY],
        },
        hardhat: {
            forking: {
                url: "https://eth-mainnet.alchemyapi.io/v2/kwjMP-X-Vajdk1ItCfU-56Uaq1wwhamK",
                blockNumber: 13475006,
            },
        },
    },
};
exports.default = config;
