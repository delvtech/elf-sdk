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
import { BigNumber, Signer, providers } from "ethers";

import { ConvergentCurvePool__factory } from "../../typechain/factories/ConvergentCurvePool__factory";

/**
 * Get the time until expiration for a given pool
 * @param poolAddress any pool with a getPoolId method
 * @param signerOrProvider
 * @returns the time until expiration
 */
export async function getTimeUntilExpiration(
  poolAddress: string,
  signerOrProvider: Signer | Provider
): Promise<number> {
  const poolContract = ConvergentCurvePool__factory.connect(
    poolAddress,
    signerOrProvider
  );
  const expiration = await poolContract.expiration();
  const provider = providers.getDefaultProvider();
  const blockNumber = await provider.getBlockNumber();
  const block = await provider.getBlock(blockNumber);
  const blockTimestamp = BigNumber.from(block.timestamp);
  const timeUntilExpiration =
    blockTimestamp < expiration
      ? expiration.sub(blockTimestamp)
      : BigNumber.from(0);
  return timeUntilExpiration.toNumber();
}
