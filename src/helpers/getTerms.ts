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

import { TrancheFactory__factory } from "../../typechain/factories/TrancheFactory__factory";

/**
 * Returns an array of tranche addresses for a given tranche factory.  filterable by wrapped position.
 *
 * @param trancheFactoryAddress The TrancheFactory that deployed the tranches
 * @param wrappedPositionAddress The wrapped position to filter by
 * @returns a promise of an array of tranche addresses
 */
export async function getTerms(
  trancheFactoryAddress: string,
  wrappedPositionAddress: string | null,
  signerOrProvider: Signer | Provider
): Promise<string[]> {
  const trancheFactoryContract = TrancheFactory__factory.connect(
    trancheFactoryAddress,
    signerOrProvider
  );

  const queryFilter = trancheFactoryContract.filters.TrancheCreated(
    null,
    wrappedPositionAddress,
    null
  );

  const trancheEvents = await trancheFactoryContract.queryFilter(queryFilter);

  const trancheAddresses: string[] = trancheEvents.map(
    (event) => event.args?.trancheAddress
  );

  return trancheAddresses;
}
