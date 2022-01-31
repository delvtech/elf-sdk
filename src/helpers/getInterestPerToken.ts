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
import {
  Tranche__factory,
  YVaultAssetProxy__factory,
} from "elf-contracts-typechain";
import { BigNumber, ethers, Signer } from "ethers";

const { Zero } = ethers.constants;
/**
 * returns the yield accrued per interest token for a given term
 * @param termAddress the address of the term
 * @param signerOrProvider
 * @returns a promise of BigNumber in wei
 */
export async function getInterestPerToken(
  termAddress: string,
  signerOrProvider: Signer | Provider
): Promise<BigNumber> {
  const tranche = Tranche__factory.connect(termAddress, signerOrProvider);

  const balanceOfUnderlying = await tranche.valueSupplied();
  const wrappedPositionAddress = await tranche.position();
  const wrappedPosition = YVaultAssetProxy__factory.connect(
    wrappedPositionAddress,
    signerOrProvider
  );
  const valueOfSharesInUnderlying = await wrappedPosition.balanceOfUnderlying(
    tranche.address
  );

  const interestSupply = await tranche.interestSupply();

  const accumulatedInterest =
    valueOfSharesInUnderlying.sub(balanceOfUnderlying);

  return !interestSupply.eq(Zero)
    ? accumulatedInterest.mul(ethers.constants.WeiPerEther).div(interestSupply) // precision by expansion
    : Zero;
}
