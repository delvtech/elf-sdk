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
import { getTotalSupply } from "../src/helpers/getTotalSupply";
import { getReserves } from "../src/helpers/getReserves";
import { calcSpotPricePt, calcSpotPriceYt } from "../src/helpers/calcSpotPrice";
import { getTimeUntilExpiration } from "../src/helpers/getTimeUntilExpiration";
import { getLatestBlockTimestamp } from "../src/helpers/getLatestBlockTimestamp";
import { getUnitSeconds } from "../src/helpers/getUnitSeconds";
import { calcFixedAPR } from "../src/helpers/calcFixedAPR";

async function main() {
  const balVault = "0x65748E8287Ce4B9E6D83EE853431958851550311"; // balancer vault address
  const base = "0x9A1000D492d40bfccbc03f413A48F5B6516Ec0Fd".toLowerCase(); // base token address
  const [signer] = await ethers.getSigners();

  // calculate principal token spot price
  const ptPool = "0x9eB7F54C0eCc4d0D2dfF28a1276e36d598F2B0D1"; // principal token Pool address
  const totalSupply = await getTotalSupply(ptPool, signer);
  let reserves = await getReserves(ptPool, balVault, signer);
  const ptIndex = reserves.tokens[0].toLowerCase() == base ? 1 : 0;
  let baseIndex = reserves.tokens[0].toLowerCase() == base ? 0 : 1;
  const ptReserves = reserves.balances[ptIndex];
  let baseReserves = reserves.balances[baseIndex];
  const blockTimestamp = await getLatestBlockTimestamp();
  const timeRemainingSeconds = await getTimeUntilExpiration(
    ptPool,
    signer,
    blockTimestamp
  );
  const unitSeconds = await getUnitSeconds(ptPool, signer);
  const ptSpotPrice = calcSpotPricePt(
    baseReserves.toString(),
    ptReserves.toString(),
    totalSupply.toString(),
    timeRemainingSeconds,
    unitSeconds
  );
  console.log("\nPrincipal Token");
  console.log(`totalSupply: ${totalSupply}`);
  console.log(`ptReserves: ${ptReserves}`);
  console.log(`baseReserves: ${baseReserves}`);
  console.log(`timeRemainingSeconds: ${timeRemainingSeconds}`);
  console.log(`unitSeconds: ${unitSeconds}`);
  console.log(`ptSpotPrice: ${ptSpotPrice}`);

  // calculate yield token spot price
  const ytPool = "0xD75bfF2444FF738d443066ff4688691e6852b217"; // yield token Pool address
  reserves = await getReserves(ytPool, balVault, signer);
  const ytIndex = reserves.tokens[0].toLowerCase() == base ? 1 : 0;
  baseIndex = reserves.tokens[0].toLowerCase() == base ? 0 : 1;
  const ytReserves = reserves.balances[ytIndex];
  baseReserves = reserves.balances[baseIndex];
  const ytSpotPrice = calcSpotPriceYt(
    baseReserves.toString(),
    ytReserves.toString()
  );
  console.log("\nYield Token");
  console.log(`ytReserves: ${ytReserves}`);
  console.log(`baseReserves: ${baseReserves}`);
  console.log(`ytSpotPrice: ${ytSpotPrice}`);

  // calculate fixed APR
  const fixedAPR = calcFixedAPR(ptSpotPrice, timeRemainingSeconds);
  console.log("\nFixed APR");
  console.log(`fixedAPR: ${fixedAPR}`);
}

main();
