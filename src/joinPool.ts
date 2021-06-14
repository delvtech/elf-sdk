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

import { BigNumber, Signer, ContractTransaction } from "ethers";
import { defaultAbiCoder } from "ethers/lib/utils";

import { Vault__factory } from "../typechain/factories/Vault__factory";

/**
 * Add liquidity to a ConvergentCurvePool.
 * @param signer Who is authorizing the transaction
 * @param poolId Balancer V2 PoolId
 * @param senderAddress who is depositing the money into the pool
 * @param receipientAddress who is receiving the LP token
 * @param vaultAddress Balancer V2 Vault address
 * @param tokens tokens to deposit, note: sorted alphanumerically.  ETH must be sorted as though it
 * were WETH.
 * @param maxAmountsIn maximum amounts to deposit, same order as tokens.
 * @param fromInternalBalance Use the sender's Balancer V2 internal balance first, if available.
 * @returns returns the contract transaction.
 */
export async function joinConvergentPool(
  signer: Signer,
  poolId: string,
  senderAddress: string,
  receipientAddress: string,
  vaultAddress: string,
  tokens: string[],
  maxAmountsIn: BigNumber[],
  fromInternalBalance = false
): Promise<ContractTransaction> {
  // Balancer V2 vault allows userData as a way to pass props through to pool contracts.  In this
  // case we need to pass the maxAmountsIn.
  const userData = defaultAbiCoder.encode(["uint256[]"], [maxAmountsIn]);

  const joinRequest = {
    assets: tokens,
    maxAmountsIn,
    userData,
    fromInternalBalance,
  };

  const vaultContract = Vault__factory.connect(vaultAddress, signer);
  const joinReceipt = await vaultContract.joinPool(
    poolId,
    senderAddress,
    receipientAddress,
    joinRequest
  );

  return joinReceipt;
}

const ZeroBigNumber = BigNumber.from(0);
enum WeightedPoolJoinKind {
  INIT,
  EXACT_TOKENS_IN_FOR_BPT_OUT,
  TOKEN_IN_FOR_EXACT_BPT_OUT,
}

/**
 * Add liquidity to a WeightedPool.
 * @param signer who is authorizing the transaction.
 * @param poolId Balancer V2 PoolId.
 * @param senderAddress who is depositing the money into the pool.
 * @param receipientAddress who is receiving the LP token.
 * @param vaultAddress Balancer V2 Vault address.
 * @param tokens tokens to deposit, note: sorted alphanumerically.  ETH must be sorted as though it
 * were WETH.
 * @param maxAmountsIn maximum amounts to deposit, same order as tokens.
 * @param minBPTOut minimun amount of LP out, setting this creates a slippage tolerangs.
 * @param fromInternalBalance use the sender's Balancer V2 internal balance first, if available.
 * @param joinKind
 * @returns returns the contract transaction.
 */
export async function joinWeightedPool(
  signer: Signer,
  poolId: string,
  senderAddress: string,
  receipientAddress: string,
  vaultAddress: string,
  tokens: string[],
  maxAmountsIn: BigNumber[],
  minBPTOut: BigNumber = ZeroBigNumber,
  fromInternalBalance = false,
  joinKind: WeightedPoolJoinKind = WeightedPoolJoinKind.EXACT_TOKENS_IN_FOR_BPT_OUT
): Promise<ContractTransaction> {
  // Balancer V2 vault allows userData as a way to pass props through to pool contracts.  In this
  // case we need to pass the joinKind, maxAmountsIn and minBPTOut.
  const userData = defaultAbiCoder.encode(
    ["uint8", "uint256[]", "uint256"],
    [joinKind, maxAmountsIn, minBPTOut]
  );
  const joinRequest = {
    assets: tokens,
    maxAmountsIn,
    userData,
    fromInternalBalance,
  };

  const vaultContract = Vault__factory.connect(vaultAddress, signer);
  const joinReceipt = await vaultContract.joinPool(
    poolId,
    senderAddress,
    receipientAddress,
    joinRequest
  );

  return joinReceipt;
}
