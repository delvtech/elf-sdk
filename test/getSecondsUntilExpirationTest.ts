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
//eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ethers } from "hardhat";

import {
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  getSecondsUntilExpiration,
  getSecondsUntilExpirationByTokenInfo,
} from "../src/helpers/getSecondsUntilExpiration";
import { initTokenList, getTokenInfo } from "../src/helpers/getTokenInfo";
import { PrincipalPoolTokenInfo } from "elf-tokenlist";

describe("getSecondsUntilExpiration", async () => {
  it("getsecondsUntilExpirationByTokenInfo() should return the correct time until expiration", async () => {
    const blockTimestamp = 1635000391;
    const tokenInfoByAddress = initTokenList("mainnet");
    const poolAddress = "0x893B30574BF183d69413717f30b17062eC9DFD8b";
    const poolTokenInfo = getTokenInfo(poolAddress, tokenInfoByAddress);
    const getSecondsUntilExpirationByTokenInfoResult =
      getSecondsUntilExpirationByTokenInfo(
        poolTokenInfo as PrincipalPoolTokenInfo,
        blockTimestamp
      );
    expect(getSecondsUntilExpirationByTokenInfoResult).to.equal(5619867);
  });

  /*it("getSecondsUntilExpiration() should match getSecondsUntilExpirationByTokenInfo()", async () => {
    const [signer] = await ethers.getSigners();
    const blockTimestamp = 1635000391;
    const tokenInfoByAddress = initTokenList("mainnet");
    const poolAddress = "0x893B30574BF183d69413717f30b17062eC9DFD8b";
    const poolTokenInfo = getTokenInfo(poolAddress,tokenInfoByAddress)
    const getSecondsUntilExpirationByTokenInfoResult = getSecondsUntilExpirationByTokenInfo(poolTokenInfo as PrincipalPoolTokenInfo, blockTimestamp);
    const getSecondsUntilExpirationResult = await getSecondsUntilExpiration(
      poolAddress,
      signer,
      blockTimestamp
    );
    expect(getSecondsUntilExpirationByTokenInfoResult).to.equal(getSecondsUntilExpirationResult);
  });*/
});
