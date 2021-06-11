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
import {
  getTermTokenSymbols,
  TermTokenSymbolsResult,
} from "./getTermTokenSymbols";

/**
 * returns the term matching a token symbol
 * @param termAddresses array of terms addresses
 * @param tokenSymbol the token symbol to filter on
 * @param signerOrProvider
 * @returns a promise for a term address
 */
export async function getTermByTokenSymbol(
  termAddresses: string[],
  tokenSymbol: string,
  signerOrProvider: Signer | Provider
): Promise<string> {
  return termAddresses.find(async (termAddress) => {
    // get the symbols of a particular term address
    const termTokenSymbols: TermTokenSymbolsResult = await getTermTokenSymbols(
      termAddress,
      signerOrProvider
    );
    termTokenSymbols.principalTokenSymbol == tokenSymbol ||
      termTokenSymbols.yieldTokenSymbol == tokenSymbol;
  });
}
