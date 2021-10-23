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

import { expect } from "chai";
import { ethers } from "hardhat";

import { getTimeUntilExpiration, getTimeUntilExpirationByTokenInfo } from "../src/helpers/getTimeUntilExpiration";
import { getLatestBlockTimestamp } from "../src/helpers/getLatestBlockTimestamp";
import { initTokenInfo, getTokenInfo } from "../src/helpers/getTokenInfo";
import { PrincipalPoolTokenInfo } from '../src/types/tokenlists/types'

describe("getTimeUntilExpiration", async () => {
    it("getTimeUntilExpirationByTokenInfo() should return the correct time until expiration", async () => {
      const blockTimestamp = 1635000391;
      const tokenInfoByAddress = initTokenInfo("mainnet");
      const poolAddress = "0x893B30574BF183d69413717f30b17062eC9DFD8b";
      const poolTokenInfo = getTokenInfo(poolAddress,tokenInfoByAddress)
      const getTimeUntilExpirationByTokenInfoResult = getTimeUntilExpirationByTokenInfo(poolTokenInfo as PrincipalPoolTokenInfo, blockTimestamp);
      expect(getTimeUntilExpirationByTokenInfoResult).to.equal(5619867);
    });

  /*it("getTimeUntilExpiration() should match getTimeUntilExpirationByTokenInfo()", async () => {
    const [signer] = await ethers.getSigners();
    const blockTimestamp = 1635000391;
    const tokenInfoByAddress = initTokenInfo("mainnet");
    const poolAddress = "0x893B30574BF183d69413717f30b17062eC9DFD8b";
    const poolTokenInfo = getTokenInfo(poolAddress,tokenInfoByAddress)
    const getTimeUntilExpirationByTokenInfoResult = getTimeUntilExpirationByTokenInfo(poolTokenInfo as PrincipalPoolTokenInfo, blockTimestamp);
    console.log(getTimeUntilExpirationByTokenInfoResult);
    const getTimeUntilExpirationResult = await getTimeUntilExpiration(
      poolAddress,
      signer,
      blockTimestamp
    );
    expect(getTimeUntilExpirationByTokenInfoResult).to.equal(getTimeUntilExpirationResult);
  });*/

});

