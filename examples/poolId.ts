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
import { getPoolId } from "../src/helpers/getPoolId";

async function main() {
  const [signer] = await ethers.getSigners();

  let poolID = await getPoolId(
    "0x9eB7F54C0eCc4d0D2dfF28a1276e36d598F2B0D1",
    signer
  );
  console.log("Pool ID: " + poolID);

  poolID = await getPoolId(
    "0xD75bfF2444FF738d443066ff4688691e6852b217",
    signer
  );
  console.log("Pool ID: " + poolID);

  poolID = await getPoolId(
    "0x5941DB4d6C500C4FFa57c359eE0C55c6b41D0b61",
    signer
  );
  console.log("Pool ID: " + poolID);

  poolID = await getPoolId(
    "0xcF6894C48c2AF3ddD433CC1EDfEfC74e654cC9B4",
    signer
  );
  console.log("Pool ID: " + poolID);
}

main();
