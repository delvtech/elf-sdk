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


import { TokenInfo } from "@uniswap/token-lists";

export enum TokenListTag {
  VAULT = "vault",
  ASSET_PROXY = "assetproxy",
  CCPOOL = "ccpool",
  PRINCIPAL = "eP",
  UNDERLYING = "underlying",
  WPOOL = "wpool",
  YIELD = "eY",
}

export interface PrincipalTokenInfo extends TokenInfo {
  extensions: {
    /**
     * The underlying base asset for the principal token
     */
    underlying: string;

    /**
     * The interest token for the principal token
     */
    interestToken: string;

    /**
     * Number of seconds after epoch when the principal token was created
     */
    createdAtTimestamp: number;
    /**
     * Number of seconds after epoch when the principal token can be redeemed
     */
    unlockTimestamp: number;

    /**
     * The wrapped position, eg: an Element yearn vault asset proxy
     */
    position: string;
  };
}

export interface AssetProxyTokenInfo extends TokenInfo {
  extensions: {
    /**
     * The vault address
     */
    vault: string;
  };
}
export interface VaultTokenInfo extends TokenInfo {}

export interface YieldTokenInfo extends TokenInfo {
  extensions: {
    /**
     * The underlying base asset for the yield token
     */
    underlying: string;

    /**
     * The Principal Token's address
     */
    tranche: string;

    /**
     * Number of seconds after epoch when the yield token can be redeemed
     */
    unlockTimestamp: number;
  };
}

export interface PrincipalPoolTokenInfo extends TokenInfo {
  extensions: {
    /**
     * The principal token address
     */
    bond: string;

    /**
     * The underlying base asset for the principal token.  NOTE: This will be a
     * weth address when dealing with eth tranches.
     */
    underlying: string;

    /**
     * balancer poolId
     */
    poolId: string;

    /**
     * Number of seconds after epoch when the pool was created
     */
    createdAtTimestamp: number;

    /**
     * Number of seconds after epoch when the pool assets will converge in
     * price.
     */
    expiration: number;

    /**
     * The number of seconds in the pools timescale.
     */
    unitSeconds: number;
  };
}

export interface YieldPoolTokenInfo extends TokenInfo {
  extensions: {
    /**
     * The yield token address
     */
    interestToken: string;

    /**
     * The underlying base asset for the yield token.  NOTE: This will be a
     * weth address when dealing with eth yield tokens.
     */
    underlying: string;

    /**
     * The underlying base asset for the yield token
     */
    poolId: string;

    /**
     * Number of seconds after epoch when the pool was created
     */
    createdAtTimestamp: number;

    /**
     * Number of seconds after epoch when the yield tokens in the pool will mature
     */
    expiration: number;
  };
}

export type AnyTokenListInfo =
  | TokenInfo
  | PrincipalTokenInfo
  | YieldTokenInfo
  | PrincipalPoolTokenInfo
  | YieldPoolTokenInfo;
