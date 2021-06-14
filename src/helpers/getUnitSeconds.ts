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
import { Signer } from "ethers";

import { ConvergentCurvePool__factory } from "../../typechain/factories/ConvergentCurvePool__factory";

/**
 * Get the unit seconds for a given pool
 * @param poolAddress any pool with a getPoolId method
 * @param signerOrProvider
 * @returns the unit seconds
 */
export async function getUnitSeconds(
  poolAddress: string,
  signerOrProvider: Signer | Provider
): Promise<number> {
  const poolContract = ConvergentCurvePool__factory.connect(
    poolAddress,
    signerOrProvider
  );
  const unitSeconds = await poolContract.unitSeconds();
  return unitSeconds.toNumber();
}
