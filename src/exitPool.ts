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

import { BigNumber, ContractTransaction, Signer } from "ethers";
import { defaultAbiCoder } from "ethers/lib/utils";

import { Vault__factory } from "../typechain/factories/Vault__factory";

/**
 * Remove liquidity from a ConvergentCurvePool.
 * @param signer Who is authorizing the transaction
 * @param poolId Balancer V2 PoolId
 * @param senderAddress who is returning LP token to the pool
 * @param receipientAddress who is receiving assets from the pool
 * @param vaultAddress Balancer V2 Vault address
 * @param tokens tokens to withdraw, note: sorted alphanumerically.  ETH must be sorted as though it
 * were WETH.
 * @param minAmountsOut minimum amounts to withdraw, same order as tokens.  The minimum amounts can
 * be set to ensure slippage tolerance.
 * @param fromInternalBalance Use the sender's Balancer V2 internal balance first, if available.
 * @returns returns the contract transaction.
 */
export async function exitConvergentPool(
  signer: Signer,
  poolId: string,
  senderAddress: string,
  receipientAddress: string,
  vaultAddress: string,
  tokens: string[],
  minAmountsOut: BigNumber[],
  toInternalBalance = false
): Promise<ContractTransaction> {
  // Balancer V2 vault allows userData as a way to pass props through to pool contracts.  In this
  // case we need to pass the maxAmountsIn.
  const userData = defaultAbiCoder.encode(["uint256[]"], [minAmountsOut]);

  const exitRequest = {
    assets: tokens,
    minAmountsOut,
    userData,
    toInternalBalance,
  };

  const vaultContract = Vault__factory.connect(vaultAddress, signer);
  const exitReceipt = await vaultContract.exitPool(
    poolId,
    senderAddress,
    receipientAddress,
    exitRequest
  );

  return exitReceipt;
}

export enum WeightedPoolExitKind {
  EXACT_BPT_IN_FOR_ONE_TOKEN_OUT,
  EXACT_BPT_IN_FOR_TOKENS_OUT,
  BPT_IN_FOR_EXACT_TOKENS_OUT,
}

/**
 * Remove liquidity from a WeightedPool.
 * @param signer Who is authorizing the transaction
 * @param poolId Balancer V2 PoolId
 * @param senderAddress who is returning LP token to the pool
 * @param receipientAddress who is receiving assets from the pool
 * @param vaultAddress Balancer V2 Vault address
 * @param tokens tokens to withdraw, note: sorted alphanumerically.  ETH must be sorted as though it
 * were WETH.
 * @param minAmountsOut minimum amounts to withdraw, same order as tokens.  The minimum amounts can
 * be set to ensure slippage tolerance.
 * @param fromInternalBalance Use the sender's Balancer V2 internal balance first, if available.
 * @param exitKind The exit operation
 * @param maxBPTIn The amount, or max amount of Balancer Pool Token in, depending on the exitKind.
 * @param tokenIndex If withdrawing a single token, the index of the token in tokens
 * @returns returns the contract transaction.
 */
export async function exitWeightedPool(
  signer: Signer,
  poolId: string,
  senderAddress: string,
  receipientAddress: string,
  vaultAddress: string,
  tokens: string[],
  minAmountsOut: BigNumber[],
  toInternalBalance = false,
  exitKind: WeightedPoolExitKind = WeightedPoolExitKind.EXACT_BPT_IN_FOR_TOKENS_OUT,
  maxBPTIn: BigNumber,
  tokenIndex?: number
): Promise<ContractTransaction> {
  // Balancer V2 vault allows userData as a way to pass props through to pool contracts.
  const userData = getUserData(exitKind, minAmountsOut, maxBPTIn, tokenIndex);

  const exitRequest = {
    assets: tokens,
    minAmountsOut,
    userData,
    toInternalBalance,
  };

  const vaultContract = Vault__factory.connect(vaultAddress, signer);
  const exitReceipt = await vaultContract.exitPool(
    poolId,
    senderAddress,
    receipientAddress,
    exitRequest
  );

  return exitReceipt;
}

function getUserData(
  exitKind: WeightedPoolExitKind,
  minAmountsOut: BigNumber[],
  maxBPTIn: BigNumber,
  tokenIndex?: number
): string {
  switch (exitKind) {
    // bptInForExactTokensOut
    //     (, amountsOut, maxBPTAmountIn) = abi.decode(self, (WeightedPool.ExitKind, uint256[], uint256));
    case WeightedPoolExitKind.BPT_IN_FOR_EXACT_TOKENS_OUT: {
      const userData = defaultAbiCoder.encode(
        ["uint8", "uint256[]", "uint256"],
        [exitKind, minAmountsOut, maxBPTIn]
      );
      return userData;
    }

    // exactBptInForTokenOut
    //     (, bptAmountIn, tokenIndex) = abi.decode(self, (WeightedPool.ExitKind, uint256, uint256));
    case WeightedPoolExitKind.EXACT_BPT_IN_FOR_ONE_TOKEN_OUT: {
      tokenIndex ??
        console.error(
          "tokenIndex is required for EXACT_BPT_IN_FOR_ONE_TOKEN_OUT"
        );
      const userData = defaultAbiCoder.encode(
        ["uint8", "uint256", "uint256"],
        [exitKind, maxBPTIn, tokenIndex]
      );
      return userData;
    }

    // exactBptInForTokensOut
    //     (, bptAmountIn) = abi.decode(self, (WeightedPool.ExitKind, uint256));
    case WeightedPoolExitKind.EXACT_BPT_IN_FOR_TOKENS_OUT: {
      const userData = defaultAbiCoder.encode(
        ["uint8", "uint256"],
        [exitKind, maxBPTIn]
      );
      return userData;
    }

    default:
      // should never get here.
      return "";
  }
}
