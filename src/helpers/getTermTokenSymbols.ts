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

import { Tranche__factory } from "../../typechain/factories/Tranche__factory";
import { InterestToken__factory } from "../../typechain/factories/InterestToken__factory";

export interface TermTokenSymbolsResult {
  /**
   * name of the Principal Token
   */
  principalTokenSymbol: string;
  /**
   * name of the Yield Token
   */
  yieldTokenSymbol: string;
}

/**
 * returns the token symbols for a given term
 * @param termAddress the address of the term
 * @param signerOrProvider
 * @returns a promise for a TermTokenSymbolsResult
 */
export async function getTermTokenSymbols(
  termAddress: string,
  signerOrProvider: Signer | Provider
): Promise<TermTokenSymbolsResult> {
  const trancheContract = Tranche__factory.connect(
    termAddress,
    signerOrProvider
  );
  const termSymbol = await trancheContract.symbol();
  const interestTokenAddress = await trancheContract.interestToken();
  const interestTokenContract = InterestToken__factory.connect(
    interestTokenAddress,
    signerOrProvider
  );
  const yieldTokenSymbol = await interestTokenContract.symbol();
  return {
    principalTokenSymbol: termSymbol,
    yieldTokenSymbol: yieldTokenSymbol,
  };
}
