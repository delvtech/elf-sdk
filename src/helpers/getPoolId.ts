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

import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import { BasePool__factory } from "../../typechain/factories/BasePool__factory";

/**
 * Returns the PoolId for a given pool.
 * @param poolAddress any pool with a getPoolId method
 * @param signerOrProvider
 * @returns a promise for a poolId
 */
export async function getPoolId(
  poolAddress: string,
  signerOrProvider: Signer | Provider
): Promise<string> {
  const poolContract = BasePool__factory.connect(poolAddress, signerOrProvider);
  return poolContract.getPoolId();
}
