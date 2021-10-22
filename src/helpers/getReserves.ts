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
  Vault__factory,
  BasePool__factory,
  ERC20__factory,
} from "elf-contracts-typechain";
import { BigNumber, Signer } from "ethers";

export interface ReservesResult {
  /**
   * addresses of tokens
   */
  tokens: string[];
  /**
   * balances of tokens in same order as tokens
   */
  balances: BigNumber[];
  /**
   * decimals of tokens in same order as tokens
   */
  decimals: number[];
}
export const ReservesResult = undefined;
/**
 * Returns the reserves for a given pool.
 * @param poolAddress any pool with a getPoolId method
 * @param balancerVaultAddress the address of the balancer v2 vault
 * @param signerOrProvider
 */
export async function getReserves(
  poolAddress: string,
  balancerVaultAddress: string,
  signerOrProvider: Signer | Provider
): Promise<ReservesResult> {
  const balancerVault = Vault__factory.connect(
    balancerVaultAddress,
    signerOrProvider
  );
  const poolContract = BasePool__factory.connect(poolAddress, signerOrProvider);
  const poolId = await poolContract.getPoolId();
  const poolTokens = await balancerVault.getPoolTokens(poolId);
  const decimals: number[] = [];
  await Promise.all(
    poolTokens.tokens.map(async (token) => {
      const poolTokenContract = ERC20__factory.connect(token, signerOrProvider);
      const poolTokenDecimals = await poolTokenContract.decimals();
      decimals.push(poolTokenDecimals);
    })
  );

  return {
    tokens: poolTokens.tokens,
    balances: poolTokens.balances,
    decimals: decimals,
  };
}
