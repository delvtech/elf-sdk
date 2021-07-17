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
  getBaseTokenAddress,
} from "../src/helpers/getElementAddresses";
import {
  getTermTokenSymbols,
  TermTokenSymbolsResult,
} from "../src/helpers/getTermTokenSymbols";
import { DeploymentAddresses } from "../typechain/DeploymentAddresses";
import { getTimeUntilExpiration } from "../src/helpers/getTimeUntilExpiration";
import { getLatestBlockTimestamp } from "../src/helpers/getLatestBlockTimestamp";
import { getTotalSupply } from "../src/helpers/getTotalSupply";
import { getReserves } from "../src/helpers/getReserves";
import { getUnitSeconds } from "../src/helpers/getUnitSeconds";
import { calcSpotPricePt } from "../src/helpers/calcSpotPrice";
import { calcFixedAPR } from "../src/helpers/calcFixedAPR";

async function main() {
  // TWITTER STUFF
  console.log("the bot is starting");

  const CONSUMER_KEY = process.env.TWITTER_CONSUMER_KEY || "";
  const CONSUMER_SECRET = process.env.TWITTER_CONSUMER_SECRET || "";
  const ACCESS_TOKEN = process.env.TWITTER_ACCESS_TOKEN || "";
  const ACCESS_TOKEN_SECRET = process.env.TWITTER_ACCESS_TOKEN_SECRET || "";

  var Twit = require("twit");
  var T = new Twit({
    consumer_key: CONSUMER_KEY,
    consumer_secret: CONSUMER_SECRET,
    access_token: ACCESS_TOKEN,
    access_token_secret: ACCESS_TOKEN_SECRET,
    timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
    strictSSL: true, // optional - requires SSL certificates to be valid.
  });

  var tweetBody = "";

  // ELEMENT STUFF
  const [signer] = await ethers.getSigners();

  // get the official list of Element deployed addresses.
  const deploymentAddresses: DeploymentAddresses = <DeploymentAddresses>(
    await getElementDeploymentAddresses(
      "https://raw.githubusercontent.com/element-fi/elf-deploy/main/addresses/goerli.json"
    )
  );

  for (const trancheListKey in deploymentAddresses.tranches) {
    const trancheList = deploymentAddresses.tranches[trancheListKey];
    for (const tranche of trancheList) {
      const ptPool = tranche.ptPool.address;
      const trancheAddress = tranche.address;
      const balancerVaultAddress = deploymentAddresses.balancerVault;

      // get the symbols for the term address
      const termTokenSymbols: TermTokenSymbolsResult =
        await getTermTokenSymbols(trancheAddress, signer);

      const blockTimeStamp = await getLatestBlockTimestamp();
      const timeRemainingSeconds = await getTimeUntilExpiration(
        ptPool,
        signer,
        blockTimeStamp
      );

      const base = await getBaseTokenAddress(
        deploymentAddresses,
        trancheListKey
      );

      const totalSupply = await getTotalSupply(ptPool, signer);
      let reserves = await getReserves(ptPool, balancerVaultAddress, signer);
      const ptIndex = reserves.tokens[0].toLowerCase() == base ? 1 : 0;
      let baseIndex = reserves.tokens[0].toLowerCase() == base ? 0 : 1;
      const ptReserves = reserves.balances[ptIndex];
      let baseReserves = reserves.balances[baseIndex];

      const unitSeconds = await getUnitSeconds(ptPool, signer);
      const ptSpotPrice = calcSpotPricePt(
        baseReserves.toString(),
        ptReserves.toString(),
        totalSupply.toString(),
        timeRemainingSeconds,
        unitSeconds
      );

      const fixedAPR = calcFixedAPR(ptSpotPrice, timeRemainingSeconds).toFixed(
        2
      );

      tweetBody = tweetBody + trancheListKey + ": " + fixedAPR + "%\n";
    }
  }
  T.post(
    "statuses/update",
    { status: tweetBody },
    function (err, data, response) {
      console.log(data);
    }
  );
}

main();
