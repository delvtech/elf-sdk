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

import { Provider } from "@ethersproject/providers";
import { BigNumber, Signer } from "ethers";
import { PrincipalPoolTokenInfo, YieldPoolTokenInfo } from "elf-tokenlist";

import { ConvergentCurvePool__factory } from "elf-contracts-typechain";

/**
 * Get the seconds until expiration for a given pool
 * @param poolAddress any pool with a getPoolId method
 * @param signerOrProvider
 * @param timestamp timestamp of the latest block
 * @returns the seconds until expiration
 */
export async function getSecondsUntilExpiration(
  poolAddress: string,
  signerOrProvider: Signer | Provider,
  timestamp: number
): Promise<number> {
  const poolContract = ConvergentCurvePool__factory.connect(
    poolAddress,
    signerOrProvider
  );
  const expiration = await poolContract.expiration();
  const timeUntilExpiration =
    BigNumber.from(timestamp) < expiration
      ? expiration.sub(BigNumber.from(timestamp))
      : BigNumber.from(0);
  return timeUntilExpiration.toNumber();
}

/**
 * Get the seconds until expiration for a given pool using tokenlist.
 * @param poolTokenInfo PoolTokenInfo with extension property expiration
 * @param timestamp timestamp of the latest block
 * @returns the seconds until expiration
 */
export function getSecondsUntilExpirationByTokenInfo(
  poolTokenInfo: PrincipalPoolTokenInfo | YieldPoolTokenInfo,
  timestamp: number
): number {
  const expiration = poolTokenInfo.extensions.expiration;
  const timeUntilExpiration =
    timestamp < expiration ? expiration - timestamp : 0;
  return timeUntilExpiration;
}
