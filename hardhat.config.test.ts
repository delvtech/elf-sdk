import "@nomiclabs/hardhat-waffle";
import "hardhat-gas-reporter";

import { HardhatUserConfig } from "hardhat/config";

import config from "./hardhat.config";

const testConfig: HardhatUserConfig = {
  ...config,
  networks: {
    ...config.networks,
    hardhat: {
      ...config?.networks?.hardhat,
      allowUnlimitedContractSize: true,
    },
  },
};

export default testConfig;
