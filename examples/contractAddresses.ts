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
  getElementTermFactoryAddresses,
  getElementTermAddresses,
  getElementPtPoolAddresses,
} from "../src/helpers/getElementAddresses";
import { getTerms } from "../src/helpers/getTerms";
import {
  getTermTokenSymbols,
  TermTokenSymbolsResult,
} from "../src/helpers/getTermTokenSymbols";
import { DeploymentAddresses } from "../typechain/DeploymentAddresses";

async function main() {
  const [signer] = await ethers.getSigners();

  // get the official list of Element deployed addresses.
  let deploymentAddresses: DeploymentAddresses = <DeploymentAddresses>(
    await getElementDeploymentAddresses(
      "https://raw.githubusercontent.com/element-fi/elf-deploy/802c94e9c06a7c2d1f4985dd11a05e88681ed80e/addresses/goerli.json"
    )
  );
  console.log(deploymentAddresses);

  // get the factories used to deploy each term
  // Note: because not every term is necessarily deployed from the same TermFactory (e.g. if the sc code was upgraded)
  // it is better to use this method to iterate through all terms and collect the associated factories.
  let elementTermFactoryAddresses =
    getElementTermFactoryAddresses(deploymentAddresses);
  console.log("Element TermFactories: " + elementTermFactoryAddresses);

  // get all official element term addresses
  let elementTermAddresses = getElementTermAddresses(deploymentAddresses);
  console.log("\nElement Terms: " + elementTermAddresses);

  // get all terms emitted by all officially deployed Element TermFactories
  // Note: this will include terms that were not "officially" deployed by
  // Element so they could be misconfigured
  let termAddresses = [];
  await Promise.all(
    elementTermFactoryAddresses.map(async (termFactoryAddress) => {
      termAddresses.push(await getTerms(termFactoryAddress, null, signer));
    })
  );
  console.log("\nAll Terms: " + termAddresses);

  // get all official element PTPool addresses
  let elementPtPoolAddresses = getElementPtPoolAddresses(deploymentAddresses);
  console.log("\nElement PT Pools: " + elementPtPoolAddresses);

  // get all official element YTPool addresses
  let elementYtPoolAddresses = getElementPtPoolAddresses(deploymentAddresses);
  console.log("\nElement YT Pools: " + elementYtPoolAddresses);

  // get the symbols of a particular term address
  let termTokenSymbols: TermTokenSymbolsResult = await getTermTokenSymbols(
    elementTermAddresses[0],
    signer
  );
  console.log(
    "\nPrincipal Token Symbol: " + termTokenSymbols.principalTokenSymbol
  );
  console.log("Yield Token Symbol: " + termTokenSymbols.yieldTokenSymbol);
}

main();
