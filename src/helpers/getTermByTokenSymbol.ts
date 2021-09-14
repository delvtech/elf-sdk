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

interface TermAddressSymbols {
  termAddress: string;
  principalTokenSymbol: string;
  yieldTokenSymbol: string;
}

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
  const symbolsList: TermAddressSymbols[] = await Promise.all(
    termAddresses.map(async (termAddress): Promise<TermAddressSymbols> => {
      const { principalTokenSymbol, yieldTokenSymbol }: TermTokenSymbolsResult =
        await getTermTokenSymbols(termAddress, signerOrProvider);

      return {
        termAddress,
        principalTokenSymbol,
        yieldTokenSymbol,
      };
    })
  );
  return termAddresses.find((t) => {
    // get the symbols of a particular term address
    const term = symbolsList.find(({ termAddress }) => termAddress == t);

    return (
      term?.principalTokenSymbol == tokenSymbol ||
      term?.yieldTokenSymbol == tokenSymbol
    );
  }) as string;
}
