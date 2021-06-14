/*
 * Copyright 2021 Element Finance, Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { ethers } from "hardhat";
import {
  getElementDeploymentAddresses,
  getElementTermAddresses,
  getPoolIdByTermAddress,
  PoolType,
} from "../src/helpers/getElementAddresses";
import { swap, SwapKind } from "../src/swap";
import { getTermByTokenSymbol } from "../src/helpers/getTermByTokenSymbol";
import { DeploymentAddresses } from "../typechain/DeploymentAddresses";
import { BigNumber } from "ethers";

async function main() {
  const [signer] = await ethers.getSigners();
  const sender = signer.address;
  const recipient = signer.address;
  // get the official list of Element deployed addresses.
  const deploymentAddresses: DeploymentAddresses = <DeploymentAddresses>(
    await getElementDeploymentAddresses(
      "https://raw.githubusercontent.com/element-fi/elf-deploy/main/addresses/goerli.json"
    )
  );
  // get all official element term addresses
  const elementTermAddresses = getElementTermAddresses(deploymentAddresses);
  // find the term that matches the token symbol
  const termAddress = await getTermByTokenSymbol(
    elementTermAddresses,
    "eP:eyUSDC:06-AUG-21-GMT",
    signer
  );
  // get the poolid associated with the term and PoolType
  const poolId = await getPoolIdByTermAddress(
    termAddress,
    deploymentAddresses,
    PoolType.PT
  );
  const tokenInAddress = deploymentAddresses.tokens.usdc;
  const tokenOutAddress = termAddress;
  const balancerVaultAddress = deploymentAddresses.balancerVault;
  const amount = BigNumber.from("1000000"); // 1 USDC
  const kind = SwapKind.GIVEN_IN;
  const limit = BigNumber.from("990000");
  const gasPrice = BigNumber.from("99000000000");
  const result = await swap(
    signer,
    sender,
    recipient,
    poolId,
    tokenInAddress,
    tokenOutAddress,
    balancerVaultAddress,
    amount,
    kind,
    limit,
    gasPrice
  );
  console.log(await result.wait(1));
}

main();
