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

import { TokenInfo, TokenList } from "@uniswap/token-lists";
import keyBy from "lodash.keyby";
import {
  PrincipalTokenInfo,
  YieldPoolTokenInfo,
  PrincipalPoolTokenInfo,
  AssetProxyTokenInfo,
  AnyTokenListInfo,
} from "elf-tokenlist";
import { AddressesJsonFile } from "elf-tokenlist/dist/AddressesJsonFile";
export enum TokenListTag {
  VAULT = "vault",
  ASSET_PROXY = "assetproxy",
  CCPOOL = "ccpool",
  PRINCIPAL = "eP",
  UNDERLYING = "underlying",
  WPOOL = "wpool",
  YIELD = "eY",
}

/**
 * Init the tokenlist for given chain
 * @param chainName name of the chain that the tokenlist represents
 * @returns Tuple containing tokenlist and mapping of TokenInfos by address
 */
export function initTokenList(
  chainName: string
): [TokenList, AddressesJsonFile, Record<string, AnyTokenListInfo>] {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const tokenListJson: TokenList = require(`elf-tokenlist/dist/${chainName}.tokenlist.json`);
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const AddressesJson: AddressesJsonFile = require(`elf-tokenlist/dist/${chainName}.addresses.json`);
  const tokenInfos = tokenListJson.tokens;
  const tokenInfoByAddress: Record<string, AnyTokenListInfo> = keyBy(
    tokenInfos,
    "address"
  );
  return [tokenListJson, AddressesJson, tokenInfoByAddress];
}

/**
 * Helper function for looking up a tokenlist info
 * @param address address of the token
 * @param tokenInfoByAddress mapping of TokenInfos by address
 * @returns Mapping of TokenInfos by address
 */
export function getTokenInfo<T extends TokenInfo>(
  address: string,
  tokenInfoByAddress: Record<string, AnyTokenListInfo>
): T {
  return tokenInfoByAddress[address] as T;
}

function isAssetProxy(tokenInfo: TokenInfo): tokenInfo is PrincipalTokenInfo {
  return !!tokenInfo.tags?.includes(TokenListTag.ASSET_PROXY);
}

export function getAssetProxyTokenInfos(
  tokenInfos: TokenInfo[]
): AssetProxyTokenInfo[] {
  return tokenInfos.filter((tokenInfo): tokenInfo is AssetProxyTokenInfo =>
    isAssetProxy(tokenInfo)
  );
}

function isPrincipalToken(
  tokenInfo: TokenInfo
): tokenInfo is PrincipalTokenInfo {
  return !!tokenInfo?.tags?.includes(TokenListTag.PRINCIPAL);
}

export function getPrincipalTokenInfos(
  tokenInfos: TokenInfo[]
): PrincipalTokenInfo[] {
  return tokenInfos.filter((tokenInfo): tokenInfo is PrincipalTokenInfo =>
    isPrincipalToken(tokenInfo)
  );
}

function isPrincipalPool(
  tokenInfo: TokenInfo
): tokenInfo is PrincipalPoolTokenInfo {
  return !!tokenInfo.tags?.includes(TokenListTag.CCPOOL);
}

export function getPrincipalTokenInfoForPool(
  poolInfo: YieldPoolTokenInfo | PrincipalPoolTokenInfo,
  tokenInfos: TokenInfo[]
): PrincipalTokenInfo {
  const principalTokenInfos = getPrincipalTokenInfos(tokenInfos);
  if (isPrincipalPool(poolInfo)) {
    const trancheAddress = poolInfo.extensions.bond;
    const trancheInfo = principalTokenInfos.find(
      (info) => info.address === trancheAddress
    ) as PrincipalTokenInfo;
    return trancheInfo;
  }

  const interestTokenAddress = poolInfo.extensions.interestToken;
  const trancheInfo = principalTokenInfos.find(
    (info) => info.extensions.interestToken === interestTokenAddress
  ) as PrincipalTokenInfo;
  return trancheInfo;
}

export function getPoolInfoForPrincipalToken(
  principalTokenAddress: string,
  tokenInfos: TokenInfo[]
): PrincipalPoolTokenInfo {
  const principalPools: PrincipalPoolTokenInfo[] = tokenInfos.filter(
    (tokenInfo): tokenInfo is PrincipalPoolTokenInfo =>
      isPrincipalPool(tokenInfo)
  );
  return principalPools.find(
    ({ extensions: { bond } }) => bond === principalTokenAddress
  ) as PrincipalPoolTokenInfo;
}

function isYieldPool(tokenInfo: TokenInfo): tokenInfo is YieldPoolTokenInfo {
  return !!tokenInfo.tags?.includes(TokenListTag.WPOOL);
}

export function getYieldPoolTokenInfos(
  tokenInfos: TokenInfo[]
): YieldPoolTokenInfo[] {
  return tokenInfos.filter((tokenInfo): tokenInfo is YieldPoolTokenInfo =>
    isYieldPool(tokenInfo)
  );
}
