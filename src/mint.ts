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
import { BigNumber, ContractTransaction, Signer } from "ethers";
import { parseUnits } from "ethers/lib/utils";
import { Tranche__factory } from "../typechain/factories/Tranche__factory";

import { UserProxy__factory } from "../typechain/factories/UserProxy__factory";

export const ETH_SENTINEL_ADDRESS =
  "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";

/**
 * Mints new principal and yield tokens for a given amount of base asset.  The base asset must match
 * the tranche's underlying.  For tranches that accept WETH, ETH can also be used by supplying the ETH_SENTINEL_ADDRESS.
 * @param userProxyContractAddress address of Element's UserProxy
 * @param trancheExpiration the exiration date of the tranche in unix seconds
 * @param tranchePosition the address of the tranche's wrapped position
 * @param baseAssetAmount the amount of base asset to deposit, i.e. "3.14" Ether
 * @param baseAssetAddress the address of the token to deposit. Use
 * ETH_SENTINEL_ADDRESS to mint with Ether.
 * @param baseAssetDecimals the decimal precision of the asset, i.e. 18 for Ether
 * @param signerOrProvider
 */
export async function mintWithUserProxy(
  userProxyContractAddress: string,
  trancheExpiration: number,
  tranchePosition: string,
  baseAssetAmount: string,
  baseAssetAddress: string,
  baseAssetDecimals: number,
  signerOrProvider: Signer | Provider
): Promise<ContractTransaction> {
  const userProxyContract = UserProxy__factory.connect(
    userProxyContractAddress,
    signerOrProvider
  );

  const value = parseUnits(baseAssetAmount, baseAssetDecimals);

  // if and only if we are minting with ETH, then we need to actually supply ETH in the transaction
  const overrides =
    baseAssetAddress === ETH_SENTINEL_ADDRESS ? { value } : undefined;

  const mintTx = await userProxyContract.mint(
    value,
    baseAssetAddress,
    trancheExpiration,
    tranchePosition,
    [],
    overrides
  );

  return mintTx;
}

/**
 * get the expiration time in unix seconds for a tranche.  returns a BigNumber that can be converted
 * to a number with BigNumber.toNumber()
 * @param trancheAddress the address of the tranche
 * @param signerOrProvider
 * @returns
 */
export async function getTrancheExpiration(
  trancheAddress: string,
  signerOrProvider: Signer | Provider
): Promise<BigNumber> {
  const trancheContract = Tranche__factory.connect(
    trancheAddress,
    signerOrProvider
  );

  const expiration = await trancheContract.unlockTimestamp();
  return expiration;
}

/**
 * returns the wrapped position address for a given tranche
 * @param trancheAddress the address of the tranche
 * @param signerOrProvider
 * @returns
 */
export async function getTranchePosition(
  trancheAddress: string,
  signerOrProvider: Signer | Provider
): Promise<string> {
  const trancheContract = Tranche__factory.connect(
    trancheAddress,
    signerOrProvider
  );

  const position = await trancheContract.position();
  return position;
}
