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
import { BasePool__factory } from "../../typechain/factories/BasePool__factory";

/**
 * Returns the total supply for a pool.  All balancer v2 pools use an 18 decimal Balancer Pool Token
 * (BPT) to track the total supply.
 * @param poolAddress any pool with a totalSupply method
 * @param signerOrProvider
 */
export async function getTotalSupply(
  poolAddress: string,
  signerOrProvider: Signer | Provider
): Promise<BigNumber> {
  const poolContract = BasePool__factory.connect(poolAddress, signerOrProvider);

  const totalSupply = await poolContract.totalSupply();

  return totalSupply;
}
