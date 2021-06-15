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

import {
  BigNumber,
  ContractTransaction,
  PayableOverrides,
  Signer,
} from "ethers";

import { Vault__factory } from "../typechain/factories/Vault__factory";

import { ONE_DAY_IN_SECONDS } from "../src/constants/time";

export const BALANCER_ETH_SENTINEL =
  "0x0000000000000000000000000000000000000000";

export enum SwapKind {
  GIVEN_IN,
  GIVEN_OUT,
}

export interface SingleSwap {
  poolId: string;
  kind: SwapKind;
  assetIn: string;
  assetOut: string;
  amount: BigNumber;
  userData: string;
}

/**
 *
 * @param signer
 * @param sender
 * @param recipient
 * @param poolId
 * @param tokenInAddress
 * @param tokenOutAddress
 * @param balancerVaultAddress
 * @param amount
 * @param kind
 * @param limit
 * @param expirationInSeconds
 * @param useETH
 * @param wethAddress
 * @param fromInternalBalance
 * @param toInternalBalance
 */
export async function swap(
  signer: Signer,
  sender: string,
  recipient: string,
  poolId: string,
  tokenInAddress: string,
  tokenOutAddress: string,
  balancerVaultAddress: string,
  amount: BigNumber,
  kind: SwapKind,
  limit: BigNumber,
  overrides?: PayableOverrides,
  expirationInSeconds: number = ONE_DAY_IN_SECONDS,
  useETH = false,
  wethAddress?: string,
  fromInternalBalance = false,
  toInternalBalance = false
): Promise<ContractTransaction> {
  const assetIn =
    useETH && tokenInAddress === wethAddress
      ? BALANCER_ETH_SENTINEL
      : tokenInAddress;

  const assetOut =
    useETH && tokenOutAddress === wethAddress
      ? BALANCER_ETH_SENTINEL
      : tokenOutAddress;

  const swap: SingleSwap = {
    poolId,
    kind,
    assetIn,
    assetOut,
    amount,
    // no need to pass data
    userData: "0x00",
  };

  const funds = {
    sender,
    recipient,
    fromInternalBalance,
    toInternalBalance,
  };

  const deadline = Math.round(Date.now() / 1000) + expirationInSeconds;
  const vaultContract = Vault__factory.connect(balancerVaultAddress, signer);

  const swapReceipt =
    overrides === undefined
      ? await vaultContract.swap(swap, funds, limit, deadline)
      : await vaultContract.swap(swap, funds, limit, deadline, overrides);

  return swapReceipt;
}
