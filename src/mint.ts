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
  BigNumber,
  ContractTransaction,
  Signer,
  PayableOverrides,
} from "ethers";
import { parseUnits } from "ethers/lib/utils";
import { Tranche__factory } from "../typechain/factories/Tranche__factory";

import { UserProxy__factory } from "../typechain/factories/UserProxy__factory";

export const ETH_SENTINEL_ADDRESS =
  "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";

/**
 * Mints new principal and yield tokens for a given amount of base asset.  The base asset must match
 * the term's underlying.  For terms that accept WETH, ETH can also be used by supplying the ETH_SENTINEL_ADDRESS.
 * @param userProxyContractAddress address of Element's UserProxy
 * @param termExpiration the exiration date of the term in unix seconds
 * @param termPosition the address of the term's wrapped position
 * @param baseAssetAmount the amount of base asset to deposit, i.e. "3.14" Ether
 * @param baseAssetAddress the address of the token to deposit. Use
 * ETH_SENTINEL_ADDRESS to mint with Ether.
 * @param baseAssetDecimals the decimal precision of the asset, i.e. 18 for Ether
 * @param signerOrProvider
 */
export async function mintWithUserProxy(
  userProxyContractAddress: string,
  termExpiration: number,
  termPosition: string,
  baseAssetAmount: string,
  baseAssetAddress: string,
  baseAssetDecimals: number,
  signerOrProvider: Signer | Provider,
  overrides?: PayableOverrides
): Promise<ContractTransaction> {
  const userProxyContract = UserProxy__factory.connect(
    userProxyContractAddress,
    signerOrProvider
  );

  const value = parseUnits(baseAssetAmount, baseAssetDecimals);

  const mintTx =
    overrides === undefined
      ? await userProxyContract.mint(
          value,
          baseAssetAddress,
          termExpiration,
          termPosition,
          []
        )
      : await userProxyContract.mint(
          value,
          baseAssetAddress,
          termExpiration,
          termPosition,
          [],
          overrides
        );

  return mintTx;
}

/**
 * get the expiration time in unix seconds for a term.  returns a BigNumber that can be converted
 * to a number with BigNumber.toNumber()
 * @param termAddress the address of the term
 * @param signerOrProvider
 * @returns
 */
export async function getTermExpiration(
  termAddress: string,
  signerOrProvider: Signer | Provider
): Promise<BigNumber> {
  const termContract = Tranche__factory.connect(termAddress, signerOrProvider);

  const expiration = await termContract.unlockTimestamp();
  return expiration;
}

/**
 * returns the wrapped position address for a given term
 * @param termAddress the address of the term
 * @param signerOrProvider
 * @returns
 */
export async function getTermPosition(
  termAddress: string,
  signerOrProvider: Signer | Provider
): Promise<string> {
  const termContract = Tranche__factory.connect(termAddress, signerOrProvider);

  const position = await termContract.position();
  return position;
}
