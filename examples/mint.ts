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
import { ERC20Permit__factory } from "../typechain/factories/ERC20Permit__factory";
import {
  getElementDeploymentAddresses,
  getElementTermAddresses,
} from "../src/helpers/getElementAddresses";
import {
  mintWithUserProxy,
  getTermExpiration,
  getTermPosition,
} from "../src/mint";
import { getTermByTokenSymbol } from "../src/helpers/getTermByTokenSymbol";
import { DeploymentAddresses } from "../typechain/DeploymentAddresses";
import { BigNumber } from "ethers";

async function main() {
  const [signer] = await ethers.getSigners();
  // get the official list of Element deployed addresses.
  const deploymentAddresses: DeploymentAddresses = <DeploymentAddresses>(
    await getElementDeploymentAddresses(
      "https://raw.githubusercontent.com/element-fi/elf-deploy/main/addresses/goerli.json"
    )
  );

  const userProxyAddress = deploymentAddresses.userProxy;
  // get all official element term addresses
  const elementTermAddresses = getElementTermAddresses(deploymentAddresses);
  // find the term that matches the token symbol
  const termAddress = await getTermByTokenSymbol(
    elementTermAddresses,
    "eP:eyUSDC:06-AUG-21-GMT",
    signer
  );
  const termExpiration = await getTermExpiration(termAddress, signer);
  const termPosition = await getTermPosition(termAddress, signer);
  const baseAssetAmount = "1000000"; // 1 USDC
  const baseAssetAddress = deploymentAddresses.tokens.usdc;
  const tokenContract = ERC20Permit__factory.connect(baseAssetAddress, signer);
  const approval = await tokenContract.approve(
    userProxyAddress,
    ethers.utils.parseUnits("1000000", 6),
    { gasPrice: BigNumber.from("999000000000") }
  );
  console.log(await approval.wait(1));
  const tokenDecimals = await tokenContract.decimals();
  const gasPrice = BigNumber.from("999000000000");
  const result = await mintWithUserProxy(
    userProxyAddress,
    termExpiration.toNumber(),
    termPosition,
    baseAssetAmount,
    baseAssetAddress,
    tokenDecimals,
    gasPrice,
    signer
  );
  console.log(await result.wait(1));
}

main();
